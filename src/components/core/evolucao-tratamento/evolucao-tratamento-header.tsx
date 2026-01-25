// components/core/evolucao-tratamento/evolucao-tratamento-header.tsx
'use client';

import { Button } from '@/components/ui-shadcn/button';
import { Plus, User } from 'lucide-react';

interface EvolucaoTratamentoHeaderProps {
    onCreateClick: () => void;
    onViewPacienteClick: () => void; // Nova prop
}

export function EvolucaoTratamentoHeader({
                                             onCreateClick,
                                             onViewPacienteClick // Nova prop
                                         }: EvolucaoTratamentoHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Evolução Tratamento</h1>
                <p className="text-muted-foreground">
                    Gerencie as evoluções de tratamento do sistema (total registros)
                </p>
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={onViewPacienteClick}
                    variant="outline"
                    className="gap-2"
                >
                    <User className="w-4 h-4" />
                    Ver por Paciente
                </Button>
                <Button onClick={onCreateClick} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Evolução
                </Button>
            </div>
        </div>
    );
}