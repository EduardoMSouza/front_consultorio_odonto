// app/ClientLayout.tsx
'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import Sidebar from '@/components/layouts/sidebar/Sidebar';
import Topbar from '@/components/layouts/topbar/Topbar';
import { cn } from '@/lib/utils';

export default function ClientLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [hasLoadedPreferences, setHasLoadedPreferences] = useState(false);

    // Carrega preferências do localStorage
    useLayoutEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const savedCollapsed = localStorage.getItem('sidebarCollapsed');

            if (savedCollapsed !== null) {
                setIsSidebarCollapsed(savedCollapsed === 'true');
            }
        } catch (error) {
            console.error('Erro ao carregar preferências:', error);
        } finally {
            setHasLoadedPreferences(true);
        }
    }, []);

    // Salva preferências no localStorage
    useEffect(() => {
        if (!hasLoadedPreferences) return;

        try {
            localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.toString());
        } catch (error) {
            console.error('Erro ao salvar preferências:', error);
        }
    }, [isSidebarCollapsed, hasLoadedPreferences]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    // Se ainda não carregou as preferências, mostra um loader simples
    if (!hasLoadedPreferences) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onCollapseChange={setIsSidebarCollapsed}
            />

            {/* Container principal - sem margem, apenas com flex-1 */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                {/* Topbar agora ocupa toda a largura disponível */}
                <Topbar
                    isSidebarCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />

                {/* Main content ocupa todo espaço restante */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}