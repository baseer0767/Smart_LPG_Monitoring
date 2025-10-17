import React, { useState, useEffect } from "react";
import AddDeviceButton from "./AddDeviceButton";

const AddDevice = ({ ButtonLabel = "Add Device", onAddDevice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [tareWeight, setTareWeight] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Close modal when clicking outside content
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === "modalOverlay") setIsOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !deviceName || !tareWeight || !capacity) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onAddDevice(userName, {
        deviceName,
        tareWeight,
        capacity,
      });
      setIsOpen(false);
      setUserName("");
      setDeviceName("");
      setTareWeight("");
      setCapacity("");
    } catch (err) {
      setError(err.message || "Failed to add device");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add Device Button */}
      <AddDeviceButton onClick={() => setIsOpen(true)} label={ButtonLabel}>
        <span className="text-lg">+</span>
      </AddDeviceButton>

      {/* Modal */}
      {isOpen && (
        <div
          id="modalOverlay"
          className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-md p-4 flex items-center justify-center"
        >
          <div className="relative bg-gray-900 bg-opacity-90 backdrop-blur-xl border border-gray-600 w-full max-w-lg rounded-2xl shadow-2xl p-8">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-3xl font-bold transition-colors duration-200"
            >
              ×
            </button>

            {/* Header */}
            <div className="border-b border-gray-600 pb-4 mb-6">
              <h2 className="text-white text-2xl font-bold mb-2">
                Add New Device
              </h2>
              <p className="text-gray-400 text-sm">
                Register a new LPG cylinder device
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 mb-4 text-sm bg-red-900 bg-opacity-20 p-3 rounded-lg border border-red-800">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  User Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter username"
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
                />
              </div>

              {/* Device Name */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Device Name
                </label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Enter device name"
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
                />
              </div>

              {/* Tare Weight */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Cylinder Tare Weight (kg)
                </label>
                <input
                  type="number"
                  value={tareWeight}
                  onChange={(e) => setTareWeight(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Gas Capacity (kg)
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 14"
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 rounded-lg bg-red-800 hover:bg-red-700 text-white font-semibold transition-all duration-200 shadow-lg hover:scale-105"
              >
                {loading ? "Adding..." : "Add Device"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDevice;
