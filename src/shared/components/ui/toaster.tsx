"use client";
import { useToastStore } from "./use-toast";
import { motion, AnimatePresence } from "framer-motion";

export const Toaster = () => {
  const toasts = useToastStore((state) => state.toasts);
  
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`pointer-events-auto flex flex-col gap-1 w-[350px] p-5 rounded-xl shadow-xl border backdrop-blur-md ${
              t.variant === "destructive" 
                ? "bg-red-500/90 text-white border-red-600 shadow-red-500/20" 
                : "bg-white/90 text-slate-900 border-slate-200 dark:bg-slate-900/90 dark:text-slate-100 dark:border-slate-800"
            }`}
          >
            {t.title && <h4 className="font-bold text-sm tracking-tight">{t.title}</h4>}
            {t.description && <p className="text-sm opacity-80">{t.description}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
