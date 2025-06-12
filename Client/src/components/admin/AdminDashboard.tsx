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
} from "recharts";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface StatData {
  totalUsers: number;
  totalTrips: number;
  topDestinations: { _id: string; count: number }[];
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
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard stats";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error || !stats) return <div className="text-red-500">{error}</div>;

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Trips Planned" value={stats.totalTrips} />
      </div>

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
    </div>
  );
};

export default AdminDashboard;
