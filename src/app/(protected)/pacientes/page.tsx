// app/pacientes/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui-shadcn/card';
import { Button } from '@/components/ui-shadcn/button';
import { Input } from '@/components/ui-shadcn/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui-shadcn/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui-shadcn/dropdown-menu';
import { Badge } from '@/components/ui-shadcn/badge';
import { Skeleton } from '@/components/ui-shadcn/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui-shadcn/alert-dialog';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui-shadcn/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui-shadcn/select';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Filter, RefreshCw } from 'lucide-react';
import { PacienteService } from '@/services/paciente.service';
import {PacienteResponse, PacienteResumoResponse, PageResponse} from '@/models/paciente.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export default function PacientesPage() {
    const router = useRouter();
    const [pacientes, setPacientes] = useState<PacienteResumoResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const loadPacientes = useCallback(async () => {
        try {
            setIsLoading(true);
            let response: PageResponse<PacienteResumoResponse>;

            if (search.trim()) {
                response = await PacienteService.buscarPorNomePaginado(search, page, pageSize);
            } else if (statusFilter === 'active') {
                response = await PacienteService.listarAtivosPaginado(page, pageSize);
            } else if (statusFilter === 'inactive') {
                // Note: You might need to implement a method for inactive patients with pagination
                const allPatients = await PacienteService.listarResumoPaginado(page, pageSize);
                response = {
                    ...allPatients,
                    content: allPatients.content.filter(p => !p.ativo)
                };
            } else {
                response = await PacienteService.listarResumoPaginado(page, pageSize);
            }

            setPacientes(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            toast.error('Erro ao carregar pacientes');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [search, statusFilter, page]);

    useEffect(() => {
        loadPacientes();
    }, [loadPacientes]);

    const handleEdit = (id: number) => {
        router.push(`/pacientes/${id}/editar`);
    };

    const handleView = (id: number) => {
        router.push(`/pacientes/${id}`);
    };

    const handleDelete = async (id: number) => {
        try {
            await PacienteService.excluir(id);
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
                await PacienteService.inativar(id);
                toast.success('Paciente inativado com sucesso');
            } else {
                await PacienteService.ativar(id);
                toast.success('Paciente ativado com sucesso');
            }
            loadPacientes();
        } catch (error) {
            toast.error('Erro ao alterar status do paciente');
            console.error(error);
        }
    };

    const formatCPF = (cpf?: string) => {
        if (!cpf) return '-';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
        } catch {
            return dateString;
        }
    };

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
                        <p className="text-muted-foreground">
                            Gerencie os pacientes do sistema ({totalElements} registros)
                        </p>
                    </div>
                    <Button onClick={() => router.push('/pacientes/novo')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Paciente
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nome..."
                                        className="pl-8"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="active">Ativos</SelectItem>
                                        <SelectItem value="inactive">Inativos</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" onClick={loadPacientes}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-12 w-full" />
                                ))}
                            </div>
                        ) : pacientes.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">Nenhum paciente encontrado</p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Prontuário</TableHead>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>CPF</TableHead>
                                                <TableHead>Idade</TableHead>
                                                <TableHead>Convênio</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pacientes.map((paciente) => (
                                                <TableRow key={paciente.id}>
                                                    <TableCell className="font-medium">
                                                        {paciente.prontuarioNumero}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{paciente.nome}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {paciente.telefone || 'Sem telefone'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatCPF(paciente.cpf) || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {paciente.idade || calculateAge(paciente.dataNascimento)} anos
                                                    </TableCell>
                                                    <TableCell>
                                                        {paciente.convenio ? (
                                                            <div>
                                                                <div>{paciente.convenio}</div>
                                                                {paciente.numeroInscricaoConvenio && (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        Nº: {paciente.numeroInscricaoConvenio}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">Particular</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <Badge variant={paciente.ativo ? "default" : "secondary"}>
                                                                {paciente.ativo ? 'Ativo' : 'Inativo'}
                                                            </Badge>
                                                            <Badge variant={paciente.status ? "outline" : "destructive"}>
                                                                {paciente.status ? 'Atendimento Ativo' : 'Atendimento Inativo'}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Abrir menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleView(paciente.id)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Visualizar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEdit(paciente.id)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => handleToggleStatus(paciente.id, paciente.ativo)}
                                                                >
                                                                    {paciente.ativo ? 'Inativar' : 'Ativar'}
                                                                </DropdownMenuItem>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <DropdownMenuItem
                                                                            className="text-red-600"
                                                                            onSelect={(e) => e.preventDefault()}
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Excluir
                                                                        </DropdownMenuItem>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Tem certeza que deseja excluir o paciente {paciente.nome}?
                                                                                Esta ação não pode ser desfeita.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleDelete(paciente.id)}
                                                                                className="bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Excluir
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-4">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => setPage(Math.max(0, page - 1))}
                                                        className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                    const pageNum = i;
                                                    return (
                                                        <PaginationItem key={i}>
                                                            <PaginationLink
                                                                onClick={() => setPage(pageNum)}
                                                                isActive={page === pageNum}
                                                            >
                                                                {pageNum + 1}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                })}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                                        className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}