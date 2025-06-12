import React, { useEffect, useState } from "react";
import { adminAPI } from "../../lib/projectAPIs";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface Trip {
  _id: string;
  title: string;
  destination: string;
  user: {
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  status: string;
}

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await adminAPI.getAllTrips();
        setTrips(response.data);
      } catch (err) {
        setError("Failed to fetch trips.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">All Trips</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Destination</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Dates</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr
                key={trip._id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="py-3 px-4">{trip.title}</td>
                <td className="py-3 px-4">{trip.destination}</td>
                <td className="py-3 px-4">
                  <div>{trip.user.name}</div>
                  <div className="text-sm text-gray-400">{trip.user.email}</div>
                </td>
                <td className="py-3 px-4">
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      trip.status === "completed"
                        ? "bg-green-500"
                        : trip.status === "ongoing"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {trip.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link
                    to={`/admin/trips/${trip._id}`}
                    className="text-blue-400 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripList;
