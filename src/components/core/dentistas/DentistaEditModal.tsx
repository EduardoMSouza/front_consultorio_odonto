// components/core/dentistas/DentistaEditModal.tsx
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui-shadcn/dialog';
import { Button } from '@/components/ui-shadcn/button';
import { Input } from '@/components/ui-shadcn/input';
import { Label } from '@/components/ui-shadcn/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { DentistaRequest } from '@/lib/types/dentista/dentista.type';
import {hasValidationErrors, validateDentista} from "@/lib/utils/validators/dentista.validator";
import {
    formatCROForInput,
    formatEmailForInput,
    formatPhone,
    formatProperName
} from "@/lib/utils/formatters/dentista.formatter";
import {useDentista} from "@/lib/hooks/useDentista";


interface DentistaEditModalProps {
    dentistaId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DentistaEditModal({ dentistaId, open, onOpenChange, onSuccess }: DentistaEditModalProps) {
    const { dentista: dentistaData, carregarDentista, atualizar } = useDentista(dentistaId || undefined);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [formData, setFormData] = useState<DentistaRequest>({
        nome: "",
        cro: "",
        especialidade: "",
        telefone: "",
        email: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open && dentistaId) {
            carregarDados();
        } else {
            resetForm();
        }
    }, [open, dentistaId]);

    const carregarDados = async () => {
        try {
            setLoadingData(true);
            await carregarDentista(dentistaId!);
        } catch (error) {
            toast.error("Erro ao carregar dentista");
            onOpenChange(false);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (dentistaData) {
            setFormData({
                nome: dentistaData.nome,
                cro: formatCROForInput(dentistaData.cro),
                especialidade: dentistaData.especialidade,
                telefone: formatPhone(dentistaData.telefone),
                email: dentistaData.email,
            });
        }
    }, [dentistaData]);

    const resetForm = () => {
        setFormData({
            nome: "",
            cro: "",
            especialidade: "",
            telefone: "",
            email: "",
        });
        setErrors({});
        setLoading(false);
        setLoadingData(false);
    };

    const validate = (): boolean => {
        const validationErrors = validateDentista(formData);
        setErrors(validationErrors);
        return !hasValidationErrors(validationErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !dentistaId) return;

        try {
            setLoading(true);
            const dadosParaEnviar = {
                ...formData,
                cro: formData.cro.replace(/[^A-Z0-9]/g, ''),
                telefone: formData.telefone.replace(/\D/g, ''),
                email: formatEmailForInput(formData.email)
            };

            await atualizar(dentistaId, dadosParaEnviar);
            toast.success("Dentista atualizado com sucesso");
            onSuccess?.();
            onOpenChange(false);
        } catch (error) {
            toast.error("Erro ao atualizar dentista");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof DentistaRequest, value: string) => {
        let valorFormatado = value;
        if (field === "cro") {
            valorFormatado = formatCROForInput(value);
        } else if (field === "telefone") {
            const numeros = value.replace(/\D/g, '');
            if (numeros.length <= 11) {
                valorFormatado = formatPhone(value);
            }
        } else if (field === "email") {
            valorFormatado = formatEmailForInput(value);
        }

        setFormData(prev => ({ ...prev, [field]: valorFormatado }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const styles = {
        dialog: { content: "max-w-2xl", header: "space-y-2", title: "text-2xl font-bold", description: "text-muted-foreground" },
        form: { container: "space-y-4 py-4", grid: "grid grid-cols-1 md:grid-cols-2 gap-4", field: "space-y-2", label: "text-sm font-medium", error: "text-sm text-destructive mt-1", actions: "flex justify-end gap-2 pt-4 border-t" }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={styles.dialog.content}>
                <DialogHeader className={styles.dialog.header}>
                    <DialogTitle className={styles.dialog.title}>Editar Dentista</DialogTitle>
                    <DialogDescription className={styles.dialog.description}>
                        {dentistaData ? `Atualize os dados de ${formatProperName(dentistaData.nome)}` : 'Carregando...'}
                    </DialogDescription>
                </DialogHeader>

                {loadingData ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form.container}>
                        <div className={styles.form.grid}>
                            <div className={styles.form.field}>
                                <Label htmlFor="nome" className={styles.form.label}>Nome *</Label>
                                <Input id="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} disabled={loading} />
                                {errors.nome && <p className={styles.form.error}>{errors.nome}</p>}
                            </div>

                            <div className={styles.form.field}>
                                <Label htmlFor="cro" className={styles.form.label}>CRO *</Label>
                                <Input id="cro" value={formData.cro} onChange={(e) => handleChange("cro", e.target.value)} disabled={loading} className="uppercase" maxLength={8} />
                                {errors.cro && <p className={styles.form.error}>{errors.cro}</p>}
                                <p className="text-xs text-muted-foreground mt-1">Formato: UF-12345 (ex: PE-12345)</p>
                            </div>

                            <div className={styles.form.field}>
                                <Label htmlFor="especialidade" className={styles.form.label}>Especialidade *</Label>
                                <Input id="especialidade" value={formData.especialidade} onChange={(e) => handleChange("especialidade", e.target.value)} disabled={loading} />
                                {errors.especialidade && <p className={styles.form.error}>{errors.especialidade}</p>}
                            </div>

                            <div className={styles.form.field}>
                                <Label htmlFor="telefone" className={styles.form.label}>Telefone *</Label>
                                <Input id="telefone" value={formData.telefone} onChange={(e) => handleChange("telefone", e.target.value)} disabled={loading} maxLength={15} />
                                {errors.telefone && <p className={styles.form.error}>{errors.telefone}</p>}
                                <p className="text-xs text-muted-foreground mt-1">Celular com DDD (11 dígitos)</p>
                            </div>

                            <div className="md:col-span-2">
                                <div className={styles.form.field}>
                                    <Label htmlFor="email" className={styles.form.label}>Email *</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} disabled={loading} />
                                    {errors.email && <p className={styles.form.error}>{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        <div className={styles.form.actions}>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}