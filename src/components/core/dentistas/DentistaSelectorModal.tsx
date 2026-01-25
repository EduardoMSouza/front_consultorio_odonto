// components/core/dentistas/DentistaSelectorModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, X, User, Stethoscope } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-shadcn/dialog';
import { Input } from '@/components/ui-shadcn/input';
import { Button } from '@/components/ui-shadcn/button';
import { Badge } from '@/components/ui-shadcn/badge';
import {dentistaService} from "@/lib/services/dentista/dentista.service";
import {DentistaResumoResponse} from "@/lib/types/dentista/dentista.type";

interface DentistaSelectorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (dentista: DentistaResumoResponse) => void;
    selectedId?: number;
}

export function DentistaSelectorModal({
                                          open,
                                          onOpenChange,
                                          onSelect,
                                          selectedId
                                      }: DentistaSelectorModalProps) {
    const [dentistas, setDentistas] = useState<DentistaResumoResponse[]>([]);
    const [filteredDentistas, setFilteredDentistas] = useState<DentistaResumoResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            loadDentistas();
        }
    }, [open]);

    useEffect(() => {
        filterDentistas();
    }, [searchTerm, dentistas]);

    const loadDentistas = async () => {
        try {
            setLoading(true);
            const response = await dentistaService.listarAtivos(0, 100);
            setDentistas(response.content || []);
        } catch (error) {
            console.error('Erro ao carregar dentistas:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDentistas = () => {
        if (!searchTerm.trim()) {
            setFilteredDentistas(dentistas);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = dentistas.filter(d =>
            d.nome?.toLowerCase().includes(term) ||
            d.cro?.toLowerCase().includes(term) ||
            d.especialidade?.toLowerCase().includes(term)
        );
        setFilteredDentistas(filtered);
    };

    const handleSelect = (dentista: DentistaResumoResponse) => {
        onSelect(dentista);
        onOpenChange(false);
        setSearchTerm('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-primary" />
                        Selecionar Dentista
                    </DialogTitle>
                </DialogHeader>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome, CRO ou especialidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-2 min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredDentistas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <User className="w-12 h-12 mb-3 opacity-50" />
                            <p className="text-sm">Nenhum dentista encontrado</p>
                        </div>
                    ) : (
                        filteredDentistas.map((dentista) => (
                            <button
                                key={dentista.id}
                                onClick={() => handleSelect(dentista)}
                                className={`w-full p-4 rounded-lg border transition-all text-left hover:border-primary hover:bg-primary/5 ${
                                    selectedId === dentista.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="p-2 bg-primary/10 rounded-lg mt-1">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground truncate">
                                                {dentista.nome}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                CRO: {dentista.cro}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {dentista.especialidade}
                                                </Badge>
                                                {dentista.ativo && (
                                                    <Badge variant="default" className="text-xs bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
                                                        Ativo
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        {filteredDentistas.length} dentista(s) encontrado(s)
                    </p>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}