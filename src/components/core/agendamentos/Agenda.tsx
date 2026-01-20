"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui-shadcn/button"
import { Card } from "@/components/ui-shadcn/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-shadcn/select"
import { Badge } from "@/components/ui-shadcn/badge"
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    User,
    Users,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react"
import {AgendaGrid} from "@/components/core/agendamentos/AgendaGrid";


export default function AgendaPage() {
    const [baseDate, setBaseDate] = useState(new Date())
    const [direction, setDirection] = useState<"left" | "right" | null>(null)
    const [dentistaSelecionado, setDentistaSelecionado] = useState("Todos")

    const handlePrev = () => {
        setDirection("left")
        const nova = new Date(baseDate)
        nova.setDate(baseDate.getDate() - 7)
        setBaseDate(nova)
    }

    const handleNext = () => {
        setDirection("right")
        const nova = new Date(baseDate)
        nova.setDate(baseDate.getDate() + 7)
        setBaseDate(nova)
    }

    const handleHoje = () => {
        setDirection(null)
        setBaseDate(new Date())
    }

    const mesFormatado = baseDate.toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
    })

    // Estatísticas mockadas
    const stats = {
        total: 42,
        confirmadas: 35,
        pendentes: 5,
        canceladas: 2,
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
            <div className="max-w-[1800px] mx-auto space-y-6">
                {/* HEADER */}
                <motion.div
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Calendar className="w-7 h-7" />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-none bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Agenda Semanal
                            </h1>
                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                <Clock className="w-4 h-4 text-indigo-500" />
                                {mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Filtro de Dentistas */}
                        <motion.div
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-lg shadow-indigo-100/50 px-4 py-2.5 rounded-xl"
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)"
                            }}
                        >
                            <User className="w-4 h-4 text-indigo-600" />
                            <Select value={dentistaSelecionado} onValueChange={setDentistaSelecionado}>
                                <SelectTrigger className="w-[180px] border-none focus:ring-0 focus:outline-none font-medium">
                                    <SelectValue placeholder="Dentista" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todos">Todos os Dentistas</SelectItem>
                                    <SelectItem value="Dra. Ana">Dra. Ana Silva</SelectItem>
                                    <SelectItem value="Dr. Carlos">Dr. Carlos Mendes</SelectItem>
                                    <SelectItem value="Dr. Eduardo">Dr. Eduardo Costa</SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>

                        {/* Controles de navegação */}
                        <motion.div
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-lg shadow-indigo-100/50 px-2 py-2 rounded-xl"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrev}
                                className="hover:bg-indigo-100 text-indigo-600 transition-all rounded-lg"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <Button
                                onClick={handleHoje}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg px-6 font-semibold"
                            >
                                Hoje
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNext}
                                className="hover:bg-indigo-100 text-indigo-600 transition-all rounded-lg"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* ESTATÍSTICAS */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl shadow-blue-500/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total</p>
                                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                                </div>
                                <Users className="w-10 h-10 text-blue-200" />
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl shadow-green-500/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Confirmadas</p>
                                    <p className="text-3xl font-bold mt-1">{stats.confirmadas}</p>
                                </div>
                                <CheckCircle2 className="w-10 h-10 text-green-200" />
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-xl shadow-amber-500/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-100 text-sm font-medium">Pendentes</p>
                                    <p className="text-3xl font-bold mt-1">{stats.pendentes}</p>
                                </div>
                                <AlertCircle className="w-10 h-10 text-amber-200" />
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="p-4 bg-gradient-to-br from-red-500 to-rose-600 text-white border-0 shadow-xl shadow-red-500/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm font-medium">Canceladas</p>
                                    <p className="text-3xl font-bold mt-1">{stats.canceladas}</p>
                                </div>
                                <XCircle className="w-10 h-10 text-red-200" />
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* LEGENDA */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                    <Card className="p-4 bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-lg">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-sm font-semibold text-gray-700">Legenda:</span>
                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-green-500 hover:bg-green-600 shadow-md">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Confirmada
                                </Badge>
                                <Badge className="bg-amber-500 hover:bg-amber-600 shadow-md">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Pendente
                                </Badge>
                                <Badge className="bg-blue-500 hover:bg-blue-600 shadow-md">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Disponível
                                </Badge>
                                <Badge variant="secondary" className="shadow-md">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Indisponível
                                </Badge>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* AGENDA COM TRANSIÇÃO */}
                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={baseDate.toISOString()}
                            custom={direction}
                            initial={{ x: direction === "left" ? -100 : direction === "right" ? 100 : 0, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction === "left" ? 100 : direction === "right" ? -100 : 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <AgendaGrid baseDate={baseDate} dentista={dentistaSelecionado} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
