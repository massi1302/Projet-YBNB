import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp({ email, password, ...data }) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: data.name,
        avatar_url: null
      }
    }
  });
  
  if (error) throw error;
  return user;
}

export async function signIn({ email, password }) {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function updateProfile(updates) {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });
  
  if (error) throw error;
  return data;
}