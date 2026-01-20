// components/core/dentistas/DentistasFiltros.tsx
import { forwardRef } from 'react';
import { Button } from '@/components/ui-shadcn/button';
import { Input } from '@/components/ui-shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui-shadcn/select';
import { Download, Filter, RefreshCw, Search } from 'lucide-react';

interface DentistasFiltrosProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    especialidadeFilter: string;
    setEspecialidadeFilter: (filter: string) => void;
    statusFilter: boolean | undefined;
    setStatusFilter: (filter: boolean | undefined) => void;
    especialidades: string[];
    onExport: () => void;
    onRefresh: () => void;
}

export const DentistasFiltros = forwardRef<HTMLDivElement, DentistasFiltrosProps>(
    ({
         searchTerm,
         setSearchTerm,
         especialidadeFilter,
         setEspecialidadeFilter,
         statusFilter,
         setStatusFilter,
         especialidades,
         onExport,
         onRefresh,
     }, ref) => {
        return (
            <div ref={ref} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar por nome, CRO ou especialidade..."
                        className="w-full pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Especialidade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas Especialidades</SelectItem>
                            {especialidades.map((esp) => (
                                <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter === undefined ? 'all' : statusFilter ? 'active' : 'inactive'}
                        onValueChange={(value) => {
                            if (value === 'all') setStatusFilter(undefined);
                            else if (value === 'active') setStatusFilter(true);
                            else setStatusFilter(false);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos Status</SelectItem>
                            <SelectItem value="active">Ativos</SelectItem>
                            <SelectItem value="inactive">Inativos</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={onRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Atualizar
                    </Button>
                </div>
            </div>
        );
    }
);

DentistasFiltros.displayName = 'DentistasFiltros';