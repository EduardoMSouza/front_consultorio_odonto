// components/common/Pagination.tsx
interface PaginationProps {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showingText?: string;
    previousText?: string;
    nextText?: string;
}

export function Pagination({
                               currentPage,
                               pageSize,
                               totalElements,
                               totalPages,
                               onPageChange,
                               showingText = "Mostrando {start} até {end} de {total} pacientes",
                               previousText = "Anterior",
                               nextText = "Próxima"
                           }: PaginationProps) {
    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalElements);

    const formattedText = showingText
        .replace('{start}', start.toString())
        .replace('{end}', end.toString())
        .replace('{total}', totalElements.toString());

    return (
        <div className="mt-6 flex justify-between items-center glass-card p-4 rounded-xl animate-fade-in-up">
            <p className="text-sm text-muted-foreground">
                {formattedText}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-border bg-background rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-base focus-ring"
                >
                    {previousText}
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 border border-border bg-background rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-base focus-ring"
                >
                    {nextText}
                </button>
            </div>
        </div>
    );
}