"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DentistaService } from "@/services/dentista.service";
import { DentistaRequest } from "@/models/dentista.type";
import { Button } from "@/components/ui-shadcn/button";
import { Input } from "@/components/ui-shadcn/input";
import { Label } from "@/components/ui-shadcn/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui-shadcn/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NovoDentistaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<DentistaRequest>({
        nome: "",
        cro: "",
        especialidade: "",
        telefone: "",
        email: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nome || formData.nome.length < 3) {
            newErrors.nome = "Nome deve ter entre 3 e 100 caracteres";
        }

        if (!formData.cro || !/^[A-Za-z]{2}\d{4,8}$/.test(formData.cro)) {
            newErrors.cro = "CRO inválido (formato: XX1234)";
        }

        if (!formData.especialidade) {
            newErrors.especialidade = "Especialidade é obrigatória";
        }

        if (!formData.telefone) {
            newErrors.telefone = "Telefone é obrigatório";
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            await DentistaService.criar(formData);
            toast.success("Dentista criado com sucesso");
            router.push("/dentistas");
        } catch (error) {
            toast.error("Erro ao criar dentistas");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof DentistaRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Button
                variant="ghost"
                onClick={() => router.push("/dentistas")}
                className="mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Novo Dentista</CardTitle>
                    <CardDescription>Cadastre um novo dentista no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome *</Label>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => handleChange("nome", e.target.value)}
                                placeholder="Nome completo"
                            />
                            {errors.nome && (
                                <p className="text-sm text-destructive">{errors.nome}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cro">CRO *</Label>
                            <Input
                                id="cro"
                                value={formData.cro}
                                onChange={(e) => handleChange("cro", e.target.value)}
                                placeholder="SP123456"
                            />
                            {errors.cro && (
                                <p className="text-sm text-destructive">{errors.cro}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="especialidade">Especialidade *</Label>
                            <Input
                                id="especialidade"
                                value={formData.especialidade}
                                onChange={(e) => handleChange("especialidade", e.target.value)}
                                placeholder="Ortodontia"
                            />
                            {errors.especialidade && (
                                <p className="text-sm text-destructive">{errors.especialidade}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone *</Label>
                            <Input
                                id="telefone"
                                value={formData.telefone}
                                onChange={(e) => handleChange("telefone", e.target.value)}
                                placeholder="(11) 99999-9999"
                            />
                            {errors.telefone && (
                                <p className="text-sm text-destructive">{errors.telefone}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="dentista@exemplo.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dentistas")}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}