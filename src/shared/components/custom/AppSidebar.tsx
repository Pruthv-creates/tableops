"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/shared/store/layout.store";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronLeft, ChevronRight, LayoutDashboard, Utensils, PlusCircle } from "lucide-react";

export const AppSidebar = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useLayoutStore();

  const navs = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Restaurants", href: "/restaurants", icon: <Utensils size={20} /> },
    { name: "Add New", href: "/manage/restaurant/add", icon: <PlusCircle size={20} /> }
  ];

  return (
    <aside className={cn(
      "border-r border-slate-200 dark:border-white/10 p-4 hidden md:flex flex-col bg-white/60 dark:bg-[#020617]/40 backdrop-blur-xl fixed h-full left-0 top-0 z-40 transition-all duration-300 ease-in-out shadow-xl dark:shadow-none",
      isSidebarCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between mb-8 pt-2">
        {!isSidebarCollapsed && (
          <h2 className="font-extrabold tracking-tight text-2xl bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent drop-shadow-md px-2 truncate">
            Gastronomy.
          </h2>
        )}
        {isSidebarCollapsed && (
          <div className="mx-auto text-xl font-black bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">G.</div>
        )}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-50 text-slate-500"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="space-y-2 mt-4 flex-1">
        {navs.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          return (
            <Link 
              key={link.name} 
              href={link.href}
              title={isSidebarCollapsed ? link.name : ""}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-slate-900 text-white shadow-md shadow-indigo-500/20 dark:bg-white dark:text-slate-900"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <span className={cn(
                "shrink-0",
                isActive ? "text-white dark:text-slate-900" : "group-hover:text-indigo-500"
              )}>
                {link.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="truncate">{link.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className={cn(
        "pt-6 border-t border-slate-200 dark:border-white/10",
        isSidebarCollapsed ? "px-0" : "px-0"
      )}>
        <ThemeToggle collapsed={isSidebarCollapsed} />
      </div>
    </aside>
  );
};
