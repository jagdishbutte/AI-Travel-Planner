import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAPI } from "../../lib/apiServices";
import { User, Trip } from "../../types";
import { tripsAPI } from "../../lib/apis";
import AdminTripCard from "./AdminTripCard";
// import { useAuthStore } from "../../store/authStore";

const UserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        // console.log("Fetching details for userId:", userId);
        const userResponse = await adminAPI.getUserById(userId);
        setUser(userResponse.data.data);

        const tripsResponse = await tripsAPI.getAllTrips(userId);
        // console.log("Trips API response:", tripsResponse);
        setTrips(tripsResponse.data || []);
      } catch (err: unknown) {
        console.error("Error fetching user details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch user details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
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
              <strong className="text-gray-400">Age:</strong> {user.age}
            </p>
            <p>
              <strong className="text-gray-400">Nationality:</strong>{" "}
              {user.nationality}
            </p>
            <p>
              <strong className="text-gray-400">Occupation:</strong>{" "}
              {user.occupation}
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
      <div className="p-6">
        <h2 className="text-3xl font-bold">
          Trips for{" "}
          <span className="text-blue-400 font-semibold">{user.name}</span>
        </h2>
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {trips.map((trip) => (
              <AdminTripCard key={trip._id || trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <img
              src="/travel-bag.svg"
              alt="no trips planned"
              width="300"
              height="300"
            />
            <p className="text-gray-400 flex justify-center items-center text-lg font-bold">
              This user has not planned any trips yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
