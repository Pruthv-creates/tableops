import { Card, CardContent } from "@/shared/components/ui/card";
import Link from "next/link";
import { Restaurant } from "../types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const RestaurantCard = ({ 
  restaurant, 
  isSelected, 
  onSelect 
}: { 
  restaurant: Restaurant, 
  isSelected?: boolean, 
  onSelect?: (id: string) => void 
}) => {
  return (
    <motion.div 
      whileHover={{ scale: isSelected ? 1 : 1.03 }} 
      transition={{ type: "spring", stiffness: 400, damping: 25 }} 
      className="h-full relative group"
    >
      {/* Selection Overlay */}
      {onSelect && (
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(restaurant.id);
          }}
          className={cn(
            "absolute top-3 right-3 z-30 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300",
            isSelected 
              ? "bg-indigo-600 border-indigo-600 scale-110 shadow-lg shadow-indigo-600/30" 
              : "bg-white/40 backdrop-blur-md border-white/60 hover:bg-white/60 opacity-0 group-hover:opacity-100"
          )}
        >
          {isSelected && <Check size={14} className="text-white font-bold" />}
        </div>
      )}

      <Link href={`/restaurant/${restaurant.slug}`}>
        <Card className={cn(
          "group overflow-hidden rounded-2xl transition-all duration-500 h-full flex flex-col bg-white/70 dark:bg-white/5 backdrop-blur-xl border-2 dark:hover:border-white/20",
          isSelected 
            ? "border-indigo-600 shadow-2xl scale-[0.98] ring-4 ring-indigo-600/10" 
            : "border-slate-200 dark:border-white/10 hover:shadow-2xl"
        )}>
          <div className="relative overflow-hidden group-hover:shadow-inner">
            <img
              src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80"}
              className={cn(
                "h-48 w-full object-cover transition duration-500 ease-out",
                !isSelected && "group-hover:scale-105"
              )}
              alt={restaurant.name}
            />

            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold tracking-wide rounded-full shadow-sm text-slate-800">
              {restaurant.type || "Dining"}
            </span>
          </div>

          <CardContent className="p-5 flex-grow flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-start gap-3">
                <h2 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight truncate">{restaurant.name}</h2>
                <div className="bg-green-600 text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm shrink-0">
                  ★ {restaurant.rating || "4.5"}
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-1.5 flex items-center gap-1 truncate">
                <span className="text-base shrink-0">📍</span> {restaurant.address?.area || 'Area'}, {restaurant.address?.city || 'City'}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
