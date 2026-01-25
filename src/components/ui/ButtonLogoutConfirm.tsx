// components/ButtonLogoutConfirm.tsx
"use client"

import React, { useState } from "react"
import { LogOut, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui-shadcn/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui-shadcn/alert-dialog"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/contexts/AuthContext"

interface ButtonLogoutConfirmProps {
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    onBeforeLogout?: () => Promise<void> | void
    onAfterLogout?: () => void
    redirectTo?: string
    confirmationMessage?: string
    confirmationTitle?: string
    cancelText?: string
    confirmText?: string
    showConfirmation?: boolean
    showIcon?: boolean
    showText?: boolean
    children?: React.ReactNode
    triggerAsChild?: boolean
}

export default function ButtonLogoutConfirm({
                                                className,
                                                variant = "ghost",
                                                size = "default",
                                                onBeforeLogout,
                                                onAfterLogout,
                                                redirectTo = "/login",
                                                confirmationMessage = "Tem certeza que deseja sair do sistema? Você será redirecionado para a página de login.",
                                                confirmationTitle = "Confirmar Saída",
                                                cancelText = "Cancelar",
                                                confirmText = "Sair",
                                                showConfirmation = true,
                                                showIcon = true,
                                                showText = true,
                                                children,
                                                triggerAsChild = false
                                            }: ButtonLogoutConfirmProps) {
    const { logout } = useAuth()
    const [open, setOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
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
            setOpen(false)
        }
    }

    const handleClick = () => {
        if (showConfirmation) {
            setOpen(true)
        } else {
            handleLogout()
        }
    }

    // Se não mostrar confirmação, comporta-se como o botão simples
    if (!showConfirmation) {
        return (
            <Button
                variant={variant}
                size={size}
                className={cn(
                    "flex items-center justify-center gap-2 transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    variant === 'destructive' && 'hover:bg-destructive/90 hover:text-destructive-foreground',
                    variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
                    variant === 'outline' && 'border-input hover:bg-accent hover:text-accent-foreground',
                    size === 'icon' && 'h-10 w-10',
                    size === 'sm' && 'h-9 px-3',
                    size === 'lg' && 'h-11 px-8',
                    className
                )}
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label="Sair do sistema"
            >
                {isLoggingOut ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : showIcon ? (
                    <LogOut className={cn(
                        "h-4 w-4",
                        size === 'sm' && "h-3.5 w-3.5",
                        size === 'lg' && "h-5 w-5"
                    )} />
                ) : null}

                {showText && (
                    <span className={cn(
                        "whitespace-nowrap",
                        isLoggingOut && "opacity-70",
                        size === 'sm' && "text-sm",
                        size === 'lg' && "text-base"
                    )}>
                        {isLoggingOut ? "Saindo..." : children || "Sair"}
                    </span>
                )}
            </Button>
        )
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild={triggerAsChild}>
                <Button
                    variant={variant}
                    size={size}
                    className={cn(
                        "flex items-center justify-center gap-2 transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        variant === 'destructive' && 'hover:bg-destructive/90 hover:text-destructive-foreground',
                        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
                        variant === 'outline' && 'border-input hover:bg-accent hover:text-accent-foreground',
                        size === 'icon' && 'h-10 w-10',
                        size === 'sm' && 'h-9 px-3',
                        size === 'lg' && 'h-11 px-8',
                        className
                    )}
                    onClick={handleClick}
                    aria-label="Sair do sistema"
                >
                    {showIcon && (
                        <LogOut className={cn(
                            "h-4 w-4",
                            size === 'sm' && "h-3.5 w-3.5",
                            size === 'lg' && "h-5 w-5"
                        )} />
                    )}
                    {showText && (
                        <span className={cn(
                            "whitespace-nowrap",
                            size === 'sm' && "text-sm",
                            size === 'lg' && "text-base"
                        )}>
                            {children || "Sair"}
                        </span>
                    )}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <AlertDialogTitle className="text-lg font-semibold text-foreground">
                            {confirmationTitle}
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-sm text-muted-foreground pt-2 pl-13">
                        {confirmationMessage}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 sm:mt-4 gap-3">
                    <AlertDialogCancel
                        className="mt-0 order-2 sm:order-1 w-full sm:w-auto"
                        disabled={isLoggingOut}
                    >
                        {cancelText}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleLogout}
                        className={cn(
                            "bg-red-600 hover:bg-red-700 text-white",
                            "order-1 sm:order-2 w-full sm:w-auto",
                            "focus-visible:ring-red-600",
                            isLoggingOut && "opacity-70 cursor-not-allowed"
                        )}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <span className="text-sm font-medium">Saindo...</span>
                            </div>
                        ) : (
                            <span className="text-sm font-medium">{confirmText}</span>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}