// app/dashboard/plano-dental/page.tsx
'use client';

import { PlanoDentalList } from '@/components/core/plano-dental/plano-dental-list';

export default function PlanoDentalPage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <PlanoDentalList />
        </div>
    );
}