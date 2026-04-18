"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRestaurantStore } from "@/features/restaurant/store/restaurant.store";
import { Restaurant } from "@/features/restaurant/types";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { Card } from "@/shared/components/ui/card";
import { PageWrapper } from "@/shared/components/custom/PageWrapper";
import { toast } from "@/shared/components/ui/use-toast";
import { Star, Phone, MapPin, User, Trash2, ArrowLeft, Pencil } from "lucide-react";
import { DeleteConfirmModal } from "@/shared/components/custom/DeleteConfirmModal";
import { RestaurantTablesSection } from "@/features/tables/components/RestaurantTablesSection";
import { useTableStore } from "@/features/tables/store/table.store";


export default function DetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getBySlug, deleteRestaurant, loadRestaurants, restaurants } = useRestaurantStore();
  const { getTablesForRestaurant, addTable } = useTableStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  useEffect(() => {
    if (params.slug && typeof params.slug === "string") {
      const data = getBySlug(params.slug);
      setRestaurant(data || null);

      // Auto-seed 4 starter tables for new restaurants that have none
      if (data) {
        const existing = getTablesForRestaurant(data.slug);
        if (existing.length === 0) {
          ["T-01", "T-02", "T-03", "T-04"].forEach((name, i) =>
            addTable(data.slug, name, [2, 4, 4, 6][i])
          );
        }
      }
    }
    setLoading(false);
  }, [params.slug, getBySlug, restaurants, getTablesForRestaurant, addTable]);

  const handleDelete = () => {
    if (!restaurant) return;
    deleteRestaurant(restaurant.id);
    toast({
      title: "Restaurant Removed",
      description: "The listing has been permanently deleted.",
      variant: "destructive"
    });
    router.push("/restaurants");
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-300 dark:text-slate-600"}
      />
    ));

  if (loading) return <div className="text-center p-20 text-slate-400">Loading details...</div>;

  if (!restaurant) return (
    <div className="text-center p-24 flex flex-col items-center gap-4 border-2 border-dashed border-slate-200 rounded-3xl m-8">
      <h2 className="text-3xl font-bold text-slate-800">Restaurant Not Found</h2>
      <p className="text-slate-500 max-w-md">The restaurant you are looking for does not exist or has been removed.</p>
      <Link href="/restaurants" className="mt-4">
        <Button variant="outline" className="rounded-full">← Back to directory</Button>
      </Link>
    </div>
  );

  const rating = restaurant.rating ?? 4.5;

  return (
    <>
    <PageWrapper>
      <div className="space-y-8">

        {/* Top Nav */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 rounded-full px-6 gap-2">
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="flex items-center gap-3">
            <Link href={`/manage/restaurant/${restaurant?.slug}/edit`}>
              <Button variant="outline" className="rounded-full gap-2 border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-500/10 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all">
                <Pencil size={14} /> Edit
              </Button>
            </Link>
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="rounded-full gap-2">
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl dark:shadow-none group bg-slate-900">
          <img
            src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"}
            className="w-full h-[400px] object-cover group-hover:scale-105 transition duration-700 opacity-80"
            alt={restaurant.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-8 text-white space-y-2 z-10">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
              {restaurant.type}
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-md">{restaurant.name}</h1>
            <div className="flex items-center gap-2">
              {renderStars(rating)}
              <span className="font-bold text-yellow-300 text-lg ml-1">{rating}</span>
              <span className="text-slate-300 text-sm">/5.0</span>
            </div>
          </div>
        </div>

        {/* Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Rating", value: `${rating} / 5`, icon: "⭐" },
            { label: "Type", value: restaurant.type || "—", icon: "🍽️" },
            { label: "City", value: restaurant.address?.city || "—", icon: "🏙️" },
            { label: "Pincode", value: restaurant.address?.pincode || "—", icon: "📮" }
          ].map(stat => (
            <Card key={stat.label} className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 space-y-4 md:col-span-2 rounded-3xl border border-slate-100 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-4 flex items-center gap-2">
              <MapPin size={18} className="text-indigo-500" /> Location &amp; Address
            </h3>
            <p className="font-bold text-slate-800 dark:text-white text-lg">{restaurant.address?.line1 || "—"}</p>
            <p className="text-slate-600 dark:text-slate-300">{restaurant.address?.area}, {restaurant.address?.city}</p>
            <p className="text-slate-600 dark:text-slate-300">{restaurant.address?.state} — {restaurant.address?.pincode}</p>
          </Card>

          <Card className="p-8 space-y-5 rounded-3xl border border-slate-100 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-4 flex items-center gap-2">
              <User size={18} className="text-indigo-500" /> Contact Info
            </h3>
            <div>
              <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Owner</span>
              <strong className="text-slate-800 dark:text-white flex items-center gap-2">
                <User size={14} className="text-slate-400" /> {restaurant.owner || "Not provided"}
              </strong>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Phone</span>
              <strong className="text-slate-800 dark:text-white flex items-center gap-2">
                <Phone size={14} className="text-slate-400" /> {restaurant.mobile || "Not provided"}
              </strong>
            </div>
          </Card>
        </div>

        {/* ── Tables & Bookings ─────────────────────────────── */}
        <RestaurantTablesSection restaurantSlug={restaurant.slug} />

      </div>
    </PageWrapper>

    <DeleteConfirmModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={handleDelete}
      restaurantName={restaurant?.name}
    />
    </>
  );
}
