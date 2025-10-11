"use client";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "approve" | "decline";
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "approve",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const confirmBtnClass =
        variant === "approve" ? "btn btn-success" : "btn btn-error";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="btn btn-outline">
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={confirmBtnClass}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
