"use client"

import { ReactNode, useState } from 'react'
import { format, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, Clock, Calendar, Filter, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import './AgendaHeader.css'

interface AgendaHeaderProps {
    view: 'day' | 'week' | 'month'
    currentDate: Date
    onPrev: () => void
    onNext: () => void
    onToday: () => void
    onViewChange?: (view: 'day' | 'week' | 'month') => void
    totalAgendamentos: number
    filters?: {
        status: string[]
        procedimentos: string[]
        dentistas: string[]
    }
    onFilterChange?: (filters: {
        status: string[]
        procedimentos: string[]
        dentistas: string[]
    }) => void
    children?: ReactNode
}

const VIEW_CONFIG = {
    day: {
        icon: Clock,
        title: 'Agenda Diária',
        format: (date: Date) => format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })
    },
    week: {
        icon: Calendar,
        title: 'Agenda Semanal',
        format: (date: Date) => format(date, "'Semana de' dd 'de' MMMM", { locale: ptBR })
    },
    month: {
        icon: CalendarDays,
        title: 'Agenda Mensal',
        format: (date: Date) => format(date, "MMMM 'de' yyyy", { locale: ptBR })
    }
}

const STATUS_OPTIONS = [
    { value: 'AGENDADO', label: 'Agendado', color: '#3b82f6' },
    { value: 'CONFIRMADO', label: 'Confirmado', color: '#10b981' },
    { value: 'EM_ATENDIMENTO', label: 'Em Atendimento', color: '#8b5cf6' },
    { value: 'CONCLUIDO', label: 'Concluído', color: '#22c55e' },
    { value: 'CANCELADO', label: 'Cancelado', color: '#ef4444' },
    { value: 'FALTA', label: 'Falta', color: '#f59e0b' }
]

export function AgendaHeader({
                                 view,
                                 currentDate,
                                 onPrev,
                                 onNext,
                                 onToday,
                                 onViewChange,
                                 totalAgendamentos,
                                 filters,
                                 onFilterChange,
                                 children
                             }: AgendaHeaderProps) {
    const [showFilters, setShowFilters] = useState(false)
    const [localFilters, setLocalFilters] = useState(filters || {
        status: ['AGENDADO', 'CONFIRMADO', 'EM_ATENDIMENTO'],
        procedimentos: [],
        dentistas: []
    })

    const viewConfig = VIEW_CONFIG[view]
    const Icon = viewConfig.icon
    const isCurrentDay = isToday(currentDate)

    const toggleStatusFilter = (status: string) => {
        setLocalFilters(prev => ({
            ...prev,
            status: prev.status.includes(status)
                ? prev.status.filter(s => s !== status)
                : [...prev.status, status]
        }))
    }

    const clearFilters = () => {
        setLocalFilters({
            status: [],
            procedimentos: [],
            dentistas: []
        })
    }

    const applyFilters = () => {
        onFilterChange?.(localFilters)
        setShowFilters(false)
    }

    const activeFilterCount = Object.values(localFilters).reduce(
        (count, arr) => count + arr.length, 0
    )

    return (
        <div className="agenda-header-container">
            <div className="agenda-header-content">
                <div className="agenda-header-left">
                    <div className="agenda-header-icon">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h1 className="agenda-header-title">{viewConfig.title}</h1>
                        <div className="agenda-header-subtitle">
                            <span>{viewConfig.format(currentDate)}</span>
                            {isCurrentDay && (
                                <span className="agenda-header-today-badge">HOJE</span>
                            )}
                            <span className="agenda-header-count">
                                {totalAgendamentos} {totalAgendamentos === 1 ? 'agendamento' : 'agendamentos'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="agenda-header-right">
                    {/* Botões de Visualização */}
                    {onViewChange && (
                        <div className="agenda-header-nav">
                            <button
                                className={`agenda-header-button ${view === 'day' ? 'active' : ''}`}
                                onClick={() => onViewChange('day')}
                            >
                                <Clock size={16} />
                                Dia
                            </button>
                            <button
                                className={`agenda-header-button ${view === 'week' ? 'active' : ''}`}
                                onClick={() => onViewChange('week')}
                            >
                                <Calendar size={16} />
                                Semana
                            </button>
                            <button
                                className={`agenda-header-button ${view === 'month' ? 'active' : ''}`}
                                onClick={() => onViewChange('month')}
                            >
                                <CalendarDays size={16} />
                                Mês
                            </button>
                        </div>
                    )}

                    {/* Botão de Filtros */}
                    <div className="relative">
                        <button
                            className={`filter-button ${activeFilterCount > 0 ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={16} />
                            Filtros
                            {activeFilterCount > 0 && (
                                <span className="filter-badge">{activeFilterCount}</span>
                            )}
                        </button>

                        {showFilters && (
                            <div className="filters-dropdown">
                                <div className="filters-dropdown-header">
                                    <div className="filters-dropdown-title">Filtrar por Status</div>
                                </div>
                                <div className="filters-dropdown-content">
                                    {STATUS_OPTIONS.map(option => (
                                        <div
                                            key={option.value}
                                            className={`filter-option ${localFilters.status.includes(option.value) ? 'checked' : ''}`}
                                            onClick={() => toggleStatusFilter(option.value)}
                                        >
                                            <div className="filter-option-checkbox">
                                                {localFilters.status.includes(option.value) && (
                                                    <Check className="filter-option-checkbox-icon" size={12} />
                                                )}
                                            </div>
                                            <div className="filter-option-label">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: option.color }}
                                                    />
                                                    {option.label}
                                                </div>
                                            </div>
                                            {localFilters.status.includes(option.value) && (
                                                <div
                                                    className="filter-option-badge"
                                                    style={{ backgroundColor: option.color }}
                                                >
                                                    ✓
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="filters-dropdown-actions">
                                    <button
                                        className="filters-clear-button"
                                        onClick={clearFilters}
                                    >
                                        Limpar
                                    </button>
                                    <button
                                        className="filters-apply-button"
                                        onClick={applyFilters}
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botões de Navegação */}
                    <div className="agenda-header-nav-buttons">
                        <button
                            className="agenda-header-button"
                            onClick={onToday}
                        >
                            Hoje
                        </button>
                        <div className="agenda-header-nav-divider" />
                        <button
                            className="agenda-header-nav-button"
                            onClick={onPrev}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            className="agenda-header-nav-button"
                            onClick={onNext}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Slot para conteúdo adicional */}
            {children}
        </div>
    )
}
