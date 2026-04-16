const db = require('../config/db');

/**
 * Parse comma-separated string into an array, filtering empty values.
 */
function parseCSV(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Build and execute the dynamic hotel search query.
 * All filters are applied conditionally using parameterized SQL.
 *
 * @param {Object} filters - Parsed query parameters
 * @returns {Promise<{hotels: Array, total: number, filters: Object}>}
 */
async function searchHotels(filters) {
  const {
    city,
    check_in,
    check_out,
    adults,
    star_rating,
    amenities,
    meal_plan,
    bed_type,
    property_type,
    free_cancellation,
    no_credit_card,
    min_price,
    max_price,
    sort_by = 'rating_desc',
    page = 1,
    limit = 20,
  } = filters;

  // Parse comma-separated values into arrays
  const starRatings = parseCSV(star_rating).map(Number).filter((n) => !isNaN(n));
  const amenitiesList = parseCSV(amenities);
  const mealPlans = parseCSV(meal_plan);
  const bedTypes = parseCSV(bed_type);
  const propertyTypes = parseCSV(property_type);

  const offset = (page - 1) * limit;

  // ─── Dynamic WHERE clauses and params ───────────────────────
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  // -- Hotel-level filters --

  if (city) {
    conditions.push(`LOWER(h.city) = LOWER($${paramIndex})`);
    params.push(city);
    paramIndex++;
  }

  if (starRatings.length > 0) {
    const placeholders = starRatings.map(() => `$${paramIndex++}`);
    conditions.push(`h.star_rating IN (${placeholders.join(', ')})`);
    params.push(...starRatings);
  }

  if (propertyTypes.length > 0) {
    const placeholders = propertyTypes.map(() => `$${paramIndex++}`);
    conditions.push(`LOWER(h.property_type) IN (${placeholders.join(', ')})`);
    params.push(...propertyTypes.map((p) => p.toLowerCase()));
  }

  if (free_cancellation === true || free_cancellation === 'true') {
    conditions.push(`h.free_cancellation = TRUE`);
  }

  if (no_credit_card === true || no_credit_card === 'true') {
    conditions.push(`h.no_credit_card = TRUE`);
  }

  // -- Room-level filters --

  if (adults) {
    conditions.push(`r.capacity_adults >= $${paramIndex}`);
    params.push(parseInt(adults));
    paramIndex++;
  }

  if (bedTypes.length > 0) {
    const placeholders = bedTypes.map(() => `$${paramIndex++}`);
    conditions.push(`LOWER(r.bed_type) IN (${placeholders.join(', ')})`);
    params.push(...bedTypes.map((b) => b.toLowerCase()));
  }

  if (min_price) {
    conditions.push(`r.price_per_night >= $${paramIndex}`);
    params.push(parseFloat(min_price));
    paramIndex++;
  }

  if (max_price) {
    conditions.push(`r.price_per_night <= $${paramIndex}`);
    params.push(parseFloat(max_price));
    paramIndex++;
  }

  // Room must be available
  conditions.push(`r.is_available = TRUE`);

  // -- Amenity filter (requires EXISTS subquery to handle multiple) --
  if (amenitiesList.length > 0) {
    const placeholders = amenitiesList.map(() => `$${paramIndex++}`);
    conditions.push(`
      (SELECT COUNT(DISTINCT a.name) 
       FROM room_amenities ra2
       JOIN amenities a ON a.id = ra2.amenity_id
       WHERE ra2.room_id = r.id AND LOWER(a.name) IN (${placeholders.join(', ')})) = $${paramIndex}
    `);
    params.push(...amenitiesList.map((a) => a.toLowerCase()));
    params.push(amenitiesList.length);
    paramIndex++;
  }

  // -- Meal plan filter --
  if (mealPlans.length > 0) {
    const placeholders = mealPlans.map(() => `$${paramIndex++}`);
    conditions.push(`
      EXISTS (
        SELECT 1 FROM room_meal_plans rmp
        JOIN meal_plans mp ON mp.id = rmp.meal_plan_id
        WHERE rmp.room_id = r.id AND LOWER(mp.name) IN (${placeholders.join(', ')})
      )
    `);
    params.push(...mealPlans.map((m) => m.toLowerCase()));
  }

  // -- Availability check (no overlapping confirmed bookings) --
  if (check_in && check_out) {
    conditions.push(`
      NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.room_id = r.id
          AND b.status = 'confirmed'
          AND b.check_in_date < $${paramIndex + 1}
          AND b.check_out_date > $${paramIndex}
      )
    `);
    params.push(check_in, check_out);
    paramIndex += 2;
  }

  // ─── Build WHERE string ─────────────────────────────────────
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // ─── Sort mapping ───────────────────────────────────────────
  const sortMap = {
    price_asc: 'min_price ASC',
    price_desc: 'min_price DESC',
    rating_desc: 'h.star_rating DESC',
    rating_asc: 'h.star_rating ASC',
    name_asc: 'h.name ASC',
    name_desc: 'h.name DESC',
  };
  const orderBy = sortMap[sort_by] || 'h.star_rating DESC';

  // ─── Main query: Get hotels with their best room price ──────
  const mainQuery = `
    SELECT 
      h.id,
      h.name,
      h.city,
      h.address,
      h.description,
      h.star_rating,
      h.property_type,
      h.free_cancellation,
      h.no_credit_card,
      h.image_url,
      h.latitude,
      h.longitude,
      MIN(r.price_per_night)    AS min_price,
      MAX(r.price_per_night)    AS max_price,
      COUNT(DISTINCT r.id)      AS available_rooms,
      -- Aggregate amenities as JSON array
      COALESCE(
        JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', am.name, 'label', am.label))
        FILTER (WHERE am.id IS NOT NULL),
        '[]'
      ) AS amenities,
      -- Aggregate meal plans as JSON array
      COALESCE(
        JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', mp.name, 'label', mp.label))
        FILTER (WHERE mp.id IS NOT NULL),
        '[]'
      ) AS meal_plans,
      -- Aggregate bed types
      ARRAY_AGG(DISTINCT r.bed_type) AS bed_types,
      -- Aggregate room types
      ARRAY_AGG(DISTINCT r.room_type) AS room_types
    FROM hotels h
    INNER JOIN rooms r ON r.hotel_id = h.id
    LEFT JOIN room_amenities ra ON ra.room_id = r.id
    LEFT JOIN amenities am ON am.id = ra.amenity_id
    LEFT JOIN room_meal_plans rmp ON rmp.room_id = r.id
    LEFT JOIN meal_plans mp ON mp.id = rmp.meal_plan_id
    ${whereClause}
    GROUP BY h.id
    ORDER BY ${orderBy}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(limit, offset);

  // ─── Count query (for pagination) ──────────────────────────
  const countQuery = `
    SELECT COUNT(DISTINCT h.id) AS total
    FROM hotels h
    INNER JOIN rooms r ON r.hotel_id = h.id
    LEFT JOIN room_amenities ra ON ra.room_id = r.id
    LEFT JOIN amenities am ON am.id = ra.amenity_id
    LEFT JOIN room_meal_plans rmp ON rmp.room_id = r.id
    LEFT JOIN meal_plans mp ON mp.id = rmp.meal_plan_id
    ${whereClause}
  `;

  // Remove LIMIT/OFFSET params for count query
  const countParams = params.slice(0, -2);

  // ─── Execute both queries in parallel ──────────────────────
  const [hotelsResult, countResult] = await Promise.all([
    db.query(mainQuery, params),
    db.query(countQuery, countParams),
  ]);

  const total = parseInt(countResult.rows[0].total);

  return {
    hotels: hotelsResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get dynamic filter options based on the current data in the database.
 * These adapt based on what's actually available (optionally scoped to a city).
 *
 * @param {string|null} city - Optional city to scope filters
 * @returns {Promise<Object>} Available filter facets with counts
 */
async function getFilterOptions(city) {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (city) {
    conditions.push(`LOWER(h.city) = LOWER($${paramIndex})`);
    params.push(city);
    paramIndex++;
  }

  conditions.push(`r.is_available = TRUE`);

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Run all filter aggregation queries in parallel
  const [
    starRatings,
    amenitiesResult,
    mealPlansResult,
    bedTypesResult,
    propertyTypes,
    priceRange,
  ] = await Promise.all([
    // Star ratings with counts
    db.query(`
      SELECT h.star_rating AS value, COUNT(DISTINCT h.id) AS count
      FROM hotels h
      INNER JOIN rooms r ON r.hotel_id = h.id
      ${whereClause}
      GROUP BY h.star_rating
      ORDER BY h.star_rating DESC
    `, params),

    // Available amenities with counts
    db.query(`
      SELECT am.name AS value, am.label, COUNT(DISTINCT h.id) AS count
      FROM hotels h
      INNER JOIN rooms r ON r.hotel_id = h.id
      INNER JOIN room_amenities ra ON ra.room_id = r.id
      INNER JOIN amenities am ON am.id = ra.amenity_id
      ${whereClause}
      GROUP BY am.name, am.label
      ORDER BY count DESC
    `, params),

    // Available meal plans with counts
    db.query(`
      SELECT mp.name AS value, mp.label, COUNT(DISTINCT h.id) AS count
      FROM hotels h
      INNER JOIN rooms r ON r.hotel_id = h.id
      INNER JOIN room_meal_plans rmp ON rmp.room_id = r.id
      INNER JOIN meal_plans mp ON mp.id = rmp.meal_plan_id
      ${whereClause}
      GROUP BY mp.name, mp.label
      ORDER BY count DESC
    `, params),

    // Available bed types with counts
    db.query(`
      SELECT r.bed_type AS value, COUNT(DISTINCT h.id) AS count
      FROM hotels h
      INNER JOIN rooms r ON r.hotel_id = h.id
      ${whereClause}
      GROUP BY r.bed_type
      ORDER BY count DESC
    `, params),

    // Property types with counts
    db.query(`
      SELECT h.property_type AS value, COUNT(DISTINCT h.id) AS count
      FROM hotels h
      INNER JOIN rooms r ON r.hotel_id = h.id
      ${whereClause}
      GROUP BY h.property_type
      ORDER BY count DESC
    `, params),

    // Price range
    db.query(`
      SELECT 
        MIN(r.price_per_night) AS min,
        MAX(r.price_per_night) AS max
      FROM hotels h
      INNER JOIN rooms r ON r.hotel_id = h.id
      ${whereClause}
    `, params),
  ]);

  return {
    star_ratings: starRatings.rows.map((r) => ({
      value: r.value,
      count: parseInt(r.count),
    })),
    amenities: amenitiesResult.rows.map((r) => ({
      value: r.value,
      label: r.label,
      count: parseInt(r.count),
    })),
    meal_plans: mealPlansResult.rows.map((r) => ({
      value: r.value,
      label: r.label,
      count: parseInt(r.count),
    })),
    bed_types: bedTypesResult.rows.map((r) => ({
      value: r.value,
      count: parseInt(r.count),
    })),
    property_types: propertyTypes.rows.map((r) => ({
      value: r.value,
      count: parseInt(r.count),
    })),
    price_range: priceRange.rows[0] || { min: 0, max: 0 },
  };
}

module.exports = { searchHotels, getFilterOptions };
