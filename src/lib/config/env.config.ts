// lib/config/env.config.ts

/**
 * Configuração centralizada de todas as variáveis de ambiente
 */

// Funções auxiliares
function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (!value && !defaultValue) {
        throw new Error(`❌ Variável de ambiente ${key} não encontrada!`);
    }
    return value || '';
}

function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
}

function getEnvNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (!value) {
        if (defaultValue !== undefined) return defaultValue;
        throw new Error(`❌ Variável de ambiente ${key} não encontrada!`);
    }
    return parseInt(value, 10);
}

/**
 * Configurações da aplicação
 */
export const envConfig = {
    // ==================== API ====================
    api: {
        baseUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:8080'),
        timeout: getEnvNumber('NEXT_PUBLIC_API_TIMEOUT', 30000),
    },

    // ==================== STORAGE KEYS ====================
    storage: {
        keys: {
            accessToken: getEnvVar('NEXT_PUBLIC_STORAGE_ACCESS_TOKEN_KEY', 'access_token'),
            refreshToken: getEnvVar('NEXT_PUBLIC_STORAGE_REFRESH_TOKEN_KEY', 'refresh_token'),
            user: getEnvVar('NEXT_PUBLIC_STORAGE_USER_KEY', 'user'),
            tokenExpires: getEnvVar('NEXT_PUBLIC_STORAGE_TOKEN_EXPIRES_KEY', 'token_expires_at'),
        },
    },

    // ==================== COOKIE NAMES ====================
    cookies: {
        names: {
            auth: getEnvVar('NEXT_PUBLIC_COOKIE_AUTH_NAME', 'isAuthenticated'),
            accessToken: getEnvVar('NEXT_PUBLIC_COOKIE_ACCESS_TOKEN_NAME', 'access_token'),
            refreshToken: getEnvVar('NEXT_PUBLIC_COOKIE_REFRESH_TOKEN_NAME', 'refresh_token'),
        },
        config: {
            domain: getEnvVar('NEXT_PUBLIC_COOKIE_DOMAIN', 'localhost'),
            secure: getEnvBoolean('NEXT_PUBLIC_COOKIE_SECURE', false),
            sameSite: getEnvVar('NEXT_PUBLIC_COOKIE_SAME_SITE', 'Strict') as 'Strict' | 'Lax' | 'None',
            maxAge: getEnvNumber('NEXT_PUBLIC_COOKIE_MAX_AGE', 604800), // 7 dias
        },
    },

    // ==================== ENCRYPTION ====================
    encryption: {
        // Fornece um valor padrão (APENAS para desenvolvimento)
        key: getEnvVar('NEXT_PUBLIC_ENCRYPTION_KEY', 'dev-default-key-change-in-production'),
        enabled: getEnvBoolean('NEXT_PUBLIC_ENCRYPTION_ENABLED', true),
    },

    // ==================== APP ====================
    app: {
        name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Consultório Odontológico'),
        version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
    },

    // ==================== TOKEN ====================
    token: {
        refreshBeforeExpiry: getEnvNumber('NEXT_PUBLIC_TOKEN_REFRESH_BEFORE_EXPIRY', 300000),
    },

    // ==================== DEVELOPMENT ====================
    dev: {
        debugMode: getEnvBoolean('NEXT_PUBLIC_DEBUG_MODE', false),
        showStorageData: getEnvBoolean('NEXT_PUBLIC_SHOW_STORAGE_DATA', false),
    },

    // ==================== ENVIRONMENT ====================
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
} as const;

// Validações em produção
if (envConfig.isProduction) {
    if (!envConfig.cookies.config.secure) {
        console.warn('⚠️ AVISO: COOKIE_SECURE deve ser true em produção!');
    }
    if (envConfig.encryption.key.includes('mude')) {
        throw new Error('❌ ERRO: Altere a ENCRYPTION_KEY em produção!');
    }
}

// Log em desenvolvimento
if (envConfig.dev.debugMode && typeof window !== 'undefined') {
    console.log('🔧 Configurações carregadas:', {
        api: envConfig.api.baseUrl,
        storageKeys: envConfig.storage.keys,
        cookieNames: envConfig.cookies.names,
        encryptionEnabled: envConfig.encryption.enabled,
    });
}

export default envConfig;