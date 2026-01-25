// components/core/dentistas/DentistasList.tsx
'use client';
import { forwardRef } from 'react';
import { Card, CardContent } from '@/components/ui-shadcn/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui-shadcn/table';
import { Button } from '@/components/ui-shadcn/button';
import { Badge } from '@/components/ui-shadcn/badge';
import { Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { DentistaResponse } from '@/lib/types/dentista/dentista.type';
import {
    capitalizeWords,
    formatCRO,
    formatPhone,
    formatProperName,
    getStatusBadge
} from "@/lib/utils/formatters/dentista.formatter";


interface DentistasListProps {
    dentistas: DentistaResponse[];
    loading: boolean;
    onEdit: (dentista: DentistaResponse) => void;
    onDelete: (dentista: DentistaResponse) => void;
    onToggleStatus: (dentista: DentistaResponse) => void;
}

export const DentistasList = forwardRef<HTMLDivElement, DentistasListProps>(
    ({ dentistas, loading, onEdit, onDelete, onToggleStatus }, ref) => {
        return (
            <Card ref={ref} className="w-full border-none shadow-none">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <span className="text-muted-foreground">Carregando...</span>
                        </div>
                    ) : dentistas.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium mb-2 text-muted-foreground">Nenhum dentista encontrado</h3>
                            <p className="text-sm text-muted-foreground">Tente ajustar seus filtros</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table className="w-full">
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-semibold">Nome</TableHead>
                                        <TableHead className="font-semibold">CRO</TableHead>
                                        <TableHead className="font-semibold">Especialidade</TableHead>
                                        <TableHead className="font-semibold">Telefone</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="text-right font-semibold">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dentistas.map((dentista) => {
                                        const statusBadge = getStatusBadge(dentista.ativo);
                                        return (
                                            <TableRow key={dentista.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{formatProperName(dentista.nome)}</TableCell>
                                                <TableCell className="font-mono text-sm font-medium">{formatCRO(dentista.cro)}</TableCell>
                                                <TableCell>{capitalizeWords(dentista.especialidade) || "Não informada"}</TableCell>
                                                <TableCell className="text-muted-foreground">{formatPhone(dentista.telefone)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={statusBadge.variant} className="text-xs">
                                                        {statusBadge.text}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => onEdit(dentista)} className="h-8 w-8 p-0 hover:bg-muted" title="Editar">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => onToggleStatus(dentista)} className="h-8 w-8 p-0 hover:bg-muted" title={dentista.ativo ? "Desativar" : "Ativar"}>
                                                            {dentista.ativo ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => onDelete(dentista)} className="h-8 w-8 p-0 hover:bg-muted" title="Excluir">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }
);

DentistasList.displayName = 'DentistasList';