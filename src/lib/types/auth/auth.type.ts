// models/auth.type.ts
import {Role} from "better-auth/client";

export interface LoginRequest {
    login: string;      // email ou username
    password: string;
}

export interface RegisterRequest {
    nome: string;
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ChangePasswordRequest {
    senhaAtual: string;
    novaSenha: string;
    confirmacaoSenha: string;
}

// Response do backend
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;  // Note: Java usa Long, TypeScript usa number
    tokenType: string;
    user: UserResponse;
}

export interface UserResponse {
    id: number;
    nome: string;
    email: string;
    username?: string;
    role?: string;
    ativo: boolean;
    criadoEm?: string;
    // Campos adicionais do seu sistema
}

export interface UserRequest {
    nome: string;
    username: string;
    email: string;
    password: string;
    role: Role;
}

export interface AuthState {
    user: UserResponse | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthError {
    message: string;
    status?: number;
    fieldErrors?: Record<string, string[]>;
    errors?: string[];
}

export interface ApiErrorResponse {
    message?: string;
    fieldErrors?: Record<string, string[]>;
    errors?: string[];
    timestamp?: string;
    status?: number;
    path?: string;
}