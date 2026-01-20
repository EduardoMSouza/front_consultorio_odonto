// guard/RouteGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
    children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading, checkAuth } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/login', '/recuperar-senha', '/cadastro', '/'];

    useEffect(() => {
        const verifyAuth = async () => {
            setIsChecking(true);

            // Se estiver em uma rota pública, permite acesso
            const isPublicRoute = publicRoutes.some(route =>
                pathname?.startsWith(route)
            );

            if (isPublicRoute) {
                setIsChecking(false);
                return;
            }

            // Verifica se há token
            const token = authService.getAccessToken();
            if (!token) {
                // Sem token, redireciona para login
                const redirectPath = encodeURIComponent(pathname || '/dashboard');
                router.push(`/login?redirect=${redirectPath}`);
                return;
            }

            // Verifica se o token está válido
            const isValid = await authService.validateSession();

            if (!isValid) {
                // Token inválido, limpa e redireciona
                await authService.logout();
                const redirectPath = encodeURIComponent(pathname || '/dashboard');
                router.push(`/login?redirect=${redirectPath}`);
                return;
            }

            // Atualiza estado de autenticação
            checkAuth();
            setIsChecking(false);
        };

        verifyAuth();
    }, [pathname, router, checkAuth]);

    // Se estiver verificando, mostra loading
    if (isChecking || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                        Verificando autenticação...
                    </p>
                </div>
            </div>
        );
    }

    // Se estiver autenticado e tentar acessar login, redireciona
    if (isAuthenticated && pathname === '/login') {
        router.push('/dashboard');
        return null;
    }

    return <>{children}</>;
}