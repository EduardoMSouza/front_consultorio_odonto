// components/ButtonLogoutConfirm.tsx
"use client"

import { useState } from "react"
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
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

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
                    variant === 'destructive' && 'hover:bg-red-600 hover:text-white',
                    variant === 'ghost' && 'hover:bg-gray-100 dark:hover:bg-gray-800',
                    variant === 'outline' && 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
                    className
                )}
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label="Sair do sistema"
            >
                {isLoggingOut ? (
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

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild={triggerAsChild}>
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
                        onClick={handleClick}
                        aria-label="Sair do sistema"
                    >
                        {showIcon && <LogOut className="h-4 w-4" />}
                        {showText && <span>{children || "Sair"}</span>}
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-lg">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            {confirmationTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300 pt-2">
                            {confirmationMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-4 flex-col sm:flex-row gap-2">
                        <AlertDialogCancel
                            className="mt-2 sm:mt-0 order-2 sm:order-1"
                            disabled={isLoggingOut}
                        >
                            {cancelText}
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleLogout}
                            className={cn(
                                "bg-red-500 hover:bg-red-600 text-white",
                                "order-1 sm:order-2",
                                isLoggingOut && "opacity-70 cursor-not-allowed"
                            )}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Saindo...</span>
                                </div>
                            ) : (
                                confirmText
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}