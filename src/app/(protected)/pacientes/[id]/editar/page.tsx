// app/pacientes/[id]/editar/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui-shadcn/button';
import { Alert, AlertDescription } from '@/components/ui-shadcn/alert';
import { AlertCircle } from 'lucide-react';
import { usePaciente } from '@/lib/hooks/usePaciente';
import { PacienteRequest } from '@/lib/types/paciente/paciente.types';
import { PacienteFormCompleto } from '@/components/core/paciente/PacienteFormCompleto';

export default function EditarPacientePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const { paciente, loading, carregarPaciente, atualizar } = usePaciente(id);

    useEffect(() => {
        if (id) {
            carregarPaciente(id);
        }
    }, [id]);

    const handleSuccess = () => {
        toast.success('Paciente atualizado com sucesso!');
        router.push(`/pacientes/${id}`);
    };

    const handleCancel = () => {
        router.push(`/pacientes/${id}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (!paciente) {
        return (
            <div className="container mx-auto py-10">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Paciente não encontrado</AlertDescription>
                </Alert>
            </div>
        );
    }

    const initialData: PacienteRequest = {
        dadosBasicos: {
            prontuarioNumero: paciente.dadosBasicos.prontuarioNumero,
            nome: paciente.dadosBasicos.nome,
            telefone: paciente.dadosBasicos.telefone,
            rg: paciente.dadosBasicos.rg,
            orgaoExpedidor: paciente.dadosBasicos.orgaoExpedidor,
            cpf: paciente.dadosBasicos.cpf,
            dataNascimento: paciente.dadosBasicos.dataNascimento,
            naturalidade: paciente.dadosBasicos.naturalidade,
            nacionalidade: paciente.dadosBasicos.nacionalidade,
            profissao: paciente.dadosBasicos.profissao,
            enderecoResidencial: paciente.dadosBasicos.enderecoResidencial,
            indicadoPor: paciente.dadosBasicos.indicadoPor,
            status: paciente.dadosBasicos.status,
        },
        responsavel: paciente.responsavel,
        anamnese: paciente.anamnese,
        convenio: paciente.convenio,
        inspecaoBucal: paciente.inspecaoBucal,
        questionarioSaude: paciente.questionarioSaude,
        observacoes: paciente.observacoes,
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-8">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button variant="ghost" onClick={() => router.push(`/pacientes/${id}`)} className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Visualização
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Editar Paciente</h1>
                        <p className="text-muted-foreground">
                            Editando: {paciente.dadosBasicos.nome} • Prontuário: {paciente.dadosBasicos.prontuarioNumero}
                        </p>
                    </div>
                </div>

                {/* Formulário de Edição */}
                <PacienteFormCompleto
                    initialData={initialData}
                    pacienteId={id}
                    isEditing={true}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}