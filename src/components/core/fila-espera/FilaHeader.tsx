// components/fila-espera/FilaHeader.tsx
import { Button } from "@/components/ui-shadcn/button"
import { Plus } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui-shadcn/dialog"
import { FilaFormDialog } from "./FilaFormDialog"
import { useState } from "react"

interface FilaHeaderProps {
    showAddDialog: boolean
    setShowAddDialog: (show: boolean) => void
}

export function FilaHeader({ showAddDialog, setShowAddDialog }: FilaHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Fila de Espera</h2>
                <p className="text-muted-foreground">Gerencie pacientes aguardando disponibilidade</p>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar à Fila
                    </Button>
                </DialogTrigger>
                <FilaFormDialog
                    showAddDialog={showAddDialog}
                    setShowAddDialog={setShowAddDialog}
                />
            </Dialog>
        </div>
    )
}