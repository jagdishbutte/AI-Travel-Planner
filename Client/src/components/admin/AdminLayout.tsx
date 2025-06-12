import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { Users, Globe, LayoutDashboard, Plane } from "lucide-react";

const AdminLayout: React.FC = () => {
  const navLinkClasses =
    "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md";
  const activeLinkClasses = "bg-gray-900 text-white";

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-4">
        <Link
          to="/admin"
          className="flex items-center justify-center space-x-2 mt-8 mb-8"
        >
          <Globe className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </Link>

        <nav className="space-y-2 ml-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <LayoutDashboard className="mr-8" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <Users className="mr-8" />
            <span>Users</span>
          </NavLink>
          <NavLink
            to="/admin/trips"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <Plane className="mr-8" />
            <span>Trips</span>
          </NavLink>
          {/* Add other admin links here, e.g., for a dashboard */}
          {/* <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <BarChart2 className="mr-3" />
            <span>Dashboard</span>
          </NavLink> */}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
