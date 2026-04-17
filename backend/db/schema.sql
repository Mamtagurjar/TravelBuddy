-- ============================================================
-- TravelBuddy Database Schema
-- Normalized relational design for hotel booking search system
-- ============================================================

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS room_meal_plans CASCADE;
DROP TABLE IF EXISTS room_amenities CASCADE;
DROP TABLE IF EXISTS meal_plans CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;

-- ============================================================
-- 1. HOTELS — Core hotel-level data
-- ============================================================
CREATE TABLE hotels (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100),
    address         TEXT,
    description     TEXT,
    star_rating     SMALLINT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
    property_type   VARCHAR(50) NOT NULL DEFAULT 'hotel',
    -- Booking policies
    free_cancellation   BOOLEAN DEFAULT FALSE,
    no_credit_card      BOOLEAN DEFAULT FALSE,
    -- Media
    image_url       TEXT,
    -- Metadata
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for hotel-level filters
CREATE INDEX idx_hotels_city ON hotels (LOWER(city));
CREATE INDEX idx_hotels_state ON hotels (LOWER(state));
CREATE INDEX idx_hotels_star_rating ON hotels (star_rating);
CREATE INDEX idx_hotels_property_type ON hotels (property_type);
CREATE INDEX idx_hotels_free_cancellation ON hotels (free_cancellation) WHERE free_cancellation = TRUE;
CREATE INDEX idx_hotels_no_credit_card ON hotels (no_credit_card) WHERE no_credit_card = TRUE;

-- ============================================================
-- 2. ROOMS — Room-level data linked to hotels
-- ============================================================
CREATE TABLE rooms (
    id              SERIAL PRIMARY KEY,
    hotel_id        INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_type       VARCHAR(100) NOT NULL,       -- e.g., 'Deluxe', 'Suite', 'Standard'
    bed_type        VARCHAR(50) NOT NULL,         -- e.g., 'twin', 'king', 'queen', 'double'
    capacity_adults SMALLINT NOT NULL DEFAULT 2,
    capacity_children SMALLINT NOT NULL DEFAULT 0,
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_rooms     SMALLINT NOT NULL DEFAULT 1,  -- Total inventory
    is_available    BOOLEAN DEFAULT TRUE,
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for room-level filters
CREATE INDEX idx_rooms_hotel_id ON rooms (hotel_id);
CREATE INDEX idx_rooms_bed_type ON rooms (bed_type);
CREATE INDEX idx_rooms_capacity ON rooms (capacity_adults);
CREATE INDEX idx_rooms_price ON rooms (price_per_night);
CREATE INDEX idx_rooms_available ON rooms (is_available) WHERE is_available = TRUE;

-- ============================================================
-- 3. AMENITIES — Master list of amenities
-- ============================================================
CREATE TABLE amenities (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE,   -- e.g., 'wifi', 'pool', 'gym'
    label   VARCHAR(150) NOT NULL,          -- e.g., 'Free WiFi', 'Swimming Pool'
    icon    VARCHAR(50)                     -- optional icon identifier
);

-- ============================================================
-- 4. ROOM_AMENITIES — Junction table (rooms ↔ amenities)
-- ============================================================
CREATE TABLE room_amenities (
    room_id     INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    amenity_id  INTEGER NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, amenity_id)
);

CREATE INDEX idx_room_amenities_amenity ON room_amenities (amenity_id);

-- ============================================================
-- 5. MEAL_PLANS — Master list of meal options
-- ============================================================
CREATE TABLE meal_plans (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE,   -- e.g., 'breakfast', 'half_board'
    label   VARCHAR(150) NOT NULL           -- e.g., 'Breakfast Included', 'Half Board'
);

-- ============================================================
-- 6. ROOM_MEAL_PLANS — Junction table (rooms ↔ meal_plans)
-- ============================================================
CREATE TABLE room_meal_plans (
    room_id      INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    meal_plan_id INTEGER NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    extra_cost   DECIMAL(10, 2) DEFAULT 0,   -- Additional cost for this meal plan
    PRIMARY KEY (room_id, meal_plan_id)
);

CREATE INDEX idx_room_meal_plans_meal ON room_meal_plans (meal_plan_id);

-- ============================================================
-- 7. BOOKINGS — Booking records (for availability checking)
-- ============================================================
CREATE TABLE bookings (
    id              SERIAL PRIMARY KEY,
    room_id         INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    hotel_id        INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    guest_name      VARCHAR(255) NOT NULL,
    guest_email     VARCHAR(255),
    check_in_date   DATE NOT NULL,
    check_out_date  DATE NOT NULL,
    adults          SMALLINT NOT NULL DEFAULT 1,
    children        SMALLINT DEFAULT 0,
    total_price     DECIMAL(10, 2) NOT NULL,
    status          VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

CREATE INDEX idx_bookings_room_dates ON bookings (room_id, check_in_date, check_out_date);
CREATE INDEX idx_bookings_hotel ON bookings (hotel_id);
CREATE INDEX idx_bookings_status ON bookings (status);
