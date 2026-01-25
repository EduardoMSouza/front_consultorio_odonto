// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Importa as configurações do .env.local
const COOKIE_AUTH_NAME = process.env.NEXT_PUBLIC_COOKIE_AUTH_NAME || 'isAuthenticated';

// Rotas públicas (acesso sem autenticação)
const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/api/auth/login',
    '/api/auth/refresh',
];

// Rotas protegidas (requerem autenticação)
const PROTECTED_ROUTES = [
    '/dashboard',
    '/dentistas',
    '/pacientes',
    '/planos-dentais',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Verifica se é uma rota pública
    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // Verifica se é uma rota protegida
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // Obtém cookie de autenticação usando o nome do .env.local
    const isAuthenticated = request.cookies.get(COOKIE_AUTH_NAME)?.value === 'true';

    // Se estiver autenticado e tentar acessar login, redireciona para dashboard
    if (isAuthenticated && pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Se for rota protegida e não estiver autenticado, redireciona para login
    if (isProtectedRoute && !isAuthenticated && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
    ],
};