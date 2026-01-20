'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui-shadcn/dialog'
import { Button } from '@/components/ui-shadcn/button'
import { Calendar, CheckCircle2, Clock, User, XCircle } from 'lucide-react'
import { FilaEsperaResponse, StatusFila } from '@/models/fila-espera.type'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui-shadcn/badge'

interface NotificationModalProps {
    isOpen: boolean
    onClose: () => void
    filaEntry: FilaEsperaResponse | null
    onAccept: (filaId: number) => Promise<void>
    onDecline: (filaId: number) => Promise<void>
    loading?: boolean
}

export function NotificationModal({
                                      isOpen,
                                      onClose,
                                      filaEntry,
                                      onAccept,
                                      onDecline,
                                      loading = false
                                  }: NotificationModalProps) {
    const [status, setStatus] = useState<'idle' | 'accepting' | 'declining'>('idle')

    // Resetamos o status quando o modal FECHA
    useEffect(() => {
        if (!isOpen) {
            setStatus('idle')
        }
    }, [isOpen])

    if (!filaEntry) return null

    const dataPreferencial = filaEntry.dataPreferencial
        ? format(parseISO(filaEntry.dataPreferencial), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
        : 'Data flexível'

    const periodo = filaEntry.periodoPreferencial === 'QUALQUER'
        ? 'Qualquer horário'
        : filaEntry.periodoPreferencial?.toLowerCase() || '—'

    const handleAccept = async () => {
        try {
            setStatus('accepting')
            await onAccept(filaEntry.id)
            onClose()
        } catch (error) {
            console.error('Erro ao aceitar consulta:', error)
            setStatus('idle')
            // Aqui você pode mostrar toast de erro
        }
    }

    const handleDecline = async () => {
        try {
            setStatus('declining')
            await onDecline(filaEntry.id)
            onClose()
        } catch (error) {
            console.error('Erro ao recusar consulta:', error)
            setStatus('idle')
            // Aqui você pode mostrar toast de erro
        }
    }

    const isLoading = loading || status !== 'idle'

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-amber-100 p-2">
                            <Calendar className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Nova vaga disponível!</DialogTitle>
                            <DialogDescription>
                                Uma oportunidade de agendamento foi liberada para você
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status atual */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status atual:</span>
                        <Badge variant="outline" className="text-base px-3 py-1">
                            {filaEntry.status === StatusFila.NOTIFICADO ? 'Notificado' : filaEntry.status}
                        </Badge>
                    </div>

                    {/* Informações principais */}
                    <div className="grid gap-4 rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Paciente</p>
                                <p className="font-medium">{filaEntry.nomePaciente}</p>
                            </div>
                        </div>

                        {filaEntry.nomeDentista && (
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Dentista</p>
                                    <p className="font-medium">{filaEntry.nomeDentista}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Data preferencial</p>
                                <p className="font-medium">{dataPreferencial}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Período desejado</p>
                                <p className="font-medium capitalize">{periodo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Observações (se houver) */}
                    {filaEntry.observacoes && (
                        <div className="rounded-md bg-muted/50 p-3 text-sm">
                            <p className="font-medium mb-1">Observações:</p>
                            <p className="text-muted-foreground">{filaEntry.observacoes}</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={handleDecline}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {status === 'declining' ? (
                            <>Recusando...</>
                        ) : (
                            <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Não posso agora
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleAccept}
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    >
                        {status === 'accepting' ? (
                            <>Confirmando...</>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Quero este horário!
                            </>
                        )}
                    </Button>
                </DialogFooter>

                <p className="text-xs text-center text-muted-foreground mt-4">
                    Dúvidas? Entre em contato com a clínica
                </p>
            </DialogContent>
        </Dialog>
    )
}