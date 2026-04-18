"use client";

import { useState } from "react";
import { RestaurantTable } from "../types";
import { useTableStore } from "../store/table.store";
import { cn } from "@/lib/utils";
import {
  Users, Clock, Trash2, CheckCircle, XCircle,
  CalendarDays, Phone,
} from "lucide-react";

interface Props {
  table: RestaurantTable;
  onBook: (table: RestaurantTable) => void;
}

function to12h(time24: string): string {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function TableCard({ table, onBook }: Props) {
  const { releaseTable, deleteTable, getActiveBooking } = useTableStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Derive live status from the bookings list (not just the table flag)
  const activeBooking = getActiveBooking(table.id);
  const isBooked = table.status === "booked" || !!activeBooking;

  return (
    <div
      className={cn(
        "group relative rounded-[20px] p-5 border transition-all duration-300 overflow-hidden flex flex-col gap-3",
        "bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-sm",
        isBooked
          ? "border-rose-400/60 dark:border-rose-500/40 shadow-rose-500/10"
          : "border-emerald-400/50 dark:border-emerald-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
      )}
    >
      {/* Ambient glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          isBooked ? "bg-rose-500/5" : "bg-emerald-500/5"
        )}
      />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
            {table.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <Users size={12} />
            <span>Capacity: {table.capacity}</span>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0",
            isBooked
              ? "text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30"
              : "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30"
          )}
        >
          {isBooked ? <XCircle size={11} /> : <CheckCircle size={11} />}
          {isBooked ? "Booked" : "Available"}
        </span>
      </div>

      {/* ── Active booking details ───────────────────────────── */}
      {isBooked && activeBooking ? (
        <div className="relative z-10 bg-rose-50/80 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 rounded-xl px-3 py-3 space-y-2">
          {/* Guest */}
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-[10px]">
              👤
            </span>
            {activeBooking.guestName}
          </p>

          {/* Mobile */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Phone size={10} className="shrink-0" />
            {activeBooking.mobile}
          </p>

          {/* Date */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CalendarDays size={10} className="shrink-0" />
            {formatDate(activeBooking.date)}
          </p>

          {/* Reserved time slot — disabled chip */}
          <div
            aria-label="Reserved time slot"
            className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-300/60 dark:border-rose-500/30 bg-rose-100/60 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[11px] font-bold select-none cursor-not-allowed"
          >
            <Clock size={11} />
            {to12h(activeBooking.time)}
            <span className="ml-1 text-[9px] font-medium opacity-60 uppercase tracking-wider">
              Reserved
            </span>
          </div>
        </div>
      ) : (
        /* ── Available indicator ──────────────────────────── */
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 italic">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Ready to accept guests
        </div>
      )}

      {/* ── Action buttons ──────────────────────────────────── */}
      <div className="relative z-10 flex gap-2 mt-auto pt-1">
        {!isBooked ? (
          <button
            onClick={() => onBook(table)}
            className="flex-1 text-xs font-bold py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-400 dark:hover:text-white transition-colors"
          >
            Book
          </button>
        ) : (
          <button
            onClick={() => releaseTable(table.id)}
            className="flex-1 text-xs font-semibold py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Release
          </button>
        )}

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-rose-500 hover:border-rose-300 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        ) : (
          <button
            onClick={() => deleteTable(table.id)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors text-xs font-bold"
          >
            ✓
          </button>
        )}
      </div>

      {/* Delete confirm hint */}
      {confirmDelete && (
        <p className="text-[10px] text-rose-500 text-right -mt-1 relative z-10">
          Tap ✓ to confirm &bull;{" "}
          <button className="underline" onClick={() => setConfirmDelete(false)}>
            cancel
          </button>
        </p>
      )}
    </div>
  );
}
