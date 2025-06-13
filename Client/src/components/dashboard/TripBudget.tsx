import { useParams, useNavigate } from "react-router-dom";
// import { useTripStore } from "../../store/tripStore";
import {
  ArrowLeft,
  Users,
  Calendar,
  Plane,
  Hotel,
  Coffee,
  Ticket,
  PiggyBank,
  CreditCard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { tripsAPI } from "../../lib/apis";
import { Trip } from "../../types";

export const TripBudget = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
 
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchTrip = async () => {
          try {
              const response = await tripsAPI.getTrip(tripId as string);
              setTrip(response.data);
          } catch (err) {
              console.error("Failed to fetch trip:", err);
          } finally {
              setLoading(false);
          }
      };

      if (tripId) fetchTrip();
  }, [tripId]);

  if (loading) {
      return (
          <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Loading trip details...</p>
          </div>
      );
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Trip not found</p>
      </div>
    );
  }


  // Example budget breakdown
  const budgetBreakdown = {
    transportation: {
      icon: Plane,
      title: "Transportation",
      amount: Math.round((trip.totalCost?.total ?? 0) * 0.3), // 30% of total budget
      items: [
        { name: "Flights", amount: Math.round((trip.totalCost?.total ?? 0) * 0.25) },
        {
          name: "Local Transport",
          amount: Math.round((trip.totalCost?.total ?? 0) * 0.05),
        },
      ],
    },
    accommodation: {
      icon: Hotel,
      title: "Accommodation",
      amount: Math.round((trip.totalCost?.total ?? 0) * 0.4), // 40% of total budget
      items: [
        { name: "Hotels", amount: Math.round((trip.totalCost?.total ?? 0) * 0.35) },
        { name: "Taxes & Fees", amount: Math.round((trip.totalCost?.total ?? 0) * 0.05) },
      ],
    },
    activities: {
      icon: Ticket,
      title: "Activities & Entertainment",
      amount: Math.round((trip.totalCost?.total ?? 0) * 0.15), // 15% of total budget
      items: [
        { name: "Tours", amount: Math.round((trip.totalCost?.total ?? 0) * 0.08) },
        { name: "Attractions", amount: Math.round((trip.totalCost?.total ?? 0) * 0.07) },
      ],
    },
    food: {
      icon: Coffee,
      title: "Food & Dining",
      amount: Math.round((trip.totalCost?.total ?? 0) * 0.15), // 15% of total budget
      items: [
        { name: "Restaurants", amount: Math.round((trip.totalCost?.total ?? 0) * 0.1) },
        { name: "Groceries", amount: Math.round((trip.totalCost?.total ?? 0) * 0.05) },
      ],
    },
  };

  return (
      <div className="min-h-screen bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                  <button
                      onClick={() => navigate(`/dashboard/trips/${tripId}`)}
                      className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Back to Trip
                  </button>
                  <h1 className="text-2xl font-semibold">Budget Details</h1>
              </div>

              {/* Budget Overview */}
              <div className="bg-gray-800 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                      <div>
                          <h2 className="text-xl font-semibold mb-2">
                              {trip.title}
                          </h2>
                          <p className="text-gray-400">
                              {trip.destination} • {trip.travelers} travelers
                          </p>
                      </div>
                      <div className="text-right">
                          <p className="text-3xl font-bold text-white">
                              ₹{(trip.totalCost?.total ?? 0).toLocaleString()}
                          </p>
                          <p className="text-gray-400">
                              {trip.budget.type === "per_person"
                                  ? "per person"
                                  : "total"}
                          </p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                          <div className="flex items-center text-blue-400 mb-2">
                              <Users className="h-5 w-5 mr-2" />
                              <span>Travelers</span>
                          </div>
                          <p className="text-2xl font-semibold">
                              {trip.travelers}
                          </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                          <div className="flex items-center text-green-400 mb-2">
                              <Calendar className="h-5 w-5 mr-2" />
                              <span>Duration</span>
                          </div>
                          <p className="text-2xl font-semibold">
                              {trip.itinerary.length} days
                          </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                          <div className="flex items-center text-purple-400 mb-2">
                              <CreditCard className="h-5 w-5 mr-2" />
                              <span>Daily Budget</span>
                          </div>
                          <p className="text-2xl font-semibold">
                              ₹
                              {Math.round(
                                  (trip.totalCost?.total ?? 0) / trip.itinerary.length
                              ).toLocaleString()}
                          </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                          <div className="flex items-center text-yellow-400 mb-2">
                              <PiggyBank className="h-5 w-5 mr-2" />
                              <span>Savings Target</span>
                          </div>
                          <p className="text-2xl font-semibold">
                              ₹
                              {Math.round(
                                  (trip.totalCost?.total ?? 0) * 1.1
                              ).toLocaleString()}
                          </p>
                      </div>
                  </div>
              </div>
              {/* Budget Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(budgetBreakdown).map(([key, category]) => {
                      const Icon = category.icon;
                      return (
                          <div key={key} className="bg-gray-800 rounded-xl p-6">
                              <div className="flex items-center mb-4">
                                  <Icon className="h-6 w-6 text-blue-500 mr-3" />
                                  <h3 className="text-lg font-semibold">
                                      {category.title}
                                  </h3>
                              </div>
                              <div className="space-y-4">
                                  {category.items.map((item, index) => (
                                      <div
                                          key={index}
                                          className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0"
                                      >
                                          <span className="text-gray-300">
                                              {item.name}
                                          </span>
                                          <span className="font-medium">
                                              ₹{item.amount.toLocaleString()}
                                          </span>
                                      </div>
                                  ))}
                                  <div className="flex items-center justify-between pt-4">
                                      <span className="font-semibold">
                                          Total
                                      </span>
                                      <span className="font-semibold text-blue-400">
                                          ₹{category.amount.toLocaleString()}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
              {/* Budget Tips */}
              <div className="mt-8 bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Budget Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-300">
                              💡 Book flights and accommodations in advance to
                              get better deals
                          </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-300">
                              💡 Consider local transportation passes for
                              cost-effective travel
                          </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-300">
                              💡 Look for combo tickets for attractions to save
                              money
                          </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-300">
                              💡 Mix dining options between restaurants and
                              local markets
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};
