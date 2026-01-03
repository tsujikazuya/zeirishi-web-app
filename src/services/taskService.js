
import { supabase } from './supabaseClient';
import { mockTasks } from '../lib/mockData';

export const taskService = {
    // Fetch all tasks
    async getTasks() {
        try {
            // For now, if Supabase is not configured, fallback to mock
            if (!supabase.supabaseUrl) return mockTasks;

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('due_date', { ascending: true });

            if (error) {
                console.warn('Supabase not connected or error, falling back to mock:', error);
                return mockTasks;
            }
            return data.length > 0 ? data : mockTasks; // Fallback if empty for demo
        } catch (e) {
            return mockTasks;
        }
    },

    async createTask(task) {
        // Implementation for create
    }
};
