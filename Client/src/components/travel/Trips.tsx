import { useNavigate } from "react-router-dom";
import { useTripStore } from "../../store/tripStore";
import { motion } from "framer-motion";
import { Trip } from "../../types";
import { ArrowLeft, ArrowRight, Calendar, Users, Wallet } from "lucide-react";

interface TripCardProps {
  trip: Trip;
  showBookNow?: boolean;
}

const TripCard = ({ trip, showBookNow = false }: TripCardProps) => {
    const navigate = useNavigate();

    const getBudgetDisplay = () => {
        const amount = trip.budget.amount;
        const isPerPerson = trip.budget.type === "per_person";
        const isPerDay = trip.budget.duration === "per_day";

        return `₹${amount.toLocaleString("en-IN")} ${
            isPerPerson ? "per person" : "total"
        }${isPerDay ? " per day" : ""}`;
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
        >
            <div className="aspect-w-16 aspect-h-9 relative">
                <img
                    src={
                        trip.image ||
                        `https://source.unsplash.com/800x600/?${encodeURIComponent(
                            trip.destination
                        )}`
                    }
                    alt={trip.destination}
                    className="object-cover w-full h-48"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                    {trip.destination}
                </h3>
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
                        <span>{getBudgetDisplay()}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/dashboard/trips/${trip.id}`)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                    >
                        View Itinerary
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                    {showBookNow && (
                        <button
                            onClick={() =>
                                navigate(`/dashboard/book/${trip.id}`)
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Book Now
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const Trips = () => {
  const { trips } = useTripStore();
  const navigate = useNavigate();
  return (
      <>
          <div className="max-w-7xl mx-auto mt-6">
              <div className="flex items-center justify-between">
                  <button
                      onClick={() => navigate(`/dashboard`)}
                      className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Back to Home
                  </button>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                  {/* Your Trips Section */}
                  <section>
                      {trips.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {trips.map((trip) => (
                                  <TripCard key={trip.id} trip={trip} />
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-12">
                              <p className="text-gray-400">
                                  You don't have any trips yet.
                              </p>
                          </div>
                      )}
                  </section>
              </div>
          </div>
      </>
  );
};
