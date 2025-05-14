
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qpexrjoyxlnkempprujd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwZXhyam95eGxua2VtcHBydWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTMyNzMsImV4cCI6MjA2MTI2OTI3M30.LJQGYW3dl5LKkDKUgcBsMi_6nICX1qpykuVm2uSMqR4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
