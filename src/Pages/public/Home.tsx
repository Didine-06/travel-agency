import React, { use, useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Plane,
  ArrowRight,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../../api";
import type { DestinationResponse } from "../../types";

export default function TravelHomepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState<DestinationResponse[]>([]);

  const staticDestinations = [
    {
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
      name: "Mountain",
    },
    {
      image:
        "https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=500",
      name: "Amazon",
    },
    {
      image:
        "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=500",
      name: "Sunset Beach",
    },
    {
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
      name: "Alps",
    },
  ];

  const vacationPlans = [
    {
      location: "Rome, Italy",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500",
      price: "$748k",
      duration: "7 Day Trip",
      rating: 4.8,
    },
    {
      location: "India, Delhi",
      image:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500",
      price: "$748k",
      duration: "7 Day Trip",
      rating: 4.8,
    },
    {
      location: "Usa, Chicago",
      image:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=500",
      price: "$748k",
      duration: "7 Day Trip",
      rating: 4.8,
    },
    {
      location: "UK, London",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500",
      price: "$748k",
      duration: "7 Day Trip",
      rating: 4.8,
    },
  ];

  const fetchDestinations = async () => {
    var result = await api.destinations.getAll();
    if (result.isSuccess && result.data){
      setDestinations(result.data);
    }else{
      throw new Error(result.message || 'Failed to fetch destinations, please try Again !');
    }
  }
  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden mt-10">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-img.jpg"
            alt="Tropical paradise beach destination"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-start ">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Your Journey to
            <span className="block mt-2" style={{ color: "#0F8FC6" }}>
              Paradise Awaits
            </span>
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-2xl"
            style={{ color: "#0A4F6C" }}
          >
            Discover extraordinary destinations and create unforgettable
            memories with our travel agency - your trusted travel partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/destinations">
              <button className="bg-[#0F8FC6] text-white px-8 py-3 rounded-lg hover:bg-[#0A4F6C] transition font-medium flex items-center justify-center gap-2 w-full sm:w-auto">
                Explore Destinations <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/services">
              <button
                className="border-2 px-8 py-3 rounded-lg transition font-medium w-full sm:w-auto"
                style={{ borderColor: "#0F8FC6", color: "#0F8FC6" }}
              >
                Plan Your Trip
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Find Your Best Destination */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Best <span className="text-gray-900">Destination</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            We have more than 2000 destination you can choose
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
              style={{ height: "250px" }}
            >
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              {dest.name === "Amazon" && (
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg font-semibold">
                  {dest.name}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <button

            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            See more
          </button>
        </div>
      </section>

      {/* Best Vacation Plan */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-gray-900">Best</span> Vacation Plan
          </h2>
          <p className="text-gray-600 text-lg">
            Plan your perfect vacation with our travel agency. Choose among
            <br />
            hundreds of all-inclusive offers!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
          {vacationPlans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={plan.image}
                  alt={plan.location}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-900">{plan.location}</h3>
                  <span className="font-bold text-gray-900">{plan.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Plane className="w-4 h-4" />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{plan.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button className="text-gray-600 hover:text-gray-900 font-medium">
            See more
          </button>
        </div>
      </section>

      {/* Our Blog */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-gray-900">Blog</span>
          </h2>
          <p className="text-gray-600 text-lg">
            An insight the incredible experience in the world
          </p>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                alt="Kashmir"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Beautiful Kashmir Let's Travel
              </h3>
              <p className="text-gray-600 mb-6">
                We are ready to help you build and also realize the room design
                that you dreamt of, with our experts and also the best category
                recommendations from us.
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-left">
                Read more →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* We Make World Travel Easy */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                We Make World
                <br />
                Travel Easy
              </h2>
              <p className="text-gray-600 mb-8">
                Navigating the globe effortlessly, we transform wanderlust
                dreams into seamless adventures. With us, the world becomes your
                accessible playground, travel simplified.
              </p>
              <button className="text-gray-900 hover:text-gray-700 font-medium">
                Explore Our Tour →
              </button>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"
                  alt="Travel destination"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -top-8 right-8 w-64 h-80 bg-blue-100 rounded-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
