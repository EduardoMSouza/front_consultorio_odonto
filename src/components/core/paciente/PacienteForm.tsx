// components/pacientes/PacienteForm.tsx
import React from 'react';
import { DadosBasicos, Responsavel, Anamnese, Convenio, InspecaoBucal, QuestionarioSaude } from '@/models/paciente.model';

// Define the section type for better type safety (matches keys from formData in usePacienteForm)
type SectionKey =
    | 'dadosBasicos'
    | 'responsavel'
    | 'anamnese'
    | 'convenio'
    | 'inspecaoBucal'
    | 'questionarioSaude';

interface PacienteFormProps {
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
        section?: SectionKey
    ) => void;
    onSubmit: (e: React.FormEvent) => void;
    isEditing?: boolean;
    loading?: boolean;
}

export const PacienteForm: React.FC<PacienteFormProps> = ({
                                                              formData,
                                                              errors,
                                                              onChange,
                                                              onSubmit,
                                                              isEditing = false,
                                                              loading = false,
                                                          }) => {
    const renderError = (field: string) => {
        return errors[field] ? (
            <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
        ) : null;
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Dados Básicos */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    Dados Básicos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo *
                        </label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.dadosBasicos.nome}
                            onChange={(e) => onChange(e, 'dadosBasicos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {renderError('dadosBasicos.nome')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nº Prontuário
                        </label>
                        <input
                            type="text"
                            name="prontuarioNumero"
                            value={formData.dadosBasicos.prontuarioNumero}
                            onChange={(e) => onChange(e, 'dadosBasicos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CPF
                        </label>
                        <input
                            type="text"
                            name="cpf"
                            value={formData.dadosBasicos.cpf}
                            onChange={(e) => onChange(e, 'dadosBasicos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            maxLength={14}
                        />
                        {renderError('dadosBasicos.cpf')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            RG
                        </label>
                        <input
                            type="text"
                            name="rg"
                            value={formData.dadosBasicos.rg}
                            onChange={(e) => onChange(e, 'dadosBasicos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Órgão Expedidor
                        </label>
                        <input
                            type="text"
                            name="orgaoExpedidor"
                            value={formData.dadosBasicos.orgaoExpedidor}
                            onChange={(e) => onChange(e, 'dadosBasicos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data de Nascimento
                        </label>
                        <input
                            type="date"
                            name="dataNascimento"
                            value={formData.dadosBasicos.dataNascimento}
                            onChange={(e) => onChange(e, 'dadosBasicos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone
                        </label>
                        <input
                            type="tel"
                            name="telefone"
                            value={formData.dadosBasicos.telefone}
                            onChange={(e) => onChange(e, 'dadosBasicos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Naturalidade
                        </label>
                        <input
                            type="text"
                            name="naturalidade"
                            value={formData.dadosBasicos.naturalidade}
                            onChange={(e) => onChange(e, 'dadosBasicos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nacionalidade
                        </label>
                        <input
                            type="text"
                            name="nacionalidade"
                            value={formData.dadosBasicos.nacionalidade}
                            onChange={(e) => onChange(e, 'dadosBasicos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* ... (truncated for brevity; the rest remains the same) ... */}
                </div>
            </section>

            {/* Convênio */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    Convênio
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Convênio
                        </label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.convenio.nome}
                            onChange={(e) => onChange(e, 'convenio')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Inscrição
                        </label>
                        <input
                            type="text"
                            name="numeroInscricao"
                            value={formData.convenio.numeroInscricao}
                            onChange={(e) => onChange(e, 'convenio')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Responsável */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    Responsável Legal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.responsavel.nome}
                            onChange={(e) => onChange(e, 'responsavel')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            RG
                        </label>
                        <input
                            type="text"
                            name="rg"
                            value={formData.responsavel.rg}
                            onChange={(e) => onChange(e, 'responsavel')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CPF
                        </label>
                        <input
                            type="text"
                            name="cpf"
                            value={formData.responsavel.cpf}
                            onChange={(e) => onChange(e, 'responsavel')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado Civil
                        </label>
                        <select
                            name="estadoCivil"
                            value={formData.responsavel.estadoCivil}
                            onChange={(e) => onChange(e, 'responsavel')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Selecione...</option>
                            <option value="SOLTEIRO">Solteiro(a)</option>
                            <option value="CASADO">Casado(a)</option>
                            <option value="DIVORCIADO">Divorciado(a)</option>
                            <option value="VIUVO">Viúvo(a)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Cônjuge
                        </label>
                        <input
                            type="text"
                            name="conjuge"
                            value={formData.responsavel.conjuge}
                            onChange={(e) => onChange(e, 'responsavel')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            RG do Cônjuge
                        </label>
                        <input
                            type="text"
                            name="rgConjuge"
                            value={formData.responsavel.rgConjuge}
                            onChange={(e) => onChange(e, 'responsavel')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CPF do Cônjuge
                        </label>
                        <input
                            type="text"
                            name="cpfConjuge"
                            value={formData.responsavel.cpfConjuge}
                            onChange={(e) => onChange(e, 'responsavel')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
                </button>
            </div>
        </form>
    );
};