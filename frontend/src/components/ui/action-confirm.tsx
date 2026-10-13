"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ActionConfirmProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  itemName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ActionConfirm({
  open,
  title,
  message,
  confirmLabel,
  itemName,
  onClose,
  onConfirm,
}: ActionConfirmProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isSubmitting, onClose]);

  if (!open || !mounted) {
    return null;
  }

  async function handleConfirm() {
    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={handleBackdropClick}
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-2xl">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>

        <p className="mt-2 text-sm text-muted">
          {message}{" "}
          <span className="font-medium text-foreground">{itemName}</span>?
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg px-3 py-2 text-xs text-muted hover:bg-surface-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Processando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
