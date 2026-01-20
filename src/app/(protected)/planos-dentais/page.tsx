// app/dashboard/planos-dentais/page.tsx
"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {PlanoDentalService} from "@/services/plano-dental.service";
import {PacienteService} from "@/services/paciente.service";
import {DentistaService} from "@/services/dentista.service";
import {PlanoDentalResponse, StatusPlano} from "@/models/plano-dental.type";
import {PacienteResumoResponse} from "@/models/paciente.types";
import {DentistaResponse} from "@/models/dentista.type";
import {Button} from "@/components/ui-shadcn/button";
import {Input} from "@/components/ui-shadcn/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui-shadcn/table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui-shadcn/card";
import {Badge} from "@/components/ui-shadcn/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui-shadcn/dropdown-menu";
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui-shadcn/select";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    MoreVertical,
    Plus,
    RefreshCw,
    Search,
    Tooth,
    Trash2,
    XCircle
} from "lucide-react";
import {toast} from "sonner";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";

export default function PlanosDentaisPage() {
    const router = useRouter();
    const [planos, setPlanos] = useState<PlanoDentalResponse[]>([]);
    const [pacientes, setPacientes] = useState<PacienteResumoResponse[]>([]);
    const [dentistas, setDentistas] = useState<DentistaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingFiltros, setLoadingFiltros] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("TODOS");
    const [pacienteFilter, setPacienteFilter] = useState<string>("TODOS");
    const [dentistaFilter, setDentistaFilter] = useState<string>("TODOS");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        carregarFiltros();
        carregarPlanos();
    }, [page]);

    useEffect(() => {
        // Debounce para pesquisa
        const timer = setTimeout(() => {
            if (page === 0) {
                carregarPlanos();
            } else {
                setPage(0);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, pacienteFilter, dentistaFilter]);

    const carregarFiltros = async () => {
        try {
            setLoadingFiltros(true);
            const [pacientesData, dentistasData] = await Promise.all([
                PacienteService.listarResumo(),
                DentistaService.listarTodos(0, 1000)
            ]);
            setPacientes(pacientesData.content || pacientesData);
            setDentistas(dentistasData.content || dentistasData);
        } catch (error) {
            toast.error("Erro ao carregar filtros");
        } finally {
            setLoadingFiltros(false);
        }
    };

    const carregarPlanos = async () => {
        try {
            setLoading(true);
            const response = await PlanoDentalService.listarPaginado(page, 10);

            let filteredContent = response.content;

            // Aplicar filtros
            if (statusFilter !== "TODOS") {
                filteredContent = filteredContent.filter(
                    plano => plano.status === statusFilter
                );
            }

            if (pacienteFilter !== "TODOS") {
                filteredContent = filteredContent.filter(
                    plano => plano.pacienteId === Number(pacienteFilter)
                );
            }

            if (dentistaFilter !== "TODOS") {
                filteredContent = filteredContent.filter(
                    plano => plano.dentistaId === Number(dentistaFilter)
                );
            }

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filteredContent = filteredContent.filter(plano =>
                    plano.pacienteNome.toLowerCase().includes(term) ||
                    plano.dentistaNome.toLowerCase().includes(term) ||
                    plano.procedimento.toLowerCase().includes(term) ||
                    plano.dente.toLowerCase().includes(term) ||
                    (plano.codigoProcedimento?.toLowerCase() || '').includes(term)
                );
            }

            setPlanos(filteredContent);
            setTotalPages(response.totalPages);
            setTotalElements(filteredContent.length);
        } catch (error) {
            toast.error("Erro ao carregar planos dentais");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await PlanoDentalService.excluir(deleteId);
            toast.success("Plano dental excluído com sucesso");
            carregarPlanos();
        } catch (error) {
            toast.error("Erro ao excluir plano dental");
        } finally {
            setDeleteId(null);
        }
    };

    const toggleAtivo = async (id: number, ativo: boolean) => {
        try {
            if (ativo) {
                await PlanoDentalService.desativar(id);
                toast.success("Plano dental desativado com sucesso");
            } else {
                await PlanoDentalService.ativar(id);
                toast.success("Plano dental ativado com sucesso");
            }
            carregarPlanos();
        } catch (error) {
            toast.error("Erro ao alterar status do plano");
        }
    };

    const getStatusIcon = (status: StatusPlano) => {
        switch (status) {
            case StatusPlano.CONCLUIDO:
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case StatusPlano.CANCELADO:
                return <XCircle className="h-4 w-4 text-red-500" />;
            case StatusPlano.EM_ANDAMENTO:
                return <Clock className="h-4 w-4 text-blue-500" />;
            case StatusPlano.PENDENTE:
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: StatusPlano) => {
        switch (status) {
            case StatusPlano.CONCLUIDO:
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Concluído</Badge>;
            case StatusPlano.CANCELADO:
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelado</Badge>;
            case StatusPlano.EM_ANDAMENTO:
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Em Andamento</Badge>;
            case StatusPlano.PENDENTE:
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const limparFiltros = () => {
        setSearchTerm("");
        setStatusFilter("TODOS");
        setPacienteFilter("TODOS");
        setDentistaFilter("TODOS");
        setPage(0);
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Planos Dentais</CardTitle>
                            <CardDescription>
                                Gerencie todos os planos dentais dos pacientes
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={carregarPlanos}
                                disabled={loading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Atualizar
                            </Button>
                            <Button onClick={() => router.push("/dashboard/planos-dentais/novo")}>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Plano
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filtros e Busca */}
                    <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por paciente, dentista, procedimento..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                    disabled={loadingFiltros}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODOS">Todos os Status</SelectItem>
                                        {Object.values(StatusPlano).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(status)}
                                                    {status.replace("_", " ")}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={limparFiltros}
                                    disabled={loadingFiltros}
                                    className="flex-1"
                                >
                                    Limpar
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Select
                                    value={pacienteFilter}
                                    onValueChange={setPacienteFilter}
                                    disabled={loadingFiltros}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrar por paciente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODOS">Todos os Pacientes</SelectItem>
                                        {pacientes.map((paciente) => (
                                            <SelectItem key={paciente.id} value={paciente.id.toString()}>
                                                {paciente.nome} ({paciente.prontuarioNumero})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Select
                                    value={dentistaFilter}
                                    onValueChange={setDentistaFilter}
                                    disabled={loadingFiltros}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrar por dentista" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODOS">Todos os Dentistas</SelectItem>
                                        {dentistas.map((dentista) => (
                                            <SelectItem key={dentista.id} value={dentista.id.toString()}>
                                                {dentista.nome} ({dentista.cro})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">{totalElements}</div>
                                <div className="text-sm text-muted-foreground">Total de Planos</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-green-600">
                                    {planos.filter(p => p.status === StatusPlano.CONCLUIDO).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Concluídos</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-blue-600">
                                    {planos.filter(p => p.status === StatusPlano.EM_ANDAMENTO).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Em Andamento</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {planos.filter(p => p.status === StatusPlano.PENDENTE).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Pendentes</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabela */}
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-muted-foreground">Carregando planos...</p>
                        </div>
                    ) : planos.length === 0 ? (
                        <div className="text-center py-8 border rounded-lg">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">Nenhum plano encontrado</h3>
                            <p className="text-muted-foreground mt-2">
                                {searchTerm || statusFilter !== "TODOS" || pacienteFilter !== "TODOS" || dentistaFilter !== "TODOS"
                                    ? "Tente ajustar os filtros de busca"
                                    : "Comece criando seu primeiro plano dental"}
                            </p>
                            <Button
                                onClick={() => router.push("/dashboard/planos-dentais/novo")}
                                className="mt-4"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Criar Plano
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Paciente</TableHead>
                                            <TableHead>Dentista</TableHead>
                                            <TableHead>Dente/Procedimento</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Data Prevista</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {planos.map((plano) => (
                                            <TableRow key={plano.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{plano.pacienteNome}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            ID: {plano.pacienteId}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{plano.dentistaNome}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Tooth className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <div className="font-medium">Dente {plano.dente}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {plano.procedimento}
                                                            </div>
                                                            {plano.codigoProcedimento && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    Código: {plano.codigoProcedimento}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        R$ {plano.valorFinal.toFixed(2)}
                                                    </div>
                                                    {plano.valorDesconto && (
                                                        <div className="text-xs text-muted-foreground line-through">
                                                            R$ {plano.valor.toFixed(2)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(plano.status)}
                                                        {getStatusBadge(plano.status)}
                                                        {plano.urgente && (
                                                            <Badge variant="destructive">Urgente</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {plano.dataPrevista ? (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            {format(new Date(plano.dataPrevista), "dd/MM/yyyy", {
                                                                locale: ptBR,
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">Não definida</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/dashboard/planos-dentais/${plano.id}`)}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Visualizar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/dashboard/planos-dentais/${plano.id}/editar`)}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => toggleAtivo(plano.id, plano.ativo)}
                                                            >
                                                                {plano.ativo ? (
                                                                    <>
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Desativar
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                                        Ativar
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => setDeleteId(plano.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Excluir
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Paginação */}
                            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {planos.length} de {totalElements} planos
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                    >
                                        Anterior
                                    </Button>
                                    <div className="flex items-center px-4">
                                        <span className="text-sm">
                                            Página {page + 1} de {totalPages}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page >= totalPages - 1}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Dialog de Confirmação de Exclusão */}
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este plano dental? Esta ação não pode
                            ser desfeita e todos os dados relacionados serão perdidos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}