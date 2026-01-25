// components/core/dentistas/DentistasHeader.tsx
'use client';
import { Button } from '@/components/ui-shadcn/button';
import { Plus } from 'lucide-react';

interface DentistasHeaderProps {
    onAdd: () => void;
    totalRegistros?: number;
}

export function DentistasHeader({ onAdd, totalRegistros = 0 }: DentistasHeaderProps) {
    const styles = {
        container: "flex items-center justify-between mb-6",
        titleSection: "space-y-1",
        title: "text-3xl font-bold tracking-tight text-foreground",
        subtitle: "text-muted-foreground",
        addButton: "flex items-center gap-2",
        buttonIcon: "h-4 w-4"
    };

    return (
        <div className={styles.container}>
            <div className={styles.titleSection}>
                <h2 className={styles.title}>Dentistas</h2>
                <p className={styles.subtitle}>
                    Gerencie os pacientes do sistema ({totalRegistros} registros)
                </p>
            </div>
            <Button onClick={onAdd} className={styles.addButton}>
                <Plus className={styles.buttonIcon} />
                Novo Dentista
            </Button>
        </div>
    );
}