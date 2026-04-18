"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRestaurantStore } from "@/features/restaurant/store/restaurant.store";
import { RestaurantForm } from "@/features/restaurant/components/RestaurantForm";
import { PageWrapper } from "@/shared/components/custom/PageWrapper";
import { Button } from "@/shared/components/ui/button";
import { toast } from "@/shared/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { generateSlug } from "@/shared/utils/slug";

export default function EditRestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const { getBySlug, updateRestaurant, loadRestaurants, restaurants } = useRestaurantStore();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  useEffect(() => {
    if (params.slug && typeof params.slug === "string") {
      const data = getBySlug(params.slug);
      setRestaurant(data || null);
    }
    setLoading(false);
  }, [params.slug, getBySlug, restaurants]);

  const handleSubmit = (data: any) => {
    if (!restaurant) return;

    const newSlug = generateSlug(data.name);

    updateRestaurant(restaurant.id, {
      ...data,
      slug: newSlug,
    });

    toast({
      title: "Changes Saved",
      description: `"${data.name}" has been updated successfully. ✅`,
    });

    router.push(`/restaurant/${newSlug}`);
  };

  if (loading) {
    return (
      <div className="text-center p-20 text-slate-400 animate-pulse">
        Loading restaurant data...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center p-24 flex flex-col items-center gap-4 border-2 border-dashed border-slate-200 rounded-3xl m-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          Restaurant Not Found
        </h2>
        <p className="text-slate-500 max-w-md">
          The restaurant you&apos;re trying to edit doesn&apos;t exist or has been removed.
        </p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-4 rounded-full"
        >
          ← Go Back
        </Button>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="py-2 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 rounded-full px-5 gap-2 shrink-0"
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Edit Restaurant
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Updating: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{restaurant.name}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <RestaurantForm
          onSubmit={handleSubmit}
          initialData={restaurant}
        />
      </div>
    </PageWrapper>
  );
}
