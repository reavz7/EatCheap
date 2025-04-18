import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const FilterBar = ({ onFilterChange }) => {
  const [preparationTime, setPreparationTime] = useState(180);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVegan, setIsVegan] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Debounced value for preparationTime
  const [debouncedPreparationTime, setDebouncedPreparationTime] = useState(preparationTime);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPreparationTime(preparationTime);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [preparationTime]);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        searchTerm,
        maxPrepTime: debouncedPreparationTime,
        isVegan,
        isVegetarian,
        isGlutenFree,
      });
    }
  }, [debouncedPreparationTime, searchTerm, isVegan, isVegetarian, isGlutenFree]);

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/3 text-black">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Wyszukaj przepis..."
            className="w-full px-3 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer text-sm text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filtry</span>
        </button>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Czas: {preparationTime} min
          </span>
          <input
            type="range"
            min="0"
            max="180"
            value={preparationTime}
            onChange={(e) => setPreparationTime(Number(e.target.value))}
            className="w-full md:w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {isFiltersOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Preferencje dietetyczne
              </h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={(e) => setIsVegetarian(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Wegetariańskie</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isVegan}
                  onChange={(e) => setIsVegan(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Wegańskie</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isGlutenFree}
                  onChange={(e) => setIsGlutenFree(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Bez glutenu</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
