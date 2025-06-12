import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface StatData {
  totalUsers: number;
  totalTrips: number;
  topDestinations: { _id: string; count: number }[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:2300/admin/stats");
        setStats(response.data);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-400">Total Users</h3>
          <p className="text-4xl font-bold mt-2">{stats?.totalUsers}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-400">
            Total Trips Planned
          </h3>
          <p className="text-4xl font-bold mt-2">{stats?.totalTrips}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Top 5 Destinations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.topDestinations}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="_id" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: "#374151", border: "none" }}
              labelStyle={{ color: "#d1d5db" }}
            />
            <Legend wrapperStyle={{ color: "#d1d5db" }} />
            <Bar dataKey="count" fill="#3b82f6" name="Number of Trips" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
