// app/dashboard/planos-dentais/novo/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlanoDentalService } from "@/services/plano-dental.service";
import { PacienteService } from "@/services/paciente.service";
import { DentistaService } from "@/services/dentista.service";
import { PlanoDentalRequest, StatusPlano } from "@/models/plano-dental.type";
import { PacienteResumoResponse } from "@/models/paciente.types";
import { DentistaResponse } from "@/models/dentista.type";
import { Button } from "@/components/ui-shadcn/button";
import { Input } from "@/components/ui-shadcn/input";
import { Label } from "@/components/ui-shadcn/label";
import { Textarea } from "@/components/ui-shadcn/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-shadcn/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui-shadcn/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui-shadcn/switch";

export default function NovoPlanoDentalPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [formData, setFormData] = useState<PlanoDentalRequest>({
        pacienteId: 0,
        dentistaId: 0,
        dente: "",
        faceDente: "",
        procedimento: "",
        codigoProcedimento: "",
        valor: 0,
        valorDesconto: 0,
        status: StatusPlano.PENDENTE,
        prioridade: "NORMAL",
        urgente: false,
        observacoes: "",
        dataPrevista: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pacientes, setPacientes] = useState<PacienteResumoResponse[]>([]);
    const [dentistas, setDentistas] = useState<DentistaResponse[]>([]);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoadingData(true);
            const [pacientesData, dentistasData] = await Promise.all([
                PacienteService.listarResumo(),
                DentistaService.listarTodos(0, 1000)
            ]);
            setPacientes(pacientesData.content || pacientesData);
            setDentistas(dentistasData.content || dentistasData);
        } catch (error) {
            toast.error("Erro ao carregar dados");
        } finally {
            setLoadingData(false);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.pacienteId) {
            newErrors.pacienteId = "Selecione um paciente";
        }

        if (!formData.dentistaId) {
            newErrors.dentistaId = "Selecione um dentista";
        }

        if (!formData.dente || formData.dente.trim() === "") {
            newErrors.dente = "Informe o dente";
        }

        if (!formData.procedimento || formData.procedimento.trim() === "") {
            newErrors.procedimento = "Informe o procedimento";
        }

        if (!formData.valor || formData.valor <= 0) {
            newErrors.valor = "Valor deve ser maior que zero";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            // Verificar se já existe plano ativo para o mesmo paciente/dente/procedimento
            if (formData.pacienteId && formData.dente && formData.procedimento) {
                const existePlanoAtivo = await PlanoDentalService.existePlanoAtivoParaPacienteDenteProcedimento(
                    formData.pacienteId,
                    formData.dente,
                    formData.procedimento
                );

                if (existePlanoAtivo) {
                    toast.warning("Já existe um plano ativo para este paciente, dente e procedimento.");
                    return;
                }
            }

            await PlanoDentalService.criar(formData);
            toast.success("Plano dental criado com sucesso");
            router.push("/dashboard/planos-dentais");
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar plano dental");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof PlanoDentalRequest, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleValorChange = (value: string) => {
        const numValue = parseFloat(value) || 0;
        handleChange("valor", numValue);

        // Se houver desconto, recalcular valor final
        if (formData.valorDesconto && formData.valorDesconto > 0) {
            const valorFinal = Math.max(0, numValue - (formData.valorDesconto || 0));
            handleChange("valorFinal", valorFinal);
        }
    };

    const handleDescontoChange = (value: string) => {
        const numValue = parseFloat(value) || 0;
        handleChange("valorDesconto", numValue);

        // Calcular valor final
        const valorFinal = Math.max(0, formData.valor - numValue);
        handleChange("valorFinal", valorFinal);
    };

    if (loadingData) {
        return (
            <div className="container mx-auto py-10 max-w-4xl">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/planos-dentais")}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para lista
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Novo Plano Dental</CardTitle>
                    <CardDescription>
                        Cadastre um novo plano de tratamento dental
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Paciente */}
                            <div className="space-y-2">
                                <Label htmlFor="pacienteId">Paciente *</Label>
                                <Select
                                    value={formData.pacienteId.toString()}
                                    onValueChange={(value) => handleChange("pacienteId", Number(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um paciente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pacientes.map((paciente) => (
                                            <SelectItem key={paciente.id} value={paciente.id.toString()}>
                                                <div className="flex flex-col">
                                                    <span>{paciente.nome}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Prontuário: {paciente.prontuarioNumero}
                                                        {paciente.cpf && ` • CPF: ${paciente.cpfFormatado}`}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.pacienteId && (
                                    <p className="text-sm text-destructive">{errors.pacienteId}</p>
                                )}
                            </div>

                            {/* Dentista */}
                            <div className="space-y-2">
                                <Label htmlFor="dentistaId">Dentista *</Label>
                                <Select
                                    value={formData.dentistaId.toString()}
                                    onValueChange={(value) => handleChange("dentistaId", Number(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um dentista" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dentistas.map((dentista) => (
                                            <SelectItem key={dentista.id} value={dentista.id.toString()}>
                                                <div className="flex flex-col">
                                                    <span>{dentista.nome}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        CRO: {dentista.cro} • {dentista.especialidade}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.dentistaId && (
                                    <p className="text-sm text-destructive">{errors.dentistaId}</p>
                                )}
                            </div>

                            {/* Dente e Face */}
                            <div className="space-y-2">
                                <Label htmlFor="dente">Dente *</Label>
                                <Input
                                    id="dente"
                                    value={formData.dente}
                                    onChange={(e) => handleChange("dente", e.target.value.toUpperCase())}
                                    placeholder="Ex: 11, 21, 36, etc."
                                    maxLength={10}
                                />
                                {errors.dente && (
                                    <p className="text-sm text-destructive">{errors.dente}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="faceDente">Face do Dente</Label>
                                <Select
                                    value={formData.faceDente}
                                    onValueChange={(value) => handleChange("faceDente", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a face" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VESTIBULAR">Vestibular</SelectItem>
                                        <SelectItem value="LINGUAL">Lingual</SelectItem>
                                        <SelectItem value="MESIAL">Mesial</SelectItem>
                                        <SelectItem value="DISTAL">Distal</SelectItem>
                                        <SelectItem value="OCLUSAL">Oclusal</SelectItem>
                                        <SelectItem value="INCISAL">Incisal</SelectItem>
                                        <SelectItem value="PALATAL">Palatal</SelectItem>
                                        <SelectItem value="">Não especificado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Procedimento */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="procedimento">Procedimento *</Label>
                                <Input
                                    id="procedimento"
                                    value={formData.procedimento}
                                    onChange={(e) => handleChange("procedimento", e.target.value)}
                                    placeholder="Ex: Restauração, Limpeza, Extração, Tratamento de Canal, etc."
                                />
                                {errors.procedimento && (
                                    <p className="text-sm text-destructive">{errors.procedimento}</p>
                                )}
                            </div>

                            {/* Código do Procedimento */}
                            <div className="space-y-2">
                                <Label htmlFor="codigoProcedimento">Código TUSS/AMB</Label>
                                <Input
                                    id="codigoProcedimento"
                                    value={formData.codigoProcedimento}
                                    onChange={(e) => handleChange("codigoProcedimento", e.target.value)}
                                    placeholder="Ex: 123.45"
                                />
                            </div>

                            {/* Prioridade */}
                            <div className="space-y-2">
                                <Label htmlFor="prioridade">Prioridade</Label>
                                <Select
                                    value={formData.prioridade}
                                    onValueChange={(value) => handleChange("prioridade", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a prioridade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BAIXA">Baixa</SelectItem>
                                        <SelectItem value="NORMAL">Normal</SelectItem>
                                        <SelectItem value="ALTA">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Valores */}
                            <div className="space-y-2">
                                <Label htmlFor="valor">Valor Total (R$) *</Label>
                                <Input
                                    id="valor"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.valor}
                                    onChange={(e) => handleValorChange(e.target.value)}
                                    placeholder="0.00"
                                />
                                {errors.valor && (
                                    <p className="text-sm text-destructive">{errors.valor}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="valorDesconto">Desconto (R$)</Label>
                                <Input
                                    id="valorDesconto"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max={formData.valor}
                                    value={formData.valorDesconto}
                                    onChange={(e) => handleDescontoChange(e.target.value)}
                                    placeholder="0.00"
                                />
                                {formData.valorDesconto && formData.valorDesconto > 0 && (
                                    <div className="text-sm text-green-600 font-medium">
                                        Valor final: R$ {Math.max(0, formData.valor - (formData.valorDesconto || 0)).toFixed(2)}
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">Status Inicial</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleChange("status", value as StatusPlano)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(StatusPlano).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status.replace("_", " ")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Data Prevista */}
                            <div className="space-y-2">
                                <Label htmlFor="dataPrevista">Data Prevista</Label>
                                <Input
                                    id="dataPrevista"
                                    type="date"
                                    value={formData.dataPrevista}
                                    onChange={(e) => handleChange("dataPrevista", e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {/* Urgente */}
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="urgente"
                                    checked={formData.urgente}
                                    onCheckedChange={(checked: any) => handleChange("urgente", checked)}
                                />
                                <Label htmlFor="urgente">Marcar como urgente</Label>
                            </div>
                        </div>

                        {/* Observações */}
                        <div className="space-y-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea
                                id="observacoes"
                                value={formData.observacoes}
                                onChange={(e) => handleChange("observacoes", e.target.value)}
                                placeholder="Informações adicionais sobre o plano de tratamento, histórico, recomendações..."
                                rows={4}
                            />
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dashboard/planos-dentais")}
                                disabled={loading}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    "Criar Plano"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}