import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Plane,
    Train,
    Bus,
    MapPin,
    Calendar as CalendarIcon,
    Users,
    Wallet,
    AlertCircle,
    Compass,
    Sun,
    Utensils,
    Hotel,
    Camera,
} from "lucide-react";
// import usePlacesAutocomplete from "use-places-autocomplete";
import { useTripStore } from "../../store/tripStore";
import { format, differenceInDays } from "date-fns";
import { tripAPI } from "../../lib/apiServices";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useAuthStore } from "../../store/authStore";

type BudgetType = "per_person" | "total";
type BudgetDuration = "entire_trip" | "per_day";
type TransportType = "flight" | "train" | "bus";

interface TripFormData {
    origin: string;
    destination: string;
    travelers: number;
    days: number;
    budget: {
        amount: number;
        type: BudgetType;
        duration: BudgetDuration;
    };
    transportationType: TransportType;
    startDate: Date | undefined;
    endDate: Date | undefined;
}

interface TransportOption {
    type: TransportType;
    icon: typeof Plane | typeof Train | typeof Bus;
    label: string;
}

export const CreateTrip = () => {
    const navigate = useNavigate();
    const addTrip = useTripStore((state) => state.addTrip);
    const [isLoading, setIsLoading] = useState(false);
    const [originValue, setOriginValue] = useState<{
        label: string;
        value: any;
    } | null>(null);
    const [destinationValue, setDestinationValue] = useState<{
        label: string;
        value: any;
    } | null>(null);
    const [errors, setErrors] = useState({
        origin: "",
        destination: "",
        travelers: "",
        dates: "",
        budget: "",
    });
    const [loadingStep, setLoadingStep] = useState(0);
    const loadingSteps = [
        {
            icon: Compass,
            title: "Planning Your Route",
            description: "Mapping out the best travel path...",
        },
        {
            icon: Hotel,
            title: "Finding Accommodations",
            description: "Discovering perfect places to stay...",
        },
        {
            icon: Utensils,
            title: "Curating Experiences",
            description: "Selecting local attractions and dining spots...",
        },
        {
            icon: Sun,
            title: "Checking Weather",
            description: "Analyzing weather patterns for your dates...",
        },
        {
            icon: Camera,
            title: "Final Touches",
            description: "Adding those special moments to your itinerary...",
        },
    ];

    const [formData, setFormData] = useState<TripFormData>({
        origin: "",
        destination: "",
        travelers: 1,
        days: 1,
        budget: {
            amount: 1000,
            type: "per_person",
            duration: "entire_trip",
        },
        transportationType: "flight",
        startDate: undefined,
        endDate: undefined,
    });

    const { userPreferences } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({
            origin: "",
            destination: "",
            travelers: "",
            dates: "",
            budget: "",
        });

        // Validate form fields individually
        const newErrors: Record<string, string> = {};

        if (!formData.origin.trim())
            newErrors.origin = "Please select your origin.";
        if (!formData.destination.trim())
            newErrors.destination = "Please select your destination.";
        if (!formData.startDate || !formData.endDate)
            newErrors.dates = "Please select both start and end dates.";
        else if (formData.startDate > formData.endDate)
            newErrors.dates = "Start date cannot be after end date.";
        if (!formData.travelers || formData.travelers < 1)
            newErrors.travelers = "Enter at least 1 traveler.";
        if (!formData.budget.amount || formData.budget.amount <= 0)
            newErrors.budget = "Enter a valid budget.";

        // If there are errors, set them and stop
        if (Object.keys(newErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...newErrors }));
            return;
        }

        setIsLoading(true);

        try {
            // Calculate number of days
            const days =
                differenceInDays(
                    formData.endDate ?? new Date(),
                    formData.startDate ?? new Date()
                ) + 1;

            // Prepare request payload
            const requestData = {
                location: formData.destination,
                days,
                travelers: formData.travelers,
                budget: {
                    amount: formData.budget.amount,
                    type: formData.budget.type,
                    duration: formData.budget.duration,
                },
                transportationType: formData.transportationType,
                startDate: formData.startDate
                    ? formData.startDate.toISOString()
                    : "",
                endDate: formData.endDate ? formData.endDate.toISOString() : "",
                userId: localStorage.getItem("userId"),
                preferences: userPreferences,
            };

            // Call API
            const response = await tripAPI.generateAITrip(requestData);
            const tripPlan = response.data;

            // Add trip with fallback ID
            addTrip({
                ...tripPlan,
                id:
                    tripPlan._id ||
                    tripPlan.id ||
                    Math.random().toString(36).substr(2, 9),
                status: "planned",
            });

            // Navigate to trip page
            navigate(`/dashboard/trips/${tripPlan._id || tripPlan.id}`);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                "Failed to create trip. Please try again.";
            setErrors((prev) => ({
                ...prev,
                general: errorMessage,
            }));
            console.error("Error generating trip:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const transportOptions: TransportOption[] = [
        { type: "flight", icon: Plane, label: "Flight" },
        { type: "train", icon: Train, label: "Train" },
        { type: "bus", icon: Bus, label: "Bus" },
    ];

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingStep((prev) => {
                    if (prev < loadingSteps.length - 1) {
                        return prev + 1;
                    } else {
                        return prev;
                    }
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    if (isLoading) {
        const currentStep = loadingSteps[loadingStep];

        return (
            <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center">
                <div className="max-w-md w-full mx-auto p-8">
                    <div className="text-center space-y-6">
                        {/* Loading Animation */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="p-4"
                            >
                                <currentStep.icon className="h-12 w-12 mx-auto text-blue-500" />
                            </motion.div>
                        </div>

                        {/* Step Title */}
                        <motion.h2
                            key={currentStep.title}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl font-semibold text-white"
                        >
                            {currentStep.title}
                        </motion.h2>

                        {/* Step Description */}
                        <motion.p
                            key={currentStep.description}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-gray-400"
                        >
                            {currentStep.description}
                        </motion.p>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{
                                    width: `${
                                        ((loadingStep + 1) /
                                            loadingSteps.length) *
                                        100
                                    }%`,
                                }}
                                className="h-full bg-blue-500 rounded-full"
                            />
                        </div>

                        {/* Travel Tips */}
                        <div className="mt-8 bg-gray-800/50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-300 mb-2">
                                Travel Tip
                            </h3>
                            <p className="text-sm text-gray-400">
                                {
                                    [
                                        "Pack a portable charger for your devices.",
                                        "Learn a few basic phrases in the local language.",
                                        "Keep important documents in your carry-on.",
                                        "Check the weather forecast before packing.",
                                        "Make copies of your important documents.",
                                    ][loadingStep]
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 mt-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-800 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        Plan Your Trip
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    >
                        {/* Origin & Destination */}
                        <div className="space-y-6">
                            {/* Origin */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Where are you traveling from?
                                </label>
                                <GooglePlacesAutocomplete
                                    apiKey={
                                        import.meta.env
                                            .VITE_GOOGLE_PLACE_API_KEY
                                    }
                                    selectProps={{
                                        value: originValue,
                                        onChange: (val: any) => {
                                            setOriginValue(val);
                                            setFormData((prev) => ({
                                                ...prev,
                                                origin: val?.label || "",
                                            }));
                                            setErrors((prev) => ({
                                                ...prev,
                                                origin: "",
                                            }));
                                        },
                                        placeholder: "Enter city",
                                        styles: {
                                            control: (base: any) => ({
                                                ...base,
                                                backgroundColor: "#37415180",
                                                borderColor: errors.origin
                                                    ? "#f87171"
                                                    : "#4b5563",
                                                color: "white",
                                                borderRadius: "0.5rem",
                                                padding: "0.3rem",
                                            }),
                                            singleValue: (base: any) => ({
                                                ...base,
                                                color: "white",
                                            }),
                                            input: (base: any) => ({
                                                ...base,
                                                color: "white",
                                            }),
                                            menu: (base: any) => ({
                                                ...base,
                                                backgroundColor: "#374151",
                                                color: "white",
                                                zIndex: 20,
                                            }),
                                            option: (
                                                base: any,
                                                {
                                                    isFocused,
                                                }: { isFocused: boolean }
                                            ) => ({
                                                ...base,
                                                backgroundColor: isFocused
                                                    ? "#4b5563"
                                                    : "#374151",
                                                color: "white",
                                                cursor: "pointer",
                                            }),
                                        },
                                    }}
                                />
                                {errors.origin && (
                                    <div className="mt-2 flex items-center text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.origin}
                                    </div>
                                )}
                            </div>

                            {/* Destination */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Where to?
                                </label>
                                <GooglePlacesAutocomplete
                                    apiKey={
                                        import.meta.env
                                            .VITE_GOOGLE_PLACE_API_KEY
                                    }
                                    selectProps={{
                                        value: destinationValue,
                                        onChange: (val: any) => {
                                            setDestinationValue(val);
                                            setFormData((prev) => ({
                                                ...prev,
                                                destination: val?.label || "",
                                            }));
                                            setErrors((prev) => ({
                                                ...prev,
                                                destination: "",
                                            }));
                                        },
                                        placeholder: "Enter destination",
                                        styles: {
                                            control: (base: any) => ({
                                                ...base,
                                                backgroundColor: "#37415180",
                                                borderColor: errors.destination
                                                    ? "#f87171"
                                                    : "#4b5563",
                                                color: "white",
                                                borderRadius: "0.5rem",
                                                padding: "0.3rem",
                                            }),
                                            singleValue: (base: any) => ({
                                                ...base,
                                                color: "white",
                                            }),
                                            input: (base: any) => ({
                                                ...base,
                                                color: "white",
                                            }),
                                            menu: (base: any) => ({
                                                ...base,
                                                backgroundColor: "#374151",
                                                color: "white",
                                                zIndex: 20,
                                            }),
                                            option: (
                                                base: any,
                                                {
                                                    isFocused,
                                                }: { isFocused: boolean }
                                            ) => ({
                                                ...base,
                                                backgroundColor: isFocused
                                                    ? "#4b5563"
                                                    : "#374151",
                                                color: "white",
                                                cursor: "pointer",
                                            }),
                                        },
                                    }}
                                />
                                {errors.destination && (
                                    <div className="mt-2 flex items-center text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.destination}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Dates */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                Trip Dates
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            formData.startDate
                                                ? format(
                                                      formData.startDate,
                                                      "yyyy-MM-dd"
                                                  )
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const date = e.target.value
                                                ? new Date(e.target.value)
                                                : undefined;
                                            setFormData((prev) => ({
                                                ...prev,
                                                startDate: date,
                                            }));
                                            setErrors((prev) => ({
                                                ...prev,
                                                dates: "",
                                            }));
                                        }}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark]"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            formData.endDate
                                                ? format(
                                                      formData.endDate,
                                                      "yyyy-MM-dd"
                                                  )
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const date = e.target.value
                                                ? new Date(e.target.value)
                                                : undefined;
                                            setFormData((prev) => ({
                                                ...prev,
                                                endDate: date,
                                            }));
                                            setErrors((prev) => ({
                                                ...prev,
                                                dates: "",
                                            }));
                                        }}
                                        min={
                                            formData.startDate
                                                ? format(
                                                      formData.startDate,
                                                      "yyyy-MM-dd"
                                                  )
                                                : undefined
                                        }
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark] rounded-lg"
                                    />
                                </div>
                            </div>
                            {errors.dates && (
                                <div className="mt-2 flex items-center text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.dates}
                                </div>
                            )}
                            {formData.startDate && formData.endDate && (
                                <p className="mt-2 text-sm text-gray-400">
                                    Trip duration:{" "}
                                    {differenceInDays(
                                        formData.endDate,
                                        formData.startDate
                                    ) + 1}{" "}
                                    days
                                </p>
                            )}
                        </div>
                        {/* Travelers */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                <Users className="h-4 w-4 mr-2" />
                                Number of Travelers
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.travelers}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        travelers: parseInt(e.target.value),
                                    }));
                                    setErrors((prev) => ({
                                        ...prev,
                                        travelers: "",
                                    }));
                                }}
                                className={`w-full px-4 py-3 bg-gray-700/50 border ${
                                    errors.travelers
                                        ? "border-red-500"
                                        : "border-gray-600"
                                } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                            {errors.travelers && (
                                <div className="mt-2 flex items-center text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.travelers}
                                </div>
                            )}
                        </div>
                        {/* Budget */}
                        <div className="space-y-4">
                            <label className="flex items-center text-sm font-medium text-gray-300">
                                <Wallet className="h-4 w-4 mr-2" />
                                Budget
                            </label>
                            <select
                                value={formData.budget.duration}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        budget: {
                                            ...prev.budget,
                                            duration: e.target.value as any,
                                        },
                                    }))
                                }
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="entire_trip">Entire Trip</option>
                                <option value="per_day">Per Day</option>
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.budget.amount}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            budget: {
                                                ...prev.budget,
                                                amount: parseInt(
                                                    e.target.value
                                                ),
                                            },
                                        }));
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
                                />
                                {errors.budget && (
                                    <div className="mt-2 flex items-center text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.budget}
                                    </div>
                                )}
                                <select
                                    value={formData.budget.type}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            budget: {
                                                ...prev.budget,
                                                type: e.target.value as any,
                                            },
                                        }))
                                    }
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="per_person">
                                        Per Person
                                    </option>
                                    <option value="total">Total</option>
                                </select>
                            </div>
                        </div>
                        {/* Transport Type */}
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-4 block">
                                Transportation Type
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {transportOptions.map((option) => (
                                    <button
                                        key={option.type}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                transportationType: option.type,
                                            }))
                                        }
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                                            formData.transportationType ===
                                            option.type
                                                ? "border-blue-500 bg-blue-500/20"
                                                : "border-gray-600 bg-gray-700/50"
                                        } hover:border-blue-500 transition-colors`}
                                    >
                                        <option.icon className="h-6 w-6 mb-2 text-gray-300" />
                                        <span className="text-sm text-gray-300">
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Create Trip
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default CreateTrip;
