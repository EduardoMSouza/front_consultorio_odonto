// app/pacientes/novo/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui-shadcn/button';
import { usePaciente } from '@/lib/hooks/usePaciente';
import { PacienteRequest } from '@/lib/types/paciente/paciente.types';
import {PacienteFormCompleto} from "@/components/core/paciente/PacienteFormCompleto";

export default function NovoPacientePage() {
    const router = useRouter();
    const { criar, loading } = usePaciente();

    const handleSuccess = () => {
        toast.success('Paciente criado com sucesso!');
        router.push('/pacientes');
    };

    const handleCancel = () => {
        router.back();
    };

    // Dados iniciais vazios para novo paciente
    const initialData: PacienteRequest = {
        dadosBasicos: {
            prontuarioNumero: '',
            nome: '',
            telefone: '',
            rg: '',
            orgaoExpedidor: '',
            cpf: '',
            dataNascimento: '',
            naturalidade: '',
            nacionalidade: '',
            profissao: '',
            enderecoResidencial: '',
            indicadoPor: '',
            status: true,
        },
        responsavel: undefined,
        anamnese: undefined,
        convenio: undefined,
        inspecaoBucal: undefined,
        questionarioSaude: undefined,
        observacoes: '',
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-8">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mb-4"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Novo Paciente</h1>
                        <p className="text-muted-foreground">
                            Preencha os dados para cadastrar um novo paciente
                        </p>
                    </div>
                </div>

                {/* Formulário de Novo Paciente */}
                <PacienteFormCompleto
                    initialData={initialData}
                    isEditing={false}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}