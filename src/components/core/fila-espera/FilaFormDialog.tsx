// components/fila-espera/FilaFormDialog.tsx
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui-shadcn/dialog"
import { Button } from "@/components/ui-shadcn/button"
import { Input } from "@/components/ui-shadcn/input"
import { Label } from "@/components/ui-shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-shadcn/select"
import { Switch } from "@/components/ui-shadcn/switch"
import { TipoProcedimento, getTipoProcedimentoLabel } from "@/models/fila-espera.model"

interface FilaFormDialogProps {
    showAddDialog: boolean
    setShowAddDialog: (show: boolean) => void
    formData: any
    errors: any
    handleChange: (e: any) => void
    validateForm: () => boolean
    loading: boolean
    handleCreateFila: () => Promise<void>
}

export function FilaFormDialog({
                                   setShowAddDialog,
                                   formData,
                                   errors,
                                   handleChange,
                                   validateForm,
                                   loading,
                                   handleCreateFila
                               }: FilaFormDialogProps) {
    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Adicionar Paciente à Fila de Espera</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pacienteId">ID do Paciente *</Label>
                        <Input
                            id="pacienteId"
                            name="pacienteId"
                            type="number"
                            value={formData.pacienteId || ''}
                            onChange={handleChange}
                        />
                        {errors.pacienteId && (
                            <p className="text-sm text-red-500">{errors.pacienteId}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dentistaId">ID do Dentista (Opcional)</Label>
                        <Input
                            id="dentistaId"
                            name="dentistaId"
                            type="number"
                            value={formData.dentistaId || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tipoProcedimento">Tipo de Procedimento</Label>
                    <Select
                        value={formData.tipoProcedimento}
                        onValueChange={(value) =>
                            handleChange({ target: { name: 'tipoProcedimento', value } } as any)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um procedimento" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(TipoProcedimento).map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                    {getTipoProcedimentoLabel(tipo)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="dataPreferencial">Data Preferencial</Label>
                        <Input
                            id="dataPreferencial"
                            name="dataPreferencial"
                            type="date"
                            value={formData.dataPreferencial}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="periodoPreferencial">Período Preferencial</Label>
                        <Select
                            value={formData.periodoPreferencial}
                            onValueChange={(value) =>
                                handleChange({ target: { name: 'periodoPreferencial', value } } as any)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MANHA">Manhã</SelectItem>
                                <SelectItem value="TARDE">Tarde</SelectItem>
                                <SelectItem value="NOITE">Noite</SelectItem>
                                <SelectItem value="QUALQUER">Qualquer horário</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="prioridade">Prioridade (0-10)</Label>
                        <Input
                            id="prioridade"
                            name="prioridade"
                            type="number"
                            min="0"
                            max="10"
                            value={formData.prioridade}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Input
                            id="observacoes"
                            name="observacoes"
                            value={formData.observacoes}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="aceitaQualquerHorario"
                            checked={formData.aceitaQualquerHorario}
                            onCheckedChange={(checked) =>
                                handleChange({ target: { name: 'aceitaQualquerHorario', type: 'checkbox', checked } } as any)
                            }
                        />
                        <Label htmlFor="aceitaQualquerHorario">Aceita qualquer horário</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="aceitaQualquerDentista"
                            checked={formData.aceitaQualquerDentista}
                            onCheckedChange={(checked) =>
                                handleChange({ target: { name: 'aceitaQualquerDentista', type: 'checkbox', checked } } as any)
                            }
                        />
                        <Label htmlFor="aceitaQualquerDentista">Aceita qualquer dentista</Label>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancelar
                </Button>
                <Button onClick={handleCreateFila} disabled={loading}>
                    {loading ? "Adicionando..." : "Adicionar à Fila"}
                </Button>
            </div>
        </DialogContent>
    )
}