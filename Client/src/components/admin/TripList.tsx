import React, { useEffect, useState, useMemo } from "react";
import { adminAPI } from "../../lib/projectAPIs";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Trip {
  _id: string;
  title: string;
  destination: string;
  user: {
    _id: string;
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
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Trip | "userName";
    direction: string;
  } | null>(null);

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

  const sortedAndFilteredTrips = useMemo(() => {
    const filteredTrips = trips
      .filter(
        (trip) =>
          trip.title.toLowerCase().includes(filter.toLowerCase()) ||
          trip.destination.toLowerCase().includes(filter.toLowerCase()) ||
          trip.user.name.toLowerCase().includes(filter.toLowerCase())
      )
      .filter((trip) => statusFilter === "all" || trip.status === statusFilter);

    if (sortConfig !== null) {
      filteredTrips.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "userName") {
          aValue = a.user.name;
          bValue = b.user.name;
        } else {
          aValue = a[sortConfig.key as keyof Trip];
          bValue = b[sortConfig.key as keyof Trip];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredTrips;
  }, [trips, filter, statusFilter, sortConfig]);

  const requestSort = (key: keyof Trip | "userName") => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Trip | "userName") => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === "ascending") {
      return <ChevronUp className="h-4 w-4 inline ml-1" />;
    }
    return <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 bg-gray-900 z-10 p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold">All Trips</h2>
      </header>
      <div className="flex-shrink-0 bg-gray-900 z-10 p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search trips..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white w-full md:w-1/3"
          />
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white"
            >
              <option value="all">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto px-6">
        <table className="min-w-full bg-gray-800">
          <thead className="sticky top-0 bg-gray-800 z-10">
            <tr className="bg-gray-700">
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => requestSort("title")}
              >
                Title {getSortIcon("title")}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => requestSort("destination")}
              >
                Destination {getSortIcon("destination")}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => requestSort("userName")}
              >
                User {getSortIcon("userName")}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => requestSort("startDate")}
              >
                Dates {getSortIcon("startDate")}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Status {getSortIcon("status")}
              </th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredTrips.map((trip) => (
              <tr
                key={trip._id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="py-3 px-4">{trip.title}</td>
                <td className="py-3 px-4">{trip.destination}</td>
                <td className="py-3 px-4">
                  <Link
                    to={`/admin/users/${trip.user._id}`}
                    className="hover:underline"
                  >
                    <div>{trip.user.name}</div>
                    <div className="text-sm text-gray-400">
                      {trip.user.email}
                    </div>
                  </Link>
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
