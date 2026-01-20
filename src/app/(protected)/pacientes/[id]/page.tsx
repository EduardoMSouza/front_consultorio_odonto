// app/pacientes/[id]/editar/page.tsx
'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui-shadcn/card';
import {Button} from '@/components/ui-shadcn/button';
import {Textarea} from '@/components/ui-shadcn/textarea';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui-shadcn/tabs';
import {AlertCircle, ArrowLeft, Loader2, Save} from 'lucide-react';
import {PacienteService} from '@/services/paciente.service';
import {
    namesRequest,
    ConvenioRequest,
    DadosBasicosRequest,
    InspecaoBucalRequest,
    PacienteRequest,
    PacienteResponse,
    QuestionarioSaudeRequest,
    ResponsavelRequest
} from '@/models/paciente.types';
import {toast} from 'sonner';
import {Alert, AlertDescription} from '@/components/ui-shadcn/alert';

export default function EditarPacientePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paciente, setPaciente] = useState<PacienteResponse | null>(null);

    // Estados para cada seção
    const [dadosBasicos, setDadosBasicos] = useState<DadosBasicosRequest>({
        prontuarioNumero: '',
        nome: '',
        email: '',
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
    });

    const [responsavel, setResponsavel] = useState<ResponsavelRequest>({});
    const [anamnese, setAnamnese] = useState<namesRequest>({});
    const [convenio, setConvenio] = useState<ConvenioRequest>({});
    const [inspecaoBucal, setInspecaoBucal] = useState<InspecaoBucalRequest>({});
    const [questionarioSaude, setQuestionarioSaude] = useState<QuestionarioSaudeRequest>({});
    const [observacoes, setObservacoes] = useState('');

    useEffect(() => {
        if (id) {
            loadPaciente();
        }
    }, [id]);

    const loadPaciente = async () => {
        try {
            setIsLoading(true);
            const data = await PacienteService.buscarPorId(id);
            setPaciente(data);

            // Preencher estados com os dados do paciente
            setDadosBasicos(data.dadosBasicos);
            setResponsavel(data.responsavel || {});
            setAnamnese(data.anamnese || {});
            setConvenio(data.convenio || {});
            setInspecaoBucal(data.inspecaoBucal || {});
            setQuestionarioSaude(data.questionarioSaude || {});
            setObservacoes(data.observacoes || '');
        } catch (error) {
            toast.error('Erro ao carregar paciente');
            router.push('/pacientes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const pacienteRequest: PacienteRequest = {
                dadosBasicos,
                responsavel: Object.values(responsavel).some(v => v) ? responsavel : undefined,
                anamnese: Object.values(anamnese).some(v => v !== undefined && v !== false && v !== '') ? anamnese : undefined,
                convenio: Object.values(convenio).some(v => v) ? convenio : undefined,
                inspecaoBucal: Object.values(inspecaoBucal).some(v => v !== undefined && v !== false && v !== '') ? inspecaoBucal : undefined,
                questionarioSaude: Object.values(questionarioSaude).some(v => v !== undefined && v !== false && v !== '') ? questionarioSaude : undefined,
                observacoes: observacoes || undefined,
            };

            await PacienteService.atualizar(id, pacienteRequest);
            toast.success('Paciente atualizado com sucesso!');
            router.push(`/pacientes/${id}`);
        } catch (error) {
            toast.error('Erro ao atualizar paciente');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCPF = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 11) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return value;
    };

    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return value;
    };

    if (isLoading) {
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
                    <AlertDescription>
                        Paciente não encontrado
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-8">
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
                        <h1 className="text-3xl font-bold tracking-tight">
                            Editar Paciente
                        </h1>
                        <p className="text-muted-foreground">
                            Editando: {paciente.dadosBasicos.nome}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="dados-basicos" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
                            <TabsTrigger value="responsavel">Responsável</TabsTrigger>
                            <TabsTrigger value="anamnese">Anamnese</TabsTrigger>
                            <TabsTrigger value="convenio">Convênio</TabsTrigger>
                            <TabsTrigger value="inspecao-bucal">Inspeção Bucal</TabsTrigger>
                            <TabsTrigger value="questionario-saude">Questionário Saúde</TabsTrigger>
                        </TabsList>

                        {/* Os conteúdos das tabs são os mesmos da página de novo paciente */}
                        {/* Para economizar espaço, vou mostrar apenas a estrutura básica */}
                        {/* Você pode copiar o conteúdo das tabs da página de novo paciente */}

                        <TabsContent value="dados-basicos">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dados Básicos</CardTitle>
                                    <CardDescription>
                                        Informações pessoais do paciente
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Copiar conteúdo da página de novo paciente */}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ... outras tabs com mesmo conteúdo da página de novo ... */}
                    </Tabs>

                    <div className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Observações Gerais</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Observações adicionais sobre o paciente..."
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                    rows={4}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/pacientes/${id}`)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>Salvando...</>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Atualizar Paciente
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}