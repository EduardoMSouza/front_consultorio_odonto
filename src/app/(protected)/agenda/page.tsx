"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { DentistaResumoResponse } from "@/lib/types/dentista/dentista.type";
import { FilaEsperaResponse } from "@/lib/types/agenda/fila-espera.type";
import { DentistaSelectorModal } from "@/components/core/dentistas/DentistaSelectorModal";
import CalendarSection from "@/components/core/agenda/CalendarSection";
import HeaderAgenda from "@/components/core/agenda/HeaderAgenda";
import FilaDeEspera from "@/components/core/agenda/FilaDeEspera";
import { toast } from 'sonner';
import { useFilasEspera } from "@/lib/hooks/agenda/useFilaEspera";
import { Loader2 } from 'lucide-react';

export default function DentalAgenda() {
    const [selectedDentist, setSelectedDentist] = useState<DentistaResumoResponse | null>(null);
    const [showModal, setShowModal] = useState<boolean>(true);

    const {
        filas,
        loading,
        error,
        listarPorDentista,
        notificar,
        cancelar,
        converterEmAgendamento
    } = useFilasEspera();

    const dentistName = selectedDentist?.nome || '';
    const cro = selectedDentist?.cro ? `CRO: ${selectedDentist.cro}` : 'CRO: Não informado';
    const idDentista = selectedDentist?.id;

    useEffect(() => {
        if (idDentista) {
            listarPorDentista(idDentista);
        }
    }, [idDentista, listarPorDentista]);

    const filasAtivas = filas.filter(fila =>
        fila.status === 'AGUARDANDO' || fila.status === 'NOTIFICADO'
    );

    const filasOrdenadas = [...filasAtivas].sort((a, b) => {
        if (b.prioridade !== a.prioridade) {
            return b.prioridade - a.prioridade;
        }
        return new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime();
    });

    const handleDentistSelect = (dentista: DentistaResumoResponse) => {
        setSelectedDentist(dentista);
        setShowModal(false);
    };

    const handleChangeDentist = () => {
        setShowModal(true);
    };

    const handleQueueItemClick = useCallback(async (item: FilaEsperaResponse) => {
        console.log('Item clicado:', item);

        toast.info(`Paciente: ${item.nomePaciente}`, {
            description: `Clique para ver opções`,
            action: {
                label: 'Notificar',
                onClick: () => handleNotificar(item.id)
            },
        });
    }, []);

    const handleNotificar = async (filaId: number) => {
        try {
            await notificar(filaId);
            toast.success('Paciente notificado com sucesso!');
        } catch (error) {
            toast.error('Erro ao notificar paciente');
        }
    };

    const handleCancelar = async (filaId: number) => {
        if (confirm('Tem certeza que deseja cancelar esta fila de espera?')) {
            try {
                await cancelar(filaId);
                toast.success('Fila cancelada com sucesso!');
            } catch (error) {
                toast.error('Erro ao cancelar fila');
            }
        }
    };

    if (!selectedDentist || showModal) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
                <DentistaSelectorModal
                    open={showModal}
                    onOpenChange={setShowModal}
                    onSelect={handleDentistSelect}
                    selectedId={selectedDentist?.id}
                />
                {!showModal && (
                    <div className="text-center bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-12 border border-gray-100 dark:border-slate-800">
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 blur-2xl rounded-full animate-pulse"></div>
                                <Loader2 className="h-16 w-16 animate-spin text-blue-600 dark:text-blue-400 relative z-10" />
                            </div>
                            <div>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Carregando informações
                                </p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    Aguarde enquanto preparamos sua agenda...
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 transition-colors duration-300">
            <div className="max-w-[1920px] mx-auto space-y-6">
                <HeaderAgenda
                    dentistName={dentistName}
                    cro={cro}
                    onChangeDentist={handleChangeDentist}
                />

                <div className="grid grid-cols-1 gap-6">
                    <CalendarSection
                        dentistaId={idDentista || 0}
                        dentistaName={dentistName}
                    />
                </div>

                <DentistaSelectorModal
                    open={showModal}
                    onOpenChange={setShowModal}
                    onSelect={handleDentistSelect}
                    selectedId={selectedDentist?.id}
                />
            </div>
        </div>
    );
}