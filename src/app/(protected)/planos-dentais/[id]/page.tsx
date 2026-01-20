// app/dashboard/planos-dentais/[id]/editar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PlanoDentalService } from "@/services/plano-dental.service";
import { PacienteService } from "@/services/paciente.service";
import { DentistaService } from "@/services/dentista.service";
import { PlanoDentalRequest, PlanoDentalResponse, StatusPlano } from "@/models/plano-dental.type";
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
import { ArrowLeft, Loader2, CalendarDays, User, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui-shadcn/switch";
import { Badge } from "@/components/ui-shadcn/badge";

export default function EditarPlanoDentalPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [plano, setPlano] = useState<PlanoDentalResponse | null>(null);
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
            const id = Number(params.id);
            const [planoData, pacientesData, dentistasData] = await Promise.all([
                PlanoDentalService.buscarPorId(id),
                PacienteService.listarResumo(),
                DentistaService.listarTodos(0, 1000)
            ]);

            setPlano(planoData);
            setPacientes(pacientesData.content || pacientesData);
            setDentistas(dentistasData.content || dentistasData);

            setFormData({
                pacienteId: planoData.pacienteId,
                dentistaId: planoData.dentistaId,
                dente: planoData.dente,
                faceDente: planoData.faceDente || "",
                procedimento: planoData.procedimento,
                codigoProcedimento: planoData.codigoProcedimento || "",
                valor: planoData.valor,
                valorDesconto: planoData.valorDesconto || 0,
                status: planoData.status,
                prioridade: planoData.prioridade || "NORMAL",
                urgente: planoData.urgente,
                observacoes: planoData.observacoes || "",
                dataPrevista: planoData.dataPrevista || "",
            });
        } catch (error) {
            toast.error("Erro ao carregar dados do plano");
            router.push("/dashboard/planos-dentais");
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
            const id = Number(params.id);

            // Verificar se há mudanças no paciente/dente/procedimento
            if (plano &&
                (plano.pacienteId !== formData.pacienteId ||
                    plano.dente !== formData.dente ||
                    plano.procedimento !== formData.procedimento)) {

                const existePlanoAtivo = await PlanoDentalService.existePlanoAtivoParaPacienteDenteProcedimento(
                    formData.pacienteId,
                    formData.dente,
                    formData.procedimento
                );

                if (existePlanoAtivo && existePlanoAtivo !== plano.id) {
                    toast.warning("Já existe um plano ativo para este paciente, dente e procedimento.");
                    return;
                }
            }

            await PlanoDentalService.atualizar(id, formData);
            toast.success("Plano dental atualizado com sucesso");
            router.push("/dashboard/planos-dentais");
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar plano dental");
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
    };

    const handleDescontoChange = (value: string) => {
        const numValue = parseFloat(value) || 0;
        handleChange("valorDesconto", numValue);
    };

    const getStatusBadge = (status: StatusPlano) => {
        switch (status) {
            case StatusPlano.CONCLUIDO:
                return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
            case StatusPlano.CANCELADO:
                return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
            case StatusPlano.EM_ANDAMENTO:
                return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
            case StatusPlano.PENDENTE:
                return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (loadingData) {
        return (
            <div className="container mx-auto py-10 max-w-4xl">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Carregando dados do plano...</p>
                </div>
            </div>
        );
    }

    if (!plano) {
        return null;
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Editar Plano Dental</CardTitle>
                            <CardDescription>
                                Atualize os dados do plano de tratamento
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(plano.status)}
                            {plano.urgente && (
                                <Badge variant="destructive">Urgente</Badge>
                            )}
                            {!plano.ativo && (
                                <Badge variant="secondary">Inativo</Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Informações do Plano */}
                    <div className="mb-6 p-4 bg-muted rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">Paciente</div>
                                    <div className="font-semibold">{plano.pacienteNome}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserCog className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">Dentista</div>
                                    <div className="font-semibold">{plano.dentistaNome}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">Criado em</div>
                                    <div className="font-semibold">
                                        {new Date(plano.criadoEm).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Paciente (readonly) */}
                            <div className="space-y-2">
                                <Label>Paciente</Label>
                                <div className="p-3 border rounded-md bg-muted/50">
                                    <div className="font-medium">{plano.pacienteNome}</div>
                                    <div className="text-sm text-muted-foreground">
                                        ID: {plano.pacienteId}
                                    </div>
                                </div>
                                <input type="hidden" value={formData.pacienteId} />
                            </div>

                            {/* Dentista (readonly) */}
                            <div className="space-y-2">
                                <Label>Dentista</Label>
                                <div className="p-3 border rounded-md bg-muted/50">
                                    <div className="font-medium">{plano.dentistaNome}</div>
                                    <div className="text-sm text-muted-foreground">
                                        CRO: {plano.especialidade}
                                    </div>
                                </div>
                                <input type="hidden" value={formData.dentistaId} />
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
                                <div className="text-sm font-medium">
                                    Valor final: R$ {(formData.valor - (formData.valorDesconto || 0)).toFixed(2)}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
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
                                />
                            </div>

                            {/* Urgente */}
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="urgente"
                                    checked={formData.urgente}
                                    onCheckedChange={(checked) => handleChange("urgente", checked)}
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
                                    "Salvar Alterações"
                                )}
                            </Button>
                        </div>

                        {/* Informações do Sistema */}
                        <div className="pt-6 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <Label className="text-muted-foreground">Criado em</Label>
                                    <p className="font-medium">
                                        {new Date(plano.criadoEm).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Última atualização</Label>
                                    <p className="font-medium">
                                        {new Date(plano.atualizadoEm).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Valor Final</Label>
                                    <p className="font-medium text-lg">
                                        R$ {plano.valorFinal.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}