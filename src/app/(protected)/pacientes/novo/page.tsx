// app/pacientes/novo/page.tsx
'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui-shadcn/card';
import {Button} from '@/components/ui-shadcn/button';
import {Input} from '@/components/ui-shadcn/input';
import {Textarea} from '@/components/ui-shadcn/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui-shadcn/select';
import {Label} from '@/components/ui-shadcn/label';
import {Switch} from '@/components/ui-shadcn/switch';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui-shadcn/tabs';
import {ArrowLeft, Save} from 'lucide-react';
import {PacienteService} from '@/services/paciente.service';
import {
    namesRequest,
    ConvenioRequest,
    DadosBasicosRequest,
    InspecaoBucalRequest,
    PacienteRequest,
    QuestionarioSaudeRequest,
    ResponsavelRequest
} from '@/models/paciente.types';
import {toast} from 'sonner';

export default function NovoPacientePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dados básicos
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

    // Responsável
    const [responsavel, setResponsavel] = useState<ResponsavelRequest>({
        nome: '',
        rg: '',
        orgaoExpedidor: '',
        cpf: '',
        estadoCivil: '',
        conjuge: '',
        rgConjuge: '',
        orgaoExpedidorConjuge: '',
        cpfConjuge: '',
    });

    // Anamnese
    const [anamnese, setAnamnese] = useState<namesRequest>({
        febreReumatica: false,
        hepatite: false,
        diabetes: false,
        hipertensaoArterialSistemica: false,
        portadorHiv: false,
        alteracaoCoagulacaoSanguinea: false,
        reacoesAlergicas: false,
        doencasSistemicas: false,
        internacaoRecente: false,
        utilizandoMedicacao: false,
        fumante: false,
        fumanteQuantidade: '',
        tempoFumo: '',
        bebidasAlcoolicas: false,
        problemasCardiacos: false,
        problemasRenais: false,
        problemasGastricos: false,
        problemasRespiratorios: false,
        problemasAlergicos: false,
        problemasAlergicosQuais: '',
        problemasArticularesOuReumatismo: false,
        queixaPrincipal: '',
        evolucaoDoencaAtual: '',
    });

    // Convênio
    const [convenio, setConvenio] = useState<ConvenioRequest>({
        nomeConvenio: '',
        numeroInscricao: '',
    });

    // Inspeção Bucal
    const [inspecaoBucal, setInspecaoBucal] = useState<InspecaoBucalRequest>({
        lingua: '',
        mucosa: '',
        palato: '',
        labios: '',
        gengivas: '',
        nariz: '',
        face: '',
        ganglios: '',
        glandulasSalivares: '',
        alteracaoOclusao: false,
        alteracaoOclusaoTipo: '',
        protese: false,
        proteseTipo: '',
        outrasObservacoes: '',
    });

    // Questionário Saúde
    const [questionarioSaude, setQuestionarioSaude] = useState<QuestionarioSaudeRequest>({
        sofreDoenca: false,
        sofreDoencaQuais: '',
        tratamentoMedicoAtual: false,
        gravidez: false,
        usoMedicacao: false,
        usoMedicacaoQuais: '',
        medicoAssistenteTelefone: '',
        teveAlergia: false,
        teveAlergiaQuais: '',
        foiOperado: false,
        foiOperadoQuais: '',
        problemasCicatrizacao: false,
        problemasAnestesia: false,
        problemasHemorragia: false,
        habitos: '',
        antecedentesFamiliares: '',
    });

    const [observacoes, setObservacoes] = useState('');

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

            await PacienteService.criar(pacienteRequest);
            toast.success('Paciente criado com sucesso!');
            router.push('/pacientes');
        } catch (error) {
            toast.error('Erro ao criar paciente');
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
                        <h1 className="text-3xl font-bold tracking-tight">Novo Paciente</h1>
                        <p className="text-muted-foreground">
                            Preencha os dados para cadastrar um novo paciente
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

                        <TabsContent value="dados-basicos">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dados Básicos</CardTitle>
                                    <CardDescription>
                                        Informações pessoais do paciente
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="prontuario">Número do Prontuário *</Label>
                                            <Input
                                                id="prontuario"
                                                value={dadosBasicos.prontuarioNumero}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, prontuarioNumero: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nome">Nome Completo *</Label>
                                            <Input
                                                id="nome"
                                                value={dadosBasicos.nome}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, nome: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cpf">CPF</Label>
                                            <Input
                                                id="cpf"
                                                value={dadosBasicos.cpf}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, cpf: formatCPF(e.target.value) })}
                                                maxLength={14}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                                            <Input
                                                id="dataNascimento"
                                                type="date"
                                                value={dadosBasicos.dataNascimento}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, dataNascimento: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={dadosBasicos.email || ''}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefone">Telefone</Label>
                                            <Input
                                                id="telefone"
                                                value={dadosBasicos.telefone || ''}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, telefone: formatPhone(e.target.value) })}
                                                maxLength={15}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="rg">RG</Label>
                                            <Input
                                                id="rg"
                                                value={dadosBasicos.rg || ''}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, rg: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="orgaoExpedidor">Órgão Expedidor</Label>
                                            <Input
                                                id="orgaoExpedidor"
                                                value={dadosBasicos.orgaoExpedidor || ''}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, orgaoExpedidor: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="naturalidade">Naturalidade</Label>
                                            <Input
                                                id="naturalidade"
                                                value={dadosBasicos.naturalidade || ''}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, naturalidade: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nacionalidade">Nacionalidade</Label>
                                            <Input
                                                id="nacionalidade"
                                                value={dadosBasicos.nacionalidade || ''}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, nacionalidade: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="profissao">Profissão</Label>
                                            <Input
                                                id="profissao"
                                                value={dadosBasicos.profissao || ''}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, profissao: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="endereco">Endereço Residencial</Label>
                                            <Input
                                                id="endereco"
                                                value={dadosBasicos.enderecoResidencial || ''}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, enderecoResidencial: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="indicadoPor">Indicado Por</Label>
                                            <Input
                                                id="indicadoPor"
                                                value={dadosBasicos.indicadoPor || ''}
                                                onChange={(e) => setDadosBasicos({ ...dadosBasicos, indicadoPor: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 flex items-center gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="status"
                                                    checked={dadosBasicos.status}
                                                    onCheckedChange={(checked) => setDadosBasicos({ ...dadosBasicos, status: checked })}
                                                />
                                                <Label htmlFor="status">Status do Atendimento</Label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="responsavel">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Responsável</CardTitle>
                                    <CardDescription>
                                        Dados do responsável (para menores de idade)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="respNome">Nome do Responsável</Label>
                                            <Input
                                                id="respNome"
                                                value={responsavel.nome || ''}
                                                onChange={(e) => setResponsavel({ ...responsavel, nome: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="respCPF">CPF do Responsável</Label>
                                            <Input
                                                id="respCPF"
                                                value={responsavel.cpf || ''}
                                                onChange={(e) => setResponsavel({ ...responsavel, cpf: formatCPF(e.target.value) })}
                                                maxLength={14}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="respRG">RG do Responsável</Label>
                                            <Input
                                                id="respRG"
                                                value={responsavel.rg || ''}
                                                onChange={(e) => setResponsavel({ ...responsavel, rg: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="respOrgaoExpedidor">Órgão Expedidor</Label>
                                            <Input
                                                id="respOrgaoExpedidor"
                                                value={responsavel.orgaoExpedidor || ''}
                                                onChange={(e) => setResponsavel({ ...responsavel, orgaoExpedidor: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="estadoCivil">Estado Civil</Label>
                                            <Select
                                                value={responsavel.estadoCivil || ''}
                                                onValueChange={(value) => setResponsavel({ ...responsavel, estadoCivil: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                                                    <SelectItem value="CASADO">Casado(a)</SelectItem>
                                                    <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                                                    <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-semibold mb-4">Dados do Cônjuge</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="conjugeNome">Nome do Cônjuge</Label>
                                                <Input
                                                    id="conjugeNome"
                                                    value={responsavel.conjuge || ''}
                                                    onChange={(e) => setResponsavel({ ...responsavel, conjuge: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="conjugeCPF">CPF do Cônjuge</Label>
                                                <Input
                                                    id="conjugeCPF"
                                                    value={responsavel.cpfConjuge || ''}
                                                    onChange={(e) => setResponsavel({ ...responsavel, cpfConjuge: formatCPF(e.target.value) })}
                                                    maxLength={14}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="conjugeRG">RG do Cônjuge</Label>
                                                <Input
                                                    id="conjugeRG"
                                                    value={responsavel.rgConjuge || ''}
                                                    onChange={(e) => setResponsavel({ ...responsavel, rgConjuge: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="conjugeOrgaoExpedidor">Órgão Expedidor</Label>
                                                <Input
                                                    id="conjugeOrgaoExpedidor"
                                                    value={responsavel.orgaoExpedidorConjuge || ''}
                                                    onChange={(e) => setResponsavel({ ...responsavel, orgaoExpedidorConjuge: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="anamnese">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Anamnese</CardTitle>
                                    <CardDescription>
                                        Histórico médico do paciente
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries({
                                            febreReumatica: 'Febre Reumática',
                                            hepatite: 'Hepatite',
                                            diabetes: 'Diabetes',
                                            hipertensaoArterialSistemica: 'Hipertensão Arterial',
                                            portadorHiv: 'Portador de HIV',
                                            alteracaoCoagulacaoSanguinea: 'Alteração na Coagulação',
                                            reacoesAlergicas: 'Reações Alérgicas',
                                            doencasSistemicas: 'Doenças Sistêmicas',
                                            internacaoRecente: 'Internação Recente',
                                            utilizandoMedicacao: 'Utilizando Medicação',
                                            fumante: 'Fumante',
                                            bebidasAlcoolicas: 'Bebidas Alcoólicas',
                                            problemasCardiacos: 'Problemas Cardíacos',
                                            problemasRenais: 'Problemas Renais',
                                            problemasGastricos: 'Problemas Gástricos',
                                            problemasRespiratorios: 'Problemas Respiratórios',
                                            problemasAlergicos: 'Problemas Alérgicos',
                                            problemasArticularesOuReumatismo: 'Problemas Articulares/Reumatismo',
                                        }).map(([key, label]) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <Switch
                                                    id={key}
                                                    checked={anamnese[key as keyof namesRequest] as boolean}
                                                    onCheckedChange={(checked) => setAnamnese({ ...anamnese, [key]: checked })}
                                                />
                                                <Label htmlFor={key}>{label}</Label>
                                            </div>
                                        ))}
                                    </div>

                                    {anamnese.fumante && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fumanteQuantidade">Quantidade (cigarros/dia)</Label>
                                                <Input
                                                    id="fumanteQuantidade"
                                                    value={anamnese.fumanteQuantidade || ''}
                                                    onChange={(e) => setAnamnese({ ...anamnese, fumanteQuantidade: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="tempoFumo">Tempo que fuma</Label>
                                                <Input
                                                    id="tempoFumo"
                                                    value={anamnese.tempoFumo || ''}
                                                    onChange={(e) => setAnamnese({ ...anamnese, tempoFumo: e.target.value })}
                                                    placeholder="Ex: 5 anos"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {anamnese.problemasAlergicos && (
                                        <div className="space-y-2">
                                            <Label htmlFor="problemasAlergicosQuais">Quais alergias?</Label>
                                            <Input
                                                id="problemasAlergicosQuais"
                                                value={anamnese.problemasAlergicosQuais || ''}
                                                onChange={(e) => setAnamnese({ ...anamnese, problemasAlergicosQuais: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-4 border-t pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="queixaPrincipal">Queixa Principal</Label>
                                            <Textarea
                                                id="queixaPrincipal"
                                                value={anamnese.queixaPrincipal || ''}
                                                onChange={(e) => setAnamnese({ ...anamnese, queixaPrincipal: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="evolucaoDoencaAtual">Evolução da Doença Atual</Label>
                                            <Textarea
                                                id="evolucaoDoencaAtual"
                                                value={anamnese.evolucaoDoencaAtual || ''}
                                                onChange={(e) => setAnamnese({ ...anamnese, evolucaoDoencaAtual: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="convenio">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Convênio</CardTitle>
                                    <CardDescription>
                                        Dados do plano de saúde
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nomeConvenio">Nome do Convênio</Label>
                                            <Input
                                                id="nomeConvenio"
                                                value={convenio.nomeConvenio || ''}
                                                onChange={(e) => setConvenio({ ...convenio, nomeConvenio: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="numeroInscricao">Número de Inscrição</Label>
                                            <Input
                                                id="numeroInscricao"
                                                value={convenio.numeroInscricao || ''}
                                                onChange={(e) => setConvenio({ ...convenio, numeroInscricao: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="inspecao-bucal">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Inspeção Bucal</CardTitle>
                                    <CardDescription>
                                        Exame clínico bucal
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            'lingua', 'mucosa', 'palato', 'labios',
                                            'gengivas', 'nariz', 'face', 'ganglios', 'glandulasSalivares'
                                        ].map((field) => (
                                            <div key={field} className="space-y-2">
                                                <Label htmlFor={field} className="capitalize">
                                                    {field.replace(/([A-Z])/g, ' $1')}
                                                </Label>
                                                <Input
                                                    id={field}
                                                    value={inspecaoBucal[field as keyof InspecaoBucalRequest] || ''}
                                                    onChange={(e) => setInspecaoBucal({ ...inspecaoBucal, [field]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 border-t pt-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="alteracaoOclusao"
                                                checked={inspecaoBucal.alteracaoOclusao || false}
                                                onCheckedChange={(checked) => setInspecaoBucal({ ...inspecaoBucal, alteracaoOclusao: checked })}
                                            />
                                            <Label htmlFor="alteracaoOclusao">Alteração de Oclusão</Label>
                                        </div>
                                        {inspecaoBucal.alteracaoOclusao && (
                                            <div className="space-y-2">
                                                <Label htmlFor="alteracaoOclusaoTipo">Tipo de Alteração</Label>
                                                <Input
                                                    id="alteracaoOclusaoTipo"
                                                    value={inspecaoBucal.alteracaoOclusaoTipo || ''}
                                                    onChange={(e) => setInspecaoBucal({ ...inspecaoBucal, alteracaoOclusaoTipo: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="protese"
                                                checked={inspecaoBucal.protese || false}
                                                onCheckedChange={(checked) => setInspecaoBucal({ ...inspecaoBucal, protese: checked })}
                                            />
                                            <Label htmlFor="protese">Usa Prótese</Label>
                                        </div>
                                        {inspecaoBucal.protese && (
                                            <div className="space-y-2">
                                                <Label htmlFor="proteseTipo">Tipo de Prótese</Label>
                                                <Input
                                                    id="proteseTipo"
                                                    value={inspecaoBucal.proteseTipo || ''}
                                                    onChange={(e) => setInspecaoBucal({ ...inspecaoBucal, proteseTipo: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="outrasObservacoes">Outras Observações</Label>
                                            <Textarea
                                                id="outrasObservacoes"
                                                value={inspecaoBucal.outrasObservacoes || ''}
                                                onChange={(e) => setInspecaoBucal({ ...inspecaoBucal, outrasObservacoes: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="questionario-saude">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Questionário de Saúde</CardTitle>
                                    <CardDescription>
                                        Informações gerais de saúde
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            'sofreDoenca',
                                            'tratamentoMedicoAtual',
                                            'gravidez',
                                            'usoMedicacao',
                                            'teveAlergia',
                                            'foiOperado',
                                            'problemasCicatrizacao',
                                            'problemasAnestesia',
                                            'problemasHemorragia',
                                        ].map((field) => (
                                            <div key={field} className="flex items-center space-x-2">
                                                <Switch
                                                    id={field}
                                                    checked={questionarioSaude[field as keyof QuestionarioSaudeRequest] as boolean}
                                                    onCheckedChange={(checked) => setQuestionarioSaude({ ...questionarioSaude, [field]: checked })}
                                                />
                                                <Label htmlFor={field} className="capitalize">
                                                    {field.replace(/([A-Z])/g, ' $1')}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                        {questionarioSaude.sofreDoenca && (
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="sofreDoencaQuais">Quais doenças?</Label>
                                                <Input
                                                    id="sofreDoencaQuais"
                                                    value={questionarioSaude.sofreDoencaQuais || ''}
                                                    onChange={(e) => setQuestionarioSaude({ ...questionarioSaude, sofreDoencaQuais: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {questionarioSaude.usoMedicacao && (
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="usoMedicacaoQuais">Quais medicações?</Label>
                                                <Input
                                                    id="usoMedicacaoQuais"
                                                    value={questionarioSaude.usoMedicacaoQuais || ''}
                                                    onChange={(e) => setQuestionarioSaude({ ...questionarioSaude, usoMedicacaoQuais: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {questionarioSaude.teveAlergia && (
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="teveAlergiaQuais">Quais alergias?</Label>
                                                <Input
                                                    id="teveAlergiaQuais"
                                                    value={questionarioSaude.teveAlergiaQuais || ''}
                                                    onChange={(e) => setQuestionarioSaude({ ...questionarioSaude, teveAlergiaQuais: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {questionarioSaude.foiOperado && (
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="foiOperadoQuais">Quais cirurgias?</Label>
                                                <Input
                                                    id="foiOperadoQuais"
                                                    value={questionarioSaude.foiOperadoQuais || ''}
                                                    onChange={(e) => setQuestionarioSaude({ ...questionarioSaude, foiOperadoQuais: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="medicoAssistenteTelefone">Telefone do Médico Assistente</Label>
                                            <Input
                                                id="medicoAssistenteTelefone"
                                                value={questionarioSaude.medicoAssistenteTelefone || ''}
                                                onChange={(e) => setQuestionarioSaude({ ...questionarioSaude, medicoAssistenteTelefone: formatPhone(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="habitos">Hábitos</Label>
                                            <Textarea
                                                id="habitos"
                                                value={questionarioSaude.habitos || ''}
                                                onChange={(e) => setQuestionarioSaude({ ...questionarioSaude, habitos: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="antecedentesFamiliares">Antecedentes Familiares</Label>
                                            <Textarea
                                                id="antecedentesFamiliares"
                                                value={questionarioSaude.antecedentesFamiliares || ''}
                                                onChange={(e) => setQuestionarioSaude({ ...questionarioSaude, antecedentesFamiliares: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
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
                            onClick={() => router.back()}
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
                                    Salvar Paciente
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}