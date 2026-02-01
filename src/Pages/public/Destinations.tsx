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

  // Render filters component (reusable for both desktop and mobile)
  const FiltersContent = () => (
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
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 cursor-pointer transition-colors"
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
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 cursor-pointer transition-colors"
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
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 cursor-pointer transition-colors"
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
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
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
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
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
          className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors border border-red-200 dark:border-red-800 font-medium"
        >
          {t("destinations.clearFilters") || "Réinitialiser les filtres"}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section - Full Width */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 md:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                {t("destinations.title") || "Explorez nos destinations"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl">
                {t("destinations.description") || "Découvrez des destinations exceptionnelles à travers le monde. Filtrez par pays, dates et trouvez le voyage parfait pour vous."}
              </p>
            </div>
            
            {/* Desktop Search Bar - Same level as title */}
            <div className="hidden lg:block w-96 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t("destinations.search") || "Rechercher..."}
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Mobile Search Bar & Filter Button */}
          <div className="lg:hidden mt-6 flex gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-lg transition-colors font-medium flex-shrink-0"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>{t("destinations.filters") || "Filtres"}</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder={t("destinations.search") || "Rechercher..."}
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width with Sidebar */}
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar - No box, no sticky, natural scroll */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="space-y-2 mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {t("destinations.filters") || "Filtres"}
              </h2>
              {activeFiltersCount > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <FiltersContent />
          </aside>

          {/* Main Content Area - Cards & Pagination */}
          <div className="flex-1 min-w-0">
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <span className="font-semibold text-gray-900 dark:text-white">{filteredPackages.length}</span> {t("destinations.results") || "résultats"}
              </p>
            </div>

            {/* Packages Grid */}
            {currentPackages.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("destinations.noResults") || "Aucun résultat trouvé"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("destinations.tryDifferentFilters") || "Essayez de modifier vos critères de recherche"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {currentPackages.map((pkg) => (
                    <PackageCard key={pkg.id} package={pkg} />
                  ))}
                </div>

                {/* Pagination - Integrated naturally */}
                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                      {t("destinations.showing") || "Affichage"} <span className="font-semibold text-gray-900 dark:text-white">{startIndex + 1}-{Math.min(endIndex, filteredPackages.length)}</span> sur <span className="font-semibold text-gray-900 dark:text-white">{filteredPackages.length}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-3">
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]);
                          setCurrentPage(1);
                        }}
                        className="h-10 px-3 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                          <option key={size} value={size}>
                            {size} / page
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={safeCurrentPage === 1}
                          className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={t("destinations.previous") || "Précédent"}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                          {safeCurrentPage} / {totalPages}
                        </span>
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={safeCurrentPage === totalPages}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={t("destinations.next") || "Suivant"}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 z-50 overflow-y-auto lg:hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-6 h-6" />
                  {t("destinations.filters") || "Filtres"}
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <FiltersContent />
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
    <Link to={`/destination-details/${pkg.id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={imageUrl}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {pkg.duration} {t("destinations.days") || "jours"}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm truncate">
                {pkg.destination.city}, {pkg.destination.country}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {pkg.title}
          </h3>

          {pkg.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
              {pkg.description}
            </p>
          )}

          <div className="space-y-2.5 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 flex-shrink-0 text-blue-500 dark:text-blue-400" />
              <span className="text-xs">
                {new Date(pkg.availableFrom).toLocaleDateString()} - {new Date(pkg.availableTo).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 flex-shrink-0 text-blue-500 dark:text-blue-400" />
              <span className="text-xs">
                {t("destinations.maxCapacity") || "Max"}: {pkg.maxCapacity} {t("destinations.persons") || "personnes"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                {t("destinations.from") || "À partir de"}
              </p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {pkg.price.toLocaleString()} <span className="text-sm font-normal">DZD</span>
              </p>
            </div>
            <div className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm group-hover:shadow-md">
              {t("destinations.viewDetails") || "Voir"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Destinations;