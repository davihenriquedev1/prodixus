"use client";

interface FolderDeleteDialogProps {
  open: boolean;
  folderName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function FolderDeleteDialog({
  open,
  folderName,
  onClose,
  onConfirm,
}: FolderDeleteDialogProps) {
  if (!open) {
    return null;
  }

  async function handleConfirm() {
    await onConfirm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-[#0D0F14] p-5 shadow-2xl">
        <h2 className="text-sm font-semibold text-slate-100">Excluir pasta</h2>

        <p className="mt-2 text-sm text-slate-400">
          Tem certeza que deseja excluir a pasta{" "}
          <span className="font-medium text-slate-200">{folderName}</span>?
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
