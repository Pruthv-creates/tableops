import { create } from "zustand";
import { Restaurant } from "../types";

export interface Activity {
  id: string;
  type: 'ADD' | 'DELETE';
  restaurantName: string;
  timestamp: number;
}

interface RestaurantState {
  restaurants: Restaurant[];
  activities: Activity[];
  loading: boolean;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  deleteRestaurants: (ids: string[]) => void;
  loadRestaurants: () => void;
  getBySlug: (slug: string) => Restaurant | undefined;
}

const initialMockData: Restaurant[] = [
  { id: "rng1", slug: "blue-tokai-coffee", name: "Blue Tokai Coffee Roasters", owner: "Matt Chitharanjan", mobile: "+91 9876543210", type: "Cafe", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", address: { line1: "Ground Floor, Unit 1", area: "Koramangala 8th Block", city: "Bangalore", state: "Karnataka", pincode: "560095" } },
  { id: "rng2", slug: "truffles", name: "Truffles", owner: "Avinash", mobile: "+91 9123456789", type: "Fast Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", address: { line1: "22, St Marks Road", area: "Ashok Nagar", city: "Bangalore", state: "Karnataka", pincode: "560001" } },
  { id: "rng3", slug: "farzi-cafe", name: "Farzi Cafe", owner: "Zorawar Kalra", mobile: "+91 9988776655", type: "Fine Dining", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80", address: { line1: "UB City, Level 2", area: "Vittal Mallya Road", city: "Bangalore", state: "Karnataka", pincode: "560001" } },
  { id: "rng4", slug: "faasos", name: "Faasos Wraps", owner: "Jaydeep Barman", mobile: "+91 9999888877", type: "Cloud Kitchen", image: "https://images.unsplash.com/photo-1626230249870-ab9a0815eb07?w=800&q=80", address: { line1: "Industrial Area", area: "HSR Layout", city: "Bangalore", state: "Karnataka", pincode: "560102" } }
];

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  activities: [],
  loading: true,

  loadRestaurants: () => {
    set({ loading: true });
    try {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("restaurants");
        const logs = localStorage.getItem("activity_logs");
        
        if (data && data !== "[]") {
          set({ 
            restaurants: JSON.parse(data), 
            activities: logs ? JSON.parse(logs) : [],
            loading: false 
          });
        } else {
          localStorage.setItem("restaurants", JSON.stringify(initialMockData));
          set({ restaurants: initialMockData, activities: [], loading: false });
        }
      }
    } catch (e) {
      set({ loading: false });
    }
  },

  addRestaurant: (restaurant) => {
    const newActivity: Activity = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: 'ADD',
      restaurantName: restaurant.name,
      timestamp: Date.now()
    };
    
    const updatedRes = [...get().restaurants, restaurant];
    const updatedLogs = [newActivity, ...get().activities].slice(0, 50); // Keep last 50
    
    if (typeof window !== "undefined") {
      localStorage.setItem("restaurants", JSON.stringify(updatedRes));
      localStorage.setItem("activity_logs", JSON.stringify(updatedLogs));
    }
    set({ restaurants: updatedRes, activities: updatedLogs });
  },

  updateRestaurant: (id, data) => {
    const updatedRes = get().restaurants.map(r =>
      r.id === id ? { ...r, ...data } : r
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("restaurants", JSON.stringify(updatedRes));
    }
    set({ restaurants: updatedRes });
  },

  deleteRestaurant: (id) => {
    const restaurant = get().restaurants.find(r => r.id === id);
    if (!restaurant) return;

    const newActivity: Activity = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: 'DELETE',
      restaurantName: restaurant.name,
      timestamp: Date.now()
    };

    const updatedRes = get().restaurants.filter(r => r.id !== id);
    const updatedLogs = [newActivity, ...get().activities].slice(0, 50);

    if (typeof window !== "undefined") {
      localStorage.setItem("restaurants", JSON.stringify(updatedRes));
      localStorage.setItem("activity_logs", JSON.stringify(updatedLogs));
    }
    set({ restaurants: updatedRes, activities: updatedLogs });
  },

  deleteRestaurants: (ids) => {
    const toDelete = get().restaurants.filter(r => ids.includes(r.id));
    if (toDelete.length === 0) return;

    const newActivities: Activity[] = toDelete.map(r => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: 'DELETE',
      restaurantName: r.name,
      timestamp: Date.now()
    }));

    const updatedRes = get().restaurants.filter(r => !ids.includes(r.id));
    const updatedLogs = [...newActivities, ...get().activities].slice(0, 50);

    if (typeof window !== "undefined") {
      localStorage.setItem("restaurants", JSON.stringify(updatedRes));
      localStorage.setItem("activity_logs", JSON.stringify(updatedLogs));
    }
    set({ restaurants: updatedRes, activities: updatedLogs });
  },

  getBySlug: (slug) => {
    return get().restaurants.find(r => r.slug === slug);
  }
}));
