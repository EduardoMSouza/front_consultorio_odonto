// components/dentistas/DentistaForm.tsx
import { Button } from "@/components/ui-shadcn/button"
import { Input } from "@/components/ui-shadcn/input"
import { Label } from "@/components/ui-shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-shadcn/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-shadcn/card"
import { DentistaRequest } from "@/models/dentista.model"

interface DentistaFormProps {
    formData: DentistaRequest
    loading: boolean
    onSubmit: (e: React.FormEvent) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSelectChange: (value: string) => void
    onCancel: () => void
    title?: string
    description?: string
    submitText?: string
}

export function DentistaForm({
                                 formData,
                                 loading,
                                 onSubmit,
                                 onChange,
                                 onSelectChange,
                                 onCancel,
                                 title = "Formulário de Cadastro",
                                 description = "Preencha os campos abaixo para cadastrar um novo dentista.",
                                 submitText = "Cadastrar Dentista"
                             }: DentistaFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome *</Label>
                        <Input
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cro">CRO</Label>
                            <Input
                                id="cro"
                                name="cro"
                                value={formData.cro}
                                onChange={onChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="especialidade">Especialidade</Label>
                            <Input
                                id="especialidade"
                                name="especialidade"
                                value={formData.especialidade}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                name="telefone"
                                value={formData.telefone}
                                onChange={onChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ativo">Status</Label>
                        <Select value={formData.ativo ? "true" : "false"} onValueChange={onSelectChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Ativo</SelectItem>
                                <SelectItem value="false">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Processando..." : submitText}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}