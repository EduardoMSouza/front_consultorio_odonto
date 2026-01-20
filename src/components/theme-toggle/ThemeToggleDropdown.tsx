// components/ThemeToggleDropdown.tsx
"use client"

import { Moon, Sun, Monitor, Check } from "lucide-react"
import { Button } from "@/components/ui-shadcn/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui-shadcn/dropdown-menu"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

const themeOptions = [
    { value: "light" as Theme, label: "Claro", icon: Sun },
    { value: "dark" as Theme, label: "Escuro", icon: Moon },
    { value: "system" as Theme, label: "Sistema", icon: Monitor },
]

interface ThemeToggleDropdownProps {
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    align?: "center" | "start" | "end"
}

export default function ThemeToggleDropdown({
                                                className,
                                                variant = "ghost",
                                                size = "default",
                                                align = "end"
                                            }: ThemeToggleDropdownProps) {
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

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme)
        applyTheme(newTheme)
    }

    const getCurrentThemeIcon = () => {
        if (!mounted) return <Monitor className="h-4 w-4" />

        const currentOption = themeOptions.find(opt => opt.value === theme)
        return currentOption ? (
            <currentOption.icon className="h-4 w-4" />
        ) : (
            <Monitor className="h-4 w-4" />
        )
    }

    const getCurrentThemeLabel = () => {
        if (!mounted) return "Tema"

        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            return prefersDark ? "Sistema (Escuro)" : "Sistema (Claro)"
        }

        return theme === "dark" ? "Escuro" : "Claro"
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
                <span className="hidden sm:inline">Tema</span>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className={cn(
                        "flex items-center gap-2",
                        "hover:bg-accent hover:text-accent-foreground",
                        className
                    )}
                >
                    {getCurrentThemeIcon()}
                    <span className="hidden sm:inline">{getCurrentThemeLabel()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-48">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Escolha o tema
                </div>
                <DropdownMenuSeparator />

                {themeOptions.map((option) => {
                    const Icon = option.icon
                    const isActive = theme === option.value

                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleThemeChange(option.value)}
                            className={cn(
                                "flex items-center justify-between cursor-pointer",
                                isActive && "bg-accent text-accent-foreground"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{option.label}</span>
                            </div>
                            {isActive && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                    )
                })}

                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    O tema sistema segue as configurações do seu dispositivo
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}