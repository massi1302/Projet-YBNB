import { supabase } from '../lib/supabase.js';

export const getListings = async (req, res) => {
  try {
    const { data: listings, error } = await supabase
      .from('listings')
      .select(`
        *,
        host:host_id(id, name, avatar_url),
        reviews(count),
        amenities(*)
      `);

    if (error) throw error;

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListing = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        *,
        host:host_id(id, name, avatar_url),
        reviews(*),
        amenities(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createListing = async (req, res) => {
  try {
    const { title, description, price, location, ...rest } = req.body;
    const hostId = req.user.id;

    const { data: listing, error } = await supabase
      .from('listings')
      .insert([
        { 
          title,
          description,
          price,
          location,
          host_id: hostId,
          ...rest
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    // Check ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', id)
      .single();

    if (!listing || listing.host_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data: updatedListing, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', id)
      .single();

    if (!listing || listing.host_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchListings = async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests, type } = req.query;
    let query = supabase.from('listings').select(`
      *,
      host:host_id(id, name, avatar_url),
      reviews(count)
    `);

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (guests) {
      query = query.lte('max_guests', parseInt(guests));
    }

    // For check-in/check-out dates, we'd need to check booking availability
    // This is a simplified version
    const { data: listings, error } = await query;

    if (error) throw error;

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};