import { supabase } from './supabaseClient';
import { mockClients } from '../lib/mockData';

export const clientService = {
    // Fetch all clients for the logged-in user
    async getClients() {
        if (!supabase.supabaseUrl) return mockClients;

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) {
            console.warn('Supabase error, falling back to mock:', error);
            return mockClients;
        }
        return data && data.length > 0 ? data : mockClients; // Use mock if empty (for demo)
    },

    // Get a single client by ID
    async getClientById(id) {
        if (!supabase.supabaseUrl) return mockClients.find(c => c.id === id);

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.warn('Supabase error, falling back to mock:', error);
            return mockClients.find(c => c.id === id);
        }
        return data;
    },

    // Create a new client
    async createClient(clientData) {
        const { data, error } = await supabase
            .from('clients')
            .insert([
                {
                    ...clientData,
                    user_id: (await supabase.auth.getUser()).data.user?.id
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update an existing client
    async updateClient(id, updates) {
        const { data, error } = await supabase
            .from('clients')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
