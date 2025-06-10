import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../lib/apiServices";
import { User } from "../../types";
import { Trash2 } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModal";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
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
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
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
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
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
    let filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
    );

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
  }, [users, filter, sortConfig]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">User Management</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search user..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full md:w-1/3"
        />
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th
                className="py-3 px-4 border-b-2 border-gray-600 text-left cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Name
              </th>
              <th
                className="py-3 px-4 border-b-2 border-gray-600 text-left cursor-pointer"
                onClick={() => requestSort("email")}
              >
                Email
              </th>
              <th className="py-3 px-4 border-b-2 border-gray-600 text-left">
                Location
              </th>
              <th className="py-3 px-4 border-b-2 border-gray-600 text-left">
                Mobile
              </th>
              <th className="py-3 px-4 border-b-2 border-gray-600 text-left">
                Role
              </th>
              <th
                className="py-3 px-4 border-b-2 border-gray-600 text-left cursor-pointer"
                onClick={() => requestSort("createdAt")}
              >
                Joined
              </th>
              <th className="py-3 px-4 border-b-2 border-gray-600 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredUsers.map((user) => {
              return (
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
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default UserList;
