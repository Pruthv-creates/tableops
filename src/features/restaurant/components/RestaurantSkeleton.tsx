import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";

export const RestaurantSkeleton = () => {
  return (
    <Card className="rounded-2xl border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm h-full flex flex-col bg-white/40 dark:bg-slate-900/40 backdrop-blur">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="p-5 flex-grow space-y-4 pt-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 mt-auto">
          <Skeleton className="h-3 w-1/4" />
        </div>
      </CardContent>
    </Card>
  );
};
