// components/dentistas/DentistaDialog.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui-shadcn/button';
import { Input } from '@/components/ui-shadcn/input';
import { Label } from '@/components/ui-shadcn/label';
import { Switch } from '@/components/ui-shadcn/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui-shadcn/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui-shadcn/select';

interface DentistaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dentista?: any;
    onSave: (data: any) => void;
}

export function DentistaDialog({ open, onOpenChange, dentista, onSave }: DentistaDialogProps) {
    const [formData, setFormData] = useState({
        nome: '',
        cro: '',
        especialidade: '',
        telefone: '',
        email: '',
        ativo: true,
    });

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dentista) {
            setFormData(dentista);
        } else {
            setFormData({
                nome: '',
                cro: '',
                especialidade: '',
                telefone: '',
                email: '',
                ativo: true,
            });
        }
    }, [dentista, open]);

    useEffect(() => {
        if (open && contentRef.current) {
            const inputs = contentRef.current.querySelectorAll('input, select');
            gsap.from(inputs, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.out'
            });
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const especialidades = ['Ortodontia', 'Implante', 'Endodontia', 'Periodontia', 'Prótese', 'Estética'];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>
                        {dentista ? 'Editar Dentista' : 'Novo Dentista'}
                    </DialogTitle>
                    <DialogDescription>
                        {dentista ? 'Atualize as informações do dentista' : 'Preencha os dados do novo dentista'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div ref={contentRef} className="space-y-4 py-4">
                        {/* Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome completo *</Label>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                placeholder="Digite o nome completo"
                                required
                            />
                        </div>

                        {/* CRO e Telefone */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cro">CRO *</Label>
                                <Input
                                    id="cro"
                                    value={formData.cro}
                                    onChange={(e) => setFormData({ ...formData, cro: e.target.value })}
                                    placeholder="12345"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telefone">Telefone</Label>
                                <Input
                                    id="telefone"
                                    value={formData.telefone}
                                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                    placeholder="(11) 98765-4321"
                                />
                            </div>
                        </div>

                        {/* Especialidade */}
                        <div className="space-y-2">
                            <Label htmlFor="especialidade">Especialidade *</Label>
                            <Select
                                value={formData.especialidade}
                                onValueChange={(value) => setFormData({ ...formData, especialidade: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a especialidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {especialidades.map(esp => (
                                        <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* E-mail */}
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="dentista@email.com"
                            />
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                            <div className="space-y-0.5">
                                <Label htmlFor="ativo" className="text-base">Dentista ativo</Label>
                                <p className="text-sm text-muted-foreground">
                                    O dentista estará disponível para atendimentos
                                </p>
                            </div>
                            <Switch
                                id="ativo"
                                checked={formData.ativo}
                                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="btn-emerald">
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}