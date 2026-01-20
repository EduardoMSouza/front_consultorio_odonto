// components/common/PageHeader.tsx
import { Button } from "@/components/ui-shadcn/button"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
    title: string
    description: string
    onBack: () => void
}

export function PageHeader({ title, description, onBack }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
        </div>
    )
}