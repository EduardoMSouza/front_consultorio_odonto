// components/ButtonLogout.tsx
"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui-shadcn/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {useAuth} from "@/lib/contexts/AuthContext";


interface ButtonLogoutProps {
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    onBeforeLogout?: () => Promise<void> | void
    onAfterLogout?: () => void
    redirectTo?: string
    showLoading?: boolean
    showIcon?: boolean
    showText?: boolean
    children?: React.ReactNode
}

export default function ButtonLogout({
                                         className,
                                         variant = "ghost",
                                         size = "default",
                                         onBeforeLogout,
                                         onAfterLogout,
                                         redirectTo = "/login",
                                         showLoading = true,
                                         showIcon = true,
                                         showText = true,
                                         children
                                     }: ButtonLogoutProps) {
    const { logout } = useAuth()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        if (isLoggingOut) return

        setIsLoggingOut(true)

        try {
            // Executa callback antes do logout se fornecido
            if (onBeforeLogout) {
                await onBeforeLogout()
            }

            // Executa logout pelo contexto
            await logout()

            // Callback após logout bem-sucedido
            if (onAfterLogout) {
                onAfterLogout()
            }

            // Redireciona para login
            if (typeof window !== 'undefined') {
                // Adiciona delay para garantir que o logout foi processado
                setTimeout(() => {
                    window.location.href = redirectTo
                }, 100)
            }

        } catch (error) {
            console.error("Erro durante logout:", error)

            // Em caso de erro, ainda tenta limpar tokens locais
            if (typeof window !== 'undefined') {
                try {
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('user')
                    localStorage.removeItem('token_expires_at')
                    localStorage.removeItem('sidebarCollapsed')
                    localStorage.removeItem('darkMode')
                } catch (e) {
                    console.error("Erro ao limpar localStorage:", e)
                }

                // Redireciona mesmo com erro
                window.location.href = redirectTo
            }

        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={cn(
                "flex items-center justify-center gap-2 transition-all duration-200",
                variant === 'destructive' && 'hover:bg-red-600 hover:text-white',
                variant === 'ghost' && 'hover:bg-gray-100 dark:hover:bg-gray-800',
                variant === 'outline' && 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
                className
            )}
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Sair do sistema"
        >
            {showLoading && isLoggingOut ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : showIcon ? (
                <LogOut className="h-4 w-4" />
            ) : null}

            {showText && (
                <span className={cn("whitespace-nowrap", isLoggingOut && "opacity-70")}>
                    {isLoggingOut ? "Saindo..." : children || "Sair"}
                </span>
            )}
        </Button>
    )
}