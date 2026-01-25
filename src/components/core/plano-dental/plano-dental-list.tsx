// components/core/plano-dental/plano-dental-list.tsx
'use client';

import { useState, useEffect } from 'react';
import { PlanoDentalHeader } from './plano-dental-header';
import { PlanoDentalTable } from './plano-dental-table';
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
import {PlanoDentalCreateModal} from "@/components/core/plano-dental/modal/plano-dental.create-modal";
import {usePlanoDental, usePlanosDentais} from "@/lib/hooks/usePlanoDental";
import {PlanoDentalResponse} from "@/lib/types/plano-dental/plano_dental.type";
import {PlanoDentalEditModal} from "@/components/core/plano-dental/modal/plano-dental.edit-modal";
import {PlanoDentalViewModal} from "@/components/core/plano-dental/modal/plano-dental.view-modal";
import {PlanoDentalPacienteModal} from "@/components/core/plano-dental/plano-dental-paciente-modal";

export function PlanoDentalList() {
    const { planosDentais, loading, listarTodos } = usePlanosDentais();
    const { deletar } = usePlanoDental();
    const [filteredPlanos, setFilteredPlanos] = useState<PlanoDentalResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [pacienteModalOpen, setPacienteModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPlano, setSelectedPlano] = useState<PlanoDentalResponse | null>(null);

    useEffect(() => {
        listarTodos();
    }, []);

    useEffect(() => {
        filterPlanos();
    }, [searchTerm, planosDentais]);

    const filterPlanos = () => {
        if (!searchTerm.trim()) {
            setFilteredPlanos(planosDentais);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = planosDentais.filter(p =>
            p.pacienteNome?.toLowerCase().includes(term) ||
            p.dentistaNome?.toLowerCase().includes(term) ||
            p.dente?.toLowerCase().includes(term) ||
            p.procedimento?.toLowerCase().includes(term)
        );
        setFilteredPlanos(filtered);
    };

    const handleView = (plano: PlanoDentalResponse) => {
        setSelectedPlano(plano);
        setViewModalOpen(true);
    };

    const handleEdit = (plano: PlanoDentalResponse) => {
        setSelectedPlano(plano);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (plano: PlanoDentalResponse) => {
        setSelectedPlano(plano);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedPlano) return;

        try {
            await deletar(selectedPlano.id);
            await listarTodos();
            setDeleteDialogOpen(false);
            setSelectedPlano(null);
        } catch (error) {
            console.error('Erro ao deletar plano dental:', error);
        }
    };

    const handleSuccess = () => {
        listarTodos();
    };

    return (
        <div className="space-y-6">
            <PlanoDentalHeader
                onCreateClick={() => setCreateModalOpen(true)}
                onViewPacienteClick={() => setPacienteModalOpen(true)}
            />

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por paciente, dentista, dente ou procedimento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" onClick={listarTodos} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <PlanoDentalTable
                    planos={filteredPlanos}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            <PlanoDentalCreateModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={handleSuccess}
            />

            <PlanoDentalEditModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                plano={selectedPlano}
                onSuccess={handleSuccess}
            />

            <PlanoDentalViewModal
                open={viewModalOpen}
                onOpenChange={setViewModalOpen}
                plano={selectedPlano}
            />

            <PlanoDentalPacienteModal
                open={pacienteModalOpen}
                onOpenChange={setPacienteModalOpen}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-destructive" />
                            Confirmar Exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este plano dental?
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