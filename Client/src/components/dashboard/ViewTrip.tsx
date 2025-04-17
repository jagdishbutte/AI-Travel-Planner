import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Share2,
    Edit3,
    Bookmark,
    Facebook,
    Twitter,
    MessageCircle,
    Star,
    X,
    Link as LinkIcon,
    Copy,
    Check,
    ArrowLeft,
    Users,
    CalendarDays,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTripStore } from "../../store/tripStore";
import { format } from "date-fns";
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
interface EditTripForm {
    startDate: string;
    endDate: string;
    budget: {
        amount: number;
        type: "per_person" | "total";
        duration: "entire_trip" | "per_day";
    };
    numberOfPersons: number;
    transportationType: "flight" | "train" | "bus";
    aiPrompt: string;
    preferences: string[];
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    // const [editPrompt, setEditPrompt] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [isEditSuccess, setIsEditSuccess] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [editForm, setEditForm] = useState<EditTripForm>({
        startDate: trip?.startDate
            ? format(new Date(trip.startDate), "yyyy-MM-dd")
            : "",
        endDate: trip?.endDate
            ? format(new Date(trip.endDate), "yyyy-MM-dd")
            : "",
        budget: {
            amount: trip?.budget.amount || 0,
            type: trip?.budget.type || "total",
            duration: trip?.budget.duration || "entire_trip",
        },
        numberOfPersons: trip?.travelers || 1,
        transportationType: trip?.transportationType || "flight",
        aiPrompt: "",
        preferences: [],
    });
    const [errors, setErrors] = useState({
        dates: "",
        budget: "",
    });
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

    const handleEditTrip = async () => {
        try {
            setErrors({
                dates: "",
                budget: "",
            });

            const newErrors: Record<string, string> = {};

            if (!editForm.startDate || !editForm.endDate)
                newErrors.dates = "Please select both start and end dates.";
            else if (editForm.startDate > editForm.endDate)
                newErrors.dates = "Start date cannot be after end date.";
            if (!editForm.budget.amount || editForm.budget.amount <= 0)
                newErrors.budget = "Enter a valid budget.";

            if (Object.keys(newErrors).length > 0) {
                setErrors((prev) => ({ ...prev, ...newErrors }));
                return;
            }

            setIsEditModalOpen(false);
            setIsEditing(true);
            setIsEditSuccess(false);

            const updatedData = {
                startDate: editForm.startDate,
                endDate: editForm.endDate,
                budget: editForm.budget,
                numberOfPersons: editForm.numberOfPersons,
                transportationType: editForm.transportationType,
                prompt: editForm.aiPrompt,
            };

            const response = await tripsAPI.updateTrip(
                tripId as string,
                updatedData
            );

            if (response.data?.success) {
                setIsEditSuccess(true);
                setIsEditing(false);
                console.log("Trip updated:", response.data.data);
                setTimeout(() => {
                    setIsEditSuccess(false);
                }, 2000);
            } else {
                console.error("Failed to update trip:", response.data?.message);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Update error:", error);
            setIsEditing(false);
        }
    };

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2000);
    };

    const handleBudgetClick = () => {
        navigate(`/dashboard/trips/${tripId}/budget`);
    };

    return (
        <div
            className={`min-h-screen mt-12 ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Home
                    </button>
                    {/* <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 hover:bg-gray-700 rounded-md transition-colors"
                  >
                      <Share2 className="h-5 w-5" />
                      Share
                  </button> */}
                </div>
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
                        <h1 className="text-4xl font-bold mb-2">
                            {trip.title}
                        </h1>
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
                        {/* Trip Overview */}
                        <div
                            className={`rounded-xl p-6 ${
                                theme === "dark" ? "bg-gray-800" : "bg-white"
                            } shadow-lg`}
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                Trip Overview
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div
                                    className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                                    onClick={handleBudgetClick}
                                >
                                    <p className="text-gray-400 text-sm">
                                        Budget
                                    </p>
                                    <p className="text-xl font-semibold">
                                        ₹{trip.totalCost?.total}
                                        <span className="text-sm text-gray-400 block sm:inline">
                                            /
                                            {trip.budget.type === "per_person"
                                                ? "person"
                                                : "total"}
                                        </span>
                                    </p>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <p className="text-gray-400 text-sm">
                                        Duration
                                    </p>
                                    <p className="text-xl font-semibold">
                                        {trip.itinerary.length} days
                                    </p>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <p className="text-gray-400 text-sm">
                                        Transport
                                    </p>
                                    <p className="text-xl font-semibold capitalize">
                                        {trip.transportationType}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Daily Itinerary */}
                        <div
                            className={`rounded-xl p-6 ${
                                theme === "dark" ? "bg-gray-800" : "bg-white"
                            } shadow-lg`}
                        >
                            <div className="flex justify-between mb-6">
                                <h2 className="text-2xl font-semibold">
                                    Daily Itinerary
                                </h2>
                                <div className="flex space-x-2">
                                    <button
                                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                        disabled={selectedDay === 0}
                                        onClick={() =>
                                            setSelectedDay(
                                                Math.max(0, selectedDay - 1)
                                            )
                                        }
                                    >
                                        Previous Day
                                    </button>
                                    <button
                                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                        disabled={
                                            selectedDay ===
                                            trip.itinerary.length - 1
                                        }
                                        onClick={() =>
                                            setSelectedDay(
                                                Math.min(
                                                    trip.itinerary.length - 1,
                                                    selectedDay + 1
                                                )
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
                                                    getWeatherIcon(
                                                        day.weather.condition
                                                    ),
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
                                    {formatDate(
                                        trip.itinerary[selectedDay].date
                                    )}
                                </h3>
                                {trip.itinerary[selectedDay].events.map(
                                    (event, index) => (
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
                                                    {React.createElement(
                                                        getEventIcon(
                                                            event.type
                                                        ),
                                                        {
                                                            className:
                                                                "h-6 w-6 text-blue-500 mr-4 flex-shrink-0 mt-1",
                                                        }
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-lg font-medium">
                                                                {event.title}
                                                            </h4>
                                                            <span className="text-sm text-gray-400">
                                                                {event.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-400">
                                                            {event.description}
                                                        </p>
                                                        {event.location && (
                                                            <p className="text-sm text-gray-500 mt-2">
                                                                {
                                                                    event
                                                                        .location
                                                                        .name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Weather Forecast */}
                    <div
                        className={`rounded-xl p-6 ${
                            theme === "dark" ? "bg-gray-800" : "bg-white"
                        } shadow-lg h-fit`}
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            Weather Forecast
                        </h2>
                        <div className="space-y-3">
                            {trip.itinerary.map((day, index) => {
                                const WeatherIcon = getWeatherIcon(
                                    day.weather.condition
                                );
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
                                        <span className="text-sm">
                                            Day {index + 1}
                                        </span>
                                        <div className="flex items-center">
                                            <WeatherIcon className="h-5 w-5 text-blue-500 mr-2" />
                                            <span>
                                                {day.weather.temperature}°C
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Hotel Options */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4">
                                Accommodation Options
                            </h2>
                            <div className="space-y-4">
                                {trip.accommodation
                                    .slice(
                                        0,
                                        isHotelListExpanded ? undefined : 2
                                    )
                                    .map((hotel) => (
                                        <motion.div
                                            key={hotel.id}
                                            className={`bg-gray-700 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-200 ${
                                                selectedHotel === hotel.id
                                                    ? "ring-2 ring-blue-500"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setSelectedHotel(hotel.id)
                                            }
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
                                                    <span className="text-sm">
                                                        {hotel.rating}
                                                    </span>
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
                                                    {hotel.amenities.map(
                                                        (amenity) => (
                                                            <span
                                                                key={amenity}
                                                                className="px-2 py-1 bg-gray-600 rounded-full text-xs text-gray-300"
                                                            >
                                                                {amenity}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-semibold">
                                                        ₹
                                                        {hotel.price.toLocaleString()}
                                                        <span className="text-sm text-gray-400">
                                                            /night
                                                        </span>
                                                    </span>
                                                    {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Book Now
                          </button> */}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Action Buttons */}
                <div className="sticky bottom-8 left-0 right-0 flex justify-center z-30 mt-8">
                    <div className="flex gap-4 rounded-lg">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                            <Edit3 className="h-5 w-5" />
                            Edit Trip
                        </button>
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                        >
                            <Share2 className="h-5 w-5" />
                            Share
                        </button>
                        <button
                            onClick={() => {
                                setIsSaved(true);
                                setTimeout(() => {
                                    setIsSaved(false);
                                }, 2000);
                            }}
                            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                        >
                            <Bookmark className="h-5 w-5" />
                            Save Trip
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 my-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">
                                    Edit Trip
                                </h2>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Trip Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editForm.startDate}
                                            onChange={(e) => {
                                                setEditForm({
                                                    ...editForm,
                                                    startDate: e.target.value,
                                                });
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    dates: "",
                                                }));
                                            }}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editForm.endDate}
                                            onChange={(e) => {
                                                setEditForm({
                                                    ...editForm,
                                                    endDate: e.target.value,
                                                });
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    dates: "",
                                                }));
                                            }}
                                            min={editForm.startDate}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark]"
                                        />
                                    </div>
                                    {errors.dates && (
                                        <div className="mt-2 flex items-center text-red-400 text-sm">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.dates}
                                        </div>
                                    )}
                                </div>

                                {/* Budget Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Budget
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            value={editForm.budget.amount}
                                            onChange={(e) => {
                                                setEditForm({
                                                    ...editForm,
                                                    budget: {
                                                        ...editForm.budget,
                                                        amount: Number(
                                                            e.target.value
                                                        ),
                                                    },
                                                });
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    budget: "",
                                                }));
                                            }}
                                            className={`w-full px-4 py-3 bg-gray-700/50 border ${
                                                errors.budget
                                                    ? "border-red-500"
                                                    : "border-gray-600"
                                            } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            placeholder="Amount"
                                        />
                                        <select
                                            value={editForm.budget.type}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    budget: {
                                                        ...editForm.budget,
                                                        type: e.target.value as
                                                            | "per_person"
                                                            | "total",
                                                    },
                                                })
                                            }
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                        >
                                            <option value="per_person">
                                                Per Person
                                            </option>
                                            <option value="total">Total</option>
                                        </select>
                                    </div>
                                    {errors.budget && (
                                        <div className="mt-2 flex items-center text-red-400 text-sm">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.budget}
                                        </div>
                                    )}
                                </div>

                                {/* Number of Persons */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Number of Travelers
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editForm.numberOfPersons}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                numberOfPersons: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                    />
                                </div>

                                {/* Transportation Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Transportation Type
                                    </label>
                                    <select
                                        value={editForm.transportationType}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                transportationType: e.target
                                                    .value as
                                                    | "flight"
                                                    | "train"
                                                    | "bus",
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                    >
                                        <option value="flight">Flight</option>
                                        <option value="train">Train</option>
                                        <option value="bus">Bus</option>
                                    </select>
                                </div>

                                {/* AI Prompt */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        AI Customization Prompt
                                    </label>
                                    <textarea
                                        value={editForm.aiPrompt}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                aiPrompt: e.target.value,
                                            })
                                        }
                                        placeholder="E.g., Add more adventure activities, focus on local cuisine, include more budget-friendly options..."
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white h-24 resize-none"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        onClick={() =>
                                            setIsEditModalOpen(false)
                                        }
                                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditTrip}
                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {(isEditing || isEditSuccess) && (
                <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    {isEditSuccess ? (
                        <div className="text-center py-8">
                            <div className="text-green-400 mb-4">
                                <CheckCircle className="h-12 w-12 mx-auto" />
                            </div>
                            <p className="text-lg text-green-300">
                                Trip updated successfully!
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
                            <p className="text-lg text-gray-400">
                                Updating trip...
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Share Modal */}
            <AnimatePresence>
                {isShareModalOpen && (
                    <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">
                                    Share Trip
                                </h2>
                                <button
                                    onClick={() => setIsShareModalOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={window.location.href}
                                        readOnly
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white pr-24"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors flex items-center"
                                    >
                                        {isLinkCopied ? (
                                            <>
                                                <Check className="h-4 w-4 mr-1" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4 mr-1" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                                        <Facebook className="h-6 w-6 text-blue-500 mb-2" />
                                        <span className="text-sm">
                                            Facebook
                                        </span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                                        <Twitter className="h-6 w-6 text-blue-400 mb-2" />
                                        <span className="text-sm">Twitter</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                                        <MessageCircle className="h-6 w-6 text-green-500 mb-2" />
                                        <span className="text-sm">
                                            WhatsApp
                                        </span>
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-gray-700">
                                    <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                        <LinkIcon className="h-5 w-5 mr-2" />
                                        Share Link
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Save Confirmation Toast */}
            {isSaved && (
                <div className="fixed bottom-24 left-1/2 duration-500 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
                    Trip saved successfully!
                </div>
            )}
        </div>
    );
}
