"use client"

import {useState, useEffect} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui-shadcn/dialog"
import {Button} from "@/components/ui-shadcn/button"
import {Input} from "@/components/ui-shadcn/input"
import {Label} from "@/components/ui-shadcn/label"
import {Textarea} from "@/components/ui-shadcn/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui-shadcn/select"
import {Badge} from "@/components/ui-shadcn/badge"
import {toast} from "sonner"
import {Calendar, Clock, User, Phone, FileText, Sparkles, CheckCircle2} from "lucide-react"

interface AgendaDialogProps {
    selected: { date: Date; time: string } | null,
    onClose: () => void,
    onSubmitSuccess?: () => void
}

export function AgendaDialog({selected, onClose, onSubmitSuccess}: AgendaDialogProps) {
    const [paciente, setPaciente] = useState("")
    const [telefone, setTelefone] = useState("")
    const [duracao, setDuracao] = useState(30)
    const [procedimento, setProcedimento] = useState("")
    const [observacao, setObservacao] = useState("")
    const [dentista, setDentista] = useState("Dra. Ana")

    useEffect(() => {
        if (selected) {
            setPaciente("")
            setTelefone("")
            setDuracao(30)
            setProcedimento("")
            setObservacao("")
            setDentista("Dra. Ana")
        }
    }, [selected])

    if (!selected) return null

    const dataStr = selected.date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    const horaStr = selected.time

    const handleSubmit = () => {
        if (!paciente.trim()) {
            toast.error("Por favor, preencha o nome do paciente.")
            return
        }
        if (!telefone.trim()) {
            toast.error("Por favor, preencha o telefone do paciente.")
            return
        }

        toast.success(
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold">Consulta agendada com sucesso!</p>
                    <p className="text-sm text-gray-600 mt-1">
                        {paciente} • {dataStr} às {horaStr}
                    </p>
                </div>
            </div>,
        )
        onClose()
    }

    const procedimentos = [
        "Consulta de rotina",
        "Limpeza dental",
        "Clareamento",
        "Canal",
        "Extração",
        "Ortodontia",
        "Implante",
        "Prótese",
        "Outro",
    ]

    return (
        <AnimatePresence>
            {selected && (
                <Dialog open={!!selected} onOpenChange={onClose}>
                    <DialogContent
                        className="sm:max-w-2xl bg-gradient-to-br from-white to-indigo-50/30 p-0 border-2 border-indigo-100 shadow-2xl shadow-indigo-500/20 overflow-hidden">
                        {/* Header com gradiente */}
                        <motion.div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative overflow-hidden"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                        >
                            <motion.div
                                className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                                animate={{scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3]}}
                                transition={{repeat: Number.POSITIVE_INFINITY, duration: 3}}
                            />

                            <DialogHeader className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <motion.div
                                        className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
                                        whileHover={{rotate: 360, scale: 1.1}}
                                        transition={{duration: 0.6}}
                                    >
                                        <Sparkles className="w-6 h-6"/>
                                    </motion.div>
                                    <DialogTitle className="text-3xl font-bold">Nova Consulta</DialogTitle>
                                </div>

                                <div className="flex items-center gap-4 text-indigo-100 text-sm">
                                    <div
                                        className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                        <Calendar className="w-4 h-4"/>
                                        <span className="font-medium">{dataStr}</span>
                                    </div>
                                    <div
                                        className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                        <Clock className="w-4 h-4"/>
                                        <span className="font-medium">{horaStr}</span>
                                    </div>
                                </div>
                            </DialogHeader>
                        </motion.div>

                        {/* Formulário */}
                        <motion.div
                            className="p-6 space-y-5"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.1}}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Paciente */}
                                <motion.div whileHover={{scale: 1.01}} className="space-y-2">
                                    <Label htmlFor="paciente"
                                           className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4 text-indigo-600"/>
                                        Nome do Paciente
                                        <Badge variant="destructive" className="ml-auto text-xs">
                                            Obrigatório
                                        </Badge>
                                    </Label>
                                    <Input
                                        id="paciente"
                                        placeholder="Ex: João Silva"
                                        value={paciente}
                                        onChange={(e) => setPaciente(e.target.value)}
                                        className="border-2 border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 bg-white shadow-sm"
                                    />
                                </motion.div>

                                {/* Telefone */}
                                <motion.div whileHover={{scale: 1.01}} className="space-y-2">
                                    <Label htmlFor="telefone"
                                           className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-indigo-600"/>
                                        Telefone
                                        <Badge variant="destructive" className="ml-auto text-xs">
                                            Obrigatório
                                        </Badge>
                                    </Label>
                                    <Input
                                        id="telefone"
                                        placeholder="(11) 98765-4321"
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        className="border-2 border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 bg-white shadow-sm"
                                    />
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Dentista */}
                                <motion.div whileHover={{scale: 1.01}} className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">Dentista</Label>
                                    <Select value={dentista} onValueChange={setDentista}>
                                        <SelectTrigger
                                            className="border-2 border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Dra. Ana">Dra. Ana Silva</SelectItem>
                                            <SelectItem value="Dr. Carlos">Dr. Carlos Mendes</SelectItem>
                                            <SelectItem value="Dr. Eduardo">Dr. Eduardo Costa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </motion.div>

                                {/* Procedimento */}
                                <motion.div whileHover={{scale: 1.01}} className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">Procedimento</Label>
                                    <Select value={procedimento} onValueChange={setProcedimento}>
                                        <SelectTrigger
                                            className="border-2 border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm">
                                            <SelectValue placeholder="Selecione"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {procedimentos.map((proc) => (
                                                <SelectItem key={proc} value={proc}>
                                                    {proc}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </motion.div>

                                {/* Duração */}
                                <motion.div whileHover={{scale: 1.01}} className="space-y-2">
                                    <Label htmlFor="duracao"
                                           className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-indigo-600"/>
                                        Duração (min)
                                    </Label>
                                    <Input
                                        id="duracao"
                                        type="number"
                                        value={duracao}
                                        onChange={(e) => setDuracao(Number(e.target.value))}
                                        className="border-2 border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 bg-white shadow-sm"
                                    />
                                </motion.div>
                            </div>

                            {/* Observação */}
                            <motion.div whileHover={{scale: 1.01}} className="space-y-2">
                                <Label htmlFor="observacao"
                                       className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-indigo-600"/>
                                    Observações
                                </Label>
                                <Textarea
                                    id="observacao"
                                    rows={3}
                                    maxLength={500}
                                    placeholder="Adicione observações importantes sobre a consulta, histórico do paciente, ou instruções especiais..."
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    className="border-2 border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 resize-none bg-white shadow-sm"
                                />
                                <p className="text-xs text-gray-500 text-right">{observacao.length}/500 caracteres</p>
                            </motion.div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div
                            className="flex justify-end gap-3 p-6 bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-indigo-100"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2}}
                        >
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="px-6 border-2 hover:bg-gray-100 transition-all duration-200 bg-transparent"
                            >
                                Cancelar
                            </Button>
                            <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                <Button
                                    onClick={handleSubmit}
                                    className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2"/>
                                    Confirmar Agendamento
                                </Button>
                            </motion.div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}
