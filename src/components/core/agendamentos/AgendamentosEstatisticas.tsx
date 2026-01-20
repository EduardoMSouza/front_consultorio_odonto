// components/agendamentos/AgendamentosEstatisticas.tsx
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui-shadcn/card";
import { AlertCircle, CalendarIcon, CheckCircle2, Clock } from "lucide-react";

interface Estatisticas {
    totalAgendamentos: number;
    totalConfirmados: number;
    totalEmAtendimento: number;
    taxaOcupacao: number;
    agendamentosHoje: number;
}

interface AgendamentosEstatisticasProps {
    estatisticas: Estatisticas;
    selectedDate: Date;
    formatDataConsulta: (data: string) => string;
}

export function AgendamentosEstatisticas({ estatisticas, selectedDate, formatDataConsulta }: AgendamentosEstatisticasProps) {
    const stats = [
        {
            title: "Agendamentos Hoje",
            value: estatisticas.agendamentosHoje.toString(),
            icon: CalendarIcon,
            description: `Total para ${formatDataConsulta(selectedDate.toISOString().split('T')[0])}`,
            color: "text-blue-600"
        },
        {
            title: "Confirmados",
            value: estatisticas.totalConfirmados.toString(),
            icon: CheckCircle2,
            description: `${estatisticas.totalAgendamentos > 0 ? Math.round((estatisticas.totalConfirmados / estatisticas.totalAgendamentos) * 100) : 0}% confirmados`,
            color: "text-green-600"
        },
        {
            title: "Em Atendimento",
            value: estatisticas.totalEmAtendimento.toString(),
            icon: Clock,
            description: "Atendimentos em andamento",
            color: "text-purple-600"
        },
        {
            title: "Taxa de Ocupação",
            value: `${estatisticas.taxaOcupacao}%`,
            icon: AlertCircle,
            description: estatisticas.taxaOcupacao > 80 ? "Alta ocupação" : "Ocupação normal",
            color: estatisticas.taxaOcupacao > 80 ? "text-orange-600" : "text-green-600"
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
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
            ))}
        </div>
    );
}