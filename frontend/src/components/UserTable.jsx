import React, { useState, useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import UserInfoModal from "./UserInfoModal";
import EditUserModal from "./EditUserModal";
import { getAllUsers } from "../api/userApi";

export default function UserTable({ users, onDeleteUser, onDeleteDevice }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // 🟩 Add these two new states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // 🟩 Function to refresh list (optional)
  const [refreshKey, setRefreshKey] = useState(0);
  const fetchUsers = async () => {
    try {
      await getAllUsers(); // You can also trigger parent refetch instead
      setRefreshKey((prev) => prev + 1); // triggers refresh
    } catch (err) {
      console.error("Error refreshing users:", err);
    }
  };

  const handleOpenUser = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  // 🟩 Edit user handler
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="overflow-x-auto rounded-lg mt-6">
      <div className="min-w-[700px]">
        {/* Header */}
        <div className="grid grid-cols-3 w-full bg-black/20 px-4 py-3 font-semibold text-sm text-black uppercase tracking-wide text-center">
          <div>Username</div>
          <div>Devices</div>
          <div>Created At</div>
        </div>

        {/* User rows */}
        {users.map((user) => (
          <div
            key={user._id}
            className="grid grid-cols-3 w-full border-t border-black/20 bg-black/5 px-4 py-3 text-sm text-center items-center hover:bg-white/10 transition"
          >
            {/* Username + Buttons */}
            <div className="flex items-center justify-center gap-2 font-medium text-black h-full">
              {/* Edit button */}
              <button
                onClick={() => handleEditUser(user)}
                className="text-black hover:text-blue-500 hover:bg-blue-500/20 p-1.5 rounded transition-colors"
                title="Edit user"
              >
                <Pencil size={16} />
              </button>

              {/* Delete button */}
              <button
                onClick={() => onDeleteUser && onDeleteUser(user.username)}
                className="text-black hover:text-red-300 hover:bg-red-500/20 p-1.5 rounded transition-colors"
                title="Delete user"
              >
                <Trash2 size={16} />
              </button>

              {/* Open user modal */}
              <span
                onClick={() => handleOpenUser(user)}
                className="cursor-pointer text-red-500 hover:underline"
                title="View user details"
              >
                {user.username}
              </span>
            </div>

            {/* Devices */}
            <div>
              {user.devices && user.devices.length > 0 ? (
                <ul className="space-y-1">
                  {user.devices.map((device, index) => {
                    const deviceName = device.deviceName || device;
                    return (
                      <li
                        key={device._id || index}
                        className="flex items-center justify-between text-black text-sm my-2 bg-black/5 px-2 py-1 rounded"
                      >
                        <Link
                          to={`/admin/devices/${encodeURIComponent(deviceName)}`}
                          className="text-red-500 hover:underline"
                          title="Go to device dashboard"
                        >
                          {index + 1}. {deviceName}
                        </Link>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/edit-device/${encodeURIComponent(deviceName)}`}
                            className="text-black-300 hover:text-blue-500 hover:bg-blue-500/20 p-1 rounded transition-colors"
                            title="Edit device"
                          >
                            <Pencil size={12} />
                          </Link>
                          <button
                            onClick={() =>
                              onDeleteDevice &&
                              onDeleteDevice(user.username, deviceName)
                            }
                            className="text-black-300 hover:text-red-300 hover:bg-red-500/20 p-1 rounded transition-colors"
                            title="Delete device"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-crimson italic text-xs">No devices</div>
              )}
            </div>

            {/* Created At */}
            <div className="text-black-300 text-xs">
              <div>{new Date(user.createdAt).toLocaleDateString()}</div>
              <div>{new Date(user.createdAt).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* User info modal */}
      <UserInfoModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
      />

      {/* 🟩 Edit user modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        onUserUpdated={fetchUsers} // Refresh after saving
      />
    </div>
  );
}
