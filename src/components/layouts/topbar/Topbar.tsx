// components/layouts/topbar/Topbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, User, Menu, X } from 'lucide-react';
import UserModal from './UserModal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui-shadcn/button';
import { Input } from '@/components/ui-shadcn/input';
import ThemeToggle from "@/components/theme-toggle/ThemeToggle";
import ThemeToggleDropdown from "@/components/theme-toggle/ThemeToggleDropdown";

interface TopbarProps {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Topbar({
                                   isSidebarCollapsed,
                                   toggleSidebar,
                               }: TopbarProps) {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();

    // Atualiza hora atual
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            setCurrentTime(timeString);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);

        return () => clearInterval(interval);
    }, []);

    // Dados do usuário
    const userData = {
        name: user?.nome || 'Usuário',
        email: user?.email || 'usuario@consultorio.com',
        role: user?.role || 'Administrador',
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
        }
    };

    const clearNotifications = () => {
        setNotificationsCount(0);
    };

    return (
        <header className="h-[73px] border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex-shrink-0">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden hover:bg-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menu principal"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Sidebar Toggle Button (Desktop) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="hidden lg:flex hover:bg-accent transition-colors"
                        aria-label={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
                    >
                        <div className="relative w-5 h-5">
                            <div className={cn(
                                "absolute top-0 left-0 w-5 h-0.5 bg-foreground transition-all duration-300",
                                isSidebarCollapsed ? "rotate-45 translate-y-2" : "rotate-0 translate-y-0"
                            )} />
                            <div className={cn(
                                "absolute top-2 left-0 w-5 h-0.5 bg-foreground transition-all duration-300",
                                isSidebarCollapsed ? "opacity-0" : "opacity-100"
                            )} />
                            <div className={cn(
                                "absolute top-4 left-0 w-5 h-0.5 bg-foreground transition-all duration-300",
                                isSidebarCollapsed ? "-rotate-45 -translate-y-2" : "rotate-0 translate-y-0"
                            )} />
                        </div>
                    </Button>

                    {/* Logo Mobile */}
                    <div className="lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">CE</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar pacientes, consultas..."
                                className="pl-10 pr-4 bg-background border-border focus:border-primary focus:ring-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* Current Time */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg">
                        <span className="text-sm font-medium text-accent-foreground">
                            {currentTime}
                        </span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle - Versão dropdown (alternativa) */}
                    <div className="hidden md:block">
                        <ThemeToggleDropdown
                            variant="ghost"
                            size="default"
                            align="end"
                        />
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent transition-colors relative"
                            aria-label="Notificações"
                            onClick={clearNotifications}
                        >
                            <Bell className="w-5 h-5" />
                            {notificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                                    {notificationsCount > 9 ? '9+' : notificationsCount}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* User Profile */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-3 hover:bg-accent transition-colors pl-2 pr-3"
                            onClick={() => setIsUserModalOpen(!isUserModalOpen)}
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-medium truncate max-w-[120px]">
                                    {userData.name}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {userData.role.toLowerCase()}
                                </p>
                            </div>
                        </Button>

                        {isUserModalOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsUserModalOpen(false)}
                                />
                                <UserModal
                                    userData={userData}
                                    onClose={() => setIsUserModalOpen(false)}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 right-0 bg-card border-b shadow-lg animate-in slide-in-from-top-2 z-50">
                    <div className="p-4 space-y-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar..."
                                    className="pl-10 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>

                        {/* Mobile Theme Toggle */}
                        <div className="flex items-center justify-between p-2">
                            <span className="text-sm font-medium">Tema</span>
                            <ThemeToggle
                                variant="outline"
                                size="sm"
                                showLabel={true}
                                showSystem={true}
                            />
                        </div>

                        {/* Mobile User Info */}
                        <div className="p-3 bg-accent rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{userData.name}</p>
                                    <p className="text-xs text-muted-foreground">{userData.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}