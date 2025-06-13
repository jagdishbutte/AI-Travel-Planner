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
  Plane,
  Train,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTripStore } from "../../store/tripStore";
import { useAuthStore } from "../../store/authStore";
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
  const { user } = useAuthStore();
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
  const [bookingNotification, setBookingNotification] = useState<{
    type: "hotel" | "transport" | null;
    message: string;
  }>({ type: null, message: "" });
  const [editForm, setEditForm] = useState<EditTripForm>({
    startDate: trip?.startDate
      ? format(new Date(trip.startDate), "yyyy-MM-dd")
      : "",
    endDate: trip?.endDate ? format(new Date(trip.endDate), "yyyy-MM-dd") : "",
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
          if (response.data) {
            setTrip(response.data as unknown as Trip);
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
    return icons[type] || Camera;
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

      const response = await tripsAPI.updateTrip(tripId as string, updatedData);

      if (response.data?.success) {
        setIsEditSuccess(true);
        setIsEditing(false);
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

  // Enhanced City and Airport Code Mappings with correct IATA codes
  const cityToAirportCode: Record<string, string> = {
    Delhi: "DEL",
    "New Delhi": "DEL",
    Mumbai: "BOM",
    Bangalore: "BLR",
    Bengaluru: "BLR",
    Chennai: "MAA",
    Kolkata: "CCU",
    Hyderabad: "HYD",
    Pune: "PNQ",
    Ahmedabad: "AMD",
    Jaipur: "JAI",
    Lucknow: "LKO",
    Goa: "GOI", // Correct code for Goa (Dabolim Airport)
    Panaji: "GOI",
    Kochi: "COK",
    Cochin: "COK",
    Chandigarh: "IXC",
    Indore: "IDR",
    Bhubaneswar: "BBI",
    Srinagar: "SXR",
    Udaipur: "UDR",
    Jodhpur: "JDH",
    Varanasi: "VNS",
    Agra: "AGR",
    Patna: "PAT",
    Ranchi: "IXR",
    Coimbatore: "CJB",
    Trichy: "TRZ",
    Madurai: "IXM",
    Thiruvananthapuram: "TRV",
    Trivandrum: "TRV",
    Vijayawada: "VGA",
    Visakhapatnam: "VTZ",
    Nagpur: "NAG",
    Raipur: "RPR",
    Bhopal: "BHO",
    Gwalior: "GWL",
  };

  const cityToBusInfo: Record<string, { id: string; name: string }> = {
    Delhi: { id: "733", name: "Delhi" },
    Mumbai: { id: "123", name: "Mumbai" },
    Bangalore: { id: "122", name: "Bangalore" },
    Chennai: { id: "123", name: "Chennai" },
    Kolkata: { id: "408", name: "Kolkata" },
    Hyderabad: { id: "203", name: "Hyderabad" },
    Pune: { id: "130", name: "Pune" },
    Ahmedabad: { id: "77", name: "Ahmedabad" },
    Jaipur: { id: "196", name: "Jaipur" },
    Lucknow: { id: "1439", name: "Lucknow" },
    Goa: { id: "5078", name: "Goa" },
    Kochi: { id: "236", name: "Kochi" },
    Chandigarh: { id: "156", name: "Chandigarh" },
    Indore: { id: "204", name: "Indore" },
  };

  const cityToRailwayInfo: Record<string, { code: string; name: string }> = {
    Delhi: { code: "NDLS", name: "New Delhi" },
    Mumbai: { code: "CSMT", name: "Mumbai CST" },
    Bangalore: { code: "SBC", name: "Bangalore City" },
    Chennai: { code: "MAS", name: "Chennai Central" },
    Kolkata: { code: "HWH", name: "Howrah" },
    Hyderabad: { code: "HYB", name: "Hyderabad" },
    Pune: { code: "PUNE", name: "Pune" },
    Ahmedabad: { code: "ADI", name: "Ahmedabad" },
    Jaipur: { code: "JP", name: "Jaipur" },
    Lucknow: { code: "LKO", name: "Lucknow" },
    Goa: { code: "MAO", name: "Madgaon" },
    Kochi: { code: "ERS", name: "Ernakulam" },
    Chandigarh: { code: "CDG", name: "Chandigarh" },
    Indore: { code: "INDB", name: "Indore" },
  };

  // Mock function to simulate Booking.com property ID lookup
  const getBookingComPropertyId = async (
    hotelName: string,
    location: string
  ): Promise<string | null> => {
    const mockPropertyIds: Record<string, string> = {
      "Taj Mahal Hotel Mumbai": "20020609",
      "The Leela Palace New Delhi": "20031011",
      "ITC Grand Chola Chennai": "20030815",
      "Taj Lake Palace Udaipur": "20020612",
      "The Oberoi Mumbai": "20020608",
      "ITC Maurya New Delhi": "20030816",
      "Taj Palace Hotel New Delhi": "20020610",
      "The Park Hyatt Chennai": "20031012",
    };

    const propertyId = mockPropertyIds[hotelName];
    return propertyId || null;
  };

  interface Hotel {
    name: string;
    location?: {
      address?: string;
    };
  }

  const generateHotelBookingUrl = async (hotel: Hotel) => {
    const checkIn = format(new Date(trip!.startDate), "yyyy-MM-dd");
    const checkOut = format(new Date(trip!.endDate), "yyyy-MM-dd");
    const guests = trip!.travelers;

    try {
      // Try to get the actual Booking.com property ID
      const propertyId = await getBookingComPropertyId(
        hotel.name,
        hotel.location?.address || trip!.destination
      );

      if (propertyId) {
        // Direct hotel booking URL with property ID
        return `https://www.booking.com/hotel/in/${propertyId}.html?checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=1&selected_currency=INR`;
      }
    } catch (error) {
      console.error("Error fetching property ID:", error);
    }

    // Fallback to search-based approach
    const searchQuery = `${hotel.name} ${
      hotel.location?.address || trip!.destination
    }`;
    return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
      searchQuery
    )}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=1&selected_currency=INR&dest_type=city`;
  };

  const generateTransportBookingUrl = (
    transportType: string,
    destination: string,
    origin: string = "Delhi"
  ) => {
    const departDate = format(new Date(trip!.startDate), "dd/MM/yyyy");
    const returnDate = format(new Date(trip!.endDate), "dd/MM/yyyy");
    const pax = trip!.travelers;

    if (transportType === "flight") {
      // Get origin and destination airport codes
      const originCode = cityToAirportCode[origin] || "DEL";
      const destCode =
        cityToAirportCode[destination] || destination.slice(0, 3).toUpperCase();

      // MakeMyTrip flight URL format: BOM-DEL-13/06/2025_DEL-BOM-14/06/2025
      const itinerary = `${originCode}-${destCode}-${departDate}_${destCode}-${originCode}-${returnDate}`;
      const currentTime = Date.now();

      return `https://www.makemytrip.com/flight/search?tripType=R&itinerary=${itinerary}&paxType=A-${pax}_C-0_I-0&cabinClass=E&sTime=${currentTime}&forwardFlowRequired=true&mpo=&semType=&intl=false`;
    }

    if (transportType === "train") {
      // RedBus railway booking with proper parameters
      const fromStation = cityToRailwayInfo[origin] || {
        code: "NDLS",
        name: origin,
      };
      const toStation = cityToRailwayInfo[destination] || {
        code: "NDLS",
        name: destination,
      };
      const journeyDate = format(new Date(trip!.startDate), "yyyyMMdd");

      return `https://www.redbus.in/railways/search?src=${
        fromStation.code
      }&dst=${toStation.code}&doj=${journeyDate}&srcName=${encodeURIComponent(
        fromStation.name + " - All Stations"
      )}&dstName=${encodeURIComponent(toStation.name)}&fcOpted=false`;
    }

    if (transportType === "bus") {
      const fromCity = cityToBusInfo[origin] || { id: "733", name: origin };
      const toCity = cityToBusInfo[destination] || {
        id: "1",
        name: destination,
      };
      const onwardDate = format(new Date(trip!.startDate), "dd-MMM-yyyy");

      return `https://www.redbus.in/bus-tickets/${fromCity.name.toLowerCase()}-to-${toCity.name.toLowerCase()}?fromCityName=${
        fromCity.name
      }&fromCityId=${fromCity.id}&srcCountry=IND&fromCityType=CITY&toCityName=${
        toCity.name
      }&toCityId=${
        toCity.id
      }&destCountry=India&toCityType=CITY&onward=${onwardDate}&doj=${onwardDate}&ref=home`;
    }

    return "#";
  };

  const handleHotelBooking = async (hotel: any) => {
    try {
      setBookingNotification({
        type: "hotel",
        message: `Redirecting to book ${hotel.name}...`,
      });

      const bookingUrl = await generateHotelBookingUrl(hotel);
      window.open(bookingUrl, "_blank");

      setTimeout(() => {
        setBookingNotification({ type: null, message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error generating hotel booking URL:", error);
      setBookingNotification({
        type: "hotel",
        message: `Error: Redirecting to general search...`,
      });
      // Fallback to basic search
      const fallbackUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
        trip!.destination
      )}`;
      window.open(fallbackUrl, "_blank");

      setTimeout(() => {
        setBookingNotification({ type: null, message: "" });
      }, 3000);
    }
  };

  const getOriginCity = (): string => {
    // Try to get user's location from auth store
    const userLocation = user?.location;

    // Clean and normalize location strings for comparison
    const normalizeLocation = (location: string) =>
      location.toLowerCase().trim().replace(/\s+/g, " ");

    // If user has a location and it's different from destination, use it
    if (userLocation) {
      const normalizedUserLocation = normalizeLocation(userLocation);
      const normalizedDestination = normalizeLocation(trip!.destination);

      if (normalizedUserLocation !== normalizedDestination) {
        return userLocation;
      }
    }

    // If user's location is same as destination or not available,
    // try to find a major city close to the destination region
    const regionBasedCities: Record<string, string[]> = {
      // North India
      Delhi: ["Jaipur", "Chandigarh", "Lucknow", "Agra"],
      Jaipur: ["Delhi", "Ahmedabad", "Lucknow"],
      Chandigarh: ["Delhi", "Jaipur", "Lucknow"],

      // West India
      Mumbai: ["Pune", "Ahmedabad", "Nagpur"],
      Pune: ["Mumbai", "Hyderabad", "Bangalore"],
      Ahmedabad: ["Mumbai", "Jaipur", "Pune"],

      // South India
      Bangalore: ["Chennai", "Hyderabad", "Pune"],
      Chennai: ["Bangalore", "Hyderabad", "Kochi"],
      Hyderabad: ["Bangalore", "Pune", "Chennai"],

      // East India
      Kolkata: ["Bhubaneswar", "Patna", "Ranchi"],
      Bhubaneswar: ["Kolkata", "Hyderabad", "Chennai"],
    };

    // Try to find a nearby city based on destination region
    const normalizedDestination = normalizeLocation(trip!.destination);
    for (const [region, cities] of Object.entries(regionBasedCities)) {
      if (normalizedDestination.includes(normalizeLocation(region))) {
        // Return the first city that's not the destination
        const nearbyCity = cities.find(
          (city) => normalizeLocation(city) !== normalizedDestination
        );
        if (nearbyCity) return nearbyCity;
      }
    }

    // If no regional match found, use major cities list (avoiding destination)
    const majorCities = [
      "Pune", // Default city (first in list)
      "Mumbai",
      "Bangalore",
      "Delhi",
      "Chennai",
      "Hyderabad",
      "Kolkata",
      "Ahmedabad",
      "Jaipur",
    ];

    const availableCity = majorCities.find(
      (city) => normalizeLocation(city) !== normalizedDestination
    );

    // Return first available city or Pune as default
    return availableCity || "Pune";
  };

  const handleTransportBooking = (transportType: string) => {
    const originCity = getOriginCity();

    setBookingNotification({
      type: "transport",
      message: `Redirecting to book round trip ${transportType}: ${originCity} ↔ ${
        trip!.destination
      }...`,
    });

    const bookingUrl = generateTransportBookingUrl(
      transportType,
      trip!.destination,
      originCity
    );
    window.open(bookingUrl, "_blank");

    setTimeout(() => {
      setBookingNotification({ type: null, message: "" });
    }, 3000);
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "flight":
        return Plane;
      case "train":
        return Train;
      case "bus":
        return Bus;
      default:
        return Bus;
    }
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
            Back to Dashboard
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
            {/* Trip Overview */}
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
                    {trip.budget.type === "per_person" ? (
                      <span className="text-sm text-gray-400 block sm:inline">
                        /person
                      </span>
                    ) : trip.budget.duration === "per_day" ? (
                      <span className="text-sm text-gray-400 block sm:inline">
                        /day (total)
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 block sm:inline">
                        total for entire trip
                      </span>
                    )}
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

            {/* Daily Itinerary */}
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
                    onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
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

          {/* Weather Forecast */}
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

            {/* Hotel Options */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Accommodation Options
              </h2>
              <div className="space-y-4">
                {trip.accommodation
                  .slice(0, isHotelListExpanded ? undefined : 2)
                  .map((hotel) => (
                    <motion.div
                      key={hotel.name}
                      className={`bg-gray-700 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-200 ${
                        selectedHotel === hotel.id ? "ring-2 ring-blue-500" : ""
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
                          <h3 className="text-lg font-medium">{hotel.name}</h3>
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
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleHotelBooking(hotel);
                            }}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Book Now
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Transportation Booking Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-6">
                Transportation Booking
              </h2>
              <div className="space-y-8">
                {/* Main Transportation */}
                <div className="bg-gray-700 rounded-xl p-6 space-y-6">
                  <div className="flex items-start space-x-4">
                    {React.createElement(
                      getTransportIcon(trip.transportationType),
                      {
                        className: "h-8 w-8 text-blue-500 flex-shrink-0",
                      }
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold capitalize text-white">
                        {trip.transportationType} Booking (Round Trip)
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Book your round trip {trip.transportationType} to{" "}
                        {trip.destination}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-gray-300">
                        <span className="flex items-center">
                          📅 {formatDate(trip.startDate)} -{" "}
                          {formatDate(trip.endDate)}
                        </span>
                        <span className="flex items-center">
                          👥 {trip.travelers} passenger
                          {trip.travelers > 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center">
                          📍 Round trip to {trip.destination}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() =>
                        handleTransportBooking(trip.transportationType)
                      }
                      className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium w-full"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Book{" "}
                      {trip.transportationType.charAt(0).toUpperCase() +
                        trip.transportationType.slice(1)}
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </button>
                  </div>
                </div>

                {/* Alternative Transportation Options */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-300">
                    Alternative Transportation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["flight", "train", "bus"]
                      .filter(
                        (transport) => transport !== trip.transportationType
                      )
                      .map((transportType) => (
                        <div
                          key={transportType}
                          className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:bg-gray-700/70 transition-colors"
                        >
                          <div className="flex items-center space-x-3 mb-4">
                            {React.createElement(
                              getTransportIcon(transportType),
                              {
                                className: "h-6 w-6 text-blue-400",
                              }
                            )}
                            <h4 className="text-lg font-semibold capitalize text-gray-200">
                              {transportType} Booking
                            </h4>
                          </div>
                          <p className="text-sm text-gray-400 mb-4">
                            Alternative option to reach {trip.destination}
                          </p>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-xs text-gray-500">
                              <span>📅 Same dates as main booking</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>
                                👥 {trip.travelers} passenger
                                {trip.travelers > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleTransportBooking(transportType)
                            }
                            className="w-full flex items-center justify-center px-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            {/* <CreditCard className="h-4 w-4 mr-2" /> */}
                            Book{" "}
                            {transportType.charAt(0).toUpperCase() +
                              transportType.slice(1)}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
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
                <h2 className="text-2xl font-semibold">Edit Trip</h2>
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
                            amount: Number(e.target.value),
                          },
                        });
                        setErrors((prev) => ({
                          ...prev,
                          budget: "",
                        }));
                      }}
                      className={`w-full px-4 py-3 bg-gray-700/50 border ${
                        errors.budget ? "border-red-500" : "border-gray-600"
                      } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Amount"
                    />
                    <div className="flex flex-col space-y-4">
                      <select
                        value={editForm.budget.type}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            budget: {
                              ...editForm.budget,
                              type: e.target.value as "per_person" | "total",
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                      >
                        <option value="per_person">Per Person</option>
                        <option value="total">Total Budget</option>
                      </select>
                      <select
                        value={editForm.budget.duration}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            budget: {
                              ...editForm.budget,
                              duration: e.target.value as
                                | "entire_trip"
                                | "per_day",
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                      >
                        <option value="entire_trip">For Entire Trip</option>
                        <option value="per_day">Per Day</option>
                      </select>
                    </div>
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
                        numberOfPersons: Number(e.target.value),
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
                        transportationType: e.target.value as
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
                    placeholder="E.g., Strict budget constraints: Keep activities and accommodations within specified budget type (per person/total) and duration (per day/entire trip). Add preferences: adventure activities, local cuisine, etc."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white h-24 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
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
              <p className="text-lg text-gray-400">Updating trip...</p>
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
                <h2 className="text-2xl font-semibold">Share Trip</h2>
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
                    <span className="text-sm">Facebook</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <Twitter className="h-6 w-6 text-blue-400 mb-2" />
                    <span className="text-sm">Twitter</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <MessageCircle className="h-6 w-6 text-green-500 mb-2" />
                    <span className="text-sm">WhatsApp</span>
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

      {/* Booking Notification Toast */}
      {bookingNotification.type && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white ${
            bookingNotification.type === "hotel"
              ? "bg-blue-600"
              : "bg-green-600"
          }`}
        >
          <div className="flex items-center space-x-2">
            {bookingNotification.type === "hotel" ? (
              <Hotel className="h-5 w-5" />
            ) : (
              <Plane className="h-5 w-5" />
            )}
            <span>{bookingNotification.message}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
