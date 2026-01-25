"use client";

import { useState, useEffect } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui-shadcn/alert-dialog";
import { Button } from "@/components/ui-shadcn/button";
import { toast } from "sonner";
import { DentistasHeader } from "@/components/core/dentistas/DentistasHeader";
import { DentistasFiltros } from "@/components/core/dentistas/DentistasFiltros";
import { DentistasList } from "@/components/core/dentistas/DentistasList";
import { DentistaResponse } from "@/lib/types/dentista/dentista.type";
import { DentistaViewModal } from "@/components/core/dentistas/DentistaViewModal";
import { DentistaEditModal } from "@/components/core/dentistas/DentistaEditModal";
import { DentistaCreateModal } from "@/components/core/dentistas/DentistaCreateModal";
import {useDentista, useDentistas} from "@/lib/hooks/useDentista";

export default function DentistasPage() {
    const { dentistas, paginacao, loading, listarTodos, buscarPorTermo, recarregar } = useDentistas();
    const { deletar, ativar, desativar } = useDentista();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(0);

    // Estados para modais
    const [selectedDentista, setSelectedDentista] = useState<DentistaResponse | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [dentistaToDelete, setDentistaToDelete] = useState<DentistaResponse | null>(null);

    // Carrega os dentistas sempre que page, searchTerm ou statusFilter mudar
    useEffect(() => {
        carregarDentistas();
    }, [page, searchTerm, statusFilter]);

    const carregarDentistas = async () => {
        try {
            if (searchTerm.trim()) {
                await buscarPorTermo(searchTerm, page, 10);
            } else {
                await listarTodos(page, 10);
            }
        } catch (error) {
            console.error("Erro ao carregar dentistas:", error);
            toast.error("Erro ao carregar dentistas");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!dentistaToDelete) return;

        try {
            await deletar(dentistaToDelete.id);
            toast.success("Dentista deletado com sucesso");
            recarregar();
        } catch (error) {
            console.error("Erro ao deletar dentista:", error);
            toast.error("Erro ao deletar dentista");
        } finally {
            setDentistaToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    const handleDeleteClick = (dentista: DentistaResponse) => {
        setDentistaToDelete(dentista);
        setDeleteDialogOpen(true);
    };

    const handleToggleStatus = async (dentista: DentistaResponse) => {
        try {
            if (dentista.ativo) {
                await desativar(dentista.id);
                toast.success("Dentista desativado com sucesso");
            } else {
                await ativar(dentista.id);
                toast.success("Dentista ativado com sucesso");
            }
            recarregar();
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            toast.error("Erro ao atualizar status do dentista");
        }
    };

    const handleView = (dentista: DentistaResponse) => {
        setSelectedDentista(dentista);
        setViewModalOpen(true);
    };

    const handleEdit = (dentista: DentistaResponse) => {
        setSelectedDentista(dentista);
        setEditModalOpen(true);
    };

    const handleAdd = () => {
        setCreateModalOpen(true);
    };

    const handleRefresh = () => {
        setPage(0);
        recarregar();
    };

    const handleSuccess = () => {
        setPage(0);
        recarregar();
    };

    const handleViewModalEdit = (dentista: DentistaResponse) => {
        setViewModalOpen(false);
        setSelectedDentista(dentista);
        setEditModalOpen(true);
    };

    // Filtra os dentistas por status localmente (já que o backend pode não suportar)
    const dentistasFiltrados = statusFilter === "all"
        ? dentistas
        : dentistas.filter(d => d.ativo === (statusFilter === "active"));

    return (
        <div className="container mx-auto py-6 space-y-6">
            <DentistasHeader onAdd={handleAdd} totalRegistros={paginacao.totalElements} />

            <DentistasFiltros
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onRefresh={handleRefresh}
            />

            <DentistasList
                dentistas={dentistasFiltrados}
                loading={loading}
                onEdit={handleView}
                onDelete={handleDeleteClick}
                onToggleStatus={handleToggleStatus}
            />

            {paginacao.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                        Página {page + 1} de {paginacao.totalPages} ({dentistasFiltrados.length} registros)
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= paginacao.totalPages - 1}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            )}

            <DentistaViewModal
                dentista={selectedDentista}
                open={viewModalOpen}
                onOpenChange={setViewModalOpen}
                onEdit={handleViewModalEdit}
            />

            {selectedDentista && (
                <DentistaEditModal
                    dentistaId={selectedDentista.id}
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    onSuccess={handleSuccess}
                />
            )}

            <DentistaCreateModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={handleSuccess}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold">Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground">
                            Tem certeza que deseja excluir o dentista {" "}
                            <span className="font-medium text-foreground">{dentistaToDelete?.nome}</span>
                            ? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-end gap-2">
                        <AlertDialogCancel onClick={() => { setDentistaToDelete(null); setDeleteDialogOpen(false); }}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}