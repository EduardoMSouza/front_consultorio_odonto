// components/core/plano-dental/plano-dental-table.tsx
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
import {PlanoDentalResponse} from "@/lib/types/plano-dental/plano_dental.type";

interface PlanoDentalTableProps {
    planos: PlanoDentalResponse[];
    onView: (plano: PlanoDentalResponse) => void;
    onEdit: (plano: PlanoDentalResponse) => void;
    onDelete: (plano: PlanoDentalResponse) => void;
}

export function PlanoDentalTable({
                                     planos,
                                     onView,
                                     onEdit,
                                     onDelete
                                 }: PlanoDentalTableProps) {
    const formatCurrency = (value: number | null) => {
        if (value === null) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Paciente</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Dentista</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Dente</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Procedimento</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Valor</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Valor Final</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {planos.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                Nenhum plano dental encontrado
                            </td>
                        </tr>
                    ) : (
                        planos.map((plano) => (
                            <tr key={plano.id} className="border-b hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-medium">{plano.pacienteNome}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-muted-foreground">{plano.dentistaNome}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant="outline" className="font-mono">
                                        {plano.dente}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm">{plano.procedimento}</div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                        <span className="text-sm font-medium text-blue-600">
                                            {formatCurrency(plano.valor)}
                                        </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                        <span className="text-sm font-bold text-emerald-600">
                                            {formatCurrency(plano.valorFinal)}
                                        </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onView(plano)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Visualizar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(plano)}>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDelete(plano)}
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