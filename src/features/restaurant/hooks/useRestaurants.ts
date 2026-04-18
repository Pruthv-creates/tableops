"use client";

import { useEffect, useState } from "react";
import { restaurantService } from "../services/restaurant.service";
import { Restaurant } from "../types";

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRestaurants(restaurantService.getAll());
    setLoading(false);
  }, []);

  const refresh = () => {
    setRestaurants(restaurantService.getAll());
  };

  return { restaurants, loading, refresh };
};
