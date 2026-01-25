// components/core/paciente/PacienteStats.tsx
'use client';

import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Calendar } from 'lucide-react';
import { usePacientesEstatisticas, usePacientes } from '@/lib/hooks/usePaciente';
import { PacienteResumoResponse } from '@/lib/types/paciente/paciente.types';

interface EstatisticasContagem {
    total: number;
    ativos: number;
    inativos: number;
}

export function PacienteStats() {
    const { obterContagem, loading: loadingEstatisticas, error: errorEstatisticas } = usePacientesEstatisticas();
    const { buscarAniversariantesMes, loading: loadingAniversariantes } = usePacientes();

    const [stats, setStats] = useState<EstatisticasContagem>({
        total: 0,
        ativos: 0,
        inativos: 0
    });
    const [aniversariantesHoje, setAniversariantesHoje] = useState(0);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const mesAtual = new Date().getMonth() + 1;
            const diaAtual = new Date().getDate();

            const [contagem, aniversariantes] = await Promise.all([
                obterContagem(),
                buscarAniversariantesMes(mesAtual)
            ]);

            if (contagem) {
                setStats(contagem as EstatisticasContagem);
            }

            if (Array.isArray(aniversariantes)) {
                const aniversariantesHoje = aniversariantes.filter((p: PacienteResumoResponse) => {
                    if (!p.dataNascimento) return false;
                    const [ano, mes, dia] = p.dataNascimento.split('-');
                    return parseInt(dia) === diaAtual;
                });
                setAniversariantesHoje(aniversariantesHoje.length);
            }
        } catch (err) {
            console.error('Erro ao carregar estatísticas:', err);
        }
    };

    const loading = loadingEstatisticas || loadingAniversariantes;

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 rounded-xl border animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (errorEstatisticas) {
        return (
            <div className="p-6 rounded-xl border">
                <p className="text-sm text-red-500">Erro ao carregar estatísticas</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-xl border">
                <div className="flex items-center mb-3">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                        <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <p className="text-sm text-gray-500">Total de Pacientes</p>
            </div>

            <div className="p-6 rounded-xl border">
                <div className="flex items-center mb-3">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <UserCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold">{stats.ativos}</p>
                </div>
                <p className="text-sm text-gray-500">Pacientes Ativos</p>
            </div>

            <div className="p-6 rounded-xl border">
                <div className="flex items-center mb-3">
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <UserX className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold">{stats.inativos}</p>
                </div>
                <p className="text-sm text-gray-500">Pacientes Inativos</p>
            </div>

            <div className="p-6 rounded-xl border">
                <div className="flex items-center mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold">{aniversariantesHoje}</p>
                </div>
                <p className="text-sm text-gray-500">Aniversariantes Hoje</p>
            </div>
        </div>
    );
}