// services/user.service.ts


import {PageResponse, UserRequest, UserResponse, UserRole} from "@/lib/types/user/user.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class UserService {
    private static baseUrl = `${API_URL}/api/users`;

    private static getHeaders(token?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    static async criar(request: UserRequest, token: string): Promise<UserResponse> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(token),
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Erro ao criar usuário');
        return response.json();
    }

    static async buscarPorId(id: number, token: string): Promise<UserResponse> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Usuário não encontrado');
        return response.json();
    }

    static async buscarPorUsername(username: string, token: string): Promise<UserResponse> {
        const response = await fetch(`${this.baseUrl}/username/${username}`, {
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Usuário não encontrado');
        return response.json();
    }

    static async buscarPorEmail(email: string, token: string): Promise<UserResponse> {
        const response = await fetch(`${this.baseUrl}/email/${encodeURIComponent(email)}`, {
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Usuário não encontrado');
        return response.json();
    }

    static async atualizar(id: number, request: UserRequest, token: string): Promise<UserResponse> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(token),
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Erro ao atualizar usuário');
        return response.json();
    }

    static async deletar(id: number, token: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Erro ao deletar usuário');
    }

    static async listarTodos(page = 0, size = 20, token: string): Promise<PageResponse<UserResponse>> {
        const response = await fetch(`${this.baseUrl}?page=${page}&size=${size}&sort=nome,asc`, {
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Erro ao listar usuários');
        return response.json();
    }

    static async buscar(termo: string, page = 0, size = 20, token: string): Promise<PageResponse<UserResponse>> {
        const url = termo
            ? `${this.baseUrl}/buscar?termo=${encodeURIComponent(termo)}&page=${page}&size=${size}&sort=nome,asc`
            : `${this.baseUrl}?page=${page}&size=${size}&sort=nome,asc`;

        const response = await fetch(url, {
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        return response.json();
    }

    static async listarPorStatus(ativo: boolean, page = 0, size = 20, token: string): Promise<PageResponse<UserResponse>> {
        const response = await fetch(`${this.baseUrl}/status/${ativo}?page=${page}&size=${size}&sort=nome,asc`, {
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Erro ao listar usuários por status');
        return response.json();
    }

    static async listarPorRole(role: UserRole, page = 0, size = 20, token: string): Promise<PageResponse<UserResponse>> {
        const response = await fetch(`${this.baseUrl}/role/${role}?page=${page}&size=${size}&sort=nome,asc`, {
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Erro ao listar usuários por role');
        return response.json();
    }

    static async ativar(id: number, token: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}/ativar`, {
            method: 'PATCH',
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Erro ao ativar usuário');
    }

    static async inativar(id: number, token: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}/inativar`, {
            method: 'PATCH',
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Erro ao inativar usuário');
    }

    static async me(token: string): Promise<UserResponse> {
        const response = await fetch(`${this.baseUrl}/me`, {
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Erro ao buscar dados do usuário');
        return response.json();
    }

    static async estatisticas(token: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/estatisticas`, {
            headers: this.getHeaders(token),
        });
        if (!response.ok) throw new Error('Erro ao buscar estatísticas');
        return response.json();
    }
}