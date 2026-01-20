// agendamento.service.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const agendamentoService = {
    // AGENDAMENTOS

    // Criar agendamento
    async criar(agendamento: any) {
        const response = await axios.post(`${API_URL}/api/agendamentos`, agendamento);
        return response.data;
    },

    // Atualizar agendamento
    async atualizar(id: number, agendamento: any) {
        const response = await axios.put(`${API_URL}/api/agendamentos/${id}`, agendamento);
        return response.data;
    },

    // Buscar por ID
    async buscarPorId(id: number) {
        const response = await axios.get(`${API_URL}/api/agendamentos/${id}`);
        return response.data;
    },

    // Listar todos
    async listarTodos() {
        const response = await axios.get(`${API_URL}/api/agendamentos`);
        return response.data;
    },

    // Listar por dentista
    async listarPorDentista(dentistaId: number) {
        const response = await axios.get(`${API_URL}/api/agendamentos/dentista/${dentistaId}`);
        return response.data;
    },

    // Listar por paciente
    async listarPorPaciente(pacienteId: number) {
        const response = await axios.get(`${API_URL}/api/agendamentos/paciente/${pacienteId}`);
        return response.data;
    },

    // Listar por data
    async listarPorData(data: string) {
        const response = await axios.get(`${API_URL}/api/agendamentos/data/${data}`);
        return response.data;
    },

    // Listar por período
    async listarPorPeriodo(dataInicio: string, dataFim: string) {
        const params = { dataInicio, dataFim };
        const response = await axios.get(`${API_URL}/api/agendamentos/periodo`, { params });
        return response.data;
    },

    // Listar por status
    async listarPorStatus(status: string) {
        const response = await axios.get(`${API_URL}/api/agendamentos/status/${status}`);
        return response.data;
    },

    // Listar por dentista e data
    async listarPorDentistaEData(dentistaId: number, data: string) {
        const response = await axios.get(`${API_URL}/api/agendamentos/dentista/${dentistaId}/data/${data}`);
        return response.data;
    },

    // Confirmar agendamento
    async confirmar(id: number, usuario: string) {
        const params = { usuario };
        const response = await axios.patch(`${API_URL}/api/agendamentos/${id}/confirmar`, null, { params });
        return response.data;
    },

    // Iniciar atendimento
    async iniciarAtendimento(id: number, usuario: string) {
        const params = { usuario };
        const response = await axios.patch(`${API_URL}/api/agendamentos/${id}/iniciar-atendimento`, null, { params });
        return response.data;
    },

    // Concluir agendamento
    async concluir(id: number, usuario: string) {
        const params = { usuario };
        const response = await axios.patch(`${API_URL}/api/agendamentos/${id}/concluir`, null, { params });
        return response.data;
    },

    // Cancelar agendamento
    async cancelar(id: number, motivo: string, usuario: string) {
        const params = { motivo, usuario };
        const response = await axios.patch(`${API_URL}/api/agendamentos/${id}/cancelar`, null, { params });
        return response.data;
    },

    // Marcar falta
    async marcarFalta(id: number, usuario: string) {
        const params = { usuario };
        const response = await axios.patch(`${API_URL}/api/agendamentos/${id}/marcar-falta`, null, { params });
        return response.data;
    },

    // Deletar agendamento
    async deletar(id: number) {
        await axios.delete(`${API_URL}/api/agendamentos/${id}`);
    },

    // Verificar disponibilidade
    async verificarDisponibilidade(dentistaId: number, data: string, horaInicio: string, horaFim: string) {
        const params = { dentistaId, data, horaInicio, horaFim };
        const response = await axios.get(`${API_URL}/api/agendamentos/verificar-disponibilidade`, { params });
        return response.data.disponivel;
    },

    // Buscar agendamentos para lembrete
    async buscarAgendamentosParaLembrete(data: string) {
        const response = await axios.get(`${API_URL}/api/agendamentos/lembretes/${data}`);
        return response.data;
    },

    // Marcar lembrete enviado
    async marcarLembreteEnviado(id: number) {
        await axios.patch(`${API_URL}/api/agendamentos/${id}/marcar-lembrete-enviado`);
    },

    // HISTÓRICO

    // Buscar histórico por agendamento
    async buscarHistoricoPorAgendamento(agendamentoId: number) {
        const response = await axios.get(`${API_URL}/api/agendamentos/historico/agendamento/${agendamentoId}`);
        return response.data;
    },

    // Buscar histórico por usuário
    async buscarHistoricoPorUsuario(usuario: string) {
        const response = await axios.get(`${API_URL}/api/agendamentos/historico/usuario/${usuario}`);
        return response.data;
    },

    // Buscar histórico por ação
    async buscarHistoricoPorAcao(acao: string) {
        const response = await axios.get(`${API_URL}/api/agendamentos/historico/acao/${acao}`);
        return response.data;
    },

    // Buscar histórico por período
    async buscarHistoricoPorPeriodo(inicio: string, fim: string) {
        const params = { inicio, fim };
        const response = await axios.get(`${API_URL}/api/agendamentos/historico/periodo`, { params });
        return response.data;
    },

    // FILA DE ESPERA

    // Criar fila de espera
    async criarFilaEspera(fila: any) {
        const response = await axios.post(`${API_URL}/api/fila-espera`, fila);
        return response.data;
    },

    // Atualizar fila de espera
    async atualizarFilaEspera(id: number, fila: any) {
        const response = await axios.put(`${API_URL}/api/fila-espera/${id}`, fila);
        return response.data;
    },

    // Buscar fila por ID
    async buscarFilaEsperaPorId(id: number) {
        const response = await axios.get(`${API_URL}/api/fila-espera/${id}`);
        return response.data;
    },

    // Listar todas as filas
    async listarTodasFilas() {
        const response = await axios.get(`${API_URL}/api/fila-espera`);
        return response.data;
    },

    // Listar filas por status
    async listarFilasPorStatus(status: string) {
        const response = await axios.get(`${API_URL}/api/fila-espera/status/${status}`);
        return response.data;
    },

    // Listar filas por paciente
    async listarFilasPorPaciente(pacienteId: number) {
        const response = await axios.get(`${API_URL}/api/fila-espera/paciente/${pacienteId}`);
        return response.data;
    },

    // Listar filas por dentista
    async listarFilasPorDentista(dentistaId: number) {
        const response = await axios.get(`${API_URL}/api/fila-espera/dentista/${dentistaId}`);
        return response.data;
    },

    // Listar filas ativas
    async listarFilasAtivas() {
        const response = await axios.get(`${API_URL}/api/fila-espera/ativas`);
        return response.data;
    },

    // Notificar fila
    async notificarFila(id: number) {
        const response = await axios.patch(`${API_URL}/api/fila-espera/${id}/notificar`);
        return response.data;
    },

    // Converter fila em agendamento
    async converterFilaEmAgendamento(id: number, agendamentoId: number) {
        const params = { agendamentoId };
        const response = await axios.patch(`${API_URL}/api/fila-espera/${id}/converter`, null, { params });
        return response.data;
    },

    // Cancelar fila
    async cancelarFila(id: number) {
        const response = await axios.patch(`${API_URL}/api/fila-espera/${id}/cancelar`);
        return response.data;
    },

    // Expirar filas antigas
    async expirarFilasAntigas(dataLimite: string) {
        const params = { dataLimite };
        await axios.post(`${API_URL}/api/fila-espera/expirar`, null, { params });
    },

    // Deletar fila
    async deletarFila(id: number) {
        await axios.delete(`${API_URL}/api/fila-espera/${id}`);
    }
};