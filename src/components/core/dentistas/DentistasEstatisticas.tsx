// components/core/dentistas/DentistasEstatisticas.tsx
import { forwardRef } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui-shadcn/card';
import { Skeleton } from '@/components/ui-shadcn/skeleton';
import { Layers, Users, UserCheck, UserX } from 'lucide-react';

interface Estatisticas {
    total: number;
    ativos: number;
    inativos: number;
    porEspecialidade: Record<string, number>;
}

interface DentistasEstatisticasProps {
    loading: boolean;
    estatisticas: Estatisticas | null;
    especialidades: string[];
}

export const DentistasEstatisticas = forwardRef<HTMLDivElement, DentistasEstatisticasProps>(
    ({ loading, estatisticas, especialidades }, ref) => {
        const stats = [
            {
                title: "Total de Dentistas",
                value: estatisticas?.total ?? 0,
                icon: Users,
                description: "Dentistas cadastrados",
                color: "text-blue-600",
            },
            {
                title: "Dentistas Ativos",
                value: estatisticas?.ativos ?? 0,
                icon: UserCheck,
                description: "Em atividade",
                color: "text-green-600",
            },
            {
                title: "Dentistas Inativos",
                value: estatisticas?.inativos ?? 0,
                icon: UserX,
                description: "Inativos",
                color: "text-red-600",
            },
            {
                title: "Especialidades",
                value: especialidades.length,
                icon: Layers,
                description: "Especialidades únicas",
                color: "text-purple-600",
            },
        ];

        return (
            <div ref={ref} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))
                ) : (
                    stats.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                <CardDescription className="text-xs mt-1">{stat.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        );
    }
);

DentistasEstatisticas.displayName = 'DentistasEstatisticas';