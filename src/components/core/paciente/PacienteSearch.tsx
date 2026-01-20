// components/pacientes/PacienteSearch.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface PacienteSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearch?: (term: string) => void;
    placeholder?: string;
    className?: string;
}

export const PacienteSearch: React.FC<PacienteSearchProps> = ({
                                                                  searchTerm,
                                                                  onSearchChange,
                                                                  onSearch,
                                                                  placeholder = "Buscar por nome, CPF, RG, data de nascimento ou prontuário...",
                                                                  className = "",
                                                              }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim() && onSearch) {
            e.preventDefault();
            onSearch(searchTerm.trim());
        }
    };

    return (
        <div className={`w-full space-y-1.5 ${className}`}>
            <div className="relative">
                {/* Ícone estático - sem hover */}
                <div className="
                    absolute inset-y-0 left-0 pl-4
                    flex items-center pointer-events-none
                ">
                    <div className="relative flex items-center justify-center">
                        {/* Ícone principal */}
                        <Search
                            className="
                                h-5 w-5 relative z-10
                                text-muted-foreground/70
                            "
                        />
                    </div>
                </div>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`
                        w-full
                        pl-11 pr-5 py-3.5
                        bg-background/70
                        backdrop-blur-sm
                        border border-input/70
                        text-sm text-foreground
                        rounded-xl
                        shadow-sm
                        transition-all duration-250
                        placeholder:text-muted-foreground/55
                        
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-emerald-400/40
                        focus-visible:border-emerald-400/50
                        focus-visible:shadow-emerald
                        focus-visible:shadow-md
                    `}
                />

                {/* Efeito de gradiente apenas no focus */}
                <div className="
                    pointer-events-none
                    absolute inset-0
                    rounded-xl
                    bg-gradient-to-r from-emerald-500/[0.03] via-transparent to-sky-500/[0.03]
                    opacity-0
                    focus-within:opacity-100
                    transition-opacity duration-300
                "/>
            </div>

            {/* Dica */}
            <div className="px-1.5">
                <p className="
                    text-xs
                    text-muted-foreground/70
                    tracking-tight
                    font-light
                ">
                    Exemplos: <span className="text-emerald-600/70">05/08/1990</span> •
                    <span className="text-emerald-600/70"> 123.456.789-00</span> •
                    <span className="text-emerald-600/70"> 12.345.678-9</span> •
                    <span className="text-emerald-600/70"> João Silva</span>
                </p>
            </div>
        </div>
    );
};