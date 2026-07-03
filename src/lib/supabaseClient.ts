import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Netlify site settings or environment variables.'
  );
}

// Fallback placeholders to prevent createClient from throwing an error at load time
const fallbackUrl = 'https://placeholder-project.supabase.co';
const fallbackKey = 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl || fallbackUrl, supabaseAnonKey || fallbackKey);

