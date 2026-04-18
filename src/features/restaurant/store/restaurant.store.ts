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
  // ── Cafe ────────────────────────────────────────────────────────────────
  { id: "rng1",  slug: "blue-tokai-coffee",        name: "Blue Tokai Coffee Roasters",  owner: "Matt Chitharanjan",  mobile: "+91 9876543210", type: "Cafe",         rating: 4.7, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",  address: { line1: "Ground Floor, Unit 1",      area: "Koramangala 8th Block",  city: "Bangalore", state: "Karnataka",    pincode: "560095" } },
  { id: "rng5",  slug: "third-wave-coffee",        name: "Third Wave Coffee",           owner: "Sushant Goel",       mobile: "+91 9870001234", type: "Cafe",         rating: 4.5, image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80",  address: { line1: "12, Lavelle Road",          area: "Church Street",          city: "Bangalore", state: "Karnataka",    pincode: "560001" } },
  { id: "rng9",  slug: "naaz-cafe-mumbai",         name: "Naaz Cafe",                   owner: "Rashid Khan",        mobile: "+91 9820012345", type: "Cafe",         rating: 4.3, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",  address: { line1: "1, Lamington Road",         area: "Grant Road",             city: "Mumbai",    state: "Maharashtra",  pincode: "400007" } },

  // ── Fine Dining ─────────────────────────────────────────────────────────
  { id: "rng3",  slug: "farzi-cafe",               name: "Farzi Cafe",                  owner: "Zorawar Kalra",      mobile: "+91 9988776655", type: "Fine Dining",  rating: 4.6, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",  address: { line1: "UB City, Level 2",          area: "Vittal Mallya Road",     city: "Bangalore", state: "Karnataka",    pincode: "560001" } },
  { id: "rng6",  slug: "indian-accent-delhi",      name: "Indian Accent",               owner: "Manish Mehrotra",    mobile: "+91 9811223344", type: "Fine Dining",  rating: 4.9, image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",  address: { line1: "The Lodhi, Lodhi Road",     area: "Lodhi Colony",           city: "Delhi",     state: "Delhi",        pincode: "110003" } },
  { id: "rng10", slug: "trishna-mumbai",           name: "Trishna",                     owner: "Satish Kalla",       mobile: "+91 9930001122", type: "Fine Dining",  rating: 4.8, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",  address: { line1: "7, Ropewalk Lane",          area: "Kala Ghoda",             city: "Mumbai",    state: "Maharashtra",  pincode: "400001" } },

  // ── Fast Food ───────────────────────────────────────────────────────────
  { id: "rng2",  slug: "truffles",                 name: "Truffles",                    owner: "Avinash Kapoor",     mobile: "+91 9123456789", type: "Fast Food",    rating: 4.4, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",  address: { line1: "22, St Marks Road",         area: "Ashok Nagar",            city: "Bangalore", state: "Karnataka",    pincode: "560001" } },
  { id: "rng7",  slug: "burger-singh-delhi",       name: "Burger Singh",                owner: "Rahul Seth",         mobile: "+91 9810012233", type: "Fast Food",    rating: 4.2, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",  address: { line1: "Plot 5, Sector 18",         area: "Noida Sector 18",        city: "Delhi",     state: "Delhi",        pincode: "201301" } },
  { id: "rng11", slug: "kfc-hyderabad",            name: "KFC Banjara Hills",           owner: "Franchise Owner",    mobile: "+91 9040012345", type: "Fast Food",    rating: 4.0, image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=80",  address: { line1: "Road No. 2, Plot 10",       area: "Banjara Hills",          city: "Hyderabad", state: "Telangana",    pincode: "500034" } },

  // ── Cloud Kitchen ───────────────────────────────────────────────────────
  { id: "rng4",  slug: "faasos",                   name: "Faasos Wraps",                owner: "Jaydeep Barman",     mobile: "+91 9999888877", type: "Cloud Kitchen", rating: 4.1, image: "https://images.unsplash.com/photo-1626230249870-ab9a0815eb07?w=800&q=80",  address: { line1: "Industrial Area",           area: "HSR Layout",             city: "Bangalore", state: "Karnataka",    pincode: "560102" } },
  { id: "rng8",  slug: "box8-meals",               name: "Box8 Desi Meals",             owner: "Anshul Gupta",       mobile: "+91 9810099887", type: "Cloud Kitchen", rating: 4.3, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",  address: { line1: "Unit 4B, Jogeshwari East",  area: "Jogeshwari",             city: "Mumbai",    state: "Maharashtra",  pincode: "400060" } },
  { id: "rng12", slug: "rebel-foods-pune",         name: "Rebel Foods — Behrouz Biryani", owner: "Kallol Banerjee", mobile: "+91 9922001122", type: "Cloud Kitchen", rating: 4.5, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80",  address: { line1: "Dark Kitchen Hub, Hadapsar", area: "Hadapsar",              city: "Pune",      state: "Maharashtra",  pincode: "411028" } },
  { id: "rng13", slug: "swiggy-kitchens-hyderabad", name: "Swiggy Kitchens — Pasta Stop", owner: "Cloud Ops Team",  mobile: "+91 9000112233", type: "Cloud Kitchen", rating: 4.2, image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&q=80",  address: { line1: "Dark Kitchen, HITEC City",  area: "Madhapur",               city: "Hyderabad", state: "Telangana",    pincode: "500081" } },
  { id: "rng14", slug: "the-midnight-kitchen",     name: "The Midnight Kitchen",        owner: "Priya Nair",         mobile: "+91 9444556677", type: "Cloud Kitchen", rating: 4.4, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",  address: { line1: "No. 8, Anna Salai",         area: "T Nagar",                city: "Chennai",   state: "Tamil Nadu",   pincode: "600017" } },
];

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  activities: [],
  loading: true,

  loadRestaurants: () => {
    set({ loading: true });
    try {
      if (typeof window !== "undefined") {
        const SEED_VERSION = "v2"; // bump this whenever initialMockData changes
        const storedVersion = localStorage.getItem("restaurants_version");
        const data = localStorage.getItem("restaurants");
        const logs = localStorage.getItem("activity_logs");

        if (data && data !== "[]" && storedVersion === SEED_VERSION) {
          set({
            restaurants: JSON.parse(data),
            activities: logs ? JSON.parse(logs) : [],
            loading: false,
          });
        } else {
          // Seed (or re-seed) with latest mock data
          localStorage.setItem("restaurants", JSON.stringify(initialMockData));
          localStorage.setItem("restaurants_version", SEED_VERSION);
          localStorage.removeItem("activity_logs");
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
