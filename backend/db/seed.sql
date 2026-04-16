-- ============================================================
-- TravelBuddy Seed Data
-- 50+ realistic hotels across Indian cities
-- ============================================================

-- ─── AMENITIES ───────────────────────────────────────────────
INSERT INTO amenities (name, label, icon) VALUES
  ('wifi',            'Free WiFi',           'wifi'),
  ('pool',            'Swimming Pool',       'pool'),
  ('gym',             'Fitness Center',      'fitness_center'),
  ('spa',             'Spa & Wellness',      'spa'),
  ('parking',         'Free Parking',        'local_parking'),
  ('room_service',    'Room Service',        'room_service'),
  ('restaurant',      'Restaurant',          'restaurant'),
  ('bar',             'Bar/Lounge',          'local_bar'),
  ('laundry',         'Laundry Service',     'local_laundry_service'),
  ('ac',              'Air Conditioning',    'ac_unit'),
  ('tv',              'Flat Screen TV',      'tv'),
  ('minibar',         'Mini Bar',            'kitchen'),
  ('safe',            'In-Room Safe',        'lock'),
  ('concierge',       'Concierge Service',   'support_agent'),
  ('airport_shuttle', 'Airport Shuttle',     'airport_shuttle'),
  ('business_center', 'Business Center',     'business_center'),
  ('pet_friendly',    'Pet Friendly',        'pets'),
  ('ev_charging',     'EV Charging Station', 'ev_station');

-- ─── MEAL PLANS ──────────────────────────────────────────────
INSERT INTO meal_plans (name, label) VALUES
  ('breakfast',      'Breakfast Included'),
  ('half_board',     'Half Board (Breakfast + Dinner)'),
  ('full_board',     'Full Board (All Meals)'),
  ('all_inclusive',   'All Inclusive'),
  ('room_only',      'Room Only (No Meals)');

-- ═══════════════════════════════════════════════════════════
-- MUMBAI HOTELS (10)
-- ═══════════════════════════════════════════════════════════

