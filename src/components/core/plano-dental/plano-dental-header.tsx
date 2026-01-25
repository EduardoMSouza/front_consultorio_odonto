// components/core/plano-dental/plano-dental-header.tsx
'use client';

import { Button } from '@/components/ui-shadcn/button';
import { Plus, User } from 'lucide-react';

interface PlanoDentalHeaderProps {
    onCreateClick: () => void;
    onViewPacienteClick: () => void;
}

export function PlanoDentalHeader({ onCreateClick, onViewPacienteClick }: PlanoDentalHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Planos Dentais</h1>
                <p className="text-muted-foreground">
                    Gerencie os planos de tratamento dentário
                </p>
            </div>
            <div className="flex gap-2">
                <Button onClick={onViewPacienteClick} variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    Ver por Paciente
                </Button>
                <Button onClick={onCreateClick} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Plano
                </Button>
            </div>
        </div>
    );
}