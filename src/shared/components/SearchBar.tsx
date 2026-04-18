"use client";

import React, { useState, useCallback } from "react";
import { Input } from "./Input";
import { debounce } from "../utils/debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => onSearch(query), 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="search-bar">
      <Input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};
