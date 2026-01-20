// components/core/plano/EmptyPlanosState.tsx
import Link from "next/link"
import { Card } from "@/components/ui-shadcn/card"
import { Button } from "@/components/ui-shadcn/button"
import { PlusCircle, Search } from "lucide-react"

interface EmptyPlanosStateProps {
    hasFilters: boolean
}

export function EmptyPlanosState({ hasFilters }: EmptyPlanosStateProps) {
    return (
        <Card className="p-12">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Nenhum plano encontrado</h3>
                <p className="text-muted-foreground">
                    {hasFilters
                        ? "Tente ajustar os filtros de busca"
                        : "Comece criando seu primeiro plano dental"}
                </p>
                {!hasFilters && (
                    <Link href="/plano-dental/novo">
                        <Button className="mt-4">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Criar Primeiro Plano
                        </Button>
                    </Link>
                )}
            </div>
        </Card>
    )
}