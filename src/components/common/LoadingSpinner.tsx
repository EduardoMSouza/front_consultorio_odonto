// components/common/LoadingSpinner.tsx
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
    size?: number
    className?: string
}

export function LoadingSpinner({ size = 32, className = "text-primary" }: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className={`w-${size} h-${size} animate-spin ${className}`} />
        </div>
    )
}