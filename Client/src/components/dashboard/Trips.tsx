import React from "react";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const Trips = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">My Trips</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Plan New Trip
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[
          {
            destination: "Paris, France",
            dates: "Mar 15 - Mar 22, 2024",
            status: "upcoming",
            image:
              "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
          },
          {
            destination: "Tokyo, Japan",
            dates: "Apr 5 - Apr 15, 2024",
            status: "upcoming",
            image:
              "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
          },
          {
            destination: "Barcelona, Spain",
            dates: "Feb 1 - Feb 8, 2024",
            status: "completed",
            image:
              "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216",
          },
        ].map((trip, index) => (
          <div
            key={index}
            className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={trip.image}
                  alt={trip.destination}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-white">
                    {trip.destination}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trip.status === "upcoming"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-700/50 text-gray-400"
                    }`}
                  >
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{trip.dates}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">View Itinerary</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
