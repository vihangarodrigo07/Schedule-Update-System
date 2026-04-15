import { createClient } from '@supabase/supabase-js';

// Supabase project URL
const supabaseUrl = 'https://vmvoomlhynwyimbakunz.supabase.co';

// Supabase anon public key
const supabaseAnonKey = 'sb_publishable_GNwdnkahJkmQJGxI_3kWuQ_9rCkUXuj';

// Create and export Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
