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
import { authAPI, RegisterRequest } from "../../lib/apiServices";

// Input field component to reduce repetition
interface InputFieldProps {
    id: string;
    type?: string;
    icon?: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (field: string, value: string) => void;
    required?: boolean;
    className?: string;
    min?: string;
    max?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    type = "text",
    icon,
    placeholder,
    value,
    onChange,
    required = true,
    className = "",
    min = "",
    max = "",
}) => {
    return (
        <div className={`relative ${className}`}>
            <label htmlFor={id} className="sr-only">
                {placeholder}
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                id={id}
                key={id}
                name={id}
                type={type}
                required={required}
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(e.target.name, e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={placeholder}
            />
        </div>
    );
};

export const RegistrationForm = () => {
    const [formData, setFormData] = useState<RegisterRequest>({
        name: "",
        email: "",
        password: "",
        mobile: "",
        location: "",
        age: "",
        nationality: "",
        occupation: "",
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
            const { data } = await authAPI.register(formData);

            if (data.message === "User registered successfully") {
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("token", data.token);
                signUp(formData.email, data.token, data.userId);
                navigate("/preferences");
            } else {
                throw new Error(data.message || "Registration failed");
            }
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="min-h-screen flex bg-gray-900">
            {/* Left side - Image (reduced width) */}
            <div className="hidden lg:flex lg:w-2/5 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
                <img
                    src="runway.svg"
                    alt="Travel"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Right side - Form (increased width) */}
            <div className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 overflow-auto">
                <div className="max-w-3xl w-full">
                    <div className="md:mb-6 text-center">
                        <h2 className="text-2xl font-bold pt-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-200">
                            Create your account
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left column */}
                            <div className="space-y-4">
                                <h3 className="text-md text-center font-medium text-white mb-2">
                                    Personal Information
                                </h3>

                                <InputField
                                    id="name"
                                    icon={
                                        <User className="h-5 w-5 text-gray-400" />
                                    }
                                    placeholder="Full name"
                                    value={formData.name}
                                    onChange={(id, value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [id]: value,
                                        }))
                                    }
                                />

                                <InputField
                                    id="email"
                                    type="email"
                                    icon={
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    }
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />

                                <InputField
                                    id="password"
                                    type="password"
                                    icon={
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    }
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />

                                <InputField
                                    id="mobile"
                                    type="tel"
                                    icon={
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    }
                                    placeholder="Phone number"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    required={false}
                                />
                            </div>

                            {/* Right column */}
                            <div className="space-y-4">
                                <h3 className="text-md text-center font-medium text-white mb-2">
                                    Additional Information
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        id="age"
                                        type="number"
                                        min="18"
                                        max="120"
                                        icon={
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        }
                                        placeholder="Age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                    />

                                    <InputField
                                        id="nationality"
                                        icon={
                                            <Globe className="h-5 w-5 text-gray-400" />
                                        }
                                        placeholder="Nationality"
                                        value={formData.nationality}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <InputField
                                    id="occupation"
                                    icon={
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    }
                                    placeholder="Occupation"
                                    value={formData.occupation}
                                    onChange={handleInputChange}
                                />

                                <InputField
                                    id="passportNumber"
                                    icon={
                                        <Globe className="h-5 w-5 text-gray-400" />
                                    }
                                    placeholder="Passport number (optional)"
                                    value={formData.passportNumber}
                                    onChange={handleInputChange}
                                    required={false}
                                />

                                <InputField
                                    id="location"
                                    icon={
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    }
                                    placeholder="Current location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 md:ml-[25%] md:mr-[25%]">
                            <div className="pt-8">
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
                                    <Link
                                        to="/login"
                                        className="text-blue-500 hover:text-blue-400"
                                    >
                                        Already have an account?
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-400">
                                        Step 1 of 2
                                    </span>
                                    <div className="flex space-x-1">
                                        <div className="h-1 w-4 rounded-full bg-blue-500" />
                                        <div className="h-1 w-4 rounded-full bg-gray-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
