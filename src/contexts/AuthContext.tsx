// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { UserResponse } from '@/models/auth.type';

interface AuthContextType {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (login: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: Partial<UserResponse>) => void;
    checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Verifica autenticação ao carregar
    useEffect(() => {
        checkAuth();

        // Configura listener para storage changes (outras abas)
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const checkAuth = () => {
        setIsLoading(true);
        const authenticated = authService.isAuthenticated();
        const user = authService.getUser();

        setIsAuthenticated(authenticated);
        setUser(user);
        setIsLoading(false);
    };

    const login = async (login: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ login, password });
            setUser(response.user);
            setIsAuthenticated(true);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = (userData: Partial<UserResponse>) => {
        authService.updateUser(userData);
        const currentUser = authService.getUser();
        setUser(currentUser);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            login,
            logout,
            updateUser,
            checkAuth,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}