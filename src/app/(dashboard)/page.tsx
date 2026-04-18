"use client";

import { useEffect, useState } from "react";
import { useRestaurantStore } from "@/features/restaurant/store/restaurant.store";
import { RestaurantList } from "@/features/restaurant/components/RestaurantList";
import { SearchBar } from "@/shared/components/custom/SearchBar";
import { PageWrapper } from "@/shared/components/custom/PageWrapper";
import { Card } from "@/shared/components/ui/card";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const { restaurants, activities, loadRestaurants } = useRestaurantStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const filteredRestaurants = restaurants.filter(r => 
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT MAIN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Restaurants</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                View, search, and manage your entire restaurant portfolio
              </p>
            </div>
            <Link href="/manage/restaurant/add" className="relative z-10">
              <Button className="rounded-full shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform bg-indigo-600 hover:bg-indigo-700 text-white border-0 font-bold px-6">
                <span className="mr-2 text-lg leading-none">+</span> Add Restaurant
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 rounded-[24px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-2">Total Restaurants</p>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm">{restaurants.length}</h2>
              </div>
              <div className="absolute right-0 bottom-[-15px] text-7xl opacity-[0.03] dark:opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 pointer-events-none">🏢</div>
            </Card>

            <Card className="p-5 rounded-[24px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-2">New This Week</p>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm">{Math.min(restaurants.length, 3)}</h2>
              </div>
              <div className="absolute right-0 bottom-[-15px] text-7xl opacity-[0.03] dark:opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 pointer-events-none">📈</div>
            </Card>

            <Card className="p-5 rounded-[24px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-2">Top Category</p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2 drop-shadow-sm flex items-center gap-2">
                  Fast Food <span className="text-2xl drop-shadow-md">🍔</span>
                </h2>
              </div>
            </Card>
          </div>

          {/* Quick Categories */}
          <div className="pt-2 space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold dark:text-white">Browse by Category</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {[
                { name: "North Indian", icon: "🍲", count: 142 },
                { name: "Chinese",      icon: "🍜", count: 98  },
                { name: "Italian",      icon: "🍕", count: 76  },
                { name: "South Indian", icon: "🥟", count: 130 },
                { name: "Cafe",         icon: "☕", count: 64  },
                { name: "Fast Food",    icon: "🍔", count: 210 }
              ].map((cat) => (
                 <div key={cat.name} className="flex-shrink-0 flex items-center gap-4 bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer">
                   <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xl shadow-inner">
                     {cat.icon}
                   </div>
                   <div className="flex flex-col pr-2">
                     <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{cat.name}</span>
                     <span className="text-[10px] text-slate-400 font-medium">{cat.count} Listings</span>
                   </div>
                 </div>
              ))}
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold dark:text-white tracking-tight">Active Listings</h3>
              <Link href="/restaurants">
                <Button variant="outline" size="sm" className="rounded-full border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 font-semibold gap-1">
                  🔗 View All Restaurants
                </Button>
              </Link>
            </div>
            <RestaurantList restaurants={filteredRestaurants} emptyMessage={
              <div className="mt-8 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center bg-white/50 backdrop-blur-sm shadow-sm transition-all hover:border-slate-300 cursor-default">
                <p className="text-xl font-semibold text-slate-600 mb-2">No restaurants found</p>
                <Link href="/manage/restaurant/add">
                  <Button className="rounded-full mt-4 bg-slate-800 text-white hover:bg-black">➕ Add an entry</Button>
                </Link>
              </div>
            } />
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6 relative z-10">
          <Card className="p-5 rounded-[24px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm relative z-30 group">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Search</h3>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </Card>

          <Card className="p-6 rounded-[24px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-[200px] h-[200px] bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 relative z-10">System Load</p>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white relative z-10">Good</h2>
              <p className="text-xs font-medium text-emerald-500 mt-2 relative z-10 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span> All systems operational</p>
            </div>
          </Card>

          <Card className="p-6 rounded-[24px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm relative">
            <p className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Recent Activity</p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
              {activities.length > 0 ? activities.slice(0, 6).map(act => (
                <li key={act.id} className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <span className={cn(
                    "rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0",
                    act.type === 'ADD' 
                      ? "text-emerald-500 border border-emerald-500 bg-emerald-500/10" 
                      : "text-rose-500 border border-rose-500 bg-rose-500/10"
                  )}>
                    {act.type === 'ADD' ? '+' : '-'}
                  </span>
                  <div className="overflow-hidden">
                    <span className="block font-medium text-slate-800 dark:text-white truncate">
                      {act.type === 'ADD' ? 'Added' : 'Deleted'} {act.restaurantName}
                    </span>
                    <span className="text-[10px] opacity-70 uppercase tracking-wider font-semibold">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </li>
              )) : (
                <li className="text-slate-400 italic text-center py-4">No recent activity recorded.</li>
              )}
            </ul>
          </Card>
        </div>

      </div>
    </PageWrapper>
  );
}
