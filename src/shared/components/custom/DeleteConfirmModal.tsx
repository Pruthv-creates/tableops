"use client";

import { useEffect, useRef } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  restaurantName?: string;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  restaurantName,
}: DeleteConfirmModalProps) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Trap focus and close on Escape
  useEffect(() => {
    if (!isOpen) return;
    confirmBtnRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal Panel */}
      <div
        className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mb-5">
          <AlertTriangle size={28} className="text-rose-500" />
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Delete Restaurant
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Are you sure you want to permanently delete{" "}
          {restaurantName ? (
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              &ldquo;{restaurantName}&rdquo;
            </span>
          ) : (
            "this restaurant"
          )}
          ? This action{" "}
          <span className="font-semibold text-rose-500">cannot be undone</span>.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-8">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-slate-200 dark:border-white/10 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            ref={confirmBtnRef}
            variant="destructive"
            className="flex-1 rounded-xl gap-2 shadow-lg shadow-rose-500/20"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <Trash2 size={15} />
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
