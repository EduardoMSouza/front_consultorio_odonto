// components/common/SearchBar.tsx
interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    onClear?: () => void;
    placeholder?: string;
    searchText?: string;
    clearText?: string;
}

export function SearchBar({
                              value,
                              onChange,
                              onSearch,
                              onClear,
                              placeholder = "Buscar...",
                              searchText = "Buscar",
                              clearText = "Limpar"
                          }: SearchBarProps) {
    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-base"
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
            <button
                onClick={onSearch}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md focus-ring"
            >
                {searchText}
            </button>
            {value && onClear && (
                <button
                    onClick={onClear}
                    className="px-4 py-2 border border-border bg-background rounded-lg hover:bg-secondary transition-base focus-ring"
                >
                    {clearText}
                </button>
            )}
        </div>
    );
}