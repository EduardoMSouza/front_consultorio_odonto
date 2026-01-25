// formatPhone.formatter.ts

/**
 * Formata um número de telefone para o padrão (00) 0 0000-0000
 * @param value - Valor digitado pelo usuário
 * @returns Valor formatado no padrão (00) 0 0000-0000
 */
export const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 2) {
        return numbers.length > 0 ? `(${numbers}` : '';
    }

    if (numbers.length <= 3) {
        return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 3)}`;
    }

    if (numbers.length <= 7) {
        return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 3)} ${numbers.substring(3, 7)}`;
    }

    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 3)} ${numbers.substring(3, 7)}-${numbers.substring(7, 11)}`;
};

/**
 * Remove a formatação e retorna apenas os números
 * @param value - Valor formatado
 * @returns Apenas números
 */
export const unformatPhone = (value: string): string => {
    return value.replace(/\D/g, '');
};

/**
 * Verifica se o telefone está completo (11 dígitos)
 * @param value - Valor formatado ou não
 * @returns true se tiver 11 dígitos
 */
export const isPhoneComplete = (value: string): boolean => {
    return value.replace(/\D/g, '').length === 11;
};