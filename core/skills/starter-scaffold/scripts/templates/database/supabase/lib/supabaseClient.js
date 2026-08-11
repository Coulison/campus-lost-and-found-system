// Requires: npm install @supabase/supabase-js
// Create a free project at supabase.com, then fill in .env from .env.example
// (Settings > API in the Supabase dashboard for the URL + anon key).
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
