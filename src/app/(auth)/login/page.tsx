// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {useAuth} from "@/lib/contexts/AuthContext";

export default function LoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';
    const { login: authLogin, isAuthenticated } = useAuth();

    // Se já estiver autenticado, redireciona
    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirect);
        }
    }, [isAuthenticated, router, redirect]);

    // Carrega dados salvos do localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLogin = localStorage.getItem('rememberedLogin');
            if (savedLogin) {
                setLogin(savedLogin);
                setRememberMe(true);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setIsLoading(true);

        try {
            // Salva o login se "Lembrar de mim" estiver marcado
            if (rememberMe && typeof window !== 'undefined') {
                localStorage.setItem('rememberedLogin', login);
            } else {
                localStorage.removeItem('rememberedLogin');
            }

            await authLogin(login, password);
            router.push(redirect);
        } catch (err: any) {
            console.error('Erro no login:', err);

            // Trata erros específicos de campo
            if (err.fieldErrors) {
                setFieldErrors(err.fieldErrors);
            }

            // Mensagens de erro amigáveis
            if (err.status === 401) {
                setError('Credenciais inválidas. Verifique seu usuário/email e senha.');
            } else if (err.status === 403) {
                setError('Conta inativa ou sem permissão de acesso.');
            } else if (err.status === 429) {
                setError('Muitas tentativas de login. Tente novamente em alguns minutos.');
            } else if (err.message.includes('conexão')) {
                setError('Erro de conexão. Verifique sua internet.');
            } else {
                setError(err.message || 'Erro ao fazer login. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Se estiver autenticado, não renderiza nada (já será redirecionado)
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Sidebar com informações/branding */}
            <div className="hidden md:flex md:w-1/2 flex-col justify-between p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <div>
                    <div className="flex items-center space-x-3 mb-12">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold">SistemaGestão</span>
                    </div>

                    <h1 className="text-4xl font-bold mb-6">
                        Bem-vindo de volta!
                    </h1>
                    <p className="text-blue-100 text-lg mb-8">
                        Faça login para acessar o sistema completo de gestão empresarial.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Performance</h3>
                            <p className="text-blue-200">Dashboard completo com métricas em tempo real</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Segurança</h3>
                            <p className="text-blue-200">Autenticação segura com múltiplos fatores</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulário de Login */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-md">
                    {/* Logo Mobile */}
                    <div className="md:hidden flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800 dark:text-white">SistemaGestão</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                Acessar Sistema
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Use seu email ou nome de usuário
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="login" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email ou Nome de Usuário
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="login"
                                            name="login"
                                            type="text"
                                            required
                                            value={login}
                                            onChange={(e) => setLogin(e.target.value)}
                                            placeholder="usuario@empresa.com ou nome.usuario"
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                                                fieldErrors.login ? 'border-red-300' : 'border-gray-300'
                                            } dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {fieldErrors.login && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {fieldErrors.login.join(', ')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Senha
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                                                fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                                            } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {fieldErrors.password && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {fieldErrors.password.join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={isLoading}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Lembrar de mim
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Entrando...
                                    </>
                                ) : (
                                    'Entrar'
                                )}
                            </button>
                        </form>


                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            © 2026 SistemaGestão. Todos os direitos reservados.
                            <br />
                            <Link href="/termos" className="hover:underline">Termos de uso</Link>
                            {' • '}
                            <Link href="/privacidade" className="hover:underline">Política de privacidade</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}