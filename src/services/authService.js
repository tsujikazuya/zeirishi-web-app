
import { supabase } from './supabaseClient';

export const authService = {
    // Sign up with Email/Password
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    },

    // Sign in with Email/Password
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Get current session
    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        return { session: data.session, error };
    },

    // Get current user
    async getUser() {
        if (!supabase.supabaseUrl) return null; // Mock fallback handled by AuthContext if needed
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }
};
