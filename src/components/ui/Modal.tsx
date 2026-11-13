"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // A click on the dark backdrop closes the popup.
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2.5rem)] max-w-lg rounded-2xl border border-line bg-white p-0 text-ink shadow-xl backdrop:bg-black/50"
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="text-lg font-bold text-navy-900">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="cursor-pointer rounded-lg px-2 py-1 text-xl text-muted hover:bg-slate-100"
        >
          ✕
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-6 py-4 text-sm leading-relaxed">{children}</div>

      <div className="border-t border-line px-6 py-4 text-right">
        <Button type="button" onClick={onClose}>
          Close
        </Button>
      </div>
    </dialog>
  );
}