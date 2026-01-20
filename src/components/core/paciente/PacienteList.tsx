// components/pacientes/PacienteList.tsx
import React, { useState } from 'react';
import { PacienteResumoResponse } from '@/models/paciente.model';
import {Edit, Eye, Trash2, UserCheck, UserX, Calendar, FileText, User, Search} from 'lucide-react';
import { DataValidator } from '@/shared/validators/data.validator';
import { RgValidator } from '@/shared/validators/rg.validator';
import { PacienteSearch } from './PacienteSearch';

interface PacienteListProps {
    pacientes: PacienteResumoResponse[];
    loading?: boolean;
    onEdit?: (id: number) => void;
    onView?: (id: number) => void;
    onDelete?: (id: number) => void;
    onToggleStatus?: (id: number, currentStatus: boolean) => void;
}

export const PacienteList: React.FC<PacienteListProps> = ({
                                                              pacientes,
                                                              loading = false,
                                                              onEdit,
                                                              onView,
                                                              onDelete,
                                                              onToggleStatus,
                                                          }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Função para formatar data para busca (dd/mm/yyyy)
    const formatDateForSearch = (dateString?: string): string => {
        if (!dateString) return '';
        try {
            return DataValidator.format(dateString, 'pt-BR');
        } catch {
            return '';
        }
    };

    // Função para limpar formatação do CPF/RG (remove pontos, traços, etc)
    const cleanDocument = (doc?: string): string => {
        if (!doc) return '';
        return doc.replace(/[^\d]/g, ''); // Remove tudo que não é número
    };

    // Função para normalizar a data de busca (aceita dd/mm/yyyy, d/m/yyyy, etc)
    const normalizeDateSearch = (dateStr: string): string => {
        if (!dateStr) return '';
        // Remove todos os caracteres não numéricos
        const numbers = dateStr.replace(/\D/g, '');

        if (numbers.length < 6) return dateStr; // Não é uma data completa

        try {
            // Tenta interpretar como dd/mm/yyyy ou dd/mm/yy
            const day = numbers.substring(0, 2);
            const month = numbers.substring(2, 4);
            const year = numbers.substring(4);

            // Se o ano tiver 2 dígitos, assume século 20/21
            let fullYear = year;
            if (year.length === 2) {
                const yearNum = parseInt(year);
                fullYear = yearNum <= new Date().getFullYear() % 100 ?
                    `20${year.padStart(2, '0')}` :
                    `19${year.padStart(2, '0')}`;
            }

            // Verifica se é uma data válida
            const date = new Date(`${fullYear}-${month}-${day}`);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('pt-BR');
            }
        } catch {
            // Se der erro, retorna o texto original
        }

        return dateStr;
    };

    const filteredPacientes = pacientes.filter((paciente) => {
        if (!searchTerm.trim()) return true;

        const searchLower = searchTerm.toLowerCase();

        // Busca por nome
        if (paciente.nome?.toLowerCase().includes(searchLower)) return true;

        // Busca por CPF (formatado ou não)
        if (paciente.cpf) {
            const cpfFormatado = paciente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            const cpfLimpo = cleanDocument(paciente.cpf);
            const searchCleaned = cleanDocument(searchTerm);

            if (cpfFormatado.includes(searchTerm) || cpfLimpo.includes(searchCleaned)) return true;
        }

        // Busca por prontuário
        if (paciente.prontuarioNumero?.toLowerCase().includes(searchLower)) return true;

        // Busca por data de nascimento
        if (paciente.dataNascimento) {
            // Formata a data do paciente
            const dataPacienteFormatada = formatDateForSearch(paciente.dataNascimento);

            // Normaliza a busca do usuário
            const dataBuscadaNormalizada = normalizeDateSearch(searchTerm);

            // Busca em diferentes formatos
            const buscaPossibilidades = [
                dataPacienteFormatada, // Formato: dd/mm/yyyy
                dataPacienteFormatada?.replace(/\//g, ''), // Sem separadores
                dataPacienteFormatada?.replace(/^0/g, ''), // Sem zeros à esquerda
            ].filter(Boolean); // Remove valores undefined/null

            // Verifica se algum formato corresponde à busca
            if (buscaPossibilidades.some(data =>
                data.toLowerCase().includes(searchLower) ||
                (dataBuscadaNormalizada && data.includes(dataBuscadaNormalizada))
            )) {
                return true;
            }
        }

        return false;
    });

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return DataValidator.format(dateString, 'pt-BR');
        } catch {
            return '-';
        }
    };

    const formatCPF = (cpf?: string) => {
        if (!cpf) return '-';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatRG = (rg?: string) => {
        if (!rg) return '-';
        try {
            return RgValidator.format(rg);
        } catch {
            return rg;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Barra de Pesquisa - Componente Separado */}
            <PacienteSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={() => {
                    // A busca já é feita em tempo real com o filteredPacientes
                    // Esta função é opcional e pode ser usada para ações adicionais
                }}
            />

            {/* Tabela */}
            <div className="overflow-hidden glass-card rounded-xl shadow-emerald">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary/50">
                    <tr>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Prontuário
                            </div>
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Nome
                            </div>
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            CPF
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Data Nasc.
                            </div>
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            RG
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Convênio
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card/50">
                    {filteredPacientes.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                <div className="flex flex-col items-center justify-center">
                                    <Search className="w-12 h-12 text-muted-foreground/50 mb-3" />
                                    <p className="text-lg font-medium">Nenhum paciente encontrado</p>
                                    <p className="text-sm mt-1">
                                        {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando um novo paciente'}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredPacientes.map((paciente) => (
                            <tr
                                key={paciente.id}
                                className="hover:bg-secondary/30 transition-base group cursor-pointer"
                                onClick={() => onView && onView(paciente.id)}
                            >
                                {/* Prontuário */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center min-h-[40px]">
                                        <div className={`p-2 rounded-lg mr-3 ${paciente.prontuarioNumero ? 'bg-emerald-500/10' : 'bg-muted'}`}>
                                            <FileText className={`w-4 h-4 ${paciente.prontuarioNumero ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div className="min-w-[100px]">
                                            <span className="text-sm font-medium text-foreground">
                                                {paciente.prontuarioNumero || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Nome */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center min-h-[40px]">
                                        <div className="p-2 bg-primary/10 rounded-lg mr-3">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-[200px] max-w-[300px]">
                                            <p className="text-sm font-medium text-foreground truncate" title={paciente.nome}>
                                                {paciente.nome}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* CPF */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="min-h-[40px] flex items-center">
                                        <span className="text-sm text-muted-foreground font-mono min-w-[140px]">
                                            {formatCPF(paciente.cpf)}
                                        </span>
                                    </div>
                                </td>

                                {/* Data Nascimento */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="min-h-[40px] flex items-center">
                                        <span className="text-sm text-muted-foreground min-w-[100px]">
                                            {formatDate(paciente.dataNascimento)}
                                        </span>
                                    </div>
                                </td>

                                {/* Convênio */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="min-h-[40px] flex items-center">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${paciente.convenio ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                                            {paciente.convenio || 'Sem convênio'}
                                        </span>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center min-h-[40px] gap-2">
                                        <div className={`p-1.5 rounded-lg ${paciente.status ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                            {paciente.status ? (
                                                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <UserX className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            )}
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full min-w-[70px] text-center ${paciente.status ? 'badge-emerald' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'}`}>
                                            {paciente.status ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                </td>

                                {/* Ações */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="min-h-[40px] flex items-center justify-center">
                                        <div
                                            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {onView && (
                                                <button
                                                    onClick={() => onView(paciente.id)}
                                                    className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20 transition-base focus-ring"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(paciente.id)}
                                                    className="p-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-base focus-ring"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            )}
                                            {onToggleStatus && (
                                                <button
                                                    onClick={() => onToggleStatus(paciente.id, paciente.status || false)}
                                                    className={`p-2 rounded-lg transition-base focus-ring ${paciente.status ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'}`}
                                                    title={paciente.status ? 'Inativar' : 'Ativar'}
                                                >
                                                    {paciente.status ? (
                                                        <UserX className="w-4 h-4" />
                                                    ) : (
                                                        <UserCheck className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(paciente.id)}
                                                    className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-base focus-ring"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Contador de resultados */}
            {filteredPacientes.length > 0 && (
                <div className="text-sm text-muted-foreground px-4">
                    Mostrando {filteredPacientes.length} de {pacientes.length} pacientes
                    {searchTerm && ` para "${searchTerm}"`}
                </div>
            )}
        </div>
    );
};