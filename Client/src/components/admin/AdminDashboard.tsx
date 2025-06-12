import React, { useEffect, useState } from "react";
import { adminAPI } from "../../lib/projectAPIs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Link } from "react-router-dom";

interface StatData {
  totalUsers: number;
  totalTrips: number;
  topDestinations: { _id: string; count: number }[];
  tripStatusDistribution: { _id: string; count: number }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }[];
  recentTrips: {
    _id: string;
    title: string;
    destination: string;
    user: { name: string };
    createdAt: string;
  }[];
}

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-gray-800 p-6 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-400">{title}</h3>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await adminAPI.getDashboardStats();
        setStats(response.data);
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch dashboard stats";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error || !stats) return <div className="text-red-500">{error}</div>;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="text-white">
      <header className="sticky top-0 bg-gray-900 z-10 p-6 border-b border-gray-800">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Total Trips Planned" value={stats.totalTrips} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Top 5 Destinations</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.topDestinations}>
                <CartesianGrid />
                <XAxis dataKey="_id" stroke="#9ca3af" fill="transparent" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#374151",
                    border: "none",
                  }}
                  labelStyle={{ color: "#d1d5db" }}
                />
                <Legend wrapperStyle={{ color: "#d1d5db" }} />
                <Bar dataKey="count" fill="#3b82f6" name="Number of Trips" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Trip Status Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={stats.tripStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {stats.tripStatusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${entry._id}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Recent User Sign-ups</h3>
            <ul className="space-y-4">
              {stats.recentUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded-md"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Recently Planned Trips</h3>
            <ul className="space-y-4">
              {stats.recentTrips.map((trip) => (
                <li
                  key={trip._id}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded-md"
                >
                  <div>
                    <Link
                      to={`/admin/trips/${trip._id}`}
                      className="font-semibold hover:underline"
                    >
                      {trip.title}
                    </Link>
                    <p className="text-sm text-gray-400">
                      {trip.destination} by {trip.user.name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
