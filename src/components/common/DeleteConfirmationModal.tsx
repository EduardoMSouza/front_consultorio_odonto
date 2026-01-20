// components/common/DeleteConfirmationModal.tsx
interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

export function DeleteConfirmationModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            title = "Confirmar Exclusão",
                                            message = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
                                            confirmText = "Excluir",
                                            cancelText = "Cancelar"
                                        }: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="glass-card rounded-xl p-6 max-w-md w-full mx-4 animate-fade-in-up">
                <h3 className="text-xl font-semibold mb-4 text-foreground">{title}</h3>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-border bg-background rounded-lg text-foreground hover:bg-secondary transition-base focus-ring"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md focus-ring"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}