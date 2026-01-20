// components/dentistas/DeleteDialog.tsx
'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui-shadcn/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui-shadcn/alert-dialog';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dentista: any;
    onConfirm: () => void;
}

export function DeleteDialog({ open, onOpenChange, dentista, onConfirm }: DeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <AlertDialogTitle>Excluir Dentista</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir <strong>{dentista?.nome}</strong>?
                        Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}