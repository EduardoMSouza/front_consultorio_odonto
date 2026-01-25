'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui-shadcn/dialog';
import { Button } from '@/components/ui-shadcn/button';
import { Badge } from '@/components/ui-shadcn/badge';
import { ScrollArea } from '@/components/ui-shadcn/scroll-area';
import { PacienteSelectorModal } from '@/components/core/paciente/PacienteSelectorModal';
import { formatDate, formatDateShort } from '@/lib/utils/date.utils';
import { truncateText } from '@/lib/utils/text.utils';
import {
    AlertCircle,
    Clock,
    FileText,
    Loader2,
    RefreshCw,
    Stethoscope,
    User
} from 'lucide-react';
import { PacienteResumoResponse } from "@/lib/types/paciente/paciente.types";
import { useEvolucoesTratamento } from "@/lib/hooks/useEvolucaoTratamento";

interface PlanoEvolucaoPacienteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PlanoEvolucaoPacienteModal({
                                               open,
                                               onOpenChange
                                           }: PlanoEvolucaoPacienteModalProps) {
    const [pacienteSelectorOpen, setPacienteSelectorOpen] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<PacienteResumoResponse | null>(null);
    const { evolucoes, loading, buscarPorPaciente } = useEvolucoesTratamento();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedPaciente && open) {
            loadEvolucoesPaciente();
        }
    }, [selectedPaciente, open]);

    const loadEvolucoesPaciente = async () => {
        if (!selectedPaciente) return;

        try {
            setError(null);
            await buscarPorPaciente(selectedPaciente.id);
        } catch (error: any) {
            console.error('Erro ao carregar evoluções do paciente:', error);
            setError(error.message || 'Erro ao carregar evoluções do paciente');
        }
    };

    const handleSelectPaciente = (paciente: PacienteResumoResponse) => {
        setSelectedPaciente(paciente);
        setPacienteSelectorOpen(false);
    };

    const handleClose = () => {
        setSelectedPaciente(null);
        setError(null);
        onOpenChange(false);
    };

    const evolucoesOrdenadas = [...evolucoes].sort((a, b) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    // O total agora vem do tamanho do array, não de uma chamada separada
    const totalEvolucoes = evolucoes.length;

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Evoluções de Tratamento do Paciente
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Seletor de Paciente */}
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Selecionar Paciente</div>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start h-auto py-3"
                                onClick={() => setPacienteSelectorOpen(true)}
                            >
                                <User className="w-4 h-4 mr-2" />
                                {selectedPaciente ? (
                                    <div className="flex flex-col items-start">
                                        <span className="font-semibold">{selectedPaciente.nome}</span>
                                        <span className="text-xs text-muted-foreground">
                                            Prontuário: {selectedPaciente.prontuarioNumero || 'N/A'}
                                        </span>
                                    </div>
                                ) : (
                                    'Selecionar paciente'
                                )}
                            </Button>
                        </div>

                        {/* Status e Contagem */}
                        {selectedPaciente && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-muted/30 rounded-lg p-4">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Total de Evoluções
                                    </div>
                                    <div className="text-2xl font-bold mt-1">{totalEvolucoes}</div>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Última Atualização
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                        {evolucoesOrdenadas.length > 0 ? (
                                            formatDate(evolucoesOrdenadas[0].data)
                                        ) : (
                                            <span className="text-muted-foreground">Nenhuma evolução</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                        {evolucoesOrdenadas.length > 0 ? (
                                            <Badge variant="default">Em Tratamento</Badge>
                                        ) : (
                                            <Badge variant="outline">Sem Evoluções</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mensagem de Erro */}
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="font-medium">Erro ao carregar evoluções</span>
                                </div>
                                <p className="text-sm text-destructive/80 mt-1">{error}</p>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">
                                        Carregando evoluções...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Lista de Evoluções */}
                        {selectedPaciente && !loading && !error && (
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Histórico de Evoluções ({evolucoesOrdenadas.length})
                                    </h3>
                                    {evolucoesOrdenadas.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={loadEvolucoesPaciente}
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Atualizar
                                        </Button>
                                    )}
                                </div>

                                {evolucoesOrdenadas.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg">
                                        <FileText className="w-12 h-12 mx-auto text-muted-foreground/50" />
                                        <h3 className="mt-4 font-medium">Nenhuma evolução encontrada</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Este paciente ainda não possui evoluções de tratamento registradas.
                                        </p>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-[400px] pr-4">
                                        <div className="space-y-4">
                                            {evolucoesOrdenadas.map((evolucao) => (
                                                <div
                                                    key={evolucao.id}
                                                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <Badge variant="secondary">
                                                                    {formatDateShort(evolucao.data)}
                                                                </Badge>
                                                                <span className="text-sm font-medium">
                                                                    {evolucao.dentistaNome}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                                                <Stethoscope className="w-3 h-3" />
                                                                <span>Dentista responsável</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">
                                                            Evolução e Intercorrências
                                                        </div>
                                                        <div className="text-sm text-muted-foreground bg-muted/30 rounded p-3">
                                                            {truncateText(evolucao.evolucaoEIntercorrencias, 200)}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                        <div className="text-xs text-muted-foreground">
                                                            ID: {evolucao.id}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {formatDate(evolucao.data)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </div>
                        )}

                        {/* Estado Inicial (Sem Paciente Selecionado) */}
                        {!selectedPaciente && !loading && !error && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <User className="w-16 h-16 text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    Selecione um Paciente
                                </h3>
                                <p className="text-muted-foreground max-w-md">
                                    Escolha um paciente para visualizar o histórico completo de evoluções de tratamento.
                                </p>
                                <Button
                                    className="mt-6"
                                    onClick={() => setPacienteSelectorOpen(true)}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Selecionar Paciente
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={handleClose}>
                            Fechar
                        </Button>
                        {selectedPaciente && (
                            <Button
                                variant="default"
                                onClick={loadEvolucoesPaciente}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Atualizando...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Recarregar
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <PacienteSelectorModal
                open={pacienteSelectorOpen}
                onOpenChange={setPacienteSelectorOpen}
                onSelect={handleSelectPaciente}
                selectedId={selectedPaciente?.id}
            />
        </>
    );
}