// components/layouts/sidebar/Sidebar.tsx
"use client"

import { useState, useEffect } from "react"
import {
    Calendar,
    Users,
    Home,
    User,
    Settings,
    Package,
    Activity,
    BarChart3,
    CreditCard,
    Stethoscope,
    X,
    ChevronDown,
    Menu
} from "lucide-react"
import { Button } from "@/components/ui-shadcn/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import ButtonLogout from "@/components/ui/ButtonLogout"
import { useAuth } from "@/contexts/AuthContext"
import { ScrollArea } from "@/components/ui-shadcn/scroll-area"

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
    {
        id: "dashboard",
        label: "Dashboard",
        icon: Home,
        href: "/dashboard",
        color: "text-blue-500"
    },
    {
        id: "agenda",
        label: "Agenda",
        icon: Calendar,
        href: "/agenda",
        badge: 5,
        color: "text-green-500"
    },
    {
        id: "paciente",
        label: "Pacientes",
        icon: Users,
        href: "/pacientes",
        color: "text-purple-500"
    },
    {
        id: "evolucao",
        label: "Evolução",
        icon: Activity,
        color: "text-amber-500",
        subItems: [
            { label: "Histórico", href: "/evolucao/historico" },
            { label: "Próximas", href: "/evolucao/proximas", badge: 3 },
            { label: "Exames", href: "/evolucao/exames" }
        ]
    },
    {
        id: "tratamento",
        label: "Tratamentos",
        icon: Stethoscope,
        color: "text-cyan-500",
        subItems: [
            { label: "Andamento", href: "/tratamento/andamento", badge: 2 },
            { label: "Concluídos", href: "/tratamento/concluidos" },
            { label: "Orçamentos", href: "/tratamento/orcamentos" }
        ]
    },
    {
        id: "plano-dental",
        label: "Planos",
        icon: CreditCard,
        color: "text-pink-500",
        subItems: [
            { label: "Coberturas", href: "/plano/coberturas" },
            { label: "Autorizações", href: "/plano/autorizacoes" },
            { label: "Convênios", href: "/plano/convenios" }
        ]
    },
    {
        id: "dentista",
        label: "Dentistas",
        icon: User,
        href: "/dentistas",
        color: "text-indigo-500"
    },
    {
        id: "estoque",
        label: "Estoque",
        icon: Package,
        href: "/estoque",
        color: "text-orange-500",
        subItems: [
            { label: "Produtos", href: "/estoque/produtos" },
            { label: "Medicamentos", href: "/estoque/medicamentos" },
            { label: "Fornecedores", href: "/estoque/fornecedores" }
        ]
    },
    {
        id: "financeiro",
        label: "Financeiro",
        icon: BarChart3,
        color: "text-emerald-500",
        subItems: [
            { label: "Contas a Pagar", href: "/financeiro/pagar" },
            { label: "Contas a Receber", href: "/financeiro/receber" },
            { label: "Relatórios", href: "/financeiro/relatorios" }
        ]
    },
    {
        id: "configuracoes",
        label: "Configurações",
        icon: Settings,
        href: "/configuracoes",
        color: "text-gray-500"
    }
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

    return (
        <>
            {/* Mobile Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "lg:hidden fixed top-4 left-4 z-50",
                    "bg-card text-card-foreground shadow-lg hover:bg-accent",
                    "transition-all duration-300"
                )}
                onClick={toggleMobileSidebar}
            >
                {sidebarOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
            </Button>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed lg:sticky top-0 left-0 h-screen z-40",
                "transition-all duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "lg:w-20" : "lg:w-64",
                "lg:translate-x-0"
            )}>
                {/* Sidebar Content */}
                <aside className={cn(
                    "h-full flex flex-col",
                    "bg-sidebar text-sidebar-foreground",
                    "border-r border-border"
                )}>
                    {/* Logo Area - Altura ajustada para alinhar com topbar */}
                    <div className={cn(
                        "h-[73px] px-4 border-b border-border transition-all duration-300",
                        "flex items-center flex-shrink-0"
                    )}>
                        {!isCollapsed ? (
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <span className="text-primary-foreground font-bold text-xl">CE</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-lg font-bold tracking-tight truncate">Consultório</h1>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">Danilo & Eduarda</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-lg">CE</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Menu Area */}
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
                                                    "w-full justify-between hover:bg-sidebar-accent h-10",
                                                    "transition-all duration-200 group",
                                                    isCollapsed ? "px-3 justify-center" : "px-3",
                                                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                                                )}
                                                onClick={() => toggleMenu(item.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <Icon className={cn("w-4 h-4", item.color)} />
                                                        {item.badge && !isCollapsed && (
                                                            <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {!isCollapsed && (
                                                        <span className="font-medium text-sm">{item.label}</span>
                                                    )}
                                                </div>
                                                {!isCollapsed && item.subItems && (
                                                    <ChevronDown className={cn(
                                                        "w-4 h-4 transition-transform duration-200",
                                                        isOpen && "rotate-180"
                                                    )} />
                                                )}
                                            </Button>

                                            {!isCollapsed && isOpen && (
                                                <div className="ml-8 mt-1 mb-2 space-y-1 border-l border-border pl-3 animate-in slide-in-from-left-2">
                                                    {item.subItems.map((subItem, index) => (
                                                        <Button
                                                            key={index}
                                                            variant="ghost"
                                                            className={cn(
                                                                "w-full justify-start h-8 text-sm px-3",
                                                                "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                                                                pathname === subItem.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                                                            )}
                                                            onClick={() => navigateTo(subItem.href)}
                                                        >
                                                            <span className="truncate">{subItem.label}</span>
                                                            {subItem.badge && (
                                                                <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                                                                    {subItem.badge}
                                                                </span>
                                                            )}
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
                                            "w-full justify-start hover:bg-sidebar-accent h-10",
                                            "transition-all duration-200 group",
                                            isCollapsed ? "px-3 justify-center" : "px-3",
                                            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                                        )}
                                        onClick={() => navigateTo(item.href!)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Icon className={cn("w-4 h-4", item.color)} />
                                                {item.badge && !isCollapsed && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            {!isCollapsed && (
                                                <span className="font-medium text-sm">{item.label}</span>
                                            )}
                                        </div>
                                        {!isCollapsed && item.badge && (
                                            <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Button>
                                )
                            })}
                        </nav>
                    </ScrollArea>

                    {/* Bottom Area */}
                    <div className={cn(
                        "w-full p-3 border-t border-border",
                        "bg-sidebar-accent/30 flex-shrink-0",
                        "transition-all duration-300"
                    )}>
                        <ButtonLogout
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "w-full h-10",
                                "hover:bg-destructive/10 hover:text-destructive",
                                "transition-all duration-200",
                                isCollapsed ? "justify-center px-0" : "justify-start px-3"
                            )}
                            showIcon={true}
                            showText={!isCollapsed}
                            showLoading={true}
                        />
                    </div>
                </aside>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    )
}285