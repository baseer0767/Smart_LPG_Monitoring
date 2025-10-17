import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import UserRegistry from "@/components/UserRegistry";
import { getAllUsers, deleteUser } from "@/api/userApi";
import { addDeviceToUser, deleteUserDevice } from "@/api/deviceApi";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Add user (refresh immediately)
  const handleUserAdded = async () => {
    await fetchUsers();
  };

  // 🔹 Add device (refresh immediately)
  const handleDeviceAdded = async (userName, deviceData) => {
    try {
      await addDeviceToUser(userName, deviceData);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to add device:", err);
    }
  };

  // 🔹 Delete user
  const handleDeleteUser = async (username) => {
    if (!confirm(`Delete user "${username}" and all their devices?`)) return;
    await deleteUser(username);
    await fetchUsers();
  };

  // 🔹 Delete device
  const handleDeleteDevice = async (username, deviceId) => {
    if (!confirm(`Delete device "${deviceId}" for user "${username}"?`)) return;
    await deleteUserDevice(username, deviceId);
    await fetchUsers();
  };

  return (
    <div>
      <Header
        title="Admin Panel"
        subtitle="Device Management Dashboard"
        showAddUser={true}
        showAddDevice={true}
        showLogout={true}
        onAddUser={handleUserAdded}
        onAddDevice={handleDeviceAdded}
      />

      {/* ✅ Pass fetchUsers down so EditUserModal can refresh data */}
      <UserRegistry
        users={users}
        loading={loading}
        error={error}
        onDeleteUser={handleDeleteUser}
        onDeleteDevice={handleDeleteDevice}
        onUserAdded={handleUserAdded}
        onDeviceAdded={handleDeviceAdded}
        fetchUsers={fetchUsers} // ✅ this fixes the “fetchUsers is not defined” error
      />
    </div>
  );
};

export default Admin;
