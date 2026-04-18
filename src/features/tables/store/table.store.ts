import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RestaurantTable, TableBooking } from "../types";

// ─── Seed tables (scoped to a demo restaurant slug) ─────────────────────────
const DEMO = "demo-restaurant";
const TODAY = new Date().toISOString().split("T")[0];

const seedTables: RestaurantTable[] = [
  { id: "t1",  restaurantSlug: DEMO, name: "T-01",   capacity: 2,  status: "available" },
  { id: "t2",  restaurantSlug: DEMO, name: "T-02",   capacity: 4,  status: "available" },
  { id: "t3",  restaurantSlug: DEMO, name: "T-03",   capacity: 4,  status: "available" },
  { id: "t4",  restaurantSlug: DEMO, name: "T-04",   capacity: 6,  status: "available" },
  { id: "t5",  restaurantSlug: DEMO, name: "T-05",   capacity: 2,  status: "available" },
  { id: "t6",  restaurantSlug: DEMO, name: "T-06",   capacity: 8,  status: "available" },
  { id: "t7",  restaurantSlug: DEMO, name: "T-07",   capacity: 4,  status: "available" },
  { id: "t8",  restaurantSlug: DEMO, name: "T-08",   capacity: 6,  status: "available" },
  { id: "t9",  restaurantSlug: DEMO, name: "Patio 1",capacity: 4,  status: "available" },
  { id: "t10", restaurantSlug: DEMO, name: "Patio 2",capacity: 6,  status: "available" },
  { id: "t11", restaurantSlug: DEMO, name: "Patio 3",capacity: 2,  status: "available" },
  { id: "t12", restaurantSlug: DEMO, name: "VIP-1",  capacity: 10, status: "available" },
];

const seedBookings: TableBooking[] = [
  { id: "b1", tableId: "t2",  restaurantSlug: DEMO, guestName: "Riya Sharma",  mobile: "9876543210", date: TODAY, time: "19:00" },
  { id: "b2", tableId: "t4",  restaurantSlug: DEMO, guestName: "Arjun Mehta",  mobile: "9123456789", date: TODAY, time: "20:30" },
  { id: "b3", tableId: "t7",  restaurantSlug: DEMO, guestName: "Priya Nair",   mobile: "9988776655", date: TODAY, time: "21:00" },
  { id: "b4", tableId: "t10", restaurantSlug: DEMO, guestName: "Vikram Joshi", mobile: "9001122334", date: TODAY, time: "19:45" },
];

// ─── Overlap detection ───────────────────────────────────────────────────────
// A booking conflicts if it is on the *same table*, the *same date*, and
// within ±90 minutes of the requested time slot.
const WINDOW_MINUTES = 90;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function hasOverlap(
  bookings: TableBooking[],
  tableId: string,
  date: string,
  time: string,
  excludeId?: string   // for future edit use
): boolean {
  const requested = toMinutes(time);
  return bookings.some((b) => {
    if (b.tableId !== tableId) return false;
    if (b.date !== date) return false;
    if (excludeId && b.id === excludeId) return false;
    return Math.abs(toMinutes(b.time) - requested) < WINDOW_MINUTES;
  });
}

// ─── Store ───────────────────────────────────────────────────────────────────
interface TableState {
  tables: RestaurantTable[];
  bookings: TableBooking[];

  // queries
  getTablesForRestaurant: (slug: string) => RestaurantTable[];
  getBookingsForTable: (tableId: string, date?: string) => TableBooking[];
  getActiveBooking: (tableId: string) => TableBooking | undefined;

  // mutations — bookTable returns an error string or null on success
  addTable: (slug: string, name: string, capacity: number) => void;
  bookTable: (
    tableId: string,
    restaurantSlug: string,
    payload: Omit<TableBooking, "id" | "tableId" | "restaurantSlug">
  ) => string | null;
  releaseTable: (tableId: string) => void;
  deleteTable: (tableId: string) => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      tables: seedTables,
      bookings: seedBookings,

      // ── Computed ────────────────────────────────────────────
      getTablesForRestaurant: (slug) =>
        get().tables.filter((t) => t.restaurantSlug === slug),

      getBookingsForTable: (tableId, date) =>
        get().bookings.filter(
          (b) => b.tableId === tableId && (!date || b.date === date)
        ),

      getActiveBooking: (tableId) => {
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // Filter and sort bookings for this table from today onwards
        const upcoming = get().bookings
          .filter((b) => b.tableId === tableId && b.date >= todayStr)
          .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
          });

        // 1. First, check if there's a booking happening RIGHT NOW (within window)
        const current = upcoming.find((b) => {
          if (b.date !== todayStr) return false;
          const start = toMinutes(b.time);
          return currentMinutes >= start && currentMinutes < start + WINDOW_MINUTES;
        });
        if (current) return current;

        // 2. Otherwise, find the next upcoming booking strictly in the future
        return upcoming.find((b) => {
          if (b.date > todayStr) return true;
          return toMinutes(b.time) > currentMinutes;
        });
      },

      // ── Mutations ───────────────────────────────────────────
      addTable: (slug, name, capacity) =>
        set((s) => ({
          tables: [
            ...s.tables,
            {
              id: crypto.randomUUID(),
              restaurantSlug: slug,
              name,
              capacity,
              status: "available",
            },
          ],
        })),

      bookTable: (tableId, restaurantSlug, payload) => {
        const { bookings } = get();
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // 1. Prevent booking in the past (same day earlier time)
        if (payload.date < todayStr) {
          return "You cannot book a table for a past date.";
        }
        if (payload.date === todayStr && toMinutes(payload.time) < currentMinutes) {
          return "You cannot book a table for a past time today.";
        }

        // 2. Check overlap logic (±90 mins)
        if (hasOverlap(bookings, tableId, payload.date, payload.time)) {
          const conflicting = bookings.find(
            (b) =>
              b.tableId === tableId &&
              b.date === payload.date &&
              Math.abs(toMinutes(b.time) - toMinutes(payload.time)) < WINDOW_MINUTES
          );
          
          const formatTime = (t: string) => {
            const [h, m] = t.split(":").map(Number);
            return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
          };
          
          const bookedAt = conflicting ? formatTime(conflicting.time) : "that time";
          return `Conflict: This table already has a booking at ${bookedAt} (±90 min gap required).`;
        }

        const newBooking: TableBooking = {
          id: crypto.randomUUID(),
          tableId,
          restaurantSlug,
          ...payload,
        };

        // Mark the table booked for today ONLY if the booking is currently active or upcoming today
        set((s) => ({
          bookings: [...s.bookings, newBooking],
          tables: s.tables.map((t) =>
            t.id === tableId && payload.date === todayStr
              ? { ...t, status: "booked" }
              : t
          ),
        }));

        return null;
      },

      releaseTable: (tableId) =>
        set((s) => ({
          // Remove ALL future bookings for that table
          bookings: s.bookings.filter((b) => {
            const today = new Date().toISOString().split("T")[0];
            return !(b.tableId === tableId && b.date >= today);
          }),
          tables: s.tables.map((t) =>
            t.id === tableId ? { ...t, status: "available" } : t
          ),
        })),

      deleteTable: (tableId) =>
        set((s) => ({
          tables: s.tables.filter((t) => t.id !== tableId),
          bookings: s.bookings.filter((b) => b.tableId !== tableId),
        })),
    }),
    { name: "hotel-tables", version: 4 }
  )
);
