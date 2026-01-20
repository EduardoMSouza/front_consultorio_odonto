// components/common/ErrorAlert.tsx
import { Alert, AlertDescription } from "@/components/ui-shadcn/alert"
import { AlertTriangle } from "lucide-react"

interface ErrorAlertProps {
    message: string
}

export function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}