
import React, { useState, useEffect } from "react";
import { addUser } from "@/api/userApi";
import AddUserButton from "./AddUserButton";

const AddUser = ({ ButtonLabel = "Add User", onAddUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  // form fields
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Close modal when clicking outside content
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === "modalOverlay") {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !userPassword || !name || !organization || !phone || !city) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addUser({
        username: userName,
        password: userPassword,
        name,
        organization,
        phone,
        city,
      });

      if (onAddUser) {
        onAddUser();
      }

      // Reset + close modal
      setIsOpen(false);
      setUserName("");
      setUserPassword("");
      setName("");
      setOrganization("");
      setPhone("");
      setCity("");
    } catch (err) {
      setError(err.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <AddUserButton onClick={() => setIsOpen(true)} label={ButtonLabel}>
        <span className="text-lg">+</span>
      </AddUserButton>

      {/* Modal */}
      {isOpen && (
        <div
          id="modalOverlay"
          className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-md p-4 flex items-center justify-center"
        >
          <div className="relative bg-gray-900 bg-opacity-90 backdrop-blur-xl border border-gray-600 
            w-full max-w-sm h-[550px] mx-auto rounded-lg shadow-xl p-4 
            transform transition-all duration-300 ease-out scale-100 overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-2xl font-bold 
              transition-colors duration-200 w-7 h-7 flex items-center justify-center"
            >
              ×
            </button>

            {/* Header */}
            <div className="border-b border-gray-600 pb-2 mb-3">
              <h2 className="text-white text-lg font-bold">Add New User</h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 mb-3 text-xs bg-red-900 bg-opacity-20 p-2 rounded-md border border-red-800">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter username"
                  className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Set user password"
                  className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Organization</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Enter organization"
                  className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-sm text-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full p-2 rounded-md bg-red-800 hover:bg-red-700 text-white text-sm font-semibold 
                transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {loading ? "Adding..." : "Add User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUser;
