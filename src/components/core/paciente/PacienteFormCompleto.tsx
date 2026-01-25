// components/core/paciente/PacienteFormCompleto.tsx
import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronUp, Eye, Heart, Shield, Stethoscope, User, Users} from 'lucide-react';
import {
    AnamneseRequest,
    DadosBasicosRequest,
    EstCivilOptions,
    InspecaoBucalRequest,
    NacionalidadeOptions,
    PacienteRequest,
    ProfissaoOptions
} from '@/lib/types/paciente/paciente.types';
import {cleanDocument, formatCPFInput, formatPhoneInput, formatRGInput} from '@/lib/utils/document.utils';
import {usePaciente} from '@/lib/hooks/usePaciente';
import {validatePaciente} from "@/lib/utils/validators/paciente.validator";
import {hasValidationErrors} from "@/lib/utils/validators/dentista.validator";


type FormSection = 'dadosBasicos' | 'responsavel' | 'anamnese' | 'convenio' | 'inspecaoBucal' | 'questionarioSaude';

interface PacienteFormCompletoProps {
    initialData?: PacienteRequest;
    pacienteId?: number;
    isEditing?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const PacienteFormCompleto: React.FC<PacienteFormCompletoProps> = ({
                                                                              initialData,
                                                                              pacienteId,
                                                                              isEditing = false,
                                                                              onSuccess,
                                                                              onCancel
                                                                          }) => {
    const { criar, atualizar, loading } = usePaciente(pacienteId);

    const [formData, setFormData] = useState<PacienteRequest>({
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
            status: true
        },
        responsavel: undefined,
        anamnese: undefined,
        convenio: undefined,
        inspecaoBucal: undefined,
        questionarioSaude: undefined,
        observacoes: ''
    });

    const [errors, setErrors] = useState<PacienteValidationErrors>({});
    const [formattedValues, setFormattedValues] = useState<Record<string, string>>({});

    const [expandedSections, setExpandedSections] = useState<Record<FormSection, boolean>>({
        dadosBasicos: true,
        convenio: true,
        responsavel: false,
        anamnese: false,
        inspecaoBucal: false,
        questionarioSaude: false,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const toggleSection = (section: FormSection) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        section?: FormSection
    ) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const actualValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => {
            if (section && section !== 'observacoes') {
                const sectionData = prev[section] || {};
                return {
                    ...prev,
                    [section]: {
                        ...sectionData,
                        [name]: actualValue
                    }
                };
            } else if (name === 'observacoes') {
                return {
                    ...prev,
                    observacoes: value
                };
            } else {
                return {
                    ...prev,
                    dadosBasicos: {
                        ...prev.dadosBasicos,
                        [name]: actualValue
                    }
                };
            }
        });

        // Aplica formatação para campos específicos
        if (name === 'cpf' && !isCheckbox) {
            setFormattedValues(prev => ({ ...prev, [name]: formatCPFInput(value) }));
        } else if (name === 'rg' && !isCheckbox) {
            setFormattedValues(prev => ({ ...prev, [name]: formatRGInput(value) }));
        } else if (name === 'telefone' && !isCheckbox) {
            setFormattedValues(prev => ({ ...prev, [name]: formatPhoneInput(value) }));
        }

