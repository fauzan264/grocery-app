import { Trash2, AlertTriangle } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-error/10 p-3 rounded-full">
            <AlertTriangle className="text-error" size={24} />
          </div>
          <h3 className="font-bold text-lg">Confirm Delete</h3>
        </div>
        <p className="py-4 text-base-content/70">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-base-content">"{itemName}"</span>?
        </p>
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn bg-red-500 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading loading-spinner loading-sm"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
}
