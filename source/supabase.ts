import { createClient } from '@supabase/supabase-js';

// This publishable key is intended for browser applications, not administrative access.
export const supabase = createClient(
  'https://rzvfeeatzksvgxucbzbo.supabase.co',
  'sb_publishable_qyTSD1QtcPLdF7UtQBtmNw_3Gw3P3nG',
  { auth: { storage: window.sessionStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);
