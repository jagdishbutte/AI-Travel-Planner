import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredDestinations: any[];
  setFilteredDestinations: (destinations: any[]) => void;
  filteredTrips: any[];
  setFilteredTrips: (trips: any[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filteredDestinations,
        setFilteredDestinations,
        filteredTrips,
        setFilteredTrips,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
