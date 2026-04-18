"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { debounce } from "@/shared/utils/debounce";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search restaurants...",
  debounceMs = 300,
}: SearchBarProps) => {
  // Local state so the input feels instant; the parent gets the debounced value
  const [localValue, setLocalValue] = useState(value);

  // Keep local in sync if parent resets it programmatically (e.g. "Clear")
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useRef(debounce(onChange, debounceMs)).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    debouncedOnChange(val);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className="relative w-full">
      {/* Search icon */}
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />

      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm text-slate-800 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all shadow-sm"
      />

      {/* Clear button */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
