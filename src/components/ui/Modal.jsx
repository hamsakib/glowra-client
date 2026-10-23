"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/format";
import { Button } from "./Button";

/** Accessible modal built on the native <dialog> element (focus trap + Esc handled by the browser). */
export function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-xl border border-border bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        size === "lg" ? "max-w-2xl" : "max-w-md",
      )}
    >
      {open && (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-border p-6">
            <div>
              <h2 id={titleId} className="heading-3">{title}</h2>
              {description && <p className="mt-1 text-sm text-muted-fg">{description}</p>}
            </div>
            <button type="button" onClick={onClose} className="rounded-xl p-1.5 text-muted-fg hover:bg-muted hover:text-fg" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto p-6">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-border p-4">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, description, confirmLabel = "Delete", loading }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-muted-fg">{description}</p>
    </Modal>
  );
}
