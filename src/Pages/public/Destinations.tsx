import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  MapPin,
  Calendar,
  ChevronDown,
  X,
  Users,
  Clock,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import type { DestinationResponse } from "../../types/Destination-models";
import type { PackageResponse } from "../../types/Package-models";
import { LoadingSpinner } from "../../Components/common/LoadingSpinner";

type SortOption = "price-asc" | "price-desc" | "best-sell";

interface Filters {
  searchQuery: string;
  selectedCountry: string;
  selectedDestination: string;
  dateRange: { from: string; to: string };
  sortBy: SortOption;
}

const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;

const Destinations = () => {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState<DestinationResponse[]>([]);
  const [packages, setPackages] = useState<PackageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(12);

  const [filters, setFilters] = useState<Filters>({
    searchQuery: "",
    selectedCountry: "",
    selectedDestination: "",
    dateRange: { from: "", to: "" },
    sortBy: "best-sell",
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [destResponse, pkgResponse] = await Promise.all([
          api.destinations.getAll(),
          api.packages.getAll(),
        ]);

        if (destResponse.isSuccess && destResponse.data) {
          setDestinations(destResponse.data.filter((d) => d.isActive));
        }

        if (pkgResponse.isSuccess && pkgResponse.data) {
          setPackages(pkgResponse.data.filter((p) => p.isActive));
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Get unique countries from destinations
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(
      new Set(destinations.map((d) => d.country))
    );
    return uniqueCountries.sort();
  }, [destinations]);

  // Filter destinations based on selected country
  const filteredDestinations = useMemo(() => {
    if (!filters.selectedCountry) return destinations;
    return destinations.filter((d) => d.country === filters.selectedCountry);
  }, [destinations, filters.selectedCountry]);

  // Filter and sort packages based on all criteria
  const filteredPackages = useMemo(() => {
    let result = [...packages];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(query) ||
          pkg.description?.toLowerCase().includes(query) ||
          pkg.destination.name.toLowerCase().includes(query) ||
          pkg.destination.country.toLowerCase().includes(query)
      );
    }

    // Filter by country
    if (filters.selectedCountry) {
      result = result.filter(
        (pkg) => pkg.destination.country === filters.selectedCountry
      );
    }

    // Filter by destination
    if (filters.selectedDestination) {
      result = result.filter(
        (pkg) => pkg.destinationId === filters.selectedDestination
      );
    }

    // Filter by date range
    if (filters.dateRange.from) {
      result = result.filter(
        (pkg) => new Date(pkg.availableFrom) >= new Date(filters.dateRange.from)
      );
    }
    if (filters.dateRange.to) {
      result = result.filter(
        (pkg) => new Date(pkg.availableTo) <= new Date(filters.dateRange.to)
      );
    }

    // Sort packages
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "best-sell":
        break;
    }

    return result;
  }, [packages, filters]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredPackages.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPackages = filteredPackages.slice(startIndex, endIndex);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.selectedCountry) count++;
    if (filters.selectedDestination) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  }, [filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t("destinations.title") || "Nos destinations"}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">{t("destinations.filters") || "Filtres"}</span>
                <span className="sm:hidden">{t("destinations.filters_short") || "Filtrer"}</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              <div className="relative flex-1 sm:flex-initial sm:w-80 md:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t("destinations.search") || "Rechercher..."}
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-500 dark:focus:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {filteredPackages.length} {t("destinations.results") || "résultats"}
          </p>
        </div>

        {/* Packages Grid */}
        {currentPackages.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200 dark:bg-gray-800 mb-4">
              <Search className="w-6 h-6 md:w-8 md:h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("destinations.noResults") || "Aucun résultat trouvé"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              {t("destinations.tryDifferentFilters") || "Essayez de modifier vos critères de recherche"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {currentPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredPackages.length > 0 && (
          <div className="mt-8 md:mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                {t("destinations.showing") || "Affichage"} <span className="font-semibold">{pageSize}</span> {t("destinations.perPage") || "par page"}
                <span className="ml-2 text-gray-500 dark:text-gray-500">
                  ({filteredPackages.length} {t(`destinations.${filteredPackages.length > 1 ? 'results_plural' : 'results'}`) || "résultats"})
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-3">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]);
                    setCurrentPage(1);
                  }}
                  className="h-9 px-3 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={safeCurrentPage === 1}
                  className="p-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t("destinations.previous") || "Précédent"}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="p-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t("destinations.next") || "Suivant"}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters Drawer */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowFilters(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("destinations.filters") || "Filtres"}
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </button>
              </div>

              {/* Filters */}
              <div className="space-y-6">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t("destinations.sortBy") || "Trier par"}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange("sortBy", e.target.value as SortOption)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-600 cursor-pointer"
                    >
                      <option value="best-sell">{t("destinations.bestSelling") || "Meilleures ventes"}</option>
                      <option value="price-asc">{t("destinations.priceLowHigh") || "Prix croissant"}</option>
                      <option value="price-desc">{t("destinations.priceHighLow") || "Prix décroissant"}</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t("destinations.country") || "Pays"}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.selectedCountry}
                      onChange={(e) => {
                        handleFilterChange("selectedCountry", e.target.value);
                        handleFilterChange("selectedDestination", "");
                      }}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-600 cursor-pointer"
                    >
                      <option value="">{t("destinations.allCountries") || "Tous les pays"}</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t("destinations.destination") || "Destination"}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.selectedDestination}
                      onChange={(e) => handleFilterChange("selectedDestination", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-600 cursor-pointer"
                    >
                      <option value="">{t("destinations.allDestinations") || "Toutes les destinations"}</option>
                      {filteredDestinations.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.name}, {dest.city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t("destinations.departure") || "Date de départ"}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    <input
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) =>
                        handleFilterChange("dateRange", {
                          ...filters.dateRange,
                          from: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-600"
                    />
                  </div>
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t("destinations.return") || "Date de retour"}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    <input
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) =>
                        handleFilterChange("dateRange", {
                          ...filters.dateRange,
                          to: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-600"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setFilters({
                        searchQuery: "",
                        selectedCountry: "",
                        selectedDestination: "",
                        dateRange: { from: "", to: "" },
                        sortBy: "best-sell",
                      });
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
                  >
                    {t("destinations.clearFilters") || "Réinitialiser les filtres"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Package Card Component
const PackageCard = ({ package: pkg }: { package: PackageResponse }) => {
  const { t } = useTranslation();
  const imageUrl =
    pkg.imagesUrls?.[0] ||
    pkg.destination.imageUrl ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* Image */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={imageUrl}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gray-900 dark:bg-gray-900 bg-opacity-90 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm font-medium">
          {pkg.duration} {t("destinations.days") || "jours"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {pkg.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {pkg.destination.city}, {pkg.destination.country}
            </span>
          </div>
        </div>

        {pkg.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {pkg.description}
          </p>
        )}

        <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs truncate">
              {new Date(pkg.availableFrom).toLocaleDateString()} - {new Date(pkg.availableTo).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {t("destinations.maxCapacity") || "Max"}: {pkg.maxCapacity} {t("destinations.persons") || "personnes"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t("destinations.from") || "À partir de"}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {pkg.price.toLocaleString()} DZD
            </p>
          </div>
          <Link
            to={`/destination-details/${pkg.id}`}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors text-sm"
          >
            {t("destinations.viewDetails") || "Voir"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Destinations;