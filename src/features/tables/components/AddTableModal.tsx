"use client";

import { useState } from "react";
import { useTableStore } from "../store/table.store";
import { X } from "lucide-react";

interface Props {
  restaurantSlug: string;
  onClose: () => void;
}

export function AddTableModal({ restaurantSlug, onClose }: Props) {
  const { addTable } = useTableStore();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("4");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addTable(restaurantSlug, name.trim(), parseInt(capacity, 10));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Table</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Table Name / Number
            </label>
            <input
              required
              type="text"
              placeholder="e.g. T-13 or Terrace 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Capacity
            </label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
            >
              {[2, 4, 6, 8, 10, 12].map((n) => (
                <option key={n} value={n}>{n} guests</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-400 text-white dark:text-slate-900 dark:hover:text-white font-semibold text-sm transition-colors"
          >
            Add Table
          </button>
        </form>
      </div>
    </div>
  );
}
