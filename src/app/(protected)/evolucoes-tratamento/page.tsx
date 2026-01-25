// app/dashboard/evolucao-tratamento/page.tsx
'use client';

import { EvolucaoTratamentoList } from '@/components/core/evolucao-tratamento/evolucao-tratamento-list';

export default function EvolucaoTratamentoPage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <EvolucaoTratamentoList />
        </div>
    );
}