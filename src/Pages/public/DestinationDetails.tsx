import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  ArrowLeft,
  Plane,
  CheckCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "../../api";
import type { PackageResponse } from "../../types/Package-models";
import { LoadingSpinner } from "../../Components/common/LoadingSpinner";

const DestinationDetails = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<PackageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const loadPackage = async () => {
      if (!packageId) return;

      setIsLoading(true);
      try {
        const response = await api.packages.getById(packageId);
        if (response.isSuccess && response.data) {
          setPackageData(response.data);
        } else {
          setError("Package not found");
        }
      } catch (err) {
        console.error("Failed to load package", err);
        setError("Failed to load package details");
      } finally {
        setIsLoading(false);
      }
    };

    loadPackage();
  }, [packageId]);

  const handleReserve = () => {
    navigate("/client/reservation", { state: { selectedPackage: packageData } });
  };

  const nextImage = () => {
    if (!packageData) return;
    const images = packageData.imagesUrls || [packageData.destination.imageUrl];
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!packageData) return;
    const images = packageData.imagesUrls || [packageData.destination.imageUrl];
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Package not found"}
          </h2>
          <Link
            to="/destinations"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to destinations
          </Link>
        </div>
      </div>
    );
  }

  const images = packageData.imagesUrls || [packageData.destination.imageUrl || "https://images.unsplash.com/photo-1469854523086/cc02fe5d8800?w=800&h=600&fit=crop"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] max-h-[650px] overflow-hidden">
        <div className="absolute inset-0">
          {images.map((image: string, idx: number) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === selectedImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={packageData.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  idx === selectedImageIndex ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="flex items-center justify-between">
              <Link
                to="/destinations"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200 group shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Back</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2.5 rounded-xl backdrop-blur-xl border transition-all duration-200 shadow-lg ${
                    isLiked
                      ? 'bg-red-500 border-red-400 text-white'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-200 shadow-lg">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="max-w-4xl">
              {/* Rating Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white font-semibold text-sm">4.8</span>
                <span className="text-white/70 text-sm">• 120 reviews</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {packageData.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white mb-10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{packageData.destination.city}, {packageData.destination.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{packageData.duration} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Max {packageData.maxCapacity} guests</span>
                </div>
              </div>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {packageData.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-white/70 font-medium">DZD</span>
                  </div>
                  <p className="text-white/80 text-sm">per person</p>
                </div>
                <button
                  onClick={handleReserve}
                  disabled={!packageData.isActive}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Plane className="w-5 h-5" />
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Description Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About this experience
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {packageData.description}
              </p>
            </div>

            {/* What's Included Card */}
            {packageData.includedServices && packageData.includedServices.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-sm">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  What's included
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageData.includedServices.map((service: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trip Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-sm">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Trip information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{packageData.duration}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">days</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                    <Users className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Max Group</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{packageData.maxCapacity}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">guests</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Start Date</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {new Date(packageData.availableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{new Date(packageData.availableFrom).getFullYear()}</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">End Date</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {new Date(packageData.availableTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{new Date(packageData.availableTo).getFullYear()}</p>
                </div>
              </div>
            </div>

            {/* Destination Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-sm">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                About {packageData.destination.name}
              </h3>
              <div className="flex items-center gap-3 p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl mb-6 border-l-4 border-cyan-500">
                <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{packageData.destination.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {packageData.destination.city}, {packageData.destination.country}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {packageData.destination.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;