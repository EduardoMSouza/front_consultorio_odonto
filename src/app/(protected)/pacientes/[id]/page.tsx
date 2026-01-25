// app/pacientes/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui-shadcn/card';
import { Button } from '@/components/ui-shadcn/button';
import { Badge } from '@/components/ui-shadcn/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui-shadcn/tabs';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    ClipboardCheck,
    Eye,
    FileText,
    Heart,
    Loader2,
    MapPin,
    Phone,
    Shield,
    Stethoscope,
    User,
    Users
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui-shadcn/alert';
import { usePaciente } from '@/lib/hooks/usePaciente';
import { formatDate } from '@/lib/utils/date.utils';
import { formatDateTime } from '@/lib/utils/currency.utils';
import {formatCPFForDisplay, formatPhone} from "@/lib/utils/formatters/paciente.formatter";

export default function VisualizarPacientePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const { paciente, loading, carregarPaciente } = usePaciente(id);

    useEffect(() => {
        if (id) {
            carregarPaciente(id);
        }
    }, [id]);

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

    const { dadosBasicos, responsavel, anamnese, convenio, inspecaoBucal, questionarioSaude, observacoes } = paciente;

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-8">
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Button variant="ghost" onClick={() => router.push('/pacientes')} className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold tracking-tight">{dadosBasicos.nome}</h1>
                            <div className="flex gap-2">
                                <Badge variant={paciente.ativo ? "default" : "secondary"}>
                                    {paciente.ativo ? 'Ativo' : 'Inativo'}
                                </Badge>
                                <Badge variant={dadosBasicos.status ? "outline" : "destructive"}>
                                    {dadosBasicos.status ? 'Atendimento Ativo' : 'Atendimento Inativo'}
                                </Badge>
                            </div>
                        </div>
                        <p className="text-muted-foreground mt-2">
                            Prontuário: {dadosBasicos.prontuarioNumero} • ID: {paciente.id} • Idade: {paciente.idade} anos
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Cadastrado em {formatDateTime(paciente.criadoEm)} •
                            Última atualização: {formatDateTime(paciente.atualizadoEm)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.push(`/pacientes/${id}/editar`)}>
                            Editar
                        </Button>
                    </div>
                </div>

                {/* Tabs de navegação */}
                <Tabs defaultValue="dados-basicos" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
                        <TabsTrigger value="responsavel">Responsável</TabsTrigger>
                        <TabsTrigger value="anamnese">Anamnese</TabsTrigger>
                        <TabsTrigger value="convenio">Convênio</TabsTrigger>
                        <TabsTrigger value="inspecao-bucal">Inspeção Bucal</TabsTrigger>
                        <TabsTrigger value="questionario-saude">Questionário Saúde</TabsTrigger>
                    </TabsList>

                    {/* Dados Básicos */}
                    <TabsContent value="dados-basicos">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Dados Básicos
                                </CardTitle>
                                <CardDescription>Informações pessoais do paciente</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Nome Completo</h3>
                                        <p className="text-lg font-semibold">{dadosBasicos.nome}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Nº Prontuário</h3>
                                        <p className="text-lg font-semibold">{dadosBasicos.prontuarioNumero}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">CPF</h3>
                                        <p className="text-lg font-semibold">{formatCPFForDisplay(dadosBasicos.cpf)}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">RG</h3>
                                        <p className="text-lg">{dadosBasicos.rg || 'Não informado'}</p>
                                        {dadosBasicos.orgaoExpedidor && (
                                            <p className="text-sm text-muted-foreground">Órgão: {dadosBasicos.orgaoExpedidor}</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Data de Nascimento
                                        </h3>
                                        <p className="text-lg">{formatDate(dadosBasicos.dataNascimento)}</p>
                                        <p className="text-sm text-muted-foreground">{paciente.idade} anos</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            Telefone
                                        </h3>
                                        <p className="text-lg">{formatPhone(dadosBasicos.telefone || "Não informado")}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Naturalidade</h3>
                                        <p className="text-lg">{dadosBasicos.naturalidade || 'Não informada'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Nacionalidade</h3>
                                        <p className="text-lg">{dadosBasicos.nacionalidade || 'Não informada'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Profissão</h3>
                                        <p className="text-lg">{dadosBasicos.profissao || 'Não informada'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Endereço Residencial
                                        </h3>
                                        <p className="text-lg">{dadosBasicos.enderecoResidencial || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Indicado Por</h3>
                                        <p className="text-lg">{dadosBasicos.indicadoPor || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Status do Atendimento</h3>
                                        <Badge variant={dadosBasicos.status ? "default" : "destructive"} className="mt-1">
                                            {dadosBasicos.status ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Responsável */}
                    <TabsContent value="responsavel">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Responsável Legal
                                </CardTitle>
                                <CardDescription>Dados do responsável (para menores de idade)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {responsavel ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Nome Completo</h3>
                                            <p className="text-lg font-semibold">{responsavel.nome || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">CPF</h3>
                                            <p className="text-lg">{formatCPFForDisplay(responsavel.cpf)}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">RG</h3>
                                            <p className="text-lg">{responsavel.rg || 'Não informado'}</p>
                                            {responsavel.orgaoExpedidor && (
                                                <p className="text-sm text-muted-foreground">Órgão: {responsavel.orgaoExpedidor}</p>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Estado Civil</h3>
                                            <p className="text-lg">{responsavel.estadoCivil || 'Não informado'}</p>
                                        </div>
                                        {responsavel.conjuge && (
                                            <>
                                                <div className="md:col-span-3 border-t pt-4 mt-4">
                                                    <h3 className="text-lg font-semibold mb-4">Dados do Cônjuge</h3>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-muted-foreground">Nome do Cônjuge</h3>
                                                    <p className="text-lg">{responsavel.conjuge}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-muted-foreground">CPF do Cônjuge</h3>
                                                    <p className="text-lg">{formatCPFForDisplay(responsavel.cpfConjuge)}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-muted-foreground">RG do Cônjuge</h3>
                                                    <p className="text-lg">{responsavel.rgConjuge || 'Não informado'}</p>
                                                    {responsavel.orgaoExpedidorConjuge && (
                                                        <p className="text-sm text-muted-foreground">Órgão: {responsavel.orgaoExpedidorConjuge}</p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">Nenhum responsável cadastrado</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Anamnese */}
                    <TabsContent value="anamnese">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    Anamnese
                                </CardTitle>
                                <CardDescription>Histórico médico do paciente</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {anamnese ? (
                                    <div className="space-y-6">
                                        {/* Checkboxes */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[
                                                { key: 'febreReumatica', label: 'Febre Reumática' },
                                                { key: 'hepatite', label: 'Hepatite' },
                                                { key: 'diabetes', label: 'Diabetes' },
                                                { key: 'hipertensaoArterialSistemica', label: 'Hipertensão Arterial' },
                                                { key: 'portadorHiv', label: 'Portador de HIV' },
                                                { key: 'alteracaoCoagulacaoSanguinea', label: 'Alteração de Coagulação' },
                                                { key: 'reacoesAlergicas', label: 'Reações Alérgicas' },
                                                { key: 'doencasSistemicas', label: 'Doenças Sistêmicas' },
                                                { key: 'internacaoRecente', label: 'Internação Recente' },
                                                { key: 'utilizandoMedicacao', label: 'Utilizando Medicação' },
                                                { key: 'fumante', label: 'Fumante' },
                                                { key: 'bebidasAlcoolicas', label: 'Bebidas Alcoólicas' },
                                                { key: 'problemasCardiacos', label: 'Problemas Cardíacos' },
                                                { key: 'problemasRenais', label: 'Problemas Renais' },
                                                { key: 'problemasGastricos', label: 'Problemas Gástricos' },
                                                { key: 'problemasRespiratorios', label: 'Problemas Respiratórios' },
                                                { key: 'problemasAlergicos', label: 'Problemas Alérgicos' },
                                                { key: 'problemasArticularesOuReumatismo', label: 'Problemas Articulares' },
                                            ].map(({ key, label }) => (
                                                <div key={key} className="flex items-center">
                                                    <div className={`h-3 w-3 rounded-full mr-3 ${anamnese[key as keyof typeof anamnese] ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    <span className="text-sm">{label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Campos detalhados */}
                                        {anamnese.fumante && (
                                            <div className="border-t pt-4">
                                                <h3 className="text-lg font-semibold mb-2">Informações sobre Fumo</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground">Quantidade</h4>
                                                        <p>{anamnese.fumanteQuantidade || 'Não informado'}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground">Tempo que fuma</h4>
                                                        <p>{anamnese.tempoFumo || 'Não informado'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {anamnese.problemasAlergicos && anamnese.problemasAlergicosQuais && (
                                            <div className="border-t pt-4">
                                                <h3 className="text-lg font-semibold mb-2">Alergias</h3>
                                                <p>{anamnese.problemasAlergicosQuais}</p>
                                            </div>
                                        )}

                                        {/* Queixa Principal e Evolução */}
                                        <div className="border-t pt-4 space-y-4">
                                            {anamnese.queixaPrincipal && (
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-2">Queixa Principal</h3>
                                                    <p className="whitespace-pre-line">{anamnese.queixaPrincipal}</p>
                                                </div>
                                            )}

                                            {anamnese.evolucaoDoencaAtual && (
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-2">Evolução da Doença Atual</h3>
                                                    <p className="whitespace-pre-line">{anamnese.evolucaoDoencaAtual}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">Anamnese não preenchida</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Convênio */}
                    <TabsContent value="convenio">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Convênio
                                </CardTitle>
                                <CardDescription>Dados do plano de saúde</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {convenio ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Nome do Convênio</h3>
                                            <p className="text-lg font-semibold">{convenio.nomeConvenio || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Número de Inscrição</h3>
                                            <p className="text-lg">{convenio.numeroInscricao || 'Não informado'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">Convênio não informado</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Inspeção Bucal */}
                    <TabsContent value="inspecao-bucal">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    Inspeção Bucal
                                </CardTitle>
                                <CardDescription>Exame clínico bucal</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {inspecaoBucal ? (
                                    <div className="space-y-6">
                                        {/* Campos textuais */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { key: 'lingua', label: 'Língua' },
                                                { key: 'mucosa', label: 'Mucosa' },
                                                { key: 'palato', label: 'Palato' },
                                                { key: 'labios', label: 'Lábios' },
                                                { key: 'gengivas', label: 'Gengivas' },
                                                { key: 'nariz', label: 'Nariz' },
                                                { key: 'face', label: 'Face' },
                                                { key: 'ganglios', label: 'Gânglios' },
                                                { key: 'glandulasSalivares', label: 'Glândulas Salivares' },
                                            ].map(({ key, label }) => (
                                                <div key={key}>
                                                    <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
                                                    <p>{inspecaoBucal[key as keyof typeof inspecaoBucal] || 'Normal'}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Alteração de Oclusão */}
                                        <div className="border-t pt-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`h-3 w-3 rounded-full ${inspecaoBucal.alteracaoOclusao ? 'bg-amber-500' : 'bg-gray-300'}`} />
                                                <h3 className="text-lg font-semibold">Alteração de Oclusão</h3>
                                            </div>
                                            {inspecaoBucal.alteracaoOclusaoTipo && (
                                                <p className="ml-6">{inspecaoBucal.alteracaoOclusaoTipo}</p>
                                            )}
                                        </div>

                                        {/* Prótese */}
                                        <div className="border-t pt-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`h-3 w-3 rounded-full ${inspecaoBucal.protese ? 'bg-amber-500' : 'bg-gray-300'}`} />
                                                <h3 className="text-lg font-semibold">Usa Prótese</h3>
                                            </div>
                                            {inspecaoBucal.proteseTipo && (
                                                <p className="ml-6">{inspecaoBucal.proteseTipo}</p>
                                            )}
                                        </div>

                                        {/* Outras Observações */}
                                        {inspecaoBucal.outrasObservacoes && (
                                            <div className="border-t pt-4">
                                                <h3 className="text-lg font-semibold mb-2">Outras Observações</h3>
                                                <p className="whitespace-pre-line">{inspecaoBucal.outrasObservacoes}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">Inspeção bucal não realizada</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Questionário de Saúde */}
                    <TabsContent value="questionario-saude">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5" />
                                    Questionário de Saúde
                                </CardTitle>
                                <CardDescription>Informações gerais de saúde</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {questionarioSaude ? (
                                    <div className="space-y-6">
                                        {/* Checkboxes */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { key: 'sofreDoenca', label: 'Sofre de Doença' },
                                                { key: 'tratamentoMedicoAtual', label: 'Em Tratamento Médico Atual' },
                                                { key: 'gravidez', label: 'Gravidez' },
                                                { key: 'usoMedicacao', label: 'Usa Medicação' },
                                                { key: 'teveAlergia', label: 'Teve Alergia' },
                                                { key: 'foiOperado', label: 'Foi Operado' },
                                                { key: 'problemasCicatrizacao', label: 'Problemas com Cicatrização' },
                                                { key: 'problemasAnestesia', label: 'Problemas com Anestesia' },
                                                { key: 'problemasHemorragia', label: 'Problemas com Hemorragia' },
                                            ].map(({ key, label }) => (
                                                <div key={key} className="flex items-center">
                                                    <div className={`h-3 w-3 rounded-full mr-3 ${questionarioSaude[key as keyof typeof questionarioSaude] ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    <span className="text-sm">{label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Campos detalhados */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                            {questionarioSaude.sofreDoencaQuais && (
                                                <div className="md:col-span-2">
                                                    <h3 className="text-sm font-medium text-muted-foreground">Quais Doenças</h3>
                                                    <p>{questionarioSaude.sofreDoencaQuais}</p>
                                                </div>
                                            )}

                                            {questionarioSaude.usoMedicacaoQuais && (
                                                <div className="md:col-span-2">
                                                    <h3 className="text-sm font-medium text-muted-foreground">Quais Medicações</h3>
                                                    <p>{questionarioSaude.usoMedicacaoQuais}</p>
                                                </div>
                                            )}

                                            {questionarioSaude.teveAlergiaQuais && (
                                                <div className="md:col-span-2">
                                                    <h3 className="text-sm font-medium text-muted-foreground">Quais Alergias</h3>
                                                    <p>{questionarioSaude.teveAlergiaQuais}</p>
                                                </div>
                                            )}

                                            {questionarioSaude.foiOperadoQuais && (
                                                <div className="md:col-span-2">
                                                    <h3 className="text-sm font-medium text-muted-foreground">Quais Operações</h3>
                                                    <p>{questionarioSaude.foiOperadoQuais}</p>
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Médico Assistente/Telefone</h3>
                                                <p>{questionarioSaude.medicoAssistenteTelefone || 'Não informado'}</p>
                                            </div>
                                        </div>

                                        {/* Hábitos e Antecedentes */}
                                        <div className="border-t pt-4 space-y-4">
                                            {questionarioSaude.habitos && (
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-2">Hábitos</h3>
                                                    <p className="whitespace-pre-line">{questionarioSaude.habitos}</p>
                                                </div>
                                            )}

                                            {questionarioSaude.antecedentesFamiliares && (
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-2">Antecedentes Familiares</h3>
                                                    <p className="whitespace-pre-line">{questionarioSaude.antecedentesFamiliares}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">Questionário de saúde não preenchido</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Observações Gerais */}
                {observacoes && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardCheck className="h-5 w-5" />
                                Observações Gerais
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <p className="whitespace-pre-line">{observacoes}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Botões de ação */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button variant="outline" onClick={() => router.push(`/pacientes/${id}/editar`)}>
                        Editar Paciente
                    </Button>
                    <Button onClick={() => router.push('/pacientes')}>Voltar para Lista</Button>
                </div>
            </div>
        </div>
    );
}