import React, { useState, useEffect } from "react";
import { updateUser } from "@/api/userApi";

const EditUserModal = ({ isOpen, onClose, user, onUserUpdated }) => {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setOrganization(user.organization || "");
      setPhone(user.phone || "");
      setCity(user.city || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateUser(user._id, {
        name,
        organization,
        phone,
        city,
        ...(password ? { password } : {}),
      });
if (onUserUpdated) onUserUpdated();
      onClose();
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="editUserOverlay"
      className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-md p-4 flex items-center justify-center"
      onClick={(e) => e.target.id === "editUserOverlay" && onClose()}
    >
      <div
        className="relative bg-gray-900 bg-opacity-90 backdrop-blur-xl border border-gray-600 
        w-full max-w-sm mx-auto rounded-lg shadow-xl p-4 transform transition-all duration-300 ease-out scale-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-2xl font-bold 
          transition-colors duration-200 w-7 h-7 flex items-center justify-center"
        >
          ×
        </button>

        {/* Header */}
        <div className="border-b border-gray-600 pb-2 mb-3">
          <h2 className="text-white text-lg font-bold">Edit User</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 mb-3 text-xs bg-red-900 bg-opacity-20 p-2 rounded-md border border-red-800">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              Organization
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
            />
          </div>

          {/* Optional Password Reset */}
          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              New Password (optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 rounded-md bg-red-800 hover:bg-red-700 text-white text-sm font-semibold 
              transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
