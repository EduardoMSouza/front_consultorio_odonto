// components/core/dentistas/DentistasHeader.tsx
import { Button } from '@/components/ui-shadcn/button';
import { Plus } from 'lucide-react';

interface DentistasHeaderProps {
    onAdd: () => void;
}

export function DentistasHeader({ onAdd }: DentistasHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Dentistas</h2>
                <p className="text-muted-foreground">Gerencie os dentistas da clínica</p>
            </div>
            <Button onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Dentista
            </Button>
        </div>
    );
}