"use client";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { FormEvent, useEffect, useRef } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const RestaurantForm = ({ 
  onSubmit, 
  initialData, 
  onSkip,
  queueInfo 
}: { 
  onSubmit: (data: any) => void, 
  initialData?: any,
  onSkip?: () => void,
  queueInfo?: { current: number, total: number }
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    onSubmit({
      name: formData.get("name"),
      owner: formData.get("owner"),
      mobile: formData.get("mobile"),
      type: formData.get("type"),
      image: formData.get("image"),
      rating: Number(formData.get("rating")) || 0,
      address: {
        line1: formData.get("line1"),
        area: formData.get("area"),
        city: formData.get("city"),
        state: formData.get("state"),
        pincode: formData.get("pincode"),
      },
    });
  };

  return (
    <Card className="w-full rounded-[24px] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl overflow-hidden">
      <CardContent className="p-6 lg:p-10">
        {queueInfo && (
          <div className="mb-8 flex items-center justify-between bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white animate-pulse">
                {queueInfo.current}
              </span>
              <div>
                <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Queue Review</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Processing {queueInfo.current} of {queueInfo.total} items</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-500/20">
              Skip this item
            </Button>
          </div>
        )}

        {/* Name missing banner */}
        {initialData && !initialData.name && (
          <div className="mb-4 flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 text-amber-700 dark:text-amber-300 text-sm">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>Google Maps couldn't auto-extract the name. Please type the restaurant name manually.</span>
          </div>
        )}

        <form key={initialData?.id || 'new'} onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-4">
            <div className="grid gap-4">
              <Input 
                name="name" 
                placeholder="Restaurant Name" 
                defaultValue={initialData?.name || ""}
                autoFocus={!!initialData && !initialData.name}
                className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                required 
              />
              
              <div className="relative">
                <select 
                  name="type" 
                  className="bg-slate-50 border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm w-full appearance-none text-slate-700" 
                  required
                  defaultValue={initialData?.type || ""}
                >
                  <option value="" disabled>Select Restaurant Type</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Fine Dining">Fine Dining</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Cloud Kitchen">Cloud Kitchen</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  ⌄
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  name="image" 
                  placeholder="Cover Image URL (Optional)" 
                  defaultValue={initialData?.image || ""}
                  className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                />
                <Input 
                  name="rating" 
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="Rating (0-5)" 
                  defaultValue={initialData?.rating || "4.5"}
                  className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                name="owner" 
                placeholder="Owner Name" 
                defaultValue={initialData?.owner || ""}
                className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                required 
              />
              <Input 
                name="mobile" 
                placeholder="Mobile Number" 
                defaultValue={initialData?.mobile || ""}
                className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                required 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">Location</h3>
            <div className="grid gap-4">
              <Input 
                name="line1" 
                placeholder="Address Line 1" 
                defaultValue={initialData?.address?.line1 || ""}
                className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  name="area" 
                  placeholder="Area / Neighborhood" 
                  defaultValue={initialData?.address?.area || ""}
                  className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                  required 
                />
                <Input 
                  name="city" 
                  placeholder="City" 
                  defaultValue={initialData?.address?.city || ""}
                  className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  name="state" 
                  placeholder="State" 
                  defaultValue={initialData?.address?.state || ""}
                  className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                  required 
                />
                <Input 
                  name="pincode" 
                  placeholder="Pincode" 
                  defaultValue={initialData?.address?.pincode || ""}
                  className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl h-12 px-4 shadow-sm" 
                />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg mt-8 hover:scale-[1.02] transition-transform">
            {queueInfo ? (queueInfo.current === queueInfo.total ? "Finish & Save" : "Save & Next") : "Save Restaurant"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
};
