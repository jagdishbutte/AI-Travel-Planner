import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { adminAPI } from "../../lib/apiServices";
import { Trip } from "../../types";
import { tripsAPI } from "../../lib/apis";
import AdminTripCard from "./AdminTripCard";
import { useAuthStore } from "../../store/authStore";
import { ArrowLeft } from "lucide-react";

const UserDetail: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    if (!userId) return;

    const fetchUserTrips = async () => {
      setIsLoading(true);
      try {
        const response = await tripsAPI.getAllTrips(userId);
        // The response from getAllTrips is an object with a 'data' property containing the array
        setTrips(response.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch user trips");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTrips();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="text-white mt-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to User List
      </button>
      <h2 className="text-3xl font-bold mb-6">
        Trips for {user?.name || "User"}
      </h2>
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <AdminTripCard key={trip._id || trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <img src="/no-trip.png" alt="no trips planned" />
          <p className="text-gray-400 flex justify-center items-center">
            This user has not planned any trips yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
