export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    DENTISTA = 'DENTISTA',
    RECEPCIONISTA = 'RECEPCIONISTA'
}

export interface UserRequest {
    nome: string;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
}

export interface UserResponse {
    id: number;
    nome: string;
    username: string;
    email: string;
    role: UserRole;
    ativo: boolean;
    ultimoLogin: string | null;
    criadoEm: string;
    atualizadoEm: string;
    criadoPor: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface UserStatistics {
    total: number;
    ativos: number;
    inativos: number;
    porRole: Record<string, number>;
}