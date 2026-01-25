// components/core/dentistas/DentistaViewModal.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui-shadcn/dialog';
import { Button } from '@/components/ui-shadcn/button';
import { Badge } from '@/components/ui-shadcn/badge';
import { Separator } from '@/components/ui-shadcn/separator';
import { Mail, Phone, User, Calendar, Edit, BriefcaseMedical, CheckCircle, XCircle, Clock, UserCog, FileText, Activity } from 'lucide-react';
import { DentistaResponse } from '@/lib/types/dentista/dentista.type';
import {
    capitalizeWords,
    formatCRO,
    formatEmailForInput,
    formatPhone,
    formatProperName
} from "@/lib/utils/formatters/dentista.formatter";
import {formatDate} from "@/lib/utils/date.utils";
import {formatDateTime} from "@/lib/utils/currency.utils";

interface DentistaViewModalProps {
    dentista: DentistaResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (dentista: DentistaResponse) => void;
}

interface InfoItemProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

const InfoItem = ({ label, value, icon, className = '' }: InfoItemProps) => (
    <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
        <div className="text-sm text-foreground font-medium">{value}</div>
    </div>
);

const SectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
);

export function DentistaViewModal({ dentista, open, onOpenChange, onEdit }: DentistaViewModalProps) {
    if (!dentista) return null;

    const especialidades = dentista.especialidade?.split(',').map(s => s.trim()).filter(Boolean) || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold text-foreground">Detalhes do Dentista</DialogTitle>
                            <DialogDescription className="text-muted-foreground">Informações completas do cadastro</DialogDescription>
                        </div>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">✕</Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <div className="px-6 py-5 space-y-6 max-h-[calc(80vh-120px)] overflow-y-auto">
                    {/* Seção 1: Informações Pessoais */}
                    <div className="space-y-4">
                        <SectionHeader title="Informações Pessoais" icon={<User className="h-4 w-4" />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="Nome Completo" value={formatProperName(dentista.nome)} icon={<User className="h-3.5 w-3.5" />} />
                            <InfoItem
                                label="CRO"
                                value={
                                    <div className="flex items-center gap-2">
                                        {formatCRO(dentista.cro)}
                                        <Badge variant={dentista.ativo ? 'success' : 'destructive'} className="text-xs">
                                            {dentista.ativo ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </div>
                                }
                                icon={<FileText className="h-3.5 w-3.5" />}
                            />
                            <InfoItem label="Email" value={formatEmailForInput(dentista.email)} icon={<Mail className="h-3.5 w-3.5" />} />
                            <InfoItem label="Telefone" value={formatPhone(dentista.telefone)} icon={<Phone className="h-3.5 w-3.5" />} />
                        </div>
                    </div>

                    <Separator />

                    {/* Seção 2: Especialidades */}
                    <div className="space-y-4">
                        <SectionHeader title="Especialidades" icon={<BriefcaseMedical className="h-4 w-4" />} />
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Áreas de Atuação</div>
                            {especialidades.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {especialidades.map((esp, index) => (
                                        <Badge key={index} variant="secondary" className="px-3 py-1 text-sm font-normal">
                                            {capitalizeWords(esp)}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground italic">Nenhuma especialidade informada</div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Seção 3: Status e Histórico */}
                    <div className="space-y-4">
                        <SectionHeader title="Status e Histórico" icon={<Activity className="h-4 w-4" />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem
                                label="Status do Cadastro"
                                value={
                                    <div className="flex items-center gap-2">
                                        {dentista.ativo ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                                        <span>{dentista.ativo ? 'Ativo' : 'Inativo'}</span>
                                    </div>
                                }
                                icon={<UserCog className="h-3.5 w-3.5" />}
                            />
                            <InfoItem
                                label="Data de Cadastro"
                                value={
                                    <div className="space-y-0.5">
                                        <div>{formatDate(dentista.criadoEm)}</div>
                                        <div className="text-xs text-muted-foreground">{formatDateTime(dentista.criadoEm)}</div>
                                    </div>
                                }
                                icon={<Calendar className="h-3.5 w-3.5" />}
                            />
                            {dentista.atualizadoEm && dentista.atualizadoEm !== dentista.criadoEm && (
                                <InfoItem
                                    label="Última Atualização"
                                    value={
                                        <div className="space-y-0.5">
                                            <div>{formatDate(dentista.atualizadoEm)}</div>
                                            <div className="text-xs text-muted-foreground">{formatDateTime(dentista.atualizadoEm)}</div>
                                        </div>
                                    }
                                    icon={<Clock className="h-3.5 w-3.5" />}
                                    className="md:col-span-2"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer com ações */}
                {onEdit && (
                    <div className="px-6 py-4 border-t bg-muted/20">
                        <div className="flex justify-between items-center">
                            <DialogClose asChild>
                                <Button variant="outline" size="sm">Fechar</Button>
                            </DialogClose>
                            <Button onClick={() => { onEdit(dentista); onOpenChange(false); }} size="sm" className="flex items-center gap-2">
                                <Edit className="h-3.5 w-3.5" />Editar Dentista
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}