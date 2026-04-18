import { getData, setData } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Restaurant } from "../types";

const KEY = STORAGE_KEYS.RESTAURANTS;

export const restaurantService = {
  getAll: (): Restaurant[] => getData<Restaurant>(KEY),

  getBySlug: (slug: string): Restaurant | undefined =>
    getData<Restaurant>(KEY).find((r) => r.slug === slug),

  create: (restaurant: Restaurant): void => {
    const data = getData<Restaurant>(KEY);
    setData(KEY, [...data, restaurant]);
  },

  delete: (id: string): void => {
    const data = getData<Restaurant>(KEY).filter((r) => r.id !== id);
    setData(KEY, data);
  }
};
