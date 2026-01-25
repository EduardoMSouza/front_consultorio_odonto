// components/core/dentistas/DentistasFiltros.tsx
'use client';
import { forwardRef } from 'react';
import { Button } from '@/components/ui-shadcn/button';
import { Input } from '@/components/ui-shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui-shadcn/select';
import { Download, Filter, RefreshCw, Search } from 'lucide-react';

interface DentistasFiltrosProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
    onRefresh: () => void;
}

export const DentistasFiltros = forwardRef<HTMLDivElement, DentistasFiltrosProps>(
    ({
         searchTerm,
         setSearchTerm,
         statusFilter,
         setStatusFilter,
         onRefresh,
     }, ref) => {

        const styles = {
            container: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6",
            searchContainer: "relative flex-1 w-full md:w-auto",
            searchIcon: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground",
            searchInput: "w-full pl-8",
            filtersContainer: "flex items-center gap-2 w-full md:w-auto",
            select: "w-[120px]",
            button: "flex items-center gap-2",
            buttonIcon: "h-4 w-4"
        };

        return (
            <div ref={ref} className={styles.container}>
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} />
                    <Input
                        type="search"
                        placeholder="Buscar por nome, CPF, RG, data nascimento..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filtersContainer}>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className={styles.select}>
                            <SelectValue placeholder="todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">todos</SelectItem>
                            <SelectItem value="active">ativos</SelectItem>
                            <SelectItem value="inactive">inativos</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={onRefresh} className={styles.button}>
                        <RefreshCw className={styles.buttonIcon} />
                    </Button>
                </div>
            </div>
        );
    }
);

DentistasFiltros.displayName = 'DentistasFiltros';