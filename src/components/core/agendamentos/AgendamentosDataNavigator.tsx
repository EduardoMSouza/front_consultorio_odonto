// components/agendamentos/AgendamentosDataNavigator.tsx
import { Button } from "@/components/ui-shadcn/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AgendamentosDataNavigatorProps {
    navigateDate: (direction: "prev" | "next") => void;
    setSelectedDate: (date: Date) => void;
}

export function AgendamentosDataNavigator({ navigateDate, setSelectedDate }: AgendamentosDataNavigatorProps) {
    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                Hoje
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                semana
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                Mes
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateDate("next")}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}