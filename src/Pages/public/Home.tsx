import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  Plane,
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Award,
  Clock,
  Eye,
  BookOpen,
} from "lucide-react";
import { api } from "../../api";
import type { DestinationResponse } from "../../types/Destination-models";
import type { PackageResponse } from "../../types/Package-models";
import { LoadingSpinner } from "../../Components/common/LoadingSpinner";

export default function TravelHomepage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState<DestinationResponse[]>([]);
  const [packages, setPackages] = useState<PackageResponse[]>([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const heroImages = [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop",
  ];

  const months = t("months", { returnObjects: true }) as string[];

  const features = [
    {
      icon: Shield,
      title: t("home.features.safe.title"),
      description: t("home.features.safe.desc"),
    },
    {
      icon: Award,
      title: t("home.features.price.title"),
      description: t("home.features.price.desc"),
    },
    {
      icon: Users,
      title: t("home.features.guides.title"),
      description: t("home.features.guides.desc"),
    },
    {
      icon: Clock,
      title: t("home.features.support.title"),
      description: t("home.features.support.desc"),
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [destResponse, pkgResponse] = await Promise.all([
          api.destinations.getAll(),
          api.packages.getAll(),
        ]);

        if (destResponse.isSuccess && destResponse.data) {
          setDestinations(destResponse.data);
        }

        if (pkgResponse.isSuccess && pkgResponse.data) {
          setPackages(pkgResponse.data);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Hero carousel auto-advance
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    console.log({
      searchQuery,
      destination: selectedDestination,
      month: selectedMonth,
    });
  };

  const getImageUrl = (images: any) => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    if (typeof images === "string") return images;
    return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500"; // Fallback
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200 pt-16">
      {/* Hero Section - Professional Layout with Navbar/Footer Space */}
      <section className="relative h-[calc(100vh-64px)] min-h-[700px] flex items-center overflow-hidden">
        {/* Background Images with Smooth Transition */}
        <div className="absolute inset-0">
          {heroImages.map((image, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentHeroIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Destination ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </div>

        {/* Container for proper spacing on all screens */}
        <div className="relative z-10 w-full h-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-full">
            
            {/* Mobile Layout: Vertical Stack */}
            <div className="lg:hidden flex flex-col justify-center items-center h-full py-8 space-y-6">
              {/* Hero Text & Buttons */}
              <div className="text-center space-y-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-2xl px-4">
                  {t("home.hero.title1")}
                  <span className="block mt-2 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    {t("home.hero.title2")}
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-gray-100 font-light leading-relaxed drop-shadow-lg px-6 max-w-lg mx-auto">
                  {t("home.hero.subtitle")}
                </p>

                <div className="flex flex-col gap-2.5 px-6">
                  <button className="group w-full px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-xs sm:text-sm hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                    <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{t("home.hero.exploreDestinations")}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </button>
                  <button className="w-full px-5 py-2.5 bg-white/15 backdrop-blur-lg text-white border-2 border-white/40 rounded-full font-bold text-xs sm:text-sm hover:bg-white/25 transition-all duration-300">
                    {t("home.hero.planTrip")}
                  </button>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 pt-3">
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentHeroIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentHeroIndex ? "w-8 bg-white" : "w-4 bg-white/50"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Search Box - Mobile */}
              <div className="w-full px-4">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Search Input */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t("home.hero.searchTitle")}
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t("home.hero.searchPlaceholder")}
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Destination & Month in Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          {t("home.hero.destination")}
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                          <select
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                            className="w-full pl-10 pr-2 py-3 text-xs border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none cursor-pointer transition-all"
                          >
                            <option value="">{t("home.hero.all")}</option>
                            {destinations.map((dest) => (
                              <option key={dest.id} value={dest.id}>
                                {dest.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          {t("home.hero.month")}
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                          <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full pl-10 pr-2 py-3 text-xs border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none cursor-pointer transition-all"
                          >
                            <option value="">{t("home.hero.all")}</option>
                            {months.map((month, idx) => (
                              <option key={idx} value={idx + 1}>
                                {month}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Search Button */}
                    <button
                      onClick={handleSearch}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 font-semibold flex items-center justify-center gap-2 hover:scale-105 text-sm"
                    >
                      <Search className="w-4 h-4" />
                      {t("home.hero.search")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout: Side by Side */}
            <div className="hidden lg:flex items-center justify-between h-full gap-8 xl:gap-12 2xl:gap-16">
              {/* Left: Hero Text & Buttons */}
              <div className="flex-1 space-y-8 max-w-2xl">
                <div className="space-y-6">
                  <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-white leading-tight drop-shadow-2xl">
                    {t("home.hero.title1")}
                    <span className="block mt-4 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                      {t("home.hero.title2")}
                    </span>
                  </h1>

                  <p className="text-lg xl:text-xl 2xl:text-2xl text-gray-100 font-light leading-relaxed drop-shadow-lg">
                    {t("home.hero.subtitle")}
                  </p>
                </div>

                <div className="flex gap-4 xl:gap-6">
                  <button className="group px-8 xl:px-10 py-4 xl:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-base xl:text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-3">
                    <Plane className="w-5 h-5 xl:w-6 xl:h-6" />
                    {t("home.hero.exploreDestinations")}
                    <ArrowRight className="w-5 h-5 xl:w-6 xl:h-6 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button className="px-8 xl:px-10 py-4 xl:py-5 bg-white/15 backdrop-blur-lg text-white border-2 border-white/40 rounded-full font-bold text-base xl:text-lg hover:bg-white/25 transition-all duration-300 hover:scale-105">
                    {t("home.hero.planTrip")}
                  </button>
                </div>

                {/* Carousel Indicators */}
                <div className="flex gap-3">
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentHeroIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentHeroIndex ? "w-10 bg-white" : "w-6 bg-white/50"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Search Box */}
              <div className="flex-shrink-0 w-full max-w-md xl:max-w-lg 2xl:max-w-xl">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 xl:p-8 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="space-y-4 xl:space-y-5">
                    {/* Search Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t("home.hero.searchTitle")}
                      </label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t("home.hero.searchPlaceholder")}
                          className="w-full pl-12 pr-4 py-3.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Destination Dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t("home.hero.destination")}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <select
                          value={selectedDestination}
                          onChange={(e) => setSelectedDestination(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none cursor-pointer transition-all"
                        >
                          <option value="">{t("home.hero.all")}</option>
                          {destinations.map((dest) => (
                            <option key={dest.id} value={dest.id}>
                              {dest.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Month Dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t("home.hero.month")}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none cursor-pointer transition-all"
                        >
                          <option value="">{t("home.hero.all")}</option>
                          {months.map((month, idx) => (
                            <option key={idx} value={idx + 1}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Search Button */}
                    <button
                      onClick={handleSearch}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3.5 rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 font-semibold flex items-center justify-center gap-2 hover:scale-105"
                    >
                      <Search className="w-5 h-5" />
                      {t("home.hero.search")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.destinations.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t("home.destinations.subtitle")}
            </p>
          </div>

          <div className="flex overflow-x-auto pb-6 gap-8 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible scrollbar-hide">
            {destinations.slice(0, 4).map((dest) => (
              <div
                key={dest.id}
                className="min-w-[320px] snap-center group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer h-96 hover:-rotate-1"
              >
                <img
                  src={
                    dest.imageUrl ||
                    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500"
                  }
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <Star className="w-4 h-4 fill-black" />
                  4.9
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {dest.name}
                  </h3>
                  <p className="text-gray-200 text-base mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {dest.country}, {dest.city}
                  </p>
                  <ArrowRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:border-cyan-500 hover:text-cyan-500 dark:hover:border-cyan-500 dark:hover:text-cyan-400 transition-all duration-300 hover:scale-105">
              {t("home.destinations.viewAll")}
            </button>
          </div>
        </div>
      </section>

      {/* Best Vacation Plans */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.packages.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t("home.packages.subtitle")}
            </p>
          </div>

          <div className="flex overflow-x-auto pb-6 gap-8 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible scrollbar-hide">
            {packages.slice(0, 4).map((plan) => (
              <div
                key={plan.id}
                className="min-w-[320px] snap-center group bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-4"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getImageUrl(plan.imagesUrls)}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      4.8
                    </span>
                  </div>
                  {plan.isActive ? (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {t("home.packages.available")}
                    </div>
                  ) : (
                    <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {t("home.packages.soldOut")}
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {plan.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">
                      {plan.destination?.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                    {plan.description}
                  </p>

                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {plan.duration} {t("home.packages.days")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>
                        {t("home.packages.max")} {plan.maxCapacity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">
                        {t("home.packages.from")}
                      </span>
                      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                        ${plan.price}
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
                      {t("home.packages.bookNow")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:border-cyan-500 hover:text-cyan-500 dark:hover:border-cyan-500 dark:hover:text-cyan-400 transition-all duration-300 hover:scale-105">
              {t("home.packages.viewAll")}
            </button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.blog.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t("home.blog.subtitle")}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Featured Post - Enhanced */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 mb-12">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-auto overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                    alt="Kashmir Mountains"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    {t("home.blog.featured.tag")}
                  </div>
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {t("home.blog.featured.readTime")}
                  </div>
                </div>

                <div className="p-10 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t("home.blog.featured.date")}
                    </span>
                    <span className="text-cyan-500">•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      2.3K views
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    {t("home.blog.featured.title")}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                    {t("home.blog.featured.excerpt")}
                  </p>

                  <button className="group self-start px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-3 hover:scale-105">
                    {t("home.blog.readMore")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Blog Posts Grid - Enhanced */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  image:
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500",
                  title: t("home.blog.posts.0.title"),
                  date: t("home.blog.posts.0.date"),
                  category: t("home.blog.posts.0.category"),
                  readTime: "5 min read",
                  views: "1.8K",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500",
                  title: t("home.blog.posts.1.title"),
                  date: t("home.blog.posts.1.date"),
                  category: t("home.blog.posts.1.category"),
                  readTime: "4 min read",
                  views: "2.1K",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=500",
                  title: t("home.blog.posts.2.title"),
                  date: t("home.blog.posts.2.date"),
                  category: t("home.blog.posts.2.category"),
                  readTime: "6 min read",
                  views: "1.5K",
                },
              ].map((post, idx) => (
                <div
                  key={idx}
                  className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-700 hover:-translate-y-3"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                      {post.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h4>
                    <button className="text-cyan-600 dark:text-cyan-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all hover:text-cyan-700 dark:hover:text-cyan-300">
                      {t("home.blog.readMore")}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Blog Posts Button */}
            <div className="text-center mt-12">
              <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:border-cyan-500 hover:text-cyan-500 dark:hover:border-cyan-500 dark:hover:text-cyan-400 transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
                <BookOpen className="w-5 h-5" />
                {t("home.blog.viewAll")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: MapPin,
                number: "2000+",
                label: t("home.stats.destinations"),
              },
              { icon: Users, number: "50K+", label: t("home.stats.travelers") },
              {
                icon: TrendingUp,
                number: "500+",
                label: t("home.stats.packages"),
              },
              {
                icon: Award,
                number: "98%",
                label: t("home.stats.satisfaction"),
              },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-cyan-500 group-hover:scale-110 transition-transform duration-300" />
                <div className="mb-3">
                  <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">
                    {stat.number}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-xl">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
