import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const initAuth = async () => {
            try {
                // Check if running in offline mode (mock user already set?)
                const storedUser = localStorage.getItem('zeirishi_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setIsLoading(false);
                    return;
                }

                // If online, check Supabase session
                if (authService.getUser) {
                    const user = await authService.getUser();
                    if (user) setUser(user);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Listen for Supabase auth changes
        // Use optional chaining or check if supabase client is real
        // Accessing the real supabase instance imported from service
        import('../services/supabaseClient').then(({ supabase }) => {
            if (supabase && supabase.auth) {
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    if (session?.user) {
                        setUser(session.user);
                        localStorage.removeItem('zeirishi_user'); // Clear demo user if real login happens
                    } else if (!localStorage.getItem('zeirishi_user')) {
                        // Only clear if not in demo mode
                        setUser(null);
                    }
                    setIsLoading(false);
                });
                return () => subscription.unsubscribe();
            }
        });
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);

        // Demo Login Bypass (Works even if Supabase is offline)
        if (email === 'demo@example.com' && password === 'demo') {
            await loginAsDemo();
            return true;
        }

        const { data, error } = await authService.signIn(email, password);
        if (error) {
            console.error(error);
            setIsLoading(false);
            return false;
        }
        setUser(data.user);
        setIsLoading(false);
        return true;
    };

    const loginAsDemo = async () => {
        return new Promise((resolve) => {
            setIsLoading(true);
            setTimeout(() => {
                const demoUser = { id: 'demo123', email: 'demo@example.com', name: 'Demo User' };
                setUser(demoUser);
                localStorage.setItem('zeirishi_user', JSON.stringify(demoUser));
                setIsLoading(false);
                resolve(demoUser);
            }, 500);
        });
    };

    const logout = async () => {
        setIsLoading(true);
        await authService.signOut();
        setUser(null);
        localStorage.removeItem('zeirishi_user');
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loginAsDemo, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
