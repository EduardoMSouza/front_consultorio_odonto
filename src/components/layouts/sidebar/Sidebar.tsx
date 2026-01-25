// components/layouts/sidebar/Sidebar.tsx
"use client"

import {useEffect, useState} from "react"
import {
    BarChart3,
    CalendarDays,
    ChevronDown,
    FileHeart,
    FileSignature,
    Home,
    Menu,
    Settings,
    Shield,
    HeartPulse,
    TrendingUp,
    User,
    UserPlus,
    Users2,
    X,
    LogOut
} from "lucide-react"
import {Button} from "@/components/ui-shadcn/button"
import {cn} from "@/lib/utils"
import {usePathname, useRouter} from "next/navigation"
import ButtonLogout from "@/components/ui/ButtonLogout"
import ButtonLogoutConfirm from "@/components/ui/ButtonLogoutConfirm"
import {useAuth} from "@/lib/contexts/AuthContext"
import {ScrollArea} from "@/components/ui-shadcn/scroll-area"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-shadcn/avatar"

type MenuItem = {
    id: string
    label: string
    icon: React.ElementType
    href?: string
    subItems?: SubMenuItem[]
    badge?: number
    color?: string
}

type SubMenuItem = {
    label: string
    href: string
    badge?: number
}

const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Resumo", icon: Home, href: "/dashboard", color: "text-blue-500 dark:text-blue-400"},
    { id: "agenda", label: "Agenda", icon: CalendarDays, href: "/agenda", color: "text-blue-500 dark:text-blue-400",},
    { id: "pacientes", label: "Pacientes", icon: Users2, href: "/pacientes", color: "text-blue-500 dark:text-blue-400"},
    { id: "dentistas", label: "Dentistas", icon: UserPlus, href: "/dentistas", color: "text-blue-500 dark:text-blue-400"},
    { id: "evolucao-tratamento", label: "Evolução de Tratamento", icon: FileHeart, href: "/evolucoes-tratamento", color: "text-blue-500 dark:text-blue-400"},
    { id: "plano-dental", label: "Planos Dentais", icon: Shield, href: "/planos-dentais", color: "text-blue-500 dark:text-blue-400"},
    //{id: "procedimentos", label: "Procedimentos", icon: HeartPulse, href: "/procedimentos", color: "text-blue-500 dark:text-blue-400"},
    //{id: "orcamentos", label: "Orçamentos", icon: FileSignature, href: "/orcamentos", color: "text-blue-500 dark:text-blue-400"},
    //{id: "financeiro", label: "Financeiro", icon: TrendingUp, href: "/financeiro", color: "text-blue-500 dark:text-blue-400"},
    //{id: "relatorios", label: "Relatórios", icon: BarChart3, href: "/relatorios", color: "text-blue-500 dark:text-blue-400"},
    //{id: "configuracoes", label: "Configurações", icon: Settings, href: "/configuracoes", color: "text-blue-500 dark:text-blue-400"}
]

interface SidebarProps {
    isCollapsed: boolean
    onCollapseChange?: (collapsed: boolean) => void
}

