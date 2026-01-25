// app/layout.tsx
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import './globals.css';
import React from "react";
import RouteGuard from "@/lib/guard/RouteGuard";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={`${inter.variable} h-full`} suppressHydrationWarning>
        <body className="font-sans min-h-full h-full antialiased bg-background text-foreground">
        <AuthProvider>
            <RouteGuard>
                <div className="min-h-full h-full">
                    {children}
                </div>
            </RouteGuard>
        </AuthProvider>
        </body>
        </html>
    );
}