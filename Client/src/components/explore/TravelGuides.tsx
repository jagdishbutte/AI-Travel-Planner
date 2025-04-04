import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Plus,
  Search,
  Settings,
} from "lucide-react";

const guides = [
  {
    id: "create-trip",
    title: "Creating a New Trip",
    icon: <Plus className="h-6 w-6" />,
    steps: [
      "Click on the 'Create Trip' button in the dashboard",
      "Fill in the basic trip details: destination, dates, budget, and number of travelers",
      "Add activities and events to your itinerary",
      "Select accommodations and transportation options",
      "Review and save your trip",
    ],
  },
  {
    id: "manage-trip",
    title: "Managing Your Trips",
    icon: <Settings className="h-6 w-6" />,
    steps: [
      "View all your trips in the dashboard",
      "Edit trip details by clicking on the trip card",
      "Update itinerary, accommodations, or transportation",
      "Track your trip status (planned, ongoing, completed)",
      "Share your trip with fellow travelers",
    ],
  },
  {
    id: "view-trip",
    title: "Viewing Trip Details",
    icon: <BookOpen className="h-6 w-6" />,
    steps: [
      "Click on any trip card to view its details",
      "Navigate through the itinerary day by day",
      "View weather forecasts for your trip dates",
      "Check accommodation and transportation details",
      "Access booking information and confirmations",
    ],
  },
  {
    id: "search-trips",
    title: "Searching for Trips",
    icon: <Search className="h-6 w-6" />,
    steps: [
      "Use the search bar to find specific trips",
      "Filter trips by destination, date, or budget",
      "Browse popular and recommended trips",
      "Save interesting trips to your favorites",
      "Get personalized trip recommendations",
    ],
  },
  {
    id: "planning-tips",
    title: "Trip Planning Tips",
    icon: <Calendar className="h-6 w-6" />,
    steps: [
      "Start planning at least 2-3 months in advance",
      "Set a realistic budget and stick to it",
      "Research your destination's weather and seasons",
      "Book accommodations and transportation early",
      "Create a flexible itinerary with buffer time",
    ],
  },
];

export const TravelGuides = () => {
  const navigate = useNavigate();

  return (
    <>
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
          <h1 className="text-3xl font-bold text-white">Travel Guides</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <motion.div
              key={guide.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center mb-4">
                <div className="text-blue-400 mr-3">{guide.icon}</div>
                <h2 className="text-xl font-semibold text-white">
                  {guide.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {guide.steps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-300 text-sm"
                  >
                    <span className="text-blue-400 mr-2">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Additional Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-blue-400 mb-2">
                Before Your Trip
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Check visa requirements and passport validity</li>
                <li>• Get travel insurance</li>
                <li>• Download offline maps and important documents</li>
                <li>• Pack according to the weather forecast</li>
                <li>• Notify your bank about travel plans</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-400 mb-2">
                During Your Trip
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Keep important documents safe and accessible</li>
                <li>• Stay hydrated and take regular breaks</li>
                <li>• Be mindful of local customs and etiquette</li>
                <li>• Keep emergency contacts handy</li>
                <li>• Take lots of photos but also enjoy the moment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
