// components/core/paciente/PacienteSelectorModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, User, FileText, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-shadcn/dialog';
import { Input } from '@/components/ui-shadcn/input';
import { Button } from '@/components/ui-shadcn/button';
import { Badge } from '@/components/ui-shadcn/badge';
import { PacienteResumoResponse } from '@/lib/types/paciente/paciente.types';
import { usePacientes } from '@/lib/hooks/usePaciente';
import { formatDate } from '@/lib/utils/date.utils';
import {cleanDocument} from "@/lib/utils/document.utils";
import {formatCPFForDisplay} from "@/lib/utils/formatters/paciente.formatter";

interface PacienteSelectorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (paciente: PacienteResumoResponse) => void;
    selectedId?: number;
}

export function PacienteSelectorModal({
                                          open,
                                          onOpenChange,
                                          onSelect,
                                          selectedId
                                      }: PacienteSelectorModalProps) {
    const { pacientes, listarResumo, loading } = usePacientes();
    const [filteredPacientes, setFilteredPacientes] = useState<PacienteResumoResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (open) {
            listarResumo();
        }
    }, [open]);

    useEffect(() => {
        filterPacientes();
    }, [searchTerm, pacientes]);

    const filterPacientes = () => {
        if (!searchTerm.trim()) {
            setFilteredPacientes(pacientes);
            return;
        }

        const term = searchTerm.toLowerCase();
        const searchCleaned = cleanDocument(searchTerm);

        const filtered = pacientes.filter(p => {
            const nome = p.nome?.toLowerCase() || '';
            const cpf = cleanDocument(p.cpf);
            const prontuario = p.prontuarioNumero?.toLowerCase() || '';

            return (
                nome.includes(term) ||
                (cpf && cpf.includes(searchCleaned)) ||
                (prontuario && prontuario.includes(term))
            );
        });

        setFilteredPacientes(filtered);
    };

    const handleSelect = (paciente: PacienteResumoResponse) => {
        onSelect(paciente);
        onOpenChange(false);
        setSearchTerm('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[680px] max-h-[82vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <User className="w-5 h-5 text-primary" />
                        Selecionar Paciente
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Buscar por nome, CPF ou prontuário..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-[320px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredPacientes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <User className="w-14 h-14 mb-4 opacity-40" />
                            <p className="text-base font-medium">
                                {pacientes.length === 0 ? "Nenhum paciente cadastrado" : "Nenhum paciente encontrado"}
                            </p>
                            <p className="text-sm mt-1">
                                {pacientes.length === 0 ? "Cadastre um paciente para começar" : "Tente ajustar os termos de busca"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {filteredPacientes.map((paciente) => (
                                <button
                                    key={paciente.id}
                                    onClick={() => handleSelect(paciente)}
                                    className={`w-full p-4 rounded-lg border text-left transition-all
                    hover:border-blue-500 hover:bg-blue-50
                    ${selectedId === paciente.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-blue-100 rounded-full shrink-0 mt-0.5">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-base leading-tight truncate">
                                                {paciente.nome || 'Nome não informado'}
                                            </p>

                                            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                            {paciente.prontuarioNumero || 'Sem prontuário'}
                        </span>
                                                {paciente.cpf && (
                                                    <span className="font-mono">{formatCPFForDisplay(paciente.cpf)}</span>
                                                )}
                                            </div>

                                            <div className="mt-2.5 flex flex-wrap gap-2">
                                                {paciente.dataNascimento && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(paciente.dataNascimento)}
                                                        {paciente.idade && ` (${paciente.idade} anos)`}
                                                    </Badge>
                                                )}

                                                {paciente.convenio && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {paciente.convenio}
                                                    </Badge>
                                                )}

                                                {paciente.ativo ? (
                                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                                        Ativo
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                                                        Inativo
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
                    <p className="text-sm text-gray-500">
                        {filteredPacientes.length} paciente(s) encontrado(s)
                    </p>
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}