        // Limpa erro do campo quando usuário começa a digitar
        if (errors.dadosBasicos?.[name as keyof typeof errors.dadosBasicos]) {
            setErrors(prev => ({
                ...prev,
                dadosBasicos: {
                    ...prev.dadosBasicos,
                    [name]: undefined
                }
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Limpa formatação dos valores antes de validar
        const dataToValidate = { ...formData };
        if (dataToValidate.dadosBasicos.cpf) {
            dataToValidate.dadosBasicos.cpf = cleanDocument(dataToValidate.dadosBasicos.cpf);
        }
        if (dataToValidate.dadosBasicos.rg) {
            dataToValidate.dadosBasicos.rg = cleanDocument(dataToValidate.dadosBasicos.rg);
        }
        if (dataToValidate.dadosBasicos.telefone) {
            dataToValidate.dadosBasicos.telefone = cleanDocument(dataToValidate.dadosBasicos.telefone);
        }

        const validationErrors = validatePaciente(dataToValidate);
        setErrors(validationErrors);

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        try {
            if (isEditing && pacienteId) {
                await atualizar(pacienteId, dataToValidate);
            } else {
                await criar(dataToValidate);
            }
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar paciente:', error);
        }
    };

    const renderError = (section: keyof PacienteValidationErrors, field: string) => {
        const sectionErrors = errors[section];
        if (sectionErrors && sectionErrors[field as keyof typeof sectionErrors]) {
            return (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {sectionErrors[field as keyof typeof sectionErrors]}
                </p>
            );
        }
        return null;
    };

    const getDisplayValue = (field: string): string => {
        return formattedValues[field] || (formData.dadosBasicos[field as keyof DadosBasicosRequest] as string) || '';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Básicos */}
            <section className="rounded-xl overflow-hidden border">
                <button
                    type="button"
                    onClick={() => toggleSection('dadosBasicos')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Dados Básicos</h2>
                    </div>
                    {expandedSections.dadosBasicos ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.dadosBasicos && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome Completo *</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.dadosBasicos.nome}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                                {renderError('dadosBasicos', 'nome')}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nº Prontuário *</label>
                                <input
                                    type="text"
                                    name="prontuarioNumero"
                                    value={formData.dadosBasicos.prontuarioNumero}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                                {renderError('dadosBasicos', 'prontuarioNumero')}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={getDisplayValue('cpf')}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                    maxLength={14}
                                />
                                {renderError('dadosBasicos', 'cpf')}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">RG</label>
                                <input
                                    type="text"
                                    name="rg"
                                    value={getDisplayValue('rg')}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Órgão Expedidor</label>
                                <input
                                    type="text"
                                    name="orgaoExpedidor"
                                    value={formData.dadosBasicos.orgaoExpedidor || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Data de Nascimento *</label>
                                <input
                                    type="date"
                                    name="dataNascimento"
                                    value={formData.dadosBasicos.dataNascimento}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                                {renderError('dadosBasicos', 'dataNascimento')}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Telefone</label>
                                <input
                                    type="tel"
                                    name="telefone"
                                    value={getDisplayValue('telefone')}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                    maxLength={15}
                                />
                                {renderError('dadosBasicos', 'telefone')}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Naturalidade</label>
                                <input
                                    type="text"
                                    name="naturalidade"
                                    value={formData.dadosBasicos.naturalidade || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nacionalidade</label>
                                <select
                                    name="nacionalidade"
                                    value={formData.dadosBasicos.nacionalidade || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Selecione...</option>
                                    {NacionalidadeOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Profissão</label>
                                <select
                                    name="profissao"
                                    value={formData.dadosBasicos.profissao || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Selecione...</option>
                                    {ProfissaoOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Endereço Residencial</label>
                                <input
                                    type="text"
                                    name="enderecoResidencial"
                                    value={formData.dadosBasicos.enderecoResidencial || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Indicado Por</label>
                                <input
                                    type="text"
                                    name="indicadoPor"
                                    value={formData.dadosBasicos.indicadoPor || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="flex items-center pt-2">
                                <input
                                    type="checkbox"
                                    id="status"
                                    name="status"
                                    checked={formData.dadosBasicos.status}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="status" className="ml-2 block text-sm">
                                    Paciente Ativo
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Convênio */}
            <section className="rounded-xl overflow-hidden border">
                <button
                    type="button"
                    onClick={() => toggleSection('convenio')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">Convênio</h2>
                    </div>
                    {expandedSections.convenio ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.convenio && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome do Convênio</label>
                                <input
                                    type="text"
                                    name="nomeConvenio"
                                    value={formData.convenio?.nomeConvenio || ''}
                                    onChange={(e) => handleInputChange(e, 'convenio')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Número de Inscrição</label>
                                <input
                                    type="text"
                                    name="numeroInscricao"
                                    value={formData.convenio?.numeroInscricao || ''}
                                    onChange={(e) => handleInputChange(e, 'convenio')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Responsável */}
            <section className="rounded-xl overflow-hidden border">
                <button
                    type="button"
                    onClick={() => toggleSection('responsavel')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">Responsável Legal</h2>
                    </div>
                    {expandedSections.responsavel ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.responsavel && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.responsavel?.nome || ''}
                                    onChange={(e) => handleInputChange(e, 'responsavel')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">RG</label>
                                <input
                                    type="text"
                                    name="rg"
                                    value={formData.responsavel?.rg || ''}
                                    onChange={(e) => handleInputChange(e, 'responsavel')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.responsavel?.cpf || ''}
                                    onChange={(e) => handleInputChange(e, 'responsavel')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Estado Civil</label>
                                <select
                                    name="estadoCivil"
                                    value={formData.responsavel?.estadoCivil || ''}
                                    onChange={(e) => handleInputChange(e, 'responsavel')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">Selecione...</option>
                                    {EstCivilOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nome do Cônjuge</label>
                                <input
                                    type="text"
                                    name="conjuge"
                                    value={formData.responsavel?.conjuge || ''}
                                    onChange={(e) => handleInputChange(e, 'responsavel')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">RG do Cônjuge</label>
                                <input
                                    type="text"
                                    name="rgConjuge"
                                    value={formData.responsavel?.rgConjuge || ''}
                                    onChange={(e) => handleInputChange(e, 'responsavel')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">CPF do Cônjuge</label>
                                <input
                                    type="text"
                                    name="cpfConjuge"
                                    value={formData.responsavel?.cpfConjuge || ''}
                                    onChange={(e) => handleInputChange(e, 'responsavel')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Anamnese */}
            <section className="rounded-xl overflow-hidden border">
                <button
                    type="button"
                    onClick={() => toggleSection('anamnese')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-50"
                >
                    <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-500" />
                        <h2 className="text-xl font-semibold">Anamnese</h2>
                    </div>
                    {expandedSections.anamnese ? <ChevronUp /> : <ChevronDown />}
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
                                        checked={formData.anamnese?.[name as keyof AnamneseRequest] as boolean || false}
                                        onChange={(e) => handleInputChange(e, 'anamnese')}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label htmlFor={`anamnese-${name}`} className="ml-2 block text-sm">
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Queixa Principal</label>
                                <textarea
                                    name="queixaPrincipal"
                                    value={formData.anamnese?.queixaPrincipal || ''}
                                    onChange={(e) => handleInputChange(e, 'anamnese')}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Evolução da Doença Atual</label>
                                <textarea
                                    name="evolucaoDoencaAtual"
                                    value={formData.anamnese?.evolucaoDoencaAtual || ''}
                                    onChange={(e) => handleInputChange(e, 'anamnese')}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            {formData.anamnese?.fumante && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Quantidade de Cigarros</label>
                                        <input
                                            type="text"
                                            name="fumanteQuantidade"
                                            value={formData.anamnese.fumanteQuantidade || ''}
                                            onChange={(e) => handleInputChange(e, 'anamnese')}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tempo de Fumo</label>
                                        <input
                                            type="text"
                                            name="tempoFumo"
                                            value={formData.anamnese.tempoFumo || ''}
                                            onChange={(e) => handleInputChange(e, 'anamnese')}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.anamnese?.problemasAlergicos && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quais Problemas Alérgicos</label>
                                    <input
                                        type="text"
                                        name="problemasAlergicosQuais"
                                        value={formData.anamnese.problemasAlergicosQuais || ''}
                                        onChange={(e) => handleInputChange(e, 'anamnese')}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Inspeção Bucal */}
            <section className="rounded-xl overflow-hidden border">
                <button
                    type="button"
                    onClick={() => toggleSection('inspecaoBucal')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50"
                >
                    <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-semibold">Inspeção Bucal</h2>
                    </div>
                    {expandedSections.inspecaoBucal ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.inspecaoBucal && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'lingua', label: 'Língua' },
                                { name: 'mucosa', label: 'Mucosa' },
                                { name: 'palato', label: 'Palato' },
                                { name: 'labios', label: 'Lábios' },
                                { name: 'gengivas', label: 'Gengivas' },
                                { name: 'nariz', label: 'Nariz' },
                                { name: 'face', label: 'Face' },
                                { name: 'ganglios', label: 'Gânglios' },
                                { name: 'glandulasSalivares', label: 'Glândulas Salivares' },
                            ].map(({ name, label }) => (
                                <div key={name}>
                                    <label className="block text-sm font-medium mb-1">{label}</label>
                                    <input
                                        type="text"
                                        name={name}
                                        value={formData.inspecaoBucal?.[name as keyof InspecaoBucalRequest] as string || ''}
                                        onChange={(e) => handleInputChange(e, 'inspecaoBucal')}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            ))}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="alteracaoOclusao"
                                    name="alteracaoOclusao"
                                    checked={formData.inspecaoBucal?.alteracaoOclusao || false}
                                    onChange={(e) => handleInputChange(e, 'inspecaoBucal')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="alteracaoOclusao" className="ml-2 block text-sm">
                                    Alteração de Oclusão
                                </label>
                            </div>

                            {formData.inspecaoBucal?.alteracaoOclusao && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tipo de Alteração</label>
                                    <input
                                        type="text"
                                        name="alteracaoOclusaoTipo"
                                        value={formData.inspecaoBucal.alteracaoOclusaoTipo || ''}
                                        onChange={(e) => handleInputChange(e, 'inspecaoBucal')}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="protese"
                                    name="protese"
                                    checked={formData.inspecaoBucal?.protese || false}
                                    onChange={(e) => handleInputChange(e, 'inspecaoBucal')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="protese" className="ml-2 block text-sm">
                                    Usa Prótese
                                </label>
                            </div>

                            {formData.inspecaoBucal?.protese && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tipo de Prótese</label>
                                    <input
                                        type="text"
                                        name="proteseTipo"
                                        value={formData.inspecaoBucal.proteseTipo || ''}
                                        onChange={(e) => handleInputChange(e, 'inspecaoBucal')}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Outras Observações</label>
                                <textarea
                                    name="outrasObservacoes"
                                    value={formData.inspecaoBucal?.outrasObservacoes || ''}
                                    onChange={(e) => handleInputChange(e, 'inspecaoBucal')}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Questionário de Saúde */}
            <section className="rounded-xl overflow-hidden border">
                <button
                    type="button"
                    onClick={() => toggleSection('questionarioSaude')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-emerald-50"
                >
                    <div className="flex items-center gap-3">
                        <Stethoscope className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-xl font-semibold">Questionário de Saúde</h2>
                    </div>
                    {expandedSections.questionarioSaude ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.questionarioSaude && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="sofreDoenca"
                                    name="sofreDoenca"
                                    checked={formData.questionarioSaude?.sofreDoenca || false}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="sofreDoenca" className="ml-2 block text-sm">
                                    Sofre de Doença
                                </label>
                            </div>

                            {formData.questionarioSaude?.sofreDoenca && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quais Doenças</label>
                                    <input
                                        type="text"
                                        name="sofreDoencaQuais"
                                        value={formData.questionarioSaude.sofreDoencaQuais || ''}
                                        onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="tratamentoMedicoAtual"
                                    name="tratamentoMedicoAtual"
                                    checked={formData.questionarioSaude?.tratamentoMedicoAtual || false}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="tratamentoMedicoAtual" className="ml-2 block text-sm">
                                    Em Tratamento Médico Atual
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="gravidez"
                                    name="gravidez"
                                    checked={formData.questionarioSaude?.gravidez || false}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="gravidez" className="ml-2 block text-sm">
                                    Gravidez
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="usoMedicacao"
                                    name="usoMedicacao"
                                    checked={formData.questionarioSaude?.usoMedicacao || false}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="usoMedicacao" className="ml-2 block text-sm">
                                    Usa Medicação
                                </label>
                            </div>

                            {formData.questionarioSaude?.usoMedicacao && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Quais Medicações</label>
                                    <input
                                        type="text"
                                        name="usoMedicacaoQuais"
                                        value={formData.questionarioSaude.usoMedicacaoQuais || ''}
                                        onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Médico Assistente/Telefone</label>
                                <input
                                    type="text"
                                    name="medicoAssistenteTelefone"
                                    value={formData.questionarioSaude?.medicoAssistenteTelefone || ''}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="teveAlergia"
                                    name="teveAlergia"
                                    checked={formData.questionarioSaude?.teveAlergia || false}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="teveAlergia" className="ml-2 block text-sm">
                                    Teve Alergia
                                </label>
                            </div>

                            {formData.questionarioSaude?.teveAlergia && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quais Alergias</label>
                                    <input
                                        type="text"
                                        name="teveAlergiaQuais"
                                        value={formData.questionarioSaude.teveAlergiaQuais || ''}
                                        onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="foiOperado"
                                    name="foiOperado"
                                    checked={formData.questionarioSaude?.foiOperado || false}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="foiOperado" className="ml-2 block text-sm">
                                    Foi Operado
                                </label>
                            </div>

                            {formData.questionarioSaude?.foiOperado && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quais Operações</label>
                                    <input
                                        type="text"
                                        name="foiOperadoQuais"
                                        value={formData.questionarioSaude.foiOperadoQuais || ''}
                                        onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="problemasCicatrizacao"
                                    name="problemasCicatrizacao"
                                    checked={formData.questionarioSaude?.problemasCicatrizacao || false}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="problemasCicatrizacao" className="ml-2 block text-sm">
                                    Problemas com Cicatrização
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="problemasAnestesia"
                                    name="problemasAnestesia"
                                    checked={formData.questionarioSaude?.problemasAnestesia || false}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="problemasAnestesia" className="ml-2 block text-sm">
                                    Problemas com Anestesia
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="problemasHemorragia"
                                    name="problemasHemorragia"
                                    checked={formData.questionarioSaude?.problemasHemorragia || false}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="problemasHemorragia" className="ml-2 block text-sm">
                                    Problemas com Hemorragia
                                </label>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Hábitos</label>
                                <textarea
                                    name="habitos"
                                    value={formData.questionarioSaude?.habitos || ''}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Antecedentes Familiares</label>
                                <textarea
                                    name="antecedentesFamiliares"
                                    value={formData.questionarioSaude?.antecedentesFamiliares || ''}
                                    onChange={(e) => handleInputChange(e, 'questionarioSaude')}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Observações Gerais */}
            <section className="rounded-xl overflow-hidden border">
                <div className="px-6 py-4 bg-purple-50">
                    <h2 className="text-xl font-semibold">Observações Gerais</h2>
                </div>
                <div className="p-6">
          <textarea
              name="observacoes"
              value={formData.observacoes || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Observações adicionais sobre o paciente..."
          />
                </div>
            </section>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border rounded-lg bg-white hover:bg-gray-50"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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