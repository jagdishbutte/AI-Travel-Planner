import { useState, useEffect, useContext } from "react";
import {
  User,
  Edit,
  Save,
  X,
  Camera,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Globe,
  FileText,
  Shield,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { ThemeContext } from "../../context/ThemeContext";
import { User as UserType, UserPreferences } from "../../types";
import { profileAPI } from "../../lib/apiServices";

interface UserProfileData extends UserType {
  preferences: UserPreferences;
}

export const UserProfile = () => {
  const { user } = useAuthStore();
  const { theme } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [editedData, setEditedData] = useState<UserProfileData | null>(null);

  useEffect(() => {
      const fetchUserProfile = async () => {
          if (!user) return;

          try {
              const response = await profileAPI.getProfile(user.token);
              const userData = response.data.data as UserProfileData;
              setProfileData(userData);
              setEditedData(userData);
          } catch (error) {
              console.error("Error fetching profile:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (!editedData || !user) return;

    setSaving(true);
    try {
      const response = await profileAPI.updateProfile(user.token, editedData);
      const userData = response.data.data as UserProfileData;
      setProfileData(userData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditedData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handlePreferenceChange = (
    field: keyof UserPreferences,
    value: string[]
  ) => {
    setEditedData((prev) =>
      prev
        ? {
            ...prev,
            preferences: { ...prev.preferences, [field]: value },
          }
        : null
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center text-center">
          <h1 className="text-lg font-semibold text-white">
            Error loading profile
          </h1>
        </div>
      </div>
    );
  }

  const PreferenceSelector = ({
    label,
    options,
    value,
    onChange,
    field,
  }: {
    label: string;
    options: string[];
    value: string[];
    onChange: (field: keyof UserPreferences, value: string[]) => void;
    field: keyof UserPreferences;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              if (value.includes(option)) {
                onChange(
                  field,
                  value.filter((v) => v !== option)
                );
              } else {
                onChange(field, [...value, option]);
              }
            }}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              value.includes(option)
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
        theme === "dark" ? "text-white" : "text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg rounded-lg p-6 border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4">
                  {profileData.name?.charAt(0).toUpperCase()}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">{profileData.name}</h2>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mb-4`}
              >
                {profileData.email}
              </p>
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm capitalize">{profileData.role}</span>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                Member since{" "}
                {new Date(profileData.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg rounded-lg p-6 border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <p className="text-gray-200">{profileData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData?.age || ""}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <p className="text-gray-200">{profileData.age}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mobile
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData?.mobile || ""}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-200">{profileData.mobile}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-200">{profileData.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData?.location || ""}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-200">{profileData.location}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nationality
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData?.nationality || ""}
                    onChange={(e) =>
                      handleInputChange("nationality", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-200">{profileData.nationality}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Occupation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData?.occupation || ""}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-200">{profileData.occupation}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Passport Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData?.passportNumber || ""}
                    onChange={(e) =>
                      handleInputChange("passportNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-200">
                      {profileData.passportNumber || "Not provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Travel Preferences */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg rounded-lg p-6 border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-500" />
              Travel Preferences
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <PreferenceSelector
                  label="Travel Style"
                  options={[
                    "Adventure",
                    "Relaxation",
                    "Cultural",
                    "Budget",
                    "Luxury",
                    "Family",
                    "Solo",
                    "Business",
                  ]}
                  value={editedData?.preferences?.travelStyle || []}
                  onChange={handlePreferenceChange}
                  field="travelStyle"
                />

                <PreferenceSelector
                  label="Preferred Destinations"
                  options={[
                    "Europe",
                    "Asia",
                    "North America",
                    "South America",
                    "Africa",
                    "Australia",
                    "Antarctica",
                  ]}
                  value={editedData?.preferences?.destinations || []}
                  onChange={handlePreferenceChange}
                  field="destinations"
                />

                <PreferenceSelector
                  label="Accommodation"
                  options={[
                    "Hotel",
                    "Hostel",
                    "Apartment",
                    "Resort",
                    "Villa",
                    "Camping",
                    "Boutique",
                    "Bed & Breakfast",
                  ]}
                  value={editedData?.preferences?.accommodation || []}
                  onChange={handlePreferenceChange}
                  field="accommodation"
                />

                <PreferenceSelector
                  label="Transportation"
                  options={[
                    "Flight",
                    "Train",
                    "Bus",
                    "Car Rental",
                    "Motorcycle",
                    "Bicycle",
                    "Walking",
                    "Cruise",
                  ]}
                  value={editedData?.preferences?.transportation || []}
                  onChange={handlePreferenceChange}
                  field="transportation"
                />

                <PreferenceSelector
                  label="Activities"
                  options={[
                    "Museums",
                    "Hiking",
                    "Beach",
                    "Nightlife",
                    "Shopping",
                    "Food Tours",
                    "Adventure Sports",
                    "Photography",
                    "History",
                    "Nature",
                  ]}
                  value={editedData?.preferences?.activities || []}
                  onChange={handlePreferenceChange}
                  field="activities"
                />

                <PreferenceSelector
                  label="Budget Range"
                  options={[
                    "Budget ($)",
                    "Mid-range ($$)",
                    "Luxury ($$$)",
                    "Ultra-luxury ($$$$)",
                  ]}
                  value={editedData?.preferences?.budget || []}
                  onChange={handlePreferenceChange}
                  field="budget"
                />

                <PreferenceSelector
                  label="Trip Length"
                  options={[
                    "Weekend (2-3 days)",
                    "Short (4-7 days)",
                    "Medium (1-2 weeks)",
                    "Long (2-4 weeks)",
                    "Extended (1+ months)",
                  ]}
                  value={editedData?.preferences?.tripLength || []}
                  onChange={handlePreferenceChange}
                  field="tripLength"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    label: "Travel Style",
                    value: profileData.preferences?.travelStyle,
                  },
                  {
                    label: "Preferred Destinations",
                    value: profileData.preferences?.destinations,
                  },
                  {
                    label: "Accommodation",
                    value: profileData.preferences?.accommodation,
                  },
                  {
                    label: "Transportation",
                    value: profileData.preferences?.transportation,
                  },
                  {
                    label: "Activities",
                    value: profileData.preferences?.activities,
                  },
                  {
                    label: "Budget Range",
                    value: profileData.preferences?.budget,
                  },
                  {
                    label: "Trip Length",
                    value: profileData.preferences?.tripLength,
                  },
                ].map((pref, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-gray-300 mb-2">
                      {pref.label}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {pref.value && pref.value.length > 0 ? (
                        pref.value.map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">
                          Not specified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
