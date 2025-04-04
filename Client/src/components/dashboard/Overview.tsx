import { motion } from "framer-motion";
import { Calendar, Users, Wallet, ArrowRight } from "lucide-react";
import { useTripStore } from "../../store/tripStore";
import { useNavigate } from "react-router-dom";
import { Trip } from "../../types";

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
              onClick={() => navigate(`/dashboard/book/${trip.id}`)}
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

const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-semibold text-white">{title}</h2>
  </div>
);

export const Overview = () => {
  const { trips } = useTripStore();

  // Example trips for different sections
  const forYouTrips: Trip[] = [
    {
      id: "fy1",
      title: "Paris Getaway",
      destination: "Paris, France",
      startDate: "2024-06-15",
      endDate: "2024-06-22",
      budget: { amount: 150000, type: "per_person", duration: "entire_trip" },
      travelers: 2,
      transportationType: "flight",
      status: "planned",
      itinerary: [],
      weather: [],
      accommodation: [],
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    },
    {
      id: "fy2",
      title: "Bali Paradise",
      destination: "Bali, Indonesia",
      startDate: "2024-07-10",
      endDate: "2024-07-17",
      budget: { amount: 80000, type: "per_person", duration: "entire_trip" },
      travelers: 2,
      transportationType: "flight",
      status: "planned",
      itinerary: [],
      weather: [],
      accommodation: [],
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    },
    {
      id: "fy3",
      title: "Swiss Alps",
      destination: "Switzerland",
      startDate: "2024-08-01",
      endDate: "2024-08-08",
      budget: { amount: 200000, type: "per_person", duration: "entire_trip" },
      travelers: 2,
      transportationType: "flight",
      status: "planned",
      itinerary: [],
      weather: [],
      accommodation: [],
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
    },
  ];

  const trendingTrips: Trip[] = [
    {
      id: "tr1",
      title: "Tokyo Adventure",
      destination: "Tokyo, Japan",
      startDate: "2024-07-01",
      endDate: "2024-07-10",
      budget: { amount: 25000, type: "per_person", duration: "per_day" },
      travelers: 1,
      transportationType: "flight",
      status: "planned",
      itinerary: [],
      weather: [],
      accommodation: [],
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
    },
    {
      id: "tr2",
      title: "Dubai Luxury",
      destination: "Dubai, UAE",
      startDate: "2024-09-15",
      endDate: "2024-09-22",
      budget: { amount: 35000, type: "per_person", duration: "per_day" },
      travelers: 2,
      transportationType: "flight",
      status: "planned",
      itinerary: [],
      weather: [],
      accommodation: [],
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    },
    {
      id: "tr3",
      title: "Maldives Paradise",
      destination: "Maldives",
      startDate: "2024-10-01",
      endDate: "2024-10-07",
      budget: { amount: 300000, type: "per_person", duration: "entire_trip" },
      travelers: 2,
      transportationType: "flight",
      status: "planned",
      itinerary: [],
      weather: [],
      accommodation: [],
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd",
    },
  ];

  const exploreTrips: Trip[] = [
    {
      id: "ex1",
      title: "Greek Islands",
      destination: "Santorini, Greece",
      startDate: "2024-08-15",
      endDate: "2024-08-22",
      budget: { amount: 180000, type: "per_person", duration: "entire_trip" },
      travelers: 2,
      transportationType: "flight",
      status: "planned",
      itinerary: [],
      weather: [],
      accommodation: [],
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
    },
    {
      id: "ex2",
      title: "Vietnam Explorer",
      destination: "Ha Long Bay, Vietnam",
      startDate: "2024-11-01",
      endDate: "2024-11-08",
      budget: { amount: 15000, type: "per_person", duration: "per_day" },
      travelers: 2,
      transportationType: "flight",
      status: "planned",
      itinerary: [],
      weather: [],
      accommodation: [],
      image: "https://images.unsplash.com/photo-1528127269322-539801943592",
    },
    {
      id: "ex3",
      title: "Turkish Delight",
      destination: "Istanbul, Turkey",
      startDate: "2024-09-20",
      endDate: "2024-09-27",
      budget: { amount: 120000, type: "per_person", duration: "entire_trip" },
      travelers: 2,
      transportationType: "flight",
      status: "planned",
      itinerary: [],
      weather: [],
      accommodation: [],
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b",
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Your Trips Section */}
        {trips.length > 0 && (
          <section>
            <SectionTitle title="Your Trips" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        )}

        {/* For You Section */}
        <section>
          <SectionTitle title="For You" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forYouTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section>
          <SectionTitle title="Trending Now" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Explore Section */}
        <section>
          <SectionTitle title="Explore" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
