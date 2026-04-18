"use client";

import { useState } from "react";
import { useTableStore } from "@/features/tables/store/table.store";
import { TableCard } from "./TableCard";
import { BookTableModal } from "./BookTableModal";
import { AddTableModal } from "./AddTableModal";
import { RestaurantTable } from "../types";
import {
  LayoutGrid, CheckCircle, XCircle, Users, Search, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "all" | "available" | "booked";

interface Props {
  restaurantSlug: string;
}

export function RestaurantTablesSection({ restaurantSlug }: Props) {
  const { getTablesForRestaurant, getActiveBooking } = useTableStore();

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [bookingTarget, setBookingTarget] = useState<RestaurantTable | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Live-derived from store — always fresh
  const allTables = getTablesForRestaurant(restaurantSlug);

  // Derive status from booking list (not just the table flag)
  const withStatus = allTables.map((t) => {
    const active = getActiveBooking(t.id);
    return { ...t, _isBooked: t.status === "booked" || !!active };
  });

  const available = withStatus.filter((t) => !t._isBooked).length;
  const booked = withStatus.filter((t) => t._isBooked).length;
  const occupancy = allTables.length
    ? Math.round((booked / allTables.length) * 100)
    : 0;

  const filtered = withStatus.filter((t) => {
    const matchFilter =
      filter === "all" ||
      (filter === "available" && !t._isBooked) ||
      (filter === "booked" && t._isBooked);
    const active = getActiveBooking(t.id);
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      active?.guestName?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <section className="space-y-6">
      {/* ── Section header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
                      bg-white/60 dark:bg-white/5 backdrop-blur-xl p-5 rounded-[24px]
                      border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-[-50%] right-[-10%] w-[250px] h-[250px] bg-indigo-500/10
                        blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-500/15
                        transition-all duration-1000" />
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid size={20} className="text-indigo-500" />
            Tables &amp; Bookings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {allTables.length} tables · {occupancy}% occupancy today
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full
                     bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs
                     shadow-md shadow-indigo-500/20 hover:scale-105 transition-all"
        >
          <Plus size={14} /> Add Table
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-4 border bg-white/60 dark:bg-white/5 border-slate-200
                        dark:border-white/10 backdrop-blur-xl text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{allTables.length}</p>
        </div>
        <div className="rounded-2xl p-4 border bg-emerald-50/60 dark:bg-emerald-500/5
                        border-emerald-200/60 dark:border-emerald-500/20 backdrop-blur-xl text-center">
          <CheckCircle size={14} className="text-emerald-500 mx-auto mb-1" />
          <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Available</p>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{available}</p>
        </div>
        <div className="rounded-2xl p-4 border bg-rose-50/60 dark:bg-rose-500/5
                        border-rose-200/60 dark:border-rose-500/20 backdrop-blur-xl text-center">
          <XCircle size={14} className="text-rose-500 mx-auto mb-1" />
          <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Booked</p>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-400">{booked}</p>
        </div>
      </div>

      {/* ── Filter + search ────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-white/5 border
                        border-slate-200 dark:border-white/10 rounded-full px-2 py-1.5
                        backdrop-blur-xl">
          {(["all", "available", "booked"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all",
                filter === f
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              )}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search table or guest…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-full border border-slate-200
                       dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl
                       text-slate-800 dark:text-white placeholder:text-slate-400 outline-none
                       focus:ring-2 focus:ring-indigo-500/30 transition w-48"
          />
        </div>

        {/* Occupancy pill */}
        <div className="ml-auto flex items-center gap-1 text-[11px] text-slate-500
                        dark:text-slate-400 px-3 py-1.5 bg-white/60 dark:bg-white/5
                        rounded-full border border-slate-200 dark:border-white/10 font-medium">
          <Users size={11} /> {occupancy}% occupancy
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────────── */}
      {allTables.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl
                        p-12 text-center bg-white/40 dark:bg-white/5">
          <p className="text-slate-400 dark:text-slate-500 font-medium">No tables yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white
                       dark:text-slate-900 text-xs font-bold hover:bg-indigo-600 transition-colors"
          >
            + Add First Table
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl
                        p-10 text-center bg-white/40 dark:bg-white/5">
          <p className="text-slate-400 dark:text-slate-500 text-sm">No tables match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onBook={(t) => setBookingTarget(t)}
            />
          ))}
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────── */}
      {bookingTarget && (
        <BookTableModal
          table={bookingTarget}
          onClose={() => setBookingTarget(null)}
        />
      )}
      {showAddModal && (
        <AddTableModal
          restaurantSlug={restaurantSlug}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </section>
  );
}
