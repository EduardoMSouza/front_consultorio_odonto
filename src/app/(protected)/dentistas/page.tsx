"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DentistaService } from "@/services/dentista.service";
import { DentistaResponse } from "@/models/dentista.type";
import { Button } from "@/components/ui-shadcn/button";
import { Input } from "@/components/ui-shadcn/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui-shadcn/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui-shadcn/card";
import { Badge } from "@/components/ui-shadcn/badge";
import { Search, Plus, Edit, Trash2, Power, PowerOff } from "lucide-react";
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
import { toast } from "sonner";

export default function DentistasPage() {
    const router = useRouter();
    const [dentistas, setDentistas] = useState<DentistaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        carregarDentistas();
    }, [page, searchTerm]);

    const carregarDentistas = async () => {
        try {
            setLoading(true);
            const response = searchTerm
                ? await DentistaService.buscarPorTermo(searchTerm, page, 10)
                : await DentistaService.listarTodos(page, 10);
            setDentistas(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error("Erro ao carregar dentistas");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await DentistaService.deletar(deleteId);
            toast.success("Dentista deletado com sucesso");
            carregarDentistas();
        } catch (error) {
            toast.error("Erro ao deletar dentistas");
        } finally {
            setDeleteId(null);
        }
    };

    const toggleAtivo = async (id: number, ativo: boolean) => {
        try {
            if (ativo) {
                await DentistaService.desativar(id);
            } else {
                await DentistaService.ativar(id);
            }
            toast.success(`Dentista ${ativo ? "desativado" : "ativado"} com sucesso`);
            carregarDentistas();
        } catch (error) {
            toast.error("Erro ao atualizar status");
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciamento de Dentistas</CardTitle>
                    <CardDescription>
                        Lista de todos os dentistas cadastrados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, CRO ou especialidade..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(0);
                                }}
                                className="pl-8"
                            />
                        </div>
                        <Button onClick={() => router.push("/dentistas/novo")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Dentista
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Carregando...</div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>CRO</TableHead>
                                        <TableHead>Especialidade</TableHead>
                                        <TableHead>Telefone</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dentistas.map((dentista) => (
                                        <TableRow key={dentista.id}>
                                            <TableCell className="font-medium">
                                                {dentista.nome}
                                            </TableCell>
                                            <TableCell>{dentista.cro}</TableCell>
                                            <TableCell>{dentista.especialidade}</TableCell>
                                            <TableCell>{dentista.telefone}</TableCell>
                                            <TableCell>{dentista.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={dentista.ativo ? "default" : "secondary"}>
                                                    {dentista.ativo ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            router.push(`/dentistas/${dentista.id}`)
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            toggleAtivo(dentista.id, dentista.ativo)
                                                        }
                                                    >
                                                        {dentista.ativo ? (
                                                            <PowerOff className="h-4 w-4" />
                                                        ) : (
                                                            <Power className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteId(dentista.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Página {page + 1} de {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                    >
                                        Anterior
                                    </Button>
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

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este dentista? Esta ação não pode
                            ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}