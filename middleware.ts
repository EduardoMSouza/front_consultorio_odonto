// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas (acesso sem autenticação)
const PUBLIC_ROUTES = [
    '/',
    '/login',
    //'/recuperar-senha',
    '/api/auth/login',
    '/api/auth/refresh',
];

// Rotas protegidas (requerem autenticação)
const PROTECTED_ROUTES = [
    '/dashboard',
    '/dentistas',
    '/pacientes',
    '/planos-dentais',
    // Adicione outras rotas protegidas aqui
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

    // Obtém cookie de autenticação
    const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';

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