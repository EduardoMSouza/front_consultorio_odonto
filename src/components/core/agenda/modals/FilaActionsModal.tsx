import React from 'react';
import { FilaEsperaResponse } from '@/lib/types/agenda/fila-espera.type';
import { StatusFilaLabels, PeriodoPreferencialLabels } from '@/lib/types/agenda/fila-espera.type';

interface FilaActionsModalProps {
    item: FilaEsperaResponse | null;
    isOpen: boolean;
    onClose: () => void;
    onNotificar: (id: number) => void;
    onCancelar: (id: number) => void;
    onConverterAgendamento: (id: number) => void;
}

export default function FilaActionsModal({
                                             item,
                                             isOpen,
                                             onClose,
                                             onNotificar,
                                             onCancelar,
                                             onConverterAgendamento
                                         }: FilaActionsModalProps) {

    if (!isOpen || !item) return null;

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('pt-BR');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Detalhes da Fila</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-lg">{item.nomePaciente}</h4>
                            <p className="text-gray-600">ID: {item.id}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-medium">{StatusFilaLabels[item.status]}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Prioridade</p>
                                <p className="font-medium">{item.prioridade}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Criado em</p>
                                <p className="font-medium">{formatDateTime(item.criadoEm)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Notificado</p>
                                <p className="font-medium">{item.notificado ? 'Sim' : 'Não'}</p>
                            </div>
                        </div>

                        {item.observacoes && (
                            <div>
                                <p className="text-sm text-gray-500">Observações</p>
                                <p className="mt-1 p-2 bg-gray-50 rounded">{item.observacoes}</p>
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-500 mb-2">Preferências</p>
                            <div className="space-y-2">
                                <p>• {item.aceitaQualquerHorario ? 'Aceita qualquer horário' : 'Horário específico'}</p>
                                <p>• {item.aceitaQualquerDentista ? 'Aceita qualquer dentista' : 'Dentista específico'}</p>
                                {item.periodoPreferencial && (
                                    <p>• Período: {PeriodoPreferencialLabels[item.periodoPreferencial]}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                        {item.status === 'AGUARDANDO' && (
                            <button
                                onClick={() => {
                                    onNotificar(item.id);
                                    onClose();
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Notificar
                            </button>
                        )}

                        {item.status === 'NOTIFICADO' && (
                            <button
                                onClick={() => {
                                    onConverterAgendamento(item.id);
                                    onClose();
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Converter em Agendamento
                            </button>
                        )}

                        {item.status !== 'CANCELADO' && item.status !== 'EXPIRADO' && (
                            <button
                                onClick={() => {
                                    onCancelar(item.id);
                                    onClose();
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Cancelar
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}