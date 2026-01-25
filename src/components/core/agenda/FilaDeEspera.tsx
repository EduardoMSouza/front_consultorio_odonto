import React from 'react';
import { FilaEsperaResponse, StatusFilaLabels } from '@/lib/types/agenda/fila-espera.type';

interface WaitingQueueProps {
    waitingQueue: FilaEsperaResponse[];
    dentistName: string;
    loading?: boolean;
    error?: string | null;
    onItemClick?: (item: FilaEsperaResponse) => void;
}

export default function FilaDeEspera({
                                         waitingQueue,
                                         dentistName,
                                         loading = false,
                                         error = null,
                                         onItemClick
                                     }: WaitingQueueProps) {

    const formatTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Não definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const getPriorityColor = (priority: number) => {
        if (priority >= 8) return 'text-red-600 font-bold';
        if (priority >= 5) return 'text-orange-600 font-semibold';
        return 'text-green-600';
    };

    const getPriorityText = (priority: number) => {
        if (priority >= 8) return 'Alta';
        if (priority >= 5) return 'Média';
        return 'Baixa';
    };

    if (loading) {
        return (
            <div className="mt-8 bg-orange-500 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 text-white">
                    <h2 className="text-2xl font-bold">FILA DE ESPERA</h2>
                    <p className="text-lg">{dentistName}</p>
                </div>
                <div className="flex items-center justify-center h-40">
                    <p className="text-white text-lg">Carregando fila de espera...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 bg-orange-500 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 text-white">
                    <h2 className="text-2xl font-bold">FILA DE ESPERA</h2>
                    <p className="text-lg">{dentistName}</p>
                </div>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Erro ao carregar fila de espera: {error}</p>
                </div>
            </div>
        );
    }

    if (waitingQueue.length === 0) {
        return (
            <div className="mt-8 bg-orange-500 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 text-white">
                    <h2 className="text-2xl font-bold">FILA DE ESPERA</h2>
                    <p className="text-lg">{dentistName}</p>
                </div>
                <div className="flex items-center justify-center h-40">
                    <p className="text-white text-lg">Nenhum paciente na fila de espera</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 bg-orange-500 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 text-white">
                <h2 className="text-2xl font-bold">FILA DE ESPERA</h2>
                <div className="flex items-center gap-4">
                    <p className="text-lg">{dentistName}</p>
                    <span className="bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-semibold">
                        {waitingQueue.length} pacientes
                    </span>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
                {waitingQueue.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onItemClick?.(item)}
                        className={`bg-white rounded-xl p-4 min-w-[220px] shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${
                            item.status === 'NOTIFICADO' ? 'border-blue-500' :
                                item.status === 'AGUARDANDO' ? 'border-orange-500' :
                                    item.status === 'CANCELADO' ? 'border-red-500' :
                                        'border-gray-500'
                        }`}
                    >
                        <p className="font-semibold text-center mb-2 truncate">
                            {item.nomePaciente}
                        </p>

                        <div className="space-y-1 mb-3">
                            <p className="text-sm text-gray-600 text-center">
                                Chegada: {formatTime(item.criadoEm)}
                            </p>
                            {item.dataPreferencial && (
                                <p className="text-xs text-gray-500 text-center">
                                    Prefere: {formatDate(item.dataPreferencial)}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <p className={`text-xs ${getPriorityColor(item.prioridade)} text-center`}>
                                Prioridade: {getPriorityText(item.prioridade)}
                                <span className="ml-1">({item.prioridade})</span>
                            </p>

                            <div className={`text-xs px-2 py-1 rounded-full ${
                                item.status === 'AGUARDANDO' ? 'bg-orange-100 text-orange-800' :
                                    item.status === 'NOTIFICADO' ? 'bg-blue-100 text-blue-800' :
                                        item.status === 'CANCELADO' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                            }`}>
                                {StatusFilaLabels[item.status]}
                            </div>

                            {item.notificado && (
                                <p className="text-xs text-blue-600 text-center">
                                    ⏰ Notificado
                                </p>
                            )}

                            <p className="text-xs text-gray-500 text-center mt-1">
                                {item.aceitaQualquerDentista ?
                                    'Aceita qualquer dentista' :
                                    `Específico: ${item.nomeDentista || 'Não definido'}`
                                }
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}