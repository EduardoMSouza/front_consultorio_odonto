// components/core/paciente/PacienteStats.tsx
import { Users, UserCheck, UserX, Calendar } from 'lucide-react';

interface PacienteStatsProps {
    totalPacientes: number;
    pacientesAtivos: number;
    pacientesInativos: number;
    aniversariantesHoje: number;
}

export function PacienteStats({
                                  totalPacientes,
                                  pacientesAtivos,
                                  pacientesInativos,
                                  aniversariantesHoje
                              }: PacienteStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-6 rounded-xl card-hover">
                <div className="flex items-center mb-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg mr-3">
                        <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{totalPacientes}</p>
                </div>
                <p className="text-sm text-muted-foreground">Total de Pacientes</p>
            </div>
            <div className="glass-card p-6 rounded-xl card-hover">
                <div className="flex items-center mb-3">
                    <div className="p-2 bg-green-500/10 rounded-lg mr-3">
                        <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{pacientesAtivos}</p>
                </div>
                <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
            </div>
            <div className="glass-card p-6 rounded-xl card-hover">
                <div className="flex items-center mb-3">
                    <div className="p-2 bg-red-500/10 rounded-lg mr-3">
                        <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{pacientesInativos}</p>
                </div>
                <p className="text-sm text-muted-foreground">Pacientes Inativos</p>
            </div>
            <div className="glass-card p-6 rounded-xl card-hover">
                <div className="flex items-center mb-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg mr-3">
                        <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{aniversariantesHoje}</p>
                </div>
                <p className="text-sm text-muted-foreground">Aniversariantes Hoje</p>
            </div>
        </div>
    );
}