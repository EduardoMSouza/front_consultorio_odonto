// components/common/LoadingSkeleton.tsx
import { Skeleton } from "@/components/ui-shadcn/skeleton"

export function LoadingSkeleton() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
}