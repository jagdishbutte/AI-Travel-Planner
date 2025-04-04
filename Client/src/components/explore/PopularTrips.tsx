import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Users, Wallet } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { popularTrips } from "../../data/exploreData";

export const PopularTrips = () => {
  const navigate = useNavigate();
  const { filteredTrips } = useSearch();

  const getBudgetDisplay = (amount: number, type: string, duration: string) => {
    return `₹${amount.toLocaleString("en-IN")} ${
      type === "per_person" ? "per person" : "total"
    }${duration === "per_day" ? " per day" : ""}`;
  };

  const tripsToShow = filteredTrips.length > 0 ? filteredTrips : popularTrips;

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
        <h1 className="text-3xl font-bold text-white">Popular Trips</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tripsToShow.map((trip) => (
          <motion.div
            key={trip.id}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={trip.image}
                alt={trip.destination}
                className="object-cover w-full h-48"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                {trip.title}
              </h3>
              <p className="text-gray-300 mb-4">{trip.destination}</p>
              <div className="space-y-2 text-gray-300 text-sm mb-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{trip.travelers} travelers</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(trip.startDate).toLocaleDateString()} -{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  <span>
                    {getBudgetDisplay(
                      trip.budget.amount,
                      trip.budget.type,
                      trip.budget.duration
                    )}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-blue-400">
                  Trip Highlights:
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {trip.highlights.map((highlight: string, index: number) => (
                    <li key={index}>• {highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
