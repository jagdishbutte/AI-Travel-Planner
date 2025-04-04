import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { staticDestinations } from "../../data/exploreData";

export const Destinations = () => {
  const navigate = useNavigate();
  const { filteredDestinations } = useSearch();

  const destinationsToShow =
    filteredDestinations.length > 0 ? filteredDestinations : staticDestinations;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(`/dashboard`)}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
      </div>
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Popular Destinations</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinationsToShow.map((destination) => (
          <motion.div
            key={destination.id}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={destination.image}
                alt={destination.name}
                className="object-cover w-full h-48"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                {destination.name}
              </h3>
              <p className="text-gray-300 mb-4">{destination.description}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-blue-400">
                  Top Attractions:
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {destination.attractions.map(
                    (attraction: string, index: number) => (
                      <li key={index}>• {attraction}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
