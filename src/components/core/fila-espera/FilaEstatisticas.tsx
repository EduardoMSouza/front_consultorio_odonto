// components/fila-espera/FilaEstatisticas.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-shadcn/card"
import { Users, Bell, CheckCircle2, Clock } from "lucide-react"

interface FilaEstatisticasProps {
    statistics: {
        totalAtivas: number
        totalNotificadas: number
        totalConvertidas: number
        tempoMedio: number
    }
}

export function FilaEstatisticas({ statistics }: FilaEstatisticasProps) {
    const stats = [
        {
            title: "Na Fila",
            value: statistics.totalAtivas.toString(),
            icon: Users,
            description: "Aguardando vaga",
            color: "text-blue-600"
        },
        {
            title: "Notificados",
            value: statistics.totalNotificadas.toString(),
            icon: Bell,
            description: "Aguardando confirmação",
            color: "text-yellow-600"
        },
        {
            title: "Convertidos",
            value: statistics.totalConvertidas.toString(),
            icon: CheckCircle2,
            description: "Agendamentos realizados",
            color: "text-green-600"
        },
        {
            title: "Tempo Médio",
            value: `${statistics.tempoMedio} dias`,
            icon: Clock,
            description: "Na fila de espera",
            color: "text-purple-600"
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}