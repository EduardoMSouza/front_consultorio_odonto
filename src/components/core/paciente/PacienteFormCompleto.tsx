// components/pacientes/PacienteFormCompleto.tsx
import React, { useState } from 'react';
import { DadosBasicos, Responsavel, Anamnese, Convenio, InspecaoBucal, QuestionarioSaude } from '@/models/paciente.model';
import { ChevronDown, ChevronUp, User, FileText, Calendar, Phone, MapPin, Users, Shield, Heart, Activity, Eye, Stethoscope, ClipboardCheck } from 'lucide-react';

// Tipos para as seções do formulário
type FormSection = 'dadosBasicos' | 'responsavel' | 'anamnese' | 'convenio' | 'inspecaoBucal' | 'questionarioSaude';

interface PacienteFormCompletoProps {
    formData: {
        dadosBasicos: Required<DadosBasicos>;
        responsavel: Required<Responsavel>;
        anamnese: Required<Anamnese>;
        convenio: Required<Convenio>;
        inspecaoBucal: Required<InspecaoBucal>;
        questionarioSaude: Required<QuestionarioSaude>;
    };
    errors: Record<string, string>;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        section?: FormSection
    ) => void;
    onSubmit: (e: React.FormEvent) => void;
    isEditing?: boolean;
    loading?: boolean;
}

