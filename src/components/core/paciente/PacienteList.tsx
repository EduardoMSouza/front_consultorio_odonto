// components/pacientes/PacienteList.tsx
import React from 'react';
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
import { Button } from '@/components/ui-shadcn/button';
import { Skeleton } from '@/components/ui-shadcn/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Phone,
    FileText,
    Calendar,
} from 'lucide-react';
import { PacienteResumoResponse } from '@/lib/types/paciente/paciente.types';
import { calculateAge, formatCPFForDisplay } from '@/lib/utils/formatters/paciente.formatter';

interface PacienteListProps {
    pacientes: PacienteResumoResponse[];
    loading?: boolean;
    onEdit?: (id: number) => void;
    onView?: (id: number) => void;
    onDelete?: (id: number) => void;
    onToggleStatus?: (id: number, currentStatus: boolean) => void;
}

export const PacienteList: React.FC<PacienteListProps> = ({
                                                              pacientes,
                                                              loading = false,
                                                              onEdit,
                                                              onView,
                                                              onDelete,
                                                              onToggleStatus,
                                                          }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
        } catch {
            return '-';
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (pacientes.length === 0) {
        return (
            <div className="text-center py-10 border rounded-md">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Nenhum paciente encontrado</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Comece adicionando um novo paciente
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Prontuário</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="w-[140px]">CPF</TableHead>
                        <TableHead className="w-[80px]">DataNascimento</TableHead>
                        <TableHead>Convênio</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[80px] text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pacientes.map((paciente) => (
                        <TableRow key={paciente.id}>
                            <TableCell className="font-medium">
                                {paciente.prontuarioNumero || '-'}
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{paciente.nome}</div>
                                {paciente.telefone && (
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <Phone className="h-3 w-3 mr-1" />
                                        {paciente.telefone}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                                {formatCPFForDisplay(paciente.cpf) || '-'}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                    {formatDate(paciente.dataNascimento)}
                                </div>
                            </TableCell>
                            <TableCell>
                                {paciente.convenio ? (
                                    <div>
                                        <div className="font-medium">{paciente.convenio}</div>
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
                                <Badge
                                    variant={paciente.ativo ? "default" : "secondary"}
                                    className={paciente.ativo ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                                >
                                    {paciente.ativo ? 'Ativo' : 'Inativo'}
                                </Badge>
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
                                        {onView && (
                                            <DropdownMenuItem onClick={() => onView(paciente.id)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Visualizar
                                            </DropdownMenuItem>
                                        )}
                                        {onEdit && (
                                            <DropdownMenuItem onClick={() => onEdit(paciente.id)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        {onToggleStatus && (
                                            <DropdownMenuItem
                                                onClick={() => onToggleStatus(paciente.id, paciente.ativo)}
                                            >
                                                {paciente.ativo ? (
                                                    <>
                                                        <UserX className="mr-2 h-4 w-4" />
                                                        Inativar
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className="mr-2 h-4 w-4" />
                                                        Ativar
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                        )}
                                        {onDelete && (
                                            <DropdownMenuItem
                                                onClick={() => onDelete(paciente.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Excluir
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};