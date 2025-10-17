import { useState } from "react";
import UserTable from "./UserTable";
import DeviceSearch from "./DeviceSearch";

// ✅ Accept users, loading, error, and handlers from props
export default function UserRegistry({ users, loading, error, onDeleteUser, onDeleteDevice,fetchUsers }) {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Filter users by search term
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (u) =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.devices?.some((d) =>
            (d.deviceName || d).toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : [];

  return (
    <div className="p-6 text-black">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">User Registry</h2>
          <p className="text-gray-600">
            Manage all registered users and their devices
          </p>
        </div>

        {/* ✅ Search bar */}
        <DeviceSearch value={searchTerm} onChange={setSearchTerm} />
      </div>

      <UserTable
        users={filteredUsers}
        onDeleteUser={onDeleteUser}
        onDeleteDevice={onDeleteDevice} 
           fetchUsers={fetchUsers} // ✅ pass it down


      />
    </div>
  );
}
