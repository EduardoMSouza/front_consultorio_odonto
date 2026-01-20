// components/agendamentos/AgendamentosHeader.tsx

export function AgendamentosHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Agendamentos</h2>
                <p className="text-muted-foreground">Gerencie a agenda de consultas da clínica</p>
            </div>
            {/* O botão novo é movido para FormDialog */}
        </div>
    );
}