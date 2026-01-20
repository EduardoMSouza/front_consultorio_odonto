// components/core/paciente/PacienteHeader.tsx
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PacienteHeader() {
    const router = useRouter();

    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
                <p className="text-muted-foreground mt-1">Gerencie os pacientes da clínica</p>
            </div>
            <button
                onClick={() => router.push('/pacientes/novo')}
                className="flex items-center px-4 py-3 btn-emerald rounded-lg font-medium transition-all duration-200 shadow-emerald hover:shadow-emerald-lg focus-ring"
            >
                <Plus className="w-5 h-5 mr-2" />
                Novo Paciente
            </button>
        </div>
    );
}