INSERT INTO hotels (name, city, address, description, star_rating, property_type, free_cancellation, no_credit_card, image_url) VALUES
  ('The Taj Mahal Palace',       'Mumbai', 'Apollo Bunder, Colaba', 'Iconic luxury hotel overlooking the Gateway of India with world-class dining.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
  ('The Oberoi Mumbai',          'Mumbai', 'Nariman Point', 'Sophisticated luxury hotel with stunning sea views and exceptional service.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1582719508461-905c673771fd'),
  ('ITC Maratha',                'Mumbai', 'Andheri East', 'Grand Luxury Collection hotel near the airport with Maratha-inspired architecture.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'),
  ('Trident Nariman Point',      'Mumbai', 'Nariman Point', 'Contemporary luxury with panoramic views of the Arabian Sea.', 5, 'hotel', TRUE, TRUE, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'),
  ('JW Marriott Mumbai Juhu',    'Mumbai', 'Juhu Tara Road', 'Beachfront luxury resort with extensive wellness facilities.', 5, 'resort', TRUE, FALSE, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
  ('The Leela Mumbai',           'Mumbai', 'Andheri East', 'Award-winning luxury hotel inspired by the Lotus flower.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'),
  ('Novotel Mumbai Juhu Beach',  'Mumbai', 'Balraj Sahani Marg, Juhu', 'Modern 4-star hotel steps from Juhu Beach.', 4, 'hotel', TRUE, TRUE, 'https://images.unsplash.com/photo-1618773928121-c32f0da3ca25'),
  ('Hyatt Regency Mumbai',       'Mumbai', 'Sahar Airport Road', 'Sleek business hotel near the international airport.', 4, 'hotel', FALSE, FALSE, 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6'),
  ('Hotel Marine Plaza',         'Mumbai', 'Marine Drive', 'Art-deco boutique hotel on the famous Queens Necklace.', 4, 'boutique', TRUE, TRUE, 'https://images.unsplash.com/photo-1590490360182-c33d955bc58a'),
  ('FabHotel Prime Andheri',     'Mumbai', 'Andheri West', 'Affordable comfort in the heart of the suburbs.', 2, 'hotel', FALSE, TRUE, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304');

-- ═══════════════════════════════════════════════════════════
-- DELHI HOTELS (10)
-- ═══════════════════════════════════════════════════════════

INSERT INTO hotels (name, city, address, description, star_rating, property_type, free_cancellation, no_credit_card, image_url) VALUES
  ('The Imperial New Delhi',     'Delhi', 'Janpath, Connaught Place', 'Heritage luxury hotel with museum-quality art collection.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
  ('The Lodhi',                  'Delhi', 'Lodhi Road', 'All-suite luxury hotel with private plunge pools.', 5, 'resort', TRUE, FALSE, 'https://images.unsplash.com/photo-1582719508461-905c673771fd'),
  ('Taj Palace New Delhi',       'Delhi', 'Sardar Patel Marg, Diplomatic Enclave', 'Sprawling luxury hotel set amid 6 acres of gardens.', 5, 'hotel', TRUE, TRUE, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'),
  ('ITC Maurya',                 'Delhi', 'Diplomatic Enclave', 'Iconic hotel hosting world leaders since 1977.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'),
  ('The Oberoi New Delhi',       'Delhi', 'Dr. Zakir Hussain Marg', 'Refined luxury amid the lush Delhi Golf Course greens.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
  ('Radisson Blu New Delhi',     'Delhi', 'Mahipalpur, NH-8', 'Stylish airport hotel with excellent connectivity.', 4, 'hotel', TRUE, TRUE, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'),
  ('The Claridges',              'Delhi', 'Aurangzeb Road', 'Colonial-era boutique hotel with manicured lawns.', 4, 'boutique', TRUE, FALSE, 'https://images.unsplash.com/photo-1618773928121-c32f0da3ca25'),
  ('ibis New Delhi Aerocity',    'Delhi', 'Aerocity, IGI Airport', 'Budget-friendly comfort near the airport.', 3, 'hotel', FALSE, TRUE, 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6'),
  ('Haveli Dharampura',          'Delhi', 'Gali Guliyan, Old Delhi', 'Restored 150-year-old haveli in the heart of Old Delhi.', 4, 'heritage', TRUE, TRUE, 'https://images.unsplash.com/photo-1590490360182-c33d955bc58a'),
  ('Backpacker Panda Connaught', 'Delhi', 'Connaught Place', 'Trendy hostel with private rooms and dorms.', 1, 'hostel', FALSE, TRUE, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304');

-- ═══════════════════════════════════════════════════════════
-- GOA HOTELS (10)
-- ═══════════════════════════════════════════════════════════

INSERT INTO hotels (name, city, address, description, star_rating, property_type, free_cancellation, no_credit_card, image_url) VALUES
  ('Taj Exotica Resort & Spa',   'Goa', 'Calangute-Benaulim Road, Benaulim', 'Mediterranean-style luxury resort on 56 acres.', 5, 'resort', TRUE, FALSE, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
  ('W Goa',                      'Goa', 'Vagator Beach', 'Ultra-trendy beachfront retreat with vibrant nightlife.', 5, 'resort', TRUE, FALSE, 'https://images.unsplash.com/photo-1582719508461-905c673771fd'),
  ('The Leela Goa',              'Goa', 'Mobor, Cavelossim', 'Lagoon-front resort with a 12-hole golf course.', 5, 'resort', TRUE, TRUE, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'),
  ('Alila Diwa Goa',             'Goa', 'Majorda, South Goa', 'Paddy-field-view boutique resort with infinity pool.', 5, 'resort', TRUE, FALSE, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'),
  ('Novotel Goa Dona Sylvia',    'Goa', 'Cavelossim Beach', 'Portuguese-style village resort right on the beach.', 4, 'resort', TRUE, TRUE, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
  ('Hyatt Centric Candolim',     'Goa', 'Candolim', 'Modern hotel with rooftop pool and beach access.', 4, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'),
  ('Treehouse Blue Goa',         'Goa', 'Anjuna', 'Eco-friendly property nestled among palm trees.', 3, 'villa', FALSE, TRUE, 'https://images.unsplash.com/photo-1618773928121-c32f0da3ca25'),
  ('Antares Beach Club',         'Goa', 'Vagator, North Goa', 'Cliffside boutique hotel with stunning sunset views.', 3, 'boutique', FALSE, TRUE, 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6'),
  ('OYO Beach Walk Calangute',   'Goa', 'Calangute Beach Road', 'Budget-friendly stay 5 minutes from Calangute Beach.', 2, 'hotel', FALSE, TRUE, 'https://images.unsplash.com/photo-1590490360182-c33d955bc58a'),
  ('Palolem Beach Resort',       'Goa', 'Palolem, South Goa', 'Rustic beach huts on the famous crescent beach.', 2, 'resort', FALSE, TRUE, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304');

-- ═══════════════════════════════════════════════════════════
-- JAIPUR HOTELS (8)
-- ═══════════════════════════════════════════════════════════

INSERT INTO hotels (name, city, address, description, star_rating, property_type, free_cancellation, no_credit_card, image_url) VALUES
  ('Rambagh Palace',             'Jaipur', 'Bhawani Singh Road', 'Former royal residence turned into Indias finest palace hotel.', 5, 'palace', TRUE, FALSE, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
  ('The Oberoi Rajvilas',        'Jaipur', 'Goner Road', 'Fort-like luxury resort set amid 32 acres of gardens.', 5, 'resort', TRUE, FALSE, 'https://images.unsplash.com/photo-1582719508461-905c673771fd'),
  ('Taj Jai Mahal Palace',       'Jaipur', 'Jacob Road, Civil Lines', 'Heritage palace hotel with 18 acres of Mughal gardens.', 5, 'palace', TRUE, TRUE, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'),
  ('ITC Rajputana',              'Jaipur', 'Palace Road', 'Rajputana-inspired luxury in the heart of the Pink City.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'),
  ('Samode Haveli',              'Jaipur', 'Gangapole', '175-year-old haveli with hand-painted frescoes.', 4, 'heritage', TRUE, TRUE, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
  ('Clarks Amer',                'Jaipur', 'JLN Marg', 'Well-established 4-star hotel with rooftop pool.', 4, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'),
  ('Zostel Jaipur',              'Jaipur', 'C-Scheme', 'Backpackers hub with Rajasthani-themed interiors.', 1, 'hostel', FALSE, TRUE, 'https://images.unsplash.com/photo-1618773928121-c32f0da3ca25'),
  ('Hotel Pearl Palace',         'Jaipur', 'Hathroi Fort, Ajmer Road', 'Award-winning budget hotel with artistic rooms.', 2, 'hotel', FALSE, TRUE, 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6');

-- ═══════════════════════════════════════════════════════════
-- BANGALORE HOTELS (8)
-- ═══════════════════════════════════════════════════════════

INSERT INTO hotels (name, city, address, description, star_rating, property_type, free_cancellation, no_credit_card, image_url) VALUES
  ('The Ritz-Carlton Bangalore',  'Bangalore', 'Residency Road', 'Urban luxury with skyline views and Michelin-level dining.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
  ('Taj West End',                'Bangalore', 'Race Course Road', 'Heritage hotel set in 20 acres of tropical gardens.', 5, 'hotel', TRUE, FALSE, 'https://images.unsplash.com/photo-1582719508461-905c673771fd'),
  ('ITC Gardenia',                'Bangalore', 'Residency Road', 'LEED Platinum certified luxury with vertical gardens.', 5, 'hotel', TRUE, TRUE, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'),
  ('The Leela Palace Bangalore',  'Bangalore', 'Old Airport Road', 'Royal-inspired luxury with gold-leaf interiors.', 5, 'palace', TRUE, FALSE, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'),
  ('Radisson Blu Atria',          'Bangalore', 'Palace Road', 'Contemporary hotel in the citys commercial heart.', 4, 'hotel', TRUE, TRUE, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
  ('Lemon Tree Premier',          'Bangalore', 'Whitefield', 'Tech-corridor hotel with modern amenities.', 3, 'hotel', TRUE, TRUE, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'),
  ('Hostel by the Blue',          'Bangalore', 'Indiranagar', 'Hip hostel in Bangalores trendiest neighborhood.', 1, 'hostel', FALSE, TRUE, 'https://images.unsplash.com/photo-1618773928121-c32f0da3ca25'),
  ('The Paul Bangalore',          'Bangalore', 'Domlur', 'Design-led boutique hotel with eclectic interiors.', 4, 'boutique', TRUE, FALSE, 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6');

-- ═══════════════════════════════════════════════════════════
-- ADDITIONAL CITIES (6 more hotels)
-- ═══════════════════════════════════════════════════════════

INSERT INTO hotels (name, city, address, description, star_rating, property_type, free_cancellation, no_credit_card, image_url) VALUES
  ('Taj Lake Palace',             'Udaipur',    'Pichola Lake', 'Floating marble palace on Lake Pichola — pure magic.', 5, 'palace', TRUE, FALSE, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
  ('The Kumarakom Lake Resort',   'Kumarakom',  'Kumarakom North', 'Backwater-facing heritage resort with Ayurvedic spa.', 5, 'resort', TRUE, FALSE, 'https://images.unsplash.com/photo-1582719508461-905c673771fd'),
  ('Wildflower Hall Shimla',      'Shimla',     'Chharabra', 'Himalayan luxury retreat at 8,250 feet elevation.', 5, 'resort', TRUE, FALSE, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'),
  ('Vivanta Dal View',            'Srinagar',   'Boulevard Road, Dal Lake', 'Lakeside luxury with views of the Zabarwan Mountains.', 4, 'hotel', TRUE, TRUE, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'),
  ('Evolve Back Coorg',           'Coorg',      'Karadigodu Post', 'Plantation-inspired luxury villas amid coffee estates.', 5, 'villa', TRUE, FALSE, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
  ('OYO Central Pune',            'Pune',       'Koregaon Park', 'Smart budget hotel in Punes hippest district.', 2, 'hotel', FALSE, TRUE, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304');


-- ═══════════════════════════════════════════════════════════
-- ROOMS (2-3 rooms per hotel, 52 hotels = ~130 rooms)
-- ═══════════════════════════════════════════════════════════

-- We'll generate rooms for each hotel using a systematic approach.
-- For brevity, creating representative rooms for each hotel.

DO $$
DECLARE
    h RECORD;
    room_id_counter INTEGER;
BEGIN
    FOR h IN SELECT id, star_rating, property_type FROM hotels ORDER BY id
    LOOP
        -- Standard/Deluxe Room
        INSERT INTO rooms (hotel_id, room_type, bed_type, capacity_adults, capacity_children, price_per_night, total_rooms, is_available)
        VALUES (
            h.id,
            CASE 
                WHEN h.star_rating >= 4 THEN 'Deluxe Room'
                WHEN h.star_rating >= 2 THEN 'Standard Room'
                ELSE 'Dormitory Bed'
            END,
            CASE 
                WHEN h.star_rating >= 4 THEN 'king'
                WHEN h.star_rating >= 2 THEN 'double'
                ELSE 'single'
            END,
            CASE WHEN h.star_rating >= 2 THEN 2 ELSE 1 END,
            CASE WHEN h.star_rating >= 3 THEN 1 ELSE 0 END,
            CASE 
                WHEN h.star_rating = 5 THEN 8000 + (random() * 7000)::INT
                WHEN h.star_rating = 4 THEN 4000 + (random() * 4000)::INT
                WHEN h.star_rating = 3 THEN 2000 + (random() * 2000)::INT
                WHEN h.star_rating = 2 THEN 1000 + (random() * 1000)::INT
                ELSE 500 + (random() * 500)::INT
            END,
            CASE WHEN h.star_rating >= 3 THEN 10 ELSE 20 END,
            TRUE
        );

        -- Twin Room (for 3-star and above)
        IF h.star_rating >= 3 THEN
            INSERT INTO rooms (hotel_id, room_type, bed_type, capacity_adults, capacity_children, price_per_night, total_rooms, is_available)
            VALUES (
                h.id,
                'Twin Room',
                'twin',
                2,
                1,
                CASE 
                    WHEN h.star_rating = 5 THEN 7000 + (random() * 5000)::INT
                    WHEN h.star_rating = 4 THEN 3500 + (random() * 3500)::INT
                    ELSE 1800 + (random() * 1800)::INT
                END,
                8,
                TRUE
            );
        END IF;

        -- Suite (for 4-star and above)
        IF h.star_rating >= 4 THEN
            INSERT INTO rooms (hotel_id, room_type, bed_type, capacity_adults, capacity_children, price_per_night, total_rooms, is_available)
            VALUES (
                h.id,
                CASE WHEN h.star_rating = 5 THEN 'Presidential Suite' ELSE 'Junior Suite' END,
                'king',
                3,
                2,
                CASE 
                    WHEN h.star_rating = 5 THEN 20000 + (random() * 30000)::INT
                    ELSE 10000 + (random() * 10000)::INT
                END,
                3,
                TRUE
            );
        END IF;

        -- Family Room (for 3-star and above)
        IF h.star_rating >= 3 THEN
            INSERT INTO rooms (hotel_id, room_type, bed_type, capacity_adults, capacity_children, price_per_night, total_rooms, is_available)
            VALUES (
                h.id,
                'Family Room',
                'queen',
                4,
                2,
                CASE 
                    WHEN h.star_rating = 5 THEN 12000 + (random() * 8000)::INT
                    WHEN h.star_rating = 4 THEN 6000 + (random() * 4000)::INT
                    ELSE 3000 + (random() * 2000)::INT
                END,
                5,
                TRUE
            );
        END IF;
    END LOOP;
END $$;


-- ═══════════════════════════════════════════════════════════
-- ROOM AMENITIES (assign amenities based on star rating)
-- ═══════════════════════════════════════════════════════════

-- All rooms get WiFi, AC, TV
INSERT INTO room_amenities (room_id, amenity_id)
SELECT r.id, a.id FROM rooms r, amenities a
WHERE a.name IN ('wifi', 'ac', 'tv')
  AND r.id IN (SELECT id FROM rooms);

-- 3+ star rooms get: room_service, laundry, restaurant
INSERT INTO room_amenities (room_id, amenity_id)
SELECT r.id, a.id FROM rooms r
JOIN hotels h ON h.id = r.hotel_id
CROSS JOIN amenities a
WHERE a.name IN ('room_service', 'laundry', 'restaurant')
  AND h.star_rating >= 3;

-- 4+ star rooms get: parking, concierge, safe, bar, minibar
INSERT INTO room_amenities (room_id, amenity_id)
SELECT r.id, a.id FROM rooms r
JOIN hotels h ON h.id = r.hotel_id
CROSS JOIN amenities a
WHERE a.name IN ('parking', 'concierge', 'safe', 'bar', 'minibar')
  AND h.star_rating >= 4;

-- 5-star rooms get: pool, gym, spa, airport_shuttle, business_center
INSERT INTO room_amenities (room_id, amenity_id)
SELECT r.id, a.id FROM rooms r
JOIN hotels h ON h.id = r.hotel_id
CROSS JOIN amenities a
WHERE a.name IN ('pool', 'gym', 'spa', 'airport_shuttle', 'business_center')
  AND h.star_rating = 5;

-- Resorts get: pool (even if not 5-star)
INSERT INTO room_amenities (room_id, amenity_id)
SELECT r.id, a.id FROM rooms r
JOIN hotels h ON h.id = r.hotel_id
CROSS JOIN amenities a
WHERE a.name = 'pool'
  AND h.property_type IN ('resort', 'palace')
  AND h.star_rating < 5
ON CONFLICT DO NOTHING;

-- Pet friendly for selected boutique/villa properties
INSERT INTO room_amenities (room_id, amenity_id)
SELECT r.id, a.id FROM rooms r
JOIN hotels h ON h.id = r.hotel_id
CROSS JOIN amenities a
WHERE a.name = 'pet_friendly'
  AND h.property_type IN ('villa', 'boutique')
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- ROOM MEAL PLANS (assign based on star rating)
-- ═══════════════════════════════════════════════════════════

-- All rooms get 'room_only' option
INSERT INTO room_meal_plans (room_id, meal_plan_id, extra_cost)
SELECT r.id, mp.id, 0 FROM rooms r, meal_plans mp
WHERE mp.name = 'room_only';

-- 3+ star rooms get breakfast
INSERT INTO room_meal_plans (room_id, meal_plan_id, extra_cost)
SELECT r.id, mp.id, 
  CASE 
    WHEN h.star_rating = 5 THEN 1500
    WHEN h.star_rating = 4 THEN 800
    ELSE 400
  END
FROM rooms r
JOIN hotels h ON h.id = r.hotel_id
CROSS JOIN meal_plans mp
WHERE mp.name = 'breakfast'
  AND h.star_rating >= 3;

-- 4+ star rooms get half board
INSERT INTO room_meal_plans (room_id, meal_plan_id, extra_cost)
SELECT r.id, mp.id,
  CASE 
    WHEN h.star_rating = 5 THEN 3000
    ELSE 1500
  END
FROM rooms r
JOIN hotels h ON h.id = r.hotel_id
CROSS JOIN meal_plans mp
WHERE mp.name = 'half_board'
  AND h.star_rating >= 4;

-- 5-star rooms get full board and all inclusive
INSERT INTO room_meal_plans (room_id, meal_plan_id, extra_cost)
SELECT r.id, mp.id,
  CASE WHEN mp.name = 'full_board' THEN 4500 ELSE 6000 END
FROM rooms r
JOIN hotels h ON h.id = r.hotel_id
CROSS JOIN meal_plans mp
WHERE mp.name IN ('full_board', 'all_inclusive')
  AND h.star_rating = 5;

-- Resort properties also get all inclusive regardless of stars
INSERT INTO room_meal_plans (room_id, meal_plan_id, extra_cost)
SELECT r.id, mp.id, 5000
FROM rooms r
JOIN hotels h ON h.id = r.hotel_id
CROSS JOIN meal_plans mp
WHERE mp.name = 'all_inclusive'
  AND h.property_type = 'resort'
  AND h.star_rating < 5
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- SAMPLE BOOKINGS (for availability testing)
-- ═══════════════════════════════════════════════════════════

INSERT INTO bookings (room_id, hotel_id, guest_name, guest_email, check_in_date, check_out_date, adults, children, total_price, status)
SELECT 
    r.id,
    r.hotel_id,
    'Test Guest ' || r.id,
    'guest' || r.id || '@example.com',
    '2026-05-01',
    '2026-05-05',
    2,
    0,
    r.price_per_night * 4,
    'confirmed'
FROM rooms r
WHERE r.id % 5 = 0  -- Book every 5th room for testing
LIMIT 20;

-- Some cancelled bookings too
INSERT INTO bookings (room_id, hotel_id, guest_name, guest_email, check_in_date, check_out_date, adults, children, total_price, status)
SELECT 
    r.id,
    r.hotel_id,
    'Cancelled Guest ' || r.id,
    'cancelled' || r.id || '@example.com',
    '2026-05-10',
    '2026-05-12',
    1,
    0,
    r.price_per_night * 2,
    'cancelled'
FROM rooms r
WHERE r.id % 7 = 0
LIMIT 10;

-- ═══════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ═══════════════════════════════════════════════════════════

-- Verify counts
-- SELECT 'Hotels' AS entity, COUNT(*) AS count FROM hotels
-- UNION ALL SELECT 'Rooms', COUNT(*) FROM rooms
-- UNION ALL SELECT 'Amenities', COUNT(*) FROM amenities
-- UNION ALL SELECT 'Room-Amenity Links', COUNT(*) FROM room_amenities
-- UNION ALL SELECT 'Meal Plans', COUNT(*) FROM meal_plans
-- UNION ALL SELECT 'Room-Meal Links', COUNT(*) FROM room_meal_plans
-- UNION ALL SELECT 'Bookings', COUNT(*) FROM bookings;
