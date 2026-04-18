"use client";

import { AppSidebar } from "@/shared/components/custom/AppSidebar";
import { useLayoutStore } from "@/shared/store/layout.store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
      )}>
        <main className="flex-1 pt-10 pb-12 w-full px-6 lg:px-10 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
