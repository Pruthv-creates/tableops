"use client";

export const getData = <T>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

export const setData = <T>(key: string, data: T[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};
