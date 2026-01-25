// components/layouts/topbar/Topbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, User, Menu, X, LogOut, Settings } from 'lucide-react';
import UserModal from './UserModal';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui-shadcn/button';
import { Input } from '@/components/ui-shadcn/input';
import ThemeToggle from "@/components/theme-toggle/ThemeToggle";
import ThemeToggleDropdown from "@/components/theme-toggle/ThemeToggleDropdown";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui-shadcn/dropdown-menu";
import { Badge } from "@/components/ui-shadcn/badge";

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
    const [currentTime, setCurrentTime] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

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



    const clearNotifications = () => {
        setNotificationsCount(0);
    };

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro durante logout:', error);
            window.location.href = '/login';
        }
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

                    {/* Current Time */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg">
                        <span className="text-sm font-medium text-accent-foreground">
                            {currentTime}
                        </span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle - Versão dropdown */}
                    <div className="hidden md:block">
                        <ThemeToggleDropdown
                            variant="ghost"
                            size="default"
                            align="end"
                        />
                    </div>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative hover:bg-accent transition-colors"
                            >
                                <Bell className="h-5 w-5" />
                                {notificationsCount > 0 && (
                                    <Badge
                                        className="absolute -top-1 -right-1 px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-red-500 text-white text-xs border-0"
                                        variant="destructive"
                                    >
                                        {notificationsCount > 9 ? '9+' : notificationsCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel className="flex items-center justify-between">
                                <span>Notificações</span>
                                {notificationsCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearNotifications}
                                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Limpar tudo
                                    </Button>
                                )}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-64 overflow-y-auto p-1">
                                {notificationsCount > 0 ? (
                                    <>
                                        <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer hover:bg-accent rounded">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="text-sm font-medium">Nova consulta agendada</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">Há 10 minutos</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer hover:bg-accent rounded">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="text-sm font-medium">Pagamento confirmado</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">Há 2 horas</span>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                        <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
                                    </div>
                                )}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="justify-center text-sm text-primary cursor-pointer hover:bg-accent">
                                Ver todas as notificações
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-3 hover:bg-accent transition-colors pl-2 pr-3"
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
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userData.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userData.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setIsUserModalOpen(true)}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Meu Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configurações</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-700 dark:focus:text-red-300"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 right-0 bg-card border-b shadow-lg animate-in slide-in-from-top-2 z-50">
                    <div className="p-4 space-y-4">

                        {/* Mobile Notifications */}
                        <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5" />
                                <div>
                                    <p className="text-sm font-medium">Notificações</p>
                                    <p className="text-xs text-muted-foreground">
                                        {notificationsCount} não lidas
                                    </p>
                                </div>
                            </div>
                            {notificationsCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearNotifications}
                                    className="h-7 px-2 text-xs"
                                >
                                    Limpar
                                </Button>
                            )}
                        </div>

                        {/* Mobile Theme Toggle */}
                        <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
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
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{userData.name}</p>
                                    <p className="text-xs text-muted-foreground">{userData.email}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{userData.role.toLowerCase()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Options */}
                        <div className="space-y-1 pt-2 border-t">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => {
                                    setIsUserModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <User className="mr-2 h-4 w-4" />
                                Meu Perfil
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Configurações
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair do Sistema
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Modal */}
            {isUserModalOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserModalOpen(false)}
                    />
                    <UserModal
                        userData={userData.name}
                        onClose={() => setIsUserModalOpen(false)}
                    />
                </>
            )}
        </header>
    );
}