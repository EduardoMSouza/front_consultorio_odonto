// components/core/dentistas/DentistasLista.tsx
import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui-shadcn/card';
import { Alert, AlertDescription } from '@/components/ui-shadcn/alert';
import { Skeleton } from '@/components/ui-shadcn/skeleton';
import { Badge } from '@/components/ui-shadcn/badge';
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
import { Button } from '@/components/ui-shadcn/button';
import { AlertTriangle, Edit, MoreVertical, Trash2, UserCheck, UserX } from 'lucide-react';
import { DentistaResponse } from '@/models/dentista.model';

interface DentistasListaProps {
    dentistas: DentistaResponse[];
    loading: boolean;
    error: string | null;
    onEdit: (dentista: DentistaResponse) => void;
    onDelete: (dentista: DentistaResponse) => void;
    onToggleStatus: (dentista: DentistaResponse) => void;
}

export const DentistasLista = forwardRef<HTMLDivElement, DentistasListaProps>(
    ({ dentistas, loading, error, onEdit, onDelete, onToggleStatus }, ref) => {
        return (
            <Card ref={ref}>
                <CardHeader>
                    <CardTitle>Lista de Dentistas</CardTitle>
                    <CardDescription>{dentistas.length} dentista(s) encontrado(s)</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : dentistas.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium mb-2">Nenhum dentista encontrado</h3>
                            <p className="text-muted-foreground">Tente ajustar seus filtros</p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>CRO</TableHead>
                                        <TableHead>Especialidade</TableHead>
                                        <TableHead>Telefone</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dentistas.map((dentista) => (
                                        <TableRow key={dentista.id}>
                                            <TableCell className="font-medium">{dentista.nome}</TableCell>
                                            <TableCell>{dentista.cro}</TableCell>
                                            <TableCell>{dentista.especialidade}</TableCell>
                                            <TableCell>{dentista.telefone}</TableCell>
                                            <TableCell>{dentista.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={dentista.ativo ? "default" : "secondary"}>
                                                    {dentista.ativo ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => onEdit(dentista)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onToggleStatus(dentista)}>
                                                            {dentista.ativo ? (
                                                                <>
                                                                    <UserX className="h-4 w-4 mr-2" />
                                                                    Inativar
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                                    Ativar
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => onDelete(dentista)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
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
                    )}
                </CardContent>
            </Card>
        );
    }
);

DentistasLista.displayName = 'DentistasLista';