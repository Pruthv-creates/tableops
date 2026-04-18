"use client";

// The tables view is now embedded per-restaurant inside /restaurant/[slug].
// This route exists for direct URL access and shows all tables across restaurants.

import { useTableStore } from "@/features/tables/store/table.store";
import { TableCard } from "@/features/tables/components/TableCard";
import { BookTableModal } from "@/features/tables/components/BookTableModal";
import { PageWrapper } from "@/shared/components/custom/PageWrapper";
import { RestaurantTable } from "@/features/tables/types";
import { useState } from "react";
import { LayoutGrid, CheckCircle, XCircle } from "lucide-react";

export default function TablesPage() {
  const { tables, getActiveBooking } = useTableStore();
  const [bookingTarget, setBookingTarget] = useState<RestaurantTable | null>(null);

  const booked = tables.filter(
    (t) => t.status === "booked" || !!getActiveBooking(t.id)
  ).length;

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
                        bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 rounded-[24px]
                        border border-slate-200 dark:border-white/10 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <LayoutGrid className="text-indigo-500" size={28} /> All Tables
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Tables are managed per-restaurant — open a restaurant to book.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10
                            border border-emerald-200 dark:border-emerald-500/20 text-emerald-700
                            dark:text-emerald-400 text-xs font-bold">
              <CheckCircle size={13} /> {tables.length - booked} Available
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-500/10
                            border border-rose-200 dark:border-rose-500/20 text-rose-700
                            dark:text-rose-400 text-xs font-bold">
              <XCircle size={13} /> {booked} Booked
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map((t) => (
            <TableCard key={t.id} table={t} onBook={setBookingTarget} />
          ))}
        </div>
      </div>

      {bookingTarget && (
        <BookTableModal table={bookingTarget} onClose={() => setBookingTarget(null)} />
      )}
    </PageWrapper>
  );
}
