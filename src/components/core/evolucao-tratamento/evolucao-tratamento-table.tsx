// components/core/evolucao-tratamento/evolucao-tratamento-table.tsx
'use client';

import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui-shadcn/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui-shadcn/dropdown-menu';
import { Badge } from '@/components/ui-shadcn/badge';
import {EvolucaoTratamentoResponse} from "@/lib/types/evolucao-tratamento/evoluca_tratamento.type";

interface EvolucaoTratamentoTableProps {
    evolucoes: EvolucaoTratamentoResponse[];
    onView: (evolucao: EvolucaoTratamentoResponse) => void;
    onEdit: (evolucao: EvolucaoTratamentoResponse) => void;
    onDelete: (evolucao: EvolucaoTratamentoResponse) => void;
}

export function EvolucaoTratamentoTable({
                                            evolucoes,
                                            onView,
                                            onEdit,
                                            onDelete
                                        }: EvolucaoTratamentoTableProps) {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    };

    const truncateText = (text: string, maxLength: number = 80) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Paciente</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Dentista</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Data</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Evolução</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {evolucoes.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                Nenhuma evolução encontrada
                            </td>
                        </tr>
                    ) : (
                        evolucoes.map((evolucao) => (
                            <tr key={evolucao.id} className="border-b hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-medium">{evolucao.pacienteNome}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-muted-foreground">{evolucao.dentistaNome}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant="secondary" className="text-xs">
                                        {formatDate(evolucao.data)}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-muted-foreground max-w-md">
                                        {truncateText(evolucao.evolucaoEIntercorrencias)}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onView(evolucao)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Visualizar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(evolucao)}>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDelete(evolucao)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}