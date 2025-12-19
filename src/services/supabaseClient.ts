import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (Production)
const SUPABASE_URL = 'https://tufsmyoofuvuxaysrstv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZnNteW9vZnV2dXhheXNyc3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjYzMzQsImV4cCI6MjA4MTU0MjMzNH0.jFqK05Nv9WfKnGBYgQMe8Q7UoRArkx8w9O-3GqZclqA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
