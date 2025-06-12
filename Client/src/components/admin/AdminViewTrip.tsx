import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  Hotel,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  MapPin,
  Coffee,
  Camera,
  Bus,
  Star,
  ArrowLeft,
  Users,
  CalendarDays,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTripStore } from "../../store/tripStore";
import { ThemeContext } from "../../context/ThemeContext";
// import { LoadingSpinner } from "../common/LoadingSpinner";
import { TimelineEvent as BaseTimelineEvent } from "../../store/tripStore";
import { Trip } from "../../types";
import { tripsAPI } from "../../lib/apis";

interface TimelineEvent extends BaseTimelineEvent {
  icon: typeof Camera | typeof Bus | typeof Coffee | typeof Hotel;
}

interface WeatherInfo {
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy";
  temperature: number;
  icon:
    | typeof Sun
    | typeof Cloud
    | typeof CloudRain
    | typeof CloudSnow
    | typeof Wind;
}

export default function ViewTrip() {
  const { tripId } = useParams();
  const storeTrip = useTripStore((state) =>
    state.trips.find((t) => t.id === tripId)
  );
  // const updateTrip = useTripStore((state) => state.updateTrip);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isHotelListExpanded] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [isEditSuccess ] = useState(false);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        if (storeTrip) {
          setTrip(storeTrip);
          setLoading(false);
          return;
        } // No need to fetch if already in store

        if (tripId) {
          const response = await tripsAPI.getTrip(tripId);
          if (response) {
            setTrip(response as Trip);
          } else {
            console.error("Invalid or missing trip data");
          }
        }
      } catch (error) {
        console.error("Failed to fetch trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, storeTrip, isEditSuccess]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center content-center h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4"
        >
          <Camera className="h-12 w-12 mx-auto text-blue-500" />
        </motion.div>
        <p className="text-gray-400">Loading Trip...</p>
      </div>
    );

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Trip not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getWeatherIcon = (condition: WeatherInfo["condition"]) => {
    const icons = {
      sunny: Sun,
      cloudy: Cloud,
      rainy: CloudRain,
      snowy: CloudSnow,
      windy: Wind,
    } as const;
    return icons[condition] || Cloud; // Provide a fallback icon
  };

  const getEventIcon = (type: TimelineEvent["type"]) => {
    const icons = {
      activity: Camera,
      transport: Bus,
      food: Coffee,
      accommodation: Hotel,
    } as const;
    return icons[type] || Camera; // Provide a fallback icon
  };

  const handleBudgetClick = () => {
    navigate(`/dashboard/trips/${tripId}/budget`);
  };

  return (
    <div className="text-white">
      <header className="sticky top-0 bg-gray-900 z-10 p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Trip Details</h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>
      </header>

      {trip && (
        <div className="p-6">
          <div className="relative h-64 rounded-xl overflow-hidden mb-8">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${trip.image})`,
              }}
            >
              <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-8">
              <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
              <div className="flex items-center space-x-4 text-lg mb-2">
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  {trip.destination}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-lg">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  {trip.travelers} Travelers
                </span>
                <span className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-1" />{" "}
                  {trip.itinerary.length} days
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
              <div
                className={`rounded-xl p-6 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <h2 className="text-xl font-semibold mb-4">Trip Overview</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={handleBudgetClick}
                  >
                    <p className="text-gray-400 text-sm">Budget</p>
                    <p className="text-xl font-semibold">
                      ₹{trip.totalCost?.total}
                      <span className="text-sm text-gray-400 block sm:inline">
                        /
                        {trip.budget.type === "per_person" ? "person" : "total"}
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-xl font-semibold">
                      {trip.itinerary.length} days
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Transport</p>
                    <p className="text-xl font-semibold capitalize">
                      {trip.transportationType}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl p-6 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <div className="flex justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Daily Itinerary</h2>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                      disabled={selectedDay === 0}
                      onClick={() =>
                        setSelectedDay(Math.max(0, selectedDay - 1))
                      }
                    >
                      Previous Day
                    </button>
                    <button
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                      disabled={selectedDay === trip.itinerary.length - 1}
                      onClick={() =>
                        setSelectedDay(
                          Math.min(trip.itinerary.length - 1, selectedDay + 1)
                        )
                      }
                    >
                      Next Day
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2 overflow-x-auto pb-4 mb-6">
                  {trip.itinerary.map((day, index) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDay(index)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
                        selectedDay === index
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <span>Day {index + 1}</span>
                      {day.weather && (
                        <span className="flex items-center">
                          {React.createElement(
                            getWeatherIcon(day.weather.condition),
                            {
                              className: "h-4 w-4",
                            }
                          )}
                          <span className="ml-1">
                            {day.weather.temperature}°C
                          </span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-4">
                    {formatDate(trip.itinerary[selectedDay].date)}
                  </h3>
                  {trip.itinerary[selectedDay].events.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-8 pb-8 last:pb-0"
                    >
                      <div className="absolute left-0 top-0 h-full w-px bg-gray-700">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500" />
                      </div>
                      <div className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700/70 transition-colors">
                        <div className="flex items-start">
                          {React.createElement(getEventIcon(event.type), {
                            className:
                              "h-6 w-6 text-blue-500 mr-4 flex-shrink-0 mt-1",
                          })}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-medium">
                                {event.title}
                              </h4>
                              <span className="text-sm text-gray-400">
                                {event.time}
                              </span>
                            </div>
                            <p className="text-gray-400">{event.description}</p>
                            {event.location && (
                              <p className="text-sm text-gray-500 mt-2">
                                {event.location.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl p-6 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg h-fit`}
            >
              <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
              <div className="space-y-3">
                {trip.itinerary.map((day, index) => {
                  const WeatherIcon = getWeatherIcon(day.weather.condition);
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        selectedDay === index
                          ? "bg-gray-700"
                          : "hover:bg-gray-700/50"
                      }`}
                      onClick={() => setSelectedDay(index)}
                    >
                      <span className="text-sm">Day {index + 1}</span>
                      <div className="flex items-center">
                        <WeatherIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <span>{day.weather.temperature}°C</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                  Accommodation Options
                </h2>
                <div className="space-y-4">
                  {trip.accommodation
                    .slice(0, isHotelListExpanded ? undefined : 2)
                    .map((hotel) => (
                      <motion.div
                        key={hotel.id}
                        className={`bg-gray-700 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-200 ${
                          selectedHotel === hotel.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => setSelectedHotel(hotel.id)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="relative h-48">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-gray-800 rounded-full px-2 py-1 flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm">{hotel.rating}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium">
                              {hotel.name}
                            </h3>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">
                            {hotel.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.map((amenity) => (
                              <span
                                key={amenity}
                                className="px-2 py-1 bg-gray-600 rounded-full text-xs text-gray-300"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold">
                              ₹{hotel.price.toLocaleString()}
                              <span className="text-sm text-gray-400">
                                /night
                              </span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
