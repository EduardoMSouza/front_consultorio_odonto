// components/pacientes/PacienteSearch.tsx
import React from 'react';
import { Input } from '@/components/ui-shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui-shadcn/select';
import { Button } from '@/components/ui-shadcn/button';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface PacienteSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter?: 'all' | 'active' | 'inactive';
    onStatusFilterChange?: (value: 'all' | 'active' | 'inactive') => void;
    onRefresh?: () => void;
    placeholder?: string;
}

export const PacienteSearch: React.FC<PacienteSearchProps> = ({
                                                                  searchTerm,
                                                                  onSearchChange,
                                                                  statusFilter = 'all',
                                                                  onStatusFilterChange,
                                                                  onRefresh,
                                                                  placeholder = "Buscar por nome...",
                                                              }) => {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={placeholder}
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2">
                {onStatusFilterChange && (
                    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="active">Ativos</SelectItem>
                            <SelectItem value="inactive">Inativos</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                {onRefresh && (
                    <Button variant="outline" onClick={onRefresh}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};