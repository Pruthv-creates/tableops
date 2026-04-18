"use client";

import React, { useState } from "react";
import { Restaurant } from "../types";
import { RestaurantCard } from "./RestaurantCard";
import { RestaurantSkeleton } from "./RestaurantSkeleton";
import { useRestaurantStore } from "../store/restaurant.store";
import { toast } from "@/shared/components/ui/use-toast";
import { Trash2, X, CheckSquare, Square } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { DeleteConfirmModal } from "@/shared/components/custom/DeleteConfirmModal";

interface RestaurantListProps {
  restaurants: Restaurant[];
  emptyMessage?: React.ReactNode;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, emptyMessage }) => {
  const { loading, deleteRestaurants } = useRestaurantStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    deleteRestaurants(selectedIds);
    toast({
      title: "Bulk Delete Successful",
      description: `Permanently removed ${selectedIds.length} listing${selectedIds.length > 1 ? "s" : ""}.`,
    });
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === restaurants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(restaurants.map(r => r.id));
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-[300px]">
            <RestaurantSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      emptyMessage || (
        <div className="text-center p-12 mt-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 bg-white/50 backdrop-blur-sm">
          No restaurants currently available.
        </div>
      )
    );
  }

  return (
    <div className="relative pb-24">
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 border-r border-white/20 dark:border-slate-200 pr-6 mr-2">
            <button onClick={toggleSelectAll} className="hover:opacity-70 transition-opacity">
              {selectedIds.length === restaurants.length ? <CheckSquare size={20} /> : <Square size={20} />}
            </button>
            <span className="font-bold whitespace-nowrap">{selectedIds.length} Selected</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkModal(true)}
              className="rounded-xl flex items-center gap-2 px-4 h-10 font-bold"
            >
              <Trash2 size={16} /> Delete All
            </Button>
            <button
              onClick={() => setSelectedIds([])}
              className="p-2 hover:bg-white/10 dark:hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            isSelected={selectedIds.includes(restaurant.id)}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Bulk Delete Modal */}
      <DeleteConfirmModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onConfirm={handleBulkDelete}
        restaurantName={
          selectedIds.length === 1
            ? restaurants.find(r => r.id === selectedIds[0])?.name
            : `${selectedIds.length} restaurants`
        }
      />
    </div>
  );
};