export default function Sidebar({ isCollapsed, onCollapseChange }: SidebarProps) {
    const [openMenus, setOpenMenus] = useState<string[]>([])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    useEffect(() => {
        if (isCollapsed) {
            setOpenMenus([])
        }
    }, [isCollapsed])

    const isItemActive = (item: MenuItem) => {
        if (item.href) {
            return pathname === item.href
        }
        if (item.subItems) {
            return item.subItems.some(subItem => pathname === subItem.href)
        }
        return false
    }

    const toggleMenu = (menuId: string) => {
        if (isCollapsed) {
            onCollapseChange?.(false)
            setTimeout(() => {
                setOpenMenus(prev =>
                    prev.includes(menuId)
                        ? prev.filter(id => id !== menuId)
                        : [...prev, menuId]
                )
            }, 300)
        } else {
            setOpenMenus(prev =>
                prev.includes(menuId)
                    ? prev.filter(id => id !== menuId)
                    : [...prev, menuId]
            )
        }
    }

    const toggleMobileSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const navigateTo = (href: string) => {
        router.push(href)
        setSidebarOpen(false)
    }

    const getInitials = (nome: string) => {
        return nome
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase() || 'US'
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "lg:hidden fixed top-4 left-4 z-50",
                    "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-lg hover:bg-blue-100 dark:hover:bg-blue-900/50",
                    "border border-blue-200 dark:border-blue-700/50",
                    "transition-all duration-300"
                )}
                onClick={toggleMobileSidebar}
            >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className={cn(
                "fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col",
                "transition-all duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "lg:w-20" : "lg:w-64",
                "lg:translate-x-0"
            )}>
                <aside className={cn(
                    "h-full flex flex-col",
                    "bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/50 dark:to-slate-900",
                    "border-r border-blue-200 dark:border-blue-800/50",
                    "shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10"
                )}>
                    <div className={cn(
                        "h-[73px] px-4 border-b border-blue-200 dark:border-blue-800/50 transition-all duration-300",
                        "flex items-center flex-shrink-0",
                        "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-800 dark:via-blue-700 dark:to-blue-600"
                    )}>
                        {!isCollapsed ? (
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <HeartPulse className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-lg font-bold tracking-tight truncate text-white">Consultório</h1>
                                    <p className="text-xs text-blue-100/80 mt-0.5 truncate">Odonto Excellence</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                    <HeartPulse className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        )}
                    </div>

                    <ScrollArea className="flex-1 p-3">
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const isOpen = openMenus.includes(item.id)
                                const isActive = isItemActive(item)

                                if (item.subItems) {
                                    return (
                                        <div key={item.id} className="w-full">
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-between hover:bg-blue-100 dark:hover:bg-blue-900/30 h-10",
                                                    "transition-all duration-200 group",
                                                    "border border-transparent hover:border-blue-200 dark:hover:border-blue-700/50",
                                                    isCollapsed ? "px-3 justify-center" : "px-3",
                                                    isActive && "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600"
                                                )}
                                                onClick={() => toggleMenu(item.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", item.color)} />
                                                    {!isCollapsed && (
                                                        <span className="font-medium text-sm text-blue-900 dark:text-blue-100">{item.label}</span>
                                                    )}
                                                </div>
                                                {!isCollapsed && item.subItems && (
                                                    <ChevronDown className={cn(
                                                        "w-4 h-4 transition-transform duration-200 text-blue-500 dark:text-blue-400",
                                                        isOpen && "rotate-180"
                                                    )} />
                                                )}
                                            </Button>

                                            {!isCollapsed && isOpen && (
                                                <div className="ml-8 mt-1 mb-2 space-y-1 border-l border-blue-300 dark:border-blue-700 pl-3">
                                                    {item.subItems.map((subItem, index) => (
                                                        <Button
                                                            key={index}
                                                            variant="ghost"
                                                            className={cn(
                                                                "w-full justify-start h-8 text-sm px-3",
                                                                "hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300",
                                                                "border border-transparent hover:border-blue-200 dark:hover:border-blue-700/30",
                                                                pathname === subItem.href &&
                                                                "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600"
                                                            )}
                                                            onClick={() => navigateTo(subItem.href)}
                                                        >
                                                            <span className="truncate text-blue-800 dark:text-blue-200">{subItem.label}</span>
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                                return (
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start hover:bg-blue-100 dark:hover:bg-blue-900/30 h-10",
                                            "transition-all duration-200 group",
                                            "border border-transparent hover:border-blue-200 dark:hover:border-blue-700/50",
                                            isCollapsed ? "px-3 justify-center" : "px-3",
                                            isActive &&
                                            "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 shadow-sm"
                                        )}
                                        onClick={() => navigateTo(item.href!)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={cn(
                                                "w-4 h-4 transition-transform group-hover:scale-110",
                                                item.color,
                                                isActive && "text-blue-600 dark:text-blue-400"
                                            )} />
                                            {!isCollapsed && (
                                                <span className={cn(
                                                    "font-medium text-sm",
                                                    "text-blue-900 dark:text-blue-100",
                                                    isActive && "font-semibold text-blue-800 dark:text-blue-50"
                                                )}>{item.label}</span>
                                            )}
                                        </div>
                                    </Button>
                                )
                            })}
                        </nav>
                    </ScrollArea>
                </aside>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    )
}