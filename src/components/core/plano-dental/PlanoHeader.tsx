// components/core/plano/PlanoHeader.tsx
import Link from "next/link"
import { Button } from "@/components/ui-shadcn/button"
import { ArrowLeft, PlusCircle } from "lucide-react"

export function PlanoHeader() {
    return (
        <div className="mb-8 space-y-4">
            <Link href="/">
                <Button variant="ghost" size="sm" className="mb-2">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Button>
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-foreground">Planos Dentais</h1>
                    <p className="text-muted-foreground mt-2">Gerencie todos os planos de tratamento</p>
                </div>
                <Link href="/plano-dental/novo">
                    <Button className="bg-primary hover:bg-primary/90">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Novo Plano
                    </Button>
                </Link>
            </div>
        </div>
    )
}