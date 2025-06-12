import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../lib/apiServices";
import { User } from "../../types";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModal";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await adminAPI.deleteUser(userToDelete._id);
      // Refresh the user list after deletion
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      closeModal();
    }
  };

  const openModal = (user: User) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setUserToDelete(null);
    setIsModalOpen(false);
  };

  const sortedAndFilteredUsers = useMemo(() => {
    const filteredUsers = users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(filter.toLowerCase()) ||
          user.email.toLowerCase().includes(filter.toLowerCase())
      )
      .filter((user) => roleFilter === "all" || user.role === roleFilter);

    if (sortConfig !== null) {
      filteredUsers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredUsers;
  }, [users, filter, roleFilter, sortConfig]);

  const requestSort = (key: keyof User) => {
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

  const getSortIcon = (key: keyof User) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === "ascending") {
      return <ChevronUp className="h-4 w-4 inline ml-1" />;
    }
    return <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0 bg-gray-900 z-10 p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold">Users</h2>
      </header>
      <div className="flex-shrink-0 bg-gray-900 z-10 p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search user..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white w-full md:w-1/3"
          />
          <div className="flex items-center space-x-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
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
                onClick={() => requestSort("name")}
              >
                Name {getSortIcon("name")}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => requestSort("email")}
              >
                Email {getSortIcon("email")}
              </th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Mobile</th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => requestSort("role")}
              >
                Role {getSortIcon("role")}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => requestSort("createdAt")}
              >
                Joined {getSortIcon("createdAt")}
              </th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredUsers.map((user) => (
              <tr key={user._id} className="text-gray-300 hover:bg-gray-800">
                <td className="py-3 px-4 border-b border-gray-700">
                  <Link
                    to={`/admin/users/${user._id}`}
                    className="hover:underline text-blue-400"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {user.email}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {user.location}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {user.mobile}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {user.role}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  <button
                    onClick={() => openModal(user)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default UserList;
