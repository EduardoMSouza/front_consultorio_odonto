// components/core/agenda/modals/utils/agendamento-utils.ts
import { TipoProcedimento } from "@/lib/types/agenda/agendamento.type";

export const getDuracaoProcedimento = (tipo: TipoProcedimento): number => {
    const duracoes: Record<TipoProcedimento, number> = {
        [TipoProcedimento.CONSULTA]: 30,
        [TipoProcedimento.LIMPEZA]: 60,
        [TipoProcedimento.EXTRACAO]: 45,
        [TipoProcedimento.OBTURACAO]: 60,
        [TipoProcedimento.CANAL]: 90,
        [TipoProcedimento.PROTESE]: 60,
        [TipoProcedimento.ORTODONTIA]: 45,
        [TipoProcedimento.IMPLANTE]: 120,
        [TipoProcedimento.CLAREAMENTO]: 90,
        [TipoProcedimento.EMERGENCIA]: 30,
        [TipoProcedimento.AVALIACAO]: 30,
        [TipoProcedimento.RETORNO]: 30,
        [TipoProcedimento.OUTRO]: 30,
    };
    return duracoes[tipo] || 30;
};