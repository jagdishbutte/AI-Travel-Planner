import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Hero = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Globe,
      title: "AI-Powered Planning",
      description:
        "Smart recommendations based on your preferences, helping you discover the best destinations and activities tailored to your interests and travel style.",
    },
    {
      icon: MapPin,
      title: "Custom Itineraries",
      description:
        "Personalized travel plans tailored to you, ensuring that every detail of your trip is designed to meet your unique needs and desires.",
    },
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description:
        "Effortless trip organization and timing, allowing you to manage your itinerary with ease and flexibility, so you can focus on enjoying your journey.",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div className="relative flex items-center flex-1">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/40 backdrop-blur-xs" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-white">
              Your AI Travel Companion for Perfect Adventures
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Plan personalized trips with AI-powered recommendations tailored
              just for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-lg"
              >
                <span>Start Planning</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bg-gray-800/50 text-white px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center space-x-2 hover:bg-gray-800 border border-gray-700 transition-colors shadow-lg"
              >
                <span>Sign In</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-800 transition-colors shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <motion.div className="animate-bounce">
                    <feature.icon className="h-8 w-8 text-blue-500 mr-4" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