export const PacienteFormCompleto: React.FC<PacienteFormCompletoProps> = ({
                                                                              formData,
                                                                              errors,
                                                                              onChange,
                                                                              onSubmit,
                                                                              isEditing = false,
                                                                              loading = false,
                                                                          }) => {
    const [expandedSections, setExpandedSections] = useState<Record<FormSection, boolean>>({
        dadosBasicos: true,
        convenio: true,
        responsavel: false,
        anamnese: false,
        inspecaoBucal: false,
        questionarioSaude: false,
    });

    const toggleSection = (section: FormSection) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const renderError = (field: string) => {
        return errors[field] ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field]}</p>
        ) : null;
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
            {/* Dados Básicos */}
            <section className="glass-card rounded-xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('dadosBasicos')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-primary/5 hover:bg-primary/10 transition-base"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Dados Básicos</h2>
                    </div>
                    {expandedSections.dadosBasicos ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
                </button>
                {expandedSections.dadosBasicos && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.dadosBasicos.nome}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                    required
                                />
                                {renderError('dadosBasicos.nome')}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Nº Prontuário</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <input
                                        type="text"
                                        name="prontuarioNumero"
                                        value={formData.dadosBasicos.prontuarioNumero}
                                        onChange={(e) => onChange(e, 'dadosBasicos')}
                                        className="w-full pl-10 pr-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.dadosBasicos.cpf}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                    maxLength={14}
                                />
                                {renderError('dadosBasicos.cpf')}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">RG</label>
                                <input
                                    type="text"
                                    name="rg"
                                    value={formData.dadosBasicos.rg}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Órgão Expedidor</label>
                                <input
                                    type="text"
                                    name="orgaoExpedidor"
                                    value={formData.dadosBasicos.orgaoExpedidor}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Data de Nascimento
                                    </div>
                                </label>
                                <input
                                    type="date"
                                    name="dataNascimento"
                                    value={formData.dadosBasicos.dataNascimento}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Telefone
                                    </div>
                                </label>
                                <input
                                    type="tel"
                                    name="telefone"
                                    value={formData.dadosBasicos.telefone}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Naturalidade</label>
                                <input
                                    type="text"
                                    name="naturalidade"
                                    value={formData.dadosBasicos.naturalidade}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Nacionalidade</label>
                                <input
                                    type="text"
                                    name="nacionalidade"
                                    value={formData.dadosBasicos.nacionalidade}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Profissão</label>
                                <input
                                    type="text"
                                    name="profissao"
                                    value={formData.dadosBasicos.profissao}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Endereço Residencial
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    name="enderecoResidencial"
                                    value={formData.dadosBasicos.enderecoResidencial}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Indicado Por</label>
                                <input
                                    type="text"
                                    name="indicadoPor"
                                    value={formData.dadosBasicos.indicadoPor}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div className="flex items-center pt-2">
                                <input
                                    type="checkbox"
                                    id="status"
                                    name="status"
                                    checked={formData.dadosBasicos.status}
                                    onChange={(e) => onChange(e, 'dadosBasicos')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="status" className="ml-2 block text-sm text-foreground">
                                    Paciente Ativo
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Convênio */}
            <section className="glass-card rounded-xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('convenio')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-accent/5 hover:bg-accent/10 transition-base"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <Shield className="w-5 h-5 text-accent" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Convênio</h2>
                    </div>
                    {expandedSections.convenio ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
                </button>
                {expandedSections.convenio && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Nome do Convênio</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.convenio.nome}
                                    onChange={(e) => onChange(e, 'convenio')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Número de Inscrição</label>
                                <input
                                    type="text"
                                    name="numeroInscricao"
                                    value={formData.convenio.numeroInscricao}
                                    onChange={(e) => onChange(e, 'convenio')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Responsável */}
            <section className="glass-card rounded-xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('responsavel')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-secondary/50 hover:bg-secondary/70 transition-base"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-lg">
                            <Users className="w-5 h-5 text-secondary-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Responsável Legal</h2>
                    </div>
                    {expandedSections.responsavel ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
                </button>
                {expandedSections.responsavel && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.responsavel.nome}
                                    onChange={(e) => onChange(e, 'responsavel')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">RG</label>
                                <input
                                    type="text"
                                    name="rg"
                                    value={formData.responsavel.rg}
                                    onChange={(e) => onChange(e, 'responsavel')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.responsavel.cpf}
                                    onChange={(e) => onChange(e, 'responsavel')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Estado Civil</label>
                                <select
                                    name="estadoCivil"
                                    value={formData.responsavel.estadoCivil}
                                    onChange={(e) => onChange(e, 'responsavel')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="SOLTEIRO">Solteiro(a)</option>
                                    <option value="CASADO">Casado(a)</option>
                                    <option value="DIVORCIADO">Divorciado(a)</option>
                                    <option value="VIUVO">Viúvo(a)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Nome do Cônjuge</label>
                                <input
                                    type="text"
                                    name="conjuge"
                                    value={formData.responsavel.conjuge}
                                    onChange={(e) => onChange(e, 'responsavel')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">RG do Cônjuge</label>
                                <input
                                    type="text"
                                    name="rgConjuge"
                                    value={formData.responsavel.rgConjuge}
                                    onChange={(e) => onChange(e, 'responsavel')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">CPF do Cônjuge</label>
                                <input
                                    type="text"
                                    name="cpfConjuge"
                                    value={formData.responsavel.cpfConjuge}
                                    onChange={(e) => onChange(e, 'responsavel')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Anamnese */}
            <section className="glass-card rounded-xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('anamnese')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-red-500/5 hover:bg-red-500/10 transition-base"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Anamnese</h2>
                    </div>
                    {expandedSections.anamnese ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
                </button>
                {expandedSections.anamnese && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { name: 'febreReumatica', label: 'Febre Reumática' },
                                { name: 'hepatite', label: 'Hepatite' },
                                { name: 'diabetes', label: 'Diabetes' },
                                { name: 'hipertensaoArterialSistemica', label: 'Hipertensão Arterial' },
                                { name: 'portadorHiv', label: 'Portador de HIV' },
                                { name: 'alteracaoCoagulacaoSanguinea', label: 'Alteração de Coagulação' },
                                { name: 'reacoesAlergicas', label: 'Reações Alérgicas' },
                                { name: 'doencasSistemicas', label: 'Doenças Sistêmicas' },
                                { name: 'internacaoRecente', label: 'Internação Recente' },
                                { name: 'utilizandoMedicacao', label: 'Utilizando Medicação' },
                                { name: 'fumante', label: 'Fumante' },
                                { name: 'bebidasAlcoolicas', label: 'Bebidas Alcoólicas' },
                                { name: 'problemasCardiacos', label: 'Problemas Cardíacos' },
                                { name: 'problemasRenais', label: 'Problemas Renais' },
                                { name: 'problemasGastricos', label: 'Problemas Gástricos' },
                                { name: 'problemasRespiratorios', label: 'Problemas Respiratórios' },
                                { name: 'problemasAlergicos', label: 'Problemas Alérgicos' },
                                { name: 'problemasArticularesOuReumatismo', label: 'Problemas Articulares' },
                            ].map(({ name, label }) => (
                                <div key={name} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`anamnese-${name}`}
                                        name={name}
                                        checked={formData.anamnese[name as keyof Anamnese] as boolean}
                                        onChange={(e) => onChange(e, 'anamnese')}
                                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                    />
                                    <label htmlFor={`anamnese-${name}`} className="ml-2 block text-sm text-foreground">
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Queixa Principal</label>
                                <textarea
                                    name="queixaPrincipal"
                                    value={formData.anamnese.queixaPrincipal}
                                    onChange={(e) => onChange(e, 'anamnese')}
                                    rows={3}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Evolução da Doença Atual</label>
                                <textarea
                                    name="evolucaoDoencaAtual"
                                    value={formData.anamnese.evolucaoDoencaAtual}
                                    onChange={(e) => onChange(e, 'anamnese')}
                                    rows={3}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Inspeção Bucal */}
            <section className="glass-card rounded-xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('inspecaoBucal')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-blue-500/5 hover:bg-blue-500/10 transition-base"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Inspeção Bucal</h2>
                    </div>
                    {expandedSections.inspecaoBucal ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
                </button>
                {expandedSections.inspecaoBucal && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Língua</label>
                                <input
                                    type="text"
                                    name="lingua"
                                    value={formData.inspecaoBucal.lingua}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Mucosa</label>
                                <input
                                    type="text"
                                    name="mucosa"
                                    value={formData.inspecaoBucal.mucosa}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Palato</label>
                                <input
                                    type="text"
                                    name="palato"
                                    value={formData.inspecaoBucal.palato}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Lábios</label>
                                <input
                                    type="text"
                                    name="labios"
                                    value={formData.inspecaoBucal.labios}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Gengivas</label>
                                <input
                                    type="text"
                                    name="gengivas"
                                    value={formData.inspecaoBucal.gengivas}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Nariz</label>
                                <input
                                    type="text"
                                    name="nariz"
                                    value={formData.inspecaoBucal.nariz}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Face</label>
                                <input
                                    type="text"
                                    name="face"
                                    value={formData.inspecaoBucal.face}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Gânglios</label>
                                <input
                                    type="text"
                                    name="ganglios"
                                    value={formData.inspecaoBucal.ganglios}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Glândulas Salivares</label>
                                <input
                                    type="text"
                                    name="glandulasSalivares"
                                    value={formData.inspecaoBucal.glandulasSalivares}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="alteracaoOclusao"
                                    name="alteracaoOclusao"
                                    checked={formData.inspecaoBucal.alteracaoOclusao}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="alteracaoOclusao" className="ml-2 block text-sm text-foreground">
                                    Alteração de Oclusão
                                </label>
                            </div>

                            {formData.inspecaoBucal.alteracaoOclusao && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Tipo de Alteração</label>
                                    <input
                                        type="text"
                                        name="alteracaoOclusaoTipo"
                                        value={formData.inspecaoBucal.alteracaoOclusaoTipo}
                                        onChange={(e) => onChange(e, 'inspecaoBucal')}
                                        className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="protese"
                                    name="protese"
                                    checked={formData.inspecaoBucal.protese}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="protese" className="ml-2 block text-sm text-foreground">
                                    Usa Prótese
                                </label>
                            </div>

                            {formData.inspecaoBucal.protese && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Tipo de Prótese</label>
                                    <input
                                        type="text"
                                        name="proteseTipo"
                                        value={formData.inspecaoBucal.proteseTipo}
                                        onChange={(e) => onChange(e, 'inspecaoBucal')}
                                        className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-1">Outras Observações</label>
                                <textarea
                                    name="outrasObservacoes"
                                    value={formData.inspecaoBucal.outrasObservacoes}
                                    onChange={(e) => onChange(e, 'inspecaoBucal')}
                                    rows={3}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Questionário de Saúde */}
            <section className="glass-card rounded-xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('questionarioSaude')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-emerald-500/5 hover:bg-emerald-500/10 transition-base"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Questionário de Saúde</h2>
                    </div>
                    {expandedSections.questionarioSaude ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
                </button>
                {expandedSections.questionarioSaude && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="sofreDoenca"
                                    name="sofreDoenca"
                                    checked={formData.questionarioSaude.sofreDoenca}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="sofreDoenca" className="ml-2 block text-sm text-foreground">
                                    Sofre de Doença
                                </label>
                            </div>

                            {formData.questionarioSaude.sofreDoenca && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Quais Doenças</label>
                                    <input
                                        type="text"
                                        name="sofreDoencaQuais"
                                        value={formData.questionarioSaude.sofreDoencaQuais}
                                        onChange={(e) => onChange(e, 'questionarioSaude')}
                                        className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="tratamentoMedicoAtual"
                                    name="tratamentoMedicoAtual"
                                    checked={formData.questionarioSaude.tratamentoMedicoAtual}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="tratamentoMedicoAtual" className="ml-2 block text-sm text-foreground">
                                    Em Tratamento Médico Atual
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="gravidez"
                                    name="gravidez"
                                    checked={formData.questionarioSaude.gravidez}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="gravidez" className="ml-2 block text-sm text-foreground">
                                    Gravidez
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="usoMedicacao"
                                    name="usoMedicacao"
                                    checked={formData.questionarioSaude.usoMedicacao}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="usoMedicacao" className="ml-2 block text-sm text-foreground">
                                    Usa Medicação
                                </label>
                            </div>

                            {formData.questionarioSaude.usoMedicacao && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-foreground mb-1">Quais Medicações</label>
                                    <input
                                        type="text"
                                        name="usoMedicacaoQuais"
                                        value={formData.questionarioSaude.usoMedicacaoQuais}
                                        onChange={(e) => onChange(e, 'questionarioSaude')}
                                        className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Médico Assistente/Telefone</label>
                                <input
                                    type="text"
                                    name="medicoAssistenteTelefone"
                                    value={formData.questionarioSaude.medicoAssistenteTelefone}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="teveAlergia"
                                    name="teveAlergia"
                                    checked={formData.questionarioSaude.teveAlergia}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="teveAlergia" className="ml-2 block text-sm text-foreground">
                                    Teve Alergia
                                </label>
                            </div>

                            {formData.questionarioSaude.teveAlergia && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Quais Alergias</label>
                                    <input
                                        type="text"
                                        name="teveAlergiaQuais"
                                        value={formData.questionarioSaude.teveAlergiaQuais}
                                        onChange={(e) => onChange(e, 'questionarioSaude')}
                                        className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="foiOperado"
                                    name="foiOperado"
                                    checked={formData.questionarioSaude.foiOperado}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="foiOperado" className="ml-2 block text-sm text-foreground">
                                    Foi Operado
                                </label>
                            </div>

                            {formData.questionarioSaude.foiOperado && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Quais Operações</label>
                                    <input
                                        type="text"
                                        name="foiOperadoQuais"
                                        value={formData.questionarioSaude.foiOperadoQuais}
                                        onChange={(e) => onChange(e, 'questionarioSaude')}
                                        className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="problemasCicatrizacao"
                                    name="problemasCicatrizacao"
                                    checked={formData.questionarioSaude.problemasCicatrizacao}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="problemasCicatrizacao" className="ml-2 block text-sm text-foreground">
                                    Problemas com Cicatrização
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="problemasAnestesia"
                                    name="problemasAnestesia"
                                    checked={formData.questionarioSaude.problemasAnestesia}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="problemasAnestesia" className="ml-2 block text-sm text-foreground">
                                    Problemas com Anestesia
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="problemasHemorragia"
                                    name="problemasHemorragia"
                                    checked={formData.questionarioSaude.problemasHemorragia}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded focus-ring"
                                />
                                <label htmlFor="problemasHemorragia" className="ml-2 block text-sm text-foreground">
                                    Problemas com Hemorragia
                                </label>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-1">Hábitos</label>
                                <textarea
                                    name="habitos"
                                    value={formData.questionarioSaude.habitos}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    rows={2}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-1">Antecedentes Familiares</label>
                                <textarea
                                    name="antecedentesFamiliares"
                                    value={formData.questionarioSaude.antecedentesFamiliares}
                                    onChange={(e) => onChange(e, 'questionarioSaude')}
                                    rows={2}
                                    className="w-full px-3 py-2.5 input-emerald rounded-lg focus-ring transition-base"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-6">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2.5 border border-border bg-background rounded-lg text-foreground hover:bg-secondary transition-base focus-ring"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 btn-emerald rounded-lg font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Salvando...
                        </div>
                    ) : isEditing ? 'Atualizar Paciente' : 'Cadastrar Paciente'}
                </button>
            </div>
        </form>
    );
};