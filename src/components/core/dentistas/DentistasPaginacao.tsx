// components/core/dentistas/DentistasPaginacao.tsx
import { Button } from '@/components/ui-shadcn/button';

interface DentistasPaginacaoProps {
    paginaAtual: number;
    totalPages: number;
    loading: boolean;
    setPaginaAtual: (page: number) => void;
}

export function DentistasPaginacao({ paginaAtual, totalPages, loading, setPaginaAtual }: DentistasPaginacaoProps) {
    return (
        <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
                Página {paginaAtual + 1} de {totalPages}
            </p>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(Math.max(0, paginaAtual - 1))}
                    disabled={paginaAtual === 0 || loading}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(paginaAtual + 1)}
                    disabled={paginaAtual >= totalPages - 1 || loading}
                >
                    Próxima
                </Button>
            </div>
        </div>
    );
}