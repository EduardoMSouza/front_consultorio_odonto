// app/pacientes/page.tsx (atualizado)
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui-shadcn/card';
import { Button } from '@/components/ui-shadcn/button';
import { toast } from 'sonner';
import { usePacientes, usePaciente } from '@/lib/hooks/usePaciente';
import { PacienteStats } from '@/components/core/paciente/PacienteStats';
import {PacienteList} from "@/components/core/paciente/PacienteList";
import {PacienteSearch} from "@/components/core/paciente/PacienteSearch";


export default function PacientesPage() {
    const router = useRouter();
    const { pacientes, paginacao, loading, listarResumo, buscarPorNome, listarAtivos } = usePacientes();
    const { excluir, ativar, inativar } = usePaciente();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [page, setPage] = useState(0);
    const pageSize = 10;

    // Usar useMemo para criar uma função estável
    const loadPacientes = useCallback(async () => {
        try {
            if (search.trim()) {
                await buscarPorNome(search, page, pageSize);
            } else if (statusFilter === 'active') {
                await listarAtivos(page, pageSize);
            } else {
                await listarResumo(page, pageSize);
            }
        } catch (error) {
            toast.error('Erro ao carregar pacientes');
            console.error(error);
        }
    }, [search, statusFilter, page, pageSize]);

    // Usar useEffect com debounce para evitar loops
    useEffect(() => {
        const timer = setTimeout(() => {
            loadPacientes();
        }, 300); // Debounce de 300ms

        return () => clearTimeout(timer);
    }, [loadPacientes]);

    const handleDelete = async (id: number) => {
        try {
            await excluir(id);
            toast.success('Paciente excluído com sucesso');
            loadPacientes();
        } catch (error) {
            toast.error('Erro ao excluir paciente');
            console.error(error);
        }
    };

    const handleToggleStatus = async (id: number, isActive: boolean) => {
        try {
            if (isActive) {
                await inativar(id);
                toast.success('Paciente inativado com sucesso');
            } else {
                await ativar(id);
                toast.success('Paciente ativado com sucesso');
            }
            loadPacientes();
        } catch (error) {
            toast.error('Erro ao alterar status do paciente');
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto py-10">
            {/* Estatísticas */}
            <div className="mb-8">
                <PacienteStats />
            </div>

            <div className="space-y-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
                        <p className="text-muted-foreground">
                            Gerencie os pacientes do sistema ({paginacao.totalElements} registros)
                        </p>
                    </div>
                    <Button onClick={() => router.push('/pacientes/novo')}>
                        Novo Paciente
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <PacienteSearch
                            searchTerm={search}
                            onSearchChange={setSearch}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            onRefresh={loadPacientes}
                            placeholder="Buscar por nome..."
                        />
                    </CardHeader>
                    <CardContent>
                        <PacienteList
                            pacientes={pacientes}
                            loading={loading}
                            onView={(id) => router.push(`/pacientes/${id}`)}
                            onEdit={(id) => router.push(`/pacientes/${id}/editar`)}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />

                        {/* Paginação simplificada */}
                        {paginacao.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Página {page + 1} de {paginacao.totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => Math.min(paginacao.totalPages - 1, p + 1))}
                                        disabled={page >= paginacao.totalPages - 1}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}