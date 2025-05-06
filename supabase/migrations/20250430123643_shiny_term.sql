/*
  # Initial schema setup for YBNB

  1. Tables
    - users (handled by Supabase Auth)
    - listings
    - bookings
    - reviews
    - favorites
    - categories
    - amenities
    - listing_amenities

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL,
  location text NOT NULL,
  price decimal NOT NULL,
  images text[] NOT NULL,
  bedrooms integer NOT NULL,
  beds integer NOT NULL,
  baths integer NOT NULL,
  max_guests integer NOT NULL,
  host_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Listings are viewable by everyone" ON listings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their own listings" ON listings
  FOR UPDATE USING (auth.uid() = host_id);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id),
  user_id uuid REFERENCES auth.users(id),
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL,
  total_price decimal NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Hosts can view bookings for their listings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = bookings.listing_id
      AND listings.host_id = auth.uid()
    )
  );

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id),
  user_id uuid REFERENCES auth.users(id),
  booking_id uuid REFERENCES bookings(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.user_id = auth.uid()
      AND bookings.status = 'completed'
    )
  );

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  listing_id uuid REFERENCES listings(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Amenities table
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Amenities are viewable by everyone" ON amenities
  FOR SELECT USING (true);

-- Listing amenities junction table
CREATE TABLE IF NOT EXISTS listing_amenities (
  listing_id uuid REFERENCES listings(id),
  amenity_id uuid REFERENCES amenities(id),
  PRIMARY KEY (listing_id, amenity_id)
);

-- Enable RLS
ALTER TABLE listing_amenities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Listing amenities are viewable by everyone" ON listing_amenities
  FOR SELECT USING (true);

CREATE POLICY "Hosts can manage their listing amenities" ON listing_amenities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_id
      AND listings.host_id = auth.uid()
    )
  );