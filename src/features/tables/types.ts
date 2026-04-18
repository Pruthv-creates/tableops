export type TableStatus = "available" | "booked";

export interface TableBooking {
  id: string;
  tableId: string;
  restaurantSlug: string;
  guestName: string;
  mobile: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:MM" 24-hour
}

export interface RestaurantTable {
  id: string;
  restaurantSlug: string;   // which restaurant this table belongs to
  name: string;             // e.g. "T-01" or "Patio 3"
  capacity: number;
  status: TableStatus;
}
