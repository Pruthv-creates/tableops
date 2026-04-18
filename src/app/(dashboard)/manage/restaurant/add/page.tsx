"use client";

import { RestaurantForm } from "@/features/restaurant/components/RestaurantForm";
import { BulkImport } from "@/features/restaurant/components/BulkImport";
import { GoogleMapsImport } from "@/features/restaurant/components/GoogleMapsImport";
import { useRestaurantStore } from "@/features/restaurant/store/restaurant.store";
import { generateSlug } from "@/shared/utils/slug";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/shared/components/custom/PageWrapper";
import { toast } from "@/shared/components/ui/use-toast";
import { Card } from "@/shared/components/ui/card";

import { useState } from "react";

export default function AddRestaurant() {
  const { addRestaurant } = useRestaurantStore();
  const router = useRouter();
  const [importQueue, setImportQueue] = useState<any[]>([]);
  const [totalQueueSize, setTotalQueueSize] = useState(0);

  const handleSubmit = (data: any) => {
    // 1. Save data correctly
    addRestaurant({
      ...data,
      id: Date.now().toString(),
      slug: generateSlug(data.name),
    });

    // 2. Queue logic
    if (importQueue.length > 0) {
      const remaining = importQueue.slice(1);
      setImportQueue(remaining);

      if (remaining.length === 0) {
        toast({ title: "Import Successful", description: `Finished reviewing all ${totalQueueSize} items! 🎯` });
        router.push("/restaurants");
      } else {
        toast({ title: "Saved & Next", description: `Progress: ${totalQueueSize - remaining.length} / ${totalQueueSize}` });
      }
    } else {
      toast({ title: "Restaurant Added", description: "Successfully created 🎉" });
      router.push("/restaurants");
    }
  };

  const skipItem = () => {
    if (importQueue.length > 0) {
      const remaining = importQueue.slice(1);
      setImportQueue(remaining);
      if (remaining.length === 0) {
        toast({ title: "Queue Complete", description: "All items reviewed/skipped." });
        router.push("/restaurants");
      }
    }
  };

  const handleBulkImport = (data: any[]) => {
    const queueWithIds = data.map((item, i) => ({ ...item, id: `queue-${Date.now()}-${i}` }));
    setImportQueue(queueWithIds);
    setTotalQueueSize(data.length);
    
    toast({
      title: "Queue Loaded",
      description: `${data.length} restaurants ready for review. 📋`
    });
  };

  const handleMapsImport = (data: any) => {
    setImportQueue([{ ...data, id: `maps-${Date.now()}` }]);
    setTotalQueueSize(1);
    
    if (!data.name) {
      toast({
        title: "⚠️ Name Not Found",
        description: "Location details loaded. Please type the restaurant name manually."
      });
    } else {
      toast({
        title: "✅ Loaded into form",
        description: `"${data.name}" — review the details below before saving.`
      });
    }
  };

  return (
    <PageWrapper>
      <div className="py-2">
        <div className="mb-6 px-4 sm:px-0">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Add New Restaurant</h1>
          <p className="text-slate-500 text-sm mt-1">Create a new listing manually or upload a batch via CSV.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT - MAIN FORM */}
          <div className="lg:col-span-2">
            <RestaurantForm 
              onSubmit={handleSubmit} 
              initialData={importQueue[0]} 
              onSkip={skipItem}
              queueInfo={importQueue.length > 0 ? {
                current: totalQueueSize - importQueue.length + 1,
                total: totalQueueSize
              } : undefined}
            />
          </div>

          {/* RIGHT - SIDEBAR */}
          <div className="space-y-6">
            <GoogleMapsImport onImport={handleMapsImport} />
            <BulkImport onImport={handleBulkImport} />

            {/* Help Card */}
            <Card className="p-5 rounded-[24px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Best Practices</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 flex-shrink-0 mt-0.5">•</span> 
                  <span>Use precise, official restaurant names.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 flex-shrink-0 mt-0.5">•</span> 
                  <span>Provide accurate locality details for better map routing & search engine viability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 flex-shrink-0 mt-0.5">•</span> 
                  <span>Choose the appropriate category type.</span>
                </li>
              </ul>
            </Card>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
