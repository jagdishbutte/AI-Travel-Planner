import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  MapPin,
  Phone,
  Calendar,
  Globe,
  Briefcase,
  Loader,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    location: "",
    age: "",
    nationality: "",
    occupation: "",
    emergencyContact: "",
    passportNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/userRegister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store the token and user ID
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // Update auth state using your auth store
      signUp(formData.email, data.token, data.userId);

      // Change navigation path to preferences page
      navigate("/preferences");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Join our community of travelers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="rounded-md space-y-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  Personal Information
                </h3>

                <div className="relative">
                  <label htmlFor="name" className="sr-only">
                    Full name
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-white">
                  Contact Information
                </h3>

                <div className="relative">
                  <label htmlFor="phone" className="sr-only">
                    Phone number
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    // required
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="location" className="sr-only">
                    Current location
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Current location"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-white">
                  Additional Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="age" className="sr-only">
                      Age
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      required
                      min="18"
                      max="120"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Age"
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="nationality" className="sr-only">
                      Nationality
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nationality"
                      name="nationality"
                      type="text"
                      required
                      value={formData.nationality}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nationality: e.target.value,
                        })
                      }
                      className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nationality"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="occupation" className="sr-only">
                    Occupation
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="occupation"
                    name="occupation"
                    type="text"
                    required
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Occupation"
                  />
                </div>

                {/* <div className="relative">
                  <label htmlFor="emergencyContact" className="sr-only">
                    Emergency contact
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="emergencyContact"
                    name="emergencyContact"
                    type="tel"
                    required
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: e.target.value,
                      })
                    }
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Emergency contact number"
                  />
                </div> */}

                <div className="relative">
                  <label htmlFor="passportNumber" className="sr-only">
                    Passport number (optional)
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="passportNumber"
                    name="passportNumber"
                    type="text"
                    value={formData.passportNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passportNumber: e.target.value,
                      })
                    }
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Passport number (optional)"
                  />
                </div>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/login" className="text-blue-500 hover:text-blue-400">
                  Already have an account?
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Step 1 of 2</span>
                <div className="flex space-x-1">
                  <div className="h-1 w-4 rounded-full bg-blue-500" />
                  <div className="h-1 w-4 rounded-full bg-gray-700" />
                </div>
              </div>
            </div>

            {/* Add this style to all input fields */}
            <style>
              {`
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                  -webkit-box-shadow: 0 0 0 30px #1f2937 inset !important;
                  -webkit-text-fill-color: white !important;
                }
              `}
            </style>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
        <img
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
          alt="Travel"
          className="w-full h-full py-[25%] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-sm">
            <h3 className="text-2xl font-bold text-white mb-2">
              Start Your Journey
            </h3>
            <p className="text-gray-200">
              Join thousands of travelers discovering the world's most amazing
              destinations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
