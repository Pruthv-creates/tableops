"use client";

import { useEffect, useState, useMemo } from "react";
import { useRestaurantStore } from "@/features/restaurant/store/restaurant.store";
import { RestaurantList } from "@/features/restaurant/components/RestaurantList";
import { SearchBar } from "@/shared/components/custom/SearchBar";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { PageWrapper } from "@/shared/components/custom/PageWrapper";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const RESTAURANT_TYPES = ["All", "Cafe", "Fine Dining", "Fast Food", "Cloud Kitchen"];
const PAGE_SIZE = 8;

export default function RestaurantsPage() {
  const { restaurants, loadRestaurants } = useRestaurantStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeType]);

  const filtered = useMemo(() => {
    return restaurants.filter(r => {
      const matchesSearch =
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address?.city?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === "All" || r.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [restaurants, searchQuery, activeType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageWrapper>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              All Restaurants
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
              {activeType !== "All" && (
                <span className="ml-2 text-indigo-500 font-bold">· {activeType}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(v => !v)}
              className={cn(
                "flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border transition-all",
                showFilters
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                  : "bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
              )}
            >
              <SlidersHorizontal size={15} />
              Filters {showFilters && <X size={13} />}
            </button>
            <Link href="/manage/restaurant/add">
              <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
                ➕ Add New
              </Button>
            </Link>
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div className="space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {showFilters && (
            <div className="flex flex-wrap gap-2 pt-1">
              {RESTAURANT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200",
                    activeType === type
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                      : "bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                  )}
                >
                  {type}
                  {activeType === type && activeType !== "All" && (
                    <span className="ml-1.5 text-indigo-200 text-xs">
                      ({filtered.length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Restaurant Grid */}
        <RestaurantList
          restaurants={paginated}
          emptyMessage={
            <div className="mt-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl p-16 text-center bg-white/50 dark:bg-white/5 backdrop-blur-sm">
              <p className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                No restaurants match your filters
              </p>
              <p className="text-sm text-slate-400 mb-6">
                Try adjusting the search or filter above.
              </p>
              <div className="flex gap-3 justify-center">
                {searchQuery && (
                  <Button variant="outline" className="rounded-full" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
                {activeType !== "All" && (
                  <Button variant="outline" className="rounded-full" onClick={() => setActiveType("All")}>
                    Clear Filter
                  </Button>
                )}
                <Link href="/manage/restaurant/add">
                  <Button className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    ➕ Add a restaurant
                  </Button>
                </Link>
              </div>
            </div>
          }
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Page {page} of {totalPages} · {filtered.length} total
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-full gap-1 disabled:opacity-40"
              >
                <ChevronLeft size={16} /> Prev
              </Button>

              {/* Page number pills */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-1 text-slate-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={cn(
                          "w-8 h-8 rounded-full text-sm font-bold transition-all",
                          page === p
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow"
                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                        )}
                      >
                        {p}
                      </button>
                    )
                  )
                }
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="rounded-full gap-1 disabled:opacity-40"
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
