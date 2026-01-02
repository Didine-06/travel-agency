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
      {/* Top Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/destinations"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-gray-700 dark:text-gray-300" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Back</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="relative aspect-[16/9] md:aspect-[21/9] bg-gray-100 dark:bg-gray-900">
                {images.map((image: string, idx: number) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      idx === selectedImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${packageData.title} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Navigation Arrows - Desktop Only */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide">
                  {images.map((image: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === selectedImageIndex 
                          ? "border-blue-500 dark:border-blue-400" 
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">4.8</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">(120 reviews)</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {packageData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{packageData.destination.city}, {packageData.destination.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{packageData.duration} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Max {packageData.maxCapacity} guests</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About this experience
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {packageData.description}
              </p>
            </div>

            {/* What's Included */}
            {packageData.includedServices && packageData.includedServices.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What's included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packageData.includedServices.map((service: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trip Details */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Trip information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{packageData.duration}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">days</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Max Group</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{packageData.maxCapacity}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">guests</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Start</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {new Date(packageData.availableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(packageData.availableFrom).getFullYear()}</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">End</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {new Date(packageData.availableTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(packageData.availableTo).getFullYear()}</p>
                </div>
              </div>
            </div>

            {/* Destination Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About {packageData.destination.name}
              </h3>
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg mb-4 border-l-4 border-blue-500">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{packageData.destination.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {packageData.destination.city}, {packageData.destination.country}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {packageData.destination.description}
              </p>
            </div>
          </div>

          {/* Right Column - Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {packageData.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-600 dark:text-gray-400">DZD</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">per person</p>
              </div>

              <button
                onClick={handleReserve}
                disabled={!packageData.isActive}
                className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                <Plane className="w-5 h-5" />
                Book Now
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
                You won't be charged yet
              </p>

              <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{packageData.duration} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Max capacity</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{packageData.maxCapacity} guests</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Location</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{packageData.destination.country}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Reserve now & pay later</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;