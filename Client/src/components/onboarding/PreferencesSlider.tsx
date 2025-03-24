import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Mountain,
  Palmtree,
  Building as Buildings,
  Utensils,
  Plane,
  Train,
  Bus,
  Car,
  Bed,
  Tent,
  Hotel,
  Home,
  Sun,
  Snowflake,
  Users,
  Camera,
  Music,
  Wine,
  ShoppingBag,
  MapPin,
  Waves,
  Bike,
  LucideIcon,
  Wallet,
  CreditCard,
  BadgeDollarSign,
  Diamond,
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { preferencesAPI, UserPreferences } from "../../lib/apiServices";

interface BaseOption {
  label: string;
  value: string;
  description?: string;
}

interface IconOption extends BaseOption {
  icon: LucideIcon;
}

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  options: (BaseOption | IconOption)[];
  multiSelect?: boolean;
}

const slides: Slide[] = [
  {
    id: "travelStyle",
    title: "What's your travel style?",
    subtitle: "Choose your preferred way of exploring",
    options: [
      {
        icon: Mountain,
        label: "Adventure",
        value: "adventure",
        description: "Seeking thrilling experiences and challenges",
      },
      {
        icon: Palmtree,
        label: "Relaxation",
        value: "relaxation",
        description: "Peaceful getaways and stress-free holidays",
      },
      {
        icon: Buildings,
        label: "Cultural",
        value: "cultural",
        description: "Exploring local traditions and heritage",
      },
      {
        icon: Camera,
        label: "Photography",
        value: "photography",
        description: "Capturing beautiful moments and scenes",
      },
      {
        icon: Wine,
        label: "Luxury",
        value: "luxury",
        description: "High-end experiences and premium services",
      },
      {
        icon: MapPin,
        label: "Backpacking",
        value: "backpacking",
        description: "Budget-friendly and authentic experiences",
      },
    ],
    multiSelect: true,
  },
  {
    id: "destinations",
    title: "Preferred destinations",
    subtitle: "Select the types of places you love to visit",
    options: [
      {
        icon: Mountain,
        label: "Mountains",
        value: "mountains",
        description: "Hiking, skiing, and mountain views",
      },
      {
        icon: Palmtree,
        label: "Beaches",
        value: "beaches",
        description: "Coastal areas and island getaways",
      },
      {
        icon: Buildings,
        label: "Cities",
        value: "cities",
        description: "Urban exploration and city life",
      },
      {
        icon: Tent,
        label: "Countryside",
        value: "countryside",
        description: "Rural areas and natural landscapes",
      },
      {
        icon: Snowflake,
        label: "Cold Places",
        value: "cold",
        description: "Winter destinations and snow activities",
      },
      {
        icon: Sun,
        label: "Tropical",
        value: "tropical",
        description: "Warm climates and exotic locations",
      },
    ],
    multiSelect: true,
  },
  {
    id: "accommodation",
    title: "Where do you prefer to stay?",
    subtitle: "Select your preferred accommodation types",
    options: [
      {
        icon: Hotel,
        label: "Hotels",
        value: "hotels",
        description: "Traditional hotel stays",
      },
      {
        icon: Home,
        label: "Vacation Rentals",
        value: "rentals",
        description: "Apartments and holiday homes",
      },
      {
        icon: Tent,
        label: "Camping",
        value: "camping",
        description: "Outdoor and nature stays",
      },
      {
        icon: Bed,
        label: "B&Bs",
        value: "bnb",
        description: "Bed and Breakfast locations",
      },
      {
        icon: Buildings,
        label: "Hostels",
        value: "hostels",
        description: "Social and budget-friendly",
      },
      {
        icon: Home,
        label: "Luxury Resorts",
        value: "resorts",
        description: "High-end resort experiences",
      },
    ],
    multiSelect: true,
  },
  {
    id: "transportation",
    title: "How do you like to travel?",
    subtitle: "Choose your preferred modes of transport",
    options: [
      {
        icon: Plane,
        label: "Air Travel",
        value: "air",
        description: "Flying between destinations",
      },
      {
        icon: Train,
        label: "Train",
        value: "train",
        description: "Rail journeys and scenic routes",
      },
      {
        icon: Bus,
        label: "Bus",
        value: "bus",
        description: "Coach travel and local transport",
      },
      {
        icon: Car,
        label: "Car Rental",
        value: "car",
        description: "Self-driving and road trips",
      },
      {
        icon: Bike,
        label: "Bicycle",
        value: "bicycle",
        description: "Cycling and bike tours",
      },
      {
        icon: Users,
        label: "Group Tours",
        value: "group",
        description: "Organized group travel",
      },
    ],
    multiSelect: true,
  },
  {
    id: "activities",
    title: "What activities interest you?",
    subtitle: "Select your favorite travel activities",
    options: [
      {
        icon: MapPin,
        label: "Hiking",
        value: "hiking",
        description: "Trail walking and trekking",
      },
      {
        icon: Camera,
        label: "Sightseeing",
        value: "sightseeing",
        description: "Tourist attractions and landmarks",
      },
      {
        icon: Waves,
        label: "Water Sports",
        value: "water-sports",
        description: "Swimming, surfing, and diving",
      },
      {
        icon: Utensils,
        label: "Food Tours",
        value: "food-tours",
        description: "Culinary experiences",
      },
      {
        icon: Music,
        label: "Entertainment",
        value: "entertainment",
        description: "Shows and nightlife",
      },
      {
        icon: ShoppingBag,
        label: "Shopping",
        value: "shopping",
        description: "Local markets and retail",
      },
    ],
    multiSelect: true,
  },
  {
    id: "budget",
    title: "What's your typical travel budget?",
    subtitle: "Choose your preferred spending level",
    options: [
      {
        icon: Wallet,
        label: "Budget",
        value: "budget",
        description: "Under ₹1000/day",
      },
      {
        icon: CreditCard,
        label: "Mid-Range",
        value: "mid-range",
        description: "₹1000-₹5000/day",
      },
      {
        icon: BadgeDollarSign,
        label: "High-Range",
        value: "high-range",
        description: "₹5000-₹10000/day",
      },
      {
        icon: Diamond,
        label: "Luxury",
        value: "luxury",
        description: "Over ₹10000/day",
      },
    ],
  },
  {
    id: "tripLength",
    title: "How long do you usually travel?",
    subtitle: "Select your typical trip duration",
    options: [
      {
        icon: Clock,
        label: "Weekend Trips",
        value: "weekend",
        description: "2-3 days",
      },
      {
        icon: Calendar,
        label: "Short Breaks",
        value: "short",
        description: "4-7 days",
      },
      {
        icon: CalendarDays,
        label: "Medium Trips",
        value: "medium",
        description: "1-2 weeks",
      },
      {
        icon: CalendarRange,
        label: "Long Trips",
        value: "long",
        description: "2+ weeks",
      },
    ],
  },
];

export const PreferencesSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    travelStyle: [],
    destinations: [],
    accommodation: [],
    transportation: [],
    activities: [],
    budget: [],
    tripLength: [],
  });
  const navigate = useNavigate();
  const setOnboardingComplete = useAuthStore(
    (state) => state.setOnboardingComplete
  );
  const [, setError] = useState<string | null>(null);

  const handleSelection = (slideId: keyof UserPreferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [slideId]: slides[currentSlide].multiSelect
        ? prev[slideId].includes(value)
          ? prev[slideId].filter((v: string) => v !== value)
          : [...prev[slideId], value]
        : [value],
    }));
  };

  const handleComplete = async () => {
    setIsCompleting(true);

    try {
      // Phase 1: Initial message
      setAnimationPhase(1);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Phase 2: Processing preferences
      setAnimationPhase(2);

      // Get userId from localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Save preferences to backend
      await preferencesAPI.savePreferences({
        userId,
        ...preferences,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Phase 3: Final setup
      setAnimationPhase(3);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOnboardingComplete(true);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      setError(error.response?.data?.message || "Failed to save preferences");
      setIsCompleting(false);
    }
  };

  const getAnimationMessage = () => {
    switch (animationPhase) {
      case 1:
        return "Saving your preferences...";
      case 2:
        return "Personalizing your experience...";
      case 3:
        return "Getting everything ready...";
      default:
        return "Setting up your experience...";
    }
  };

  const getGridClass = (optionsLength: number) => {
    if (optionsLength <= 4) {
      return "grid-cols-1 sm:grid-cols-2";
    }
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {isCompleting ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              <motion.div
                animate={{
                  rotate: 360,
                  borderColor: ["#3B82F6", "#10B981", "#6366F1"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  borderColor: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="w-16 h-16 border-4 border-t-transparent rounded-full"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-white text-xl font-medium"
              >
                {getAnimationMessage()}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">
                  {slides[currentSlide].title}
                </h2>
                {slides[currentSlide].subtitle && (
                  <p className="mt-2 text-gray-400">
                    {slides[currentSlide].subtitle}
                  </p>
                )}
                {slides[currentSlide].multiSelect && (
                  <p className="mt-1 text-sm text-blue-400">
                    Select all that apply
                  </p>
                )}
              </div>

              <div
                className={`grid ${getGridClass(
                  slides[currentSlide].options.length
                )} gap-4`}
              >
                {slides[currentSlide].options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleSelection(
                        slides[currentSlide].id as keyof UserPreferences,
                        option.value
                      )
                    }
                    className={`p-6 rounded-xl border-2 bg-gray-800/50 ${
                      preferences[
                        slides[currentSlide].id as keyof UserPreferences
                      ].includes(option.value)
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {"icon" in option && (
                      <option.icon className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                    )}
                    <p className="text-lg font-medium text-white mb-2">
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="text-sm text-gray-400">
                        {option.description}
                      </p>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-8">
                <button
                  onClick={() => setCurrentSlide(currentSlide - 1)}
                  className={`flex items-center space-x-2 text-gray-400 hover:text-white transition-colors ${
                    currentSlide === 0 ? "invisible" : ""
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-1">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-4 rounded-full ${
                        i === currentSlide ? "bg-blue-500" : "bg-gray-700"
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentSlide === slides.length - 1) {
                      handleComplete();
                    } else {
                      setCurrentSlide(currentSlide + 1);
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <span>
                    {currentSlide === slides.length - 1 ? "Complete" : "Next"}
                  </span>
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PreferencesSlider;
