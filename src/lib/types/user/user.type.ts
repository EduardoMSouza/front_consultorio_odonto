// types/user.type.ts

export interface UserResponse {
    id: number;
    nome: string;
    username: string;
    email: string;
    role: UserRole;
    ativo: boolean;
    ultimoLogin: string; // ISO 8601 date string
    criadoEm: string;    // ISO 8601 date string
    atualizadoEm: string;// ISO 8601 date string
    criadoPor: string;
}

export interface UserRequest {
    nome: string;
    username: string;
    email: string;
    senha: string;
    role: UserRole;
    ativo?: boolean;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    PACIENTE = 'PACIENTE',
    DENTISTA = 'DENTISTA',
    RECEPCIONISTA = 'RECEPCIONISTA'
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}