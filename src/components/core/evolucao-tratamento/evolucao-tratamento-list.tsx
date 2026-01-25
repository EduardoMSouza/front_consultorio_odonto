// components/core/evolucao-tratamento/evolucao-tratamento-list.tsx
'use client';

import { useState, useEffect } from 'react';
import { EvolucaoTratamentoHeader } from './evolucao-tratamento-header';
import { EvolucaoTratamentoTable } from './evolucao-tratamento-table';
import { EvolucaoTratamentoCreateModal } from './modal/evolucao-tratamento-create-modal';
import { EvolucaoTratamentoEditModal } from './modal/evolucao-tratamento-edit-modal';
import { EvolucaoTratamentoViewModal } from './modal/evolucao-tratamento-view-modal';
import { PlanoEvolucaoPacienteModal } from './modal/plano-evolucao-paciente-modal';
import { Input } from '@/components/ui-shadcn/input';
import { Button } from '@/components/ui-shadcn/button';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui-shadcn/alert-dialog';
import {useEvolucaoTratamento, useEvolucoesTratamento} from "@/lib/hooks/useEvolucaoTratamento";
import {EvolucaoTratamentoResponse} from "@/lib/types/evolucao-tratamento/evoluca_tratamento.type";

export function EvolucaoTratamentoList() {
    const { evolucoes, loading, listarTodas } = useEvolucoesTratamento();
    const { deletar } = useEvolucaoTratamento();
    const [filteredEvolucoes, setFilteredEvolucoes] = useState<EvolucaoTratamentoResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [pacienteModalOpen, setPacienteModalOpen] = useState(false);
    const [selectedEvolucao, setSelectedEvolucao] = useState<EvolucaoTratamentoResponse | null>(null);

    useEffect(() => {
        listarTodas();
    }, []);

    useEffect(() => {
        filterEvolucoes();
    }, [searchTerm, evolucoes]);

    const filterEvolucoes = () => {
        if (!searchTerm.trim()) {
            setFilteredEvolucoes(evolucoes);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = evolucoes.filter(e =>
            e.pacienteNome?.toLowerCase().includes(term) ||
            e.dentistaNome?.toLowerCase().includes(term) ||
            e.evolucaoEIntercorrencias?.toLowerCase().includes(term) ||
            e.data?.includes(term)
        );
        setFilteredEvolucoes(filtered);
    };

    const handleView = (evolucao: EvolucaoTratamentoResponse) => {
        setSelectedEvolucao(evolucao);
        setViewModalOpen(true);
    };

    const handleEdit = (evolucao: EvolucaoTratamentoResponse) => {
        setSelectedEvolucao(evolucao);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (evolucao: EvolucaoTratamentoResponse) => {
        setSelectedEvolucao(evolucao);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedEvolucao) return;

        try {
            await deletar(selectedEvolucao.id);
            await listarTodas();
            setDeleteDialogOpen(false);
            setSelectedEvolucao(null);
        } catch (error) {
            console.error('Erro ao deletar evolução:', error);
        }
    };

    const handleSuccess = () => {
        listarTodas();
    };

    return (
        <div className="space-y-6">
            <EvolucaoTratamentoHeader
                onCreateClick={() => setCreateModalOpen(true)}
                onViewPacienteClick={() => setPacienteModalOpen(true)}
            />

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por paciente, dentista, evolução ou data..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" onClick={listarTodas} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <EvolucaoTratamentoTable
                    evolucoes={filteredEvolucoes}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            <PlanoEvolucaoPacienteModal
                open={pacienteModalOpen}
                onOpenChange={setPacienteModalOpen}
            />

            <EvolucaoTratamentoCreateModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={handleSuccess}
            />

            <EvolucaoTratamentoEditModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                evolucao={selectedEvolucao}
                onSuccess={handleSuccess}
            />

            <EvolucaoTratamentoViewModal
                open={viewModalOpen}
                onOpenChange={setViewModalOpen}
                evolucao={selectedEvolucao}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-destructive" />
                            Confirmar Exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir esta evolução de tratamento?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}