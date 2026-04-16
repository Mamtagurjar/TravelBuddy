const express = require('express');
const router = express.Router();
const { searchHotels, getFilterOptions } = require('../services/searchService');
const { searchValidationRules, handleValidationErrors } = require('../middleware/validateSearch');

/**
 * GET /api/search
 * 
 * Single flexible search endpoint that handles ALL filtering logic.
 * Returns filtered hotel results + dynamically generated filter options.
 *
 * Query Parameters:
 *   city, check_in, check_out, adults, star_rating, amenities,
 *   meal_plan, bed_type, property_type, free_cancellation,
 *   no_credit_card, min_price, max_price, sort_by, page, limit
 */
router.get(
  '/',
  searchValidationRules,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Execute search and filter options in parallel
      const [searchResults, filterOptions] = await Promise.all([
        searchHotels(req.query),
        getFilterOptions(req.query.city),
      ]);

      res.json({
        success: true,
        data: {
          hotels: searchResults.hotels,
          pagination: {
            page: searchResults.page,
            limit: searchResults.limit,
            total: searchResults.total,
            totalPages: searchResults.totalPages,
          },
          filters: filterOptions,
        },
      });
    } catch (error) {
      console.error('🔴 Search error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while searching hotels',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      });
    }
  }
);

/**
 * GET /api/search/filters
 * 
 * Standalone endpoint to fetch only filter options (useful for initial page load).
 * Optionally scoped to a city.
 */
router.get('/filters', async (req, res) => {
  try {
    const filterOptions = await getFilterOptions(req.query.city);
    res.json({
      success: true,
      data: { filters: filterOptions },
    });
  } catch (error) {
    console.error('🔴 Filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching filters',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
});

module.exports = router;
