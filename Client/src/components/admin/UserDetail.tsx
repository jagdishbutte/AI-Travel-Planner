import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { adminAPI } from "../../lib/apiServices";
import { Trip } from "../../types";
import { tripsAPI } from "../../lib/apis";
import AdminTripCard from "./AdminTripCard";
import { useAuthStore } from "../../store/authStore";
// import { ArrowLeft } from "lucide-react";

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
        setError(
          err instanceof Error ? err.message : "Failed to fetch user trips"
        );
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

  if (!user) return <div className="text-white">User not found.</div>;

  return (
    <div className="text-white">
      <header className="sticky top-0 bg-gray-900 z-10 p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold">User Details</h2>
      </header>
      <div className="p-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{user.name}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                user.role === "admin" ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              {user.role}
            </span>
          </div>
          <div className="space-y-4">
            <p>
              <strong className="text-gray-400">Email:</strong> {user.email}
            </p>
            <p>
              <strong className="text-gray-400">Mobile:</strong> {user.mobile}
            </p>
            <p>
              <strong className="text-gray-400">Location:</strong>{" "}
              {user.location}
            </p>
            <p>
              <strong className="text-gray-400">Joined:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to User List
          </button>
        </div>
      </div>
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
