
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
        console.error('Supabase initialization failed:', e);
    }
} else {
    console.warn('Supabase credentials missing. App running in offline/mock mode.');
    // Create a proxy to log errors when accessed
    supabaseInstance = new Proxy({}, {
        get: (target, prop) => {
            if (prop === 'supabaseUrl') return null; // Used for connection checking
            return () => {
                console.warn(`Supabase function '${String(prop)}' called but client is not initialized.`);
                return { data: null, error: { message: 'Supabase not configured' } };
            };
        }
    });
}

export const supabase = supabaseInstance;
