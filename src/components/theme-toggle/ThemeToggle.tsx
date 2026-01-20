// components/ThemeToggle.tsx
"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui-shadcn/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeToggleProps {
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    showLabel?: boolean
    showSystem?: boolean
}

export default function ThemeToggle({
                                        className,
                                        variant = "ghost",
                                        size = "default",
                                        showLabel = false,
                                        showSystem = true
                                    }: ThemeToggleProps) {
    const [theme, setTheme] = useState<Theme>("system")
    const [mounted, setMounted] = useState(false)

    // Carrega tema salvo
    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem("theme") as Theme
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

        if (savedTheme) {
            setTheme(savedTheme)
            applyTheme(savedTheme, prefersDark)
        } else {
            setTheme("system")
            applyTheme("system", prefersDark)
        }
    }, [])

    // Aplica o tema
    const applyTheme = (newTheme: Theme, prefersDark?: boolean) => {
        const root = document.documentElement

        if (newTheme === "dark" || (newTheme === "system" && prefersDark)) {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark")
        }

        localStorage.setItem("theme", newTheme)
    }

    const toggleTheme = () => {
        let newTheme: Theme

        if (theme === "light") {
            newTheme = "dark"
        } else if (theme === "dark") {
            newTheme = showSystem ? "system" : "light"
        } else {
            newTheme = "light"
        }

        setTheme(newTheme)
        applyTheme(newTheme)
    }

    const getThemeIcon = () => {
        if (!mounted) return <Monitor className="h-4 w-4" />

        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            return prefersDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
        }

        return theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
    }

    const getThemeLabel = () => {
        if (!mounted) return "Tema"

        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            return prefersDark ? "Sistema (Escuro)" : "Sistema (Claro)"
        }

        return theme === "dark" ? "Escuro" : "Claro"
    }

    const getNextThemeLabel = () => {
        if (theme === "light") return "Mudar para tema escuro"
        if (theme === "dark") return showSystem ? "Mudar para tema do sistema" : "Mudar para tema claro"
        return "Mudar para tema claro"
    }

    if (!mounted) {
        return (
            <Button
                variant={variant}
                size={size}
                className={cn("flex items-center gap-2", className)}
                disabled
            >
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {showLabel && <span>Carregando...</span>}
            </Button>
        )
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={cn(
                "flex items-center gap-2 transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                className
            )}
            onClick={toggleTheme}
            aria-label={getNextThemeLabel()}
            title={getNextThemeLabel()}
        >
            {getThemeIcon()}
            {showLabel && (
                <span className="whitespace-nowrap">
                    {getThemeLabel()}
                </span>
            )}
        </Button>
    )
}