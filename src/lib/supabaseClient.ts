import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Define the types for your environment variables
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create and export the Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
