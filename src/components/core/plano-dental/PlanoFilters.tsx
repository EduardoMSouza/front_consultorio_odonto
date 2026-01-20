// components/core/plano/PlanoFilters.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-shadcn/card"
import { Input } from "@/components/ui-shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-shadcn/select"
import { Search } from "lucide-react"
import { statusLabels } from "@/constants/plano-status"

interface PlanoFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    statusFilter: string
    onStatusChange: (value: string) => void
}

export function PlanoFilters({
                                 searchTerm,
                                 onSearchChange,
                                 statusFilter,
                                 onStatusChange
                             }: PlanoFiltersProps) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por procedimento, dente, paciente ou dentista..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODOS">Todos os Status</SelectItem>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}