import React, { useState, useEffect } from "react";

export default function EditDevice({ device, onSave, onCancel }) {
  const [form, setForm] = useState(device);
  const role = localStorage.getItem("role"); // "admin" or "user"

  useEffect(() => {
    setForm(device); // update when prop changes
  }, [device]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-black/90 dark:bg-gray-900 text-gray-100 p-6 rounded-3xl shadow-2xl w-full max-w-lg transform transition-transform duration-300 scale-100"
      >
        {/* Header */}
        <div className="relative border-b border-gray-800 pb-3 mb-5">
          <h2 className="text-2xl font-bold text-center text-white">
            ✏️ Edit Device
          </h2>
          <button
            onClick={onCancel}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {role === "admin" && (
            <>
              <label className="flex flex-col text-sm text-gray-300">
                Assigned User:
                <input
                  type="text"
                  name="username"
                  value={form.username || ""}
                  onChange={handleChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-2 mt-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>

              <label className="flex flex-col text-sm text-gray-300">
                Device Name:
                <input
                  type="text"
                  name="deviceName"
                  value={form.deviceName || ""}
                  onChange={handleChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-2 mt-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>
            </>
          )}

          {/* Shared editable fields */}
          <label className="flex flex-col text-sm text-gray-300">
            Tare Weight (kg):
            <input
              type="number"
              name="tareWeight"
              value={form.tareWeight || ""}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-xl p-2 mt-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-300">
            Gas Capacity (kg):
            <input
              type="number"
              name="capacity"
              value={form.capacity || ""}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-xl p-2 mt-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </label>

          {/* Buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-sm transition-colors"
            >
               Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm font-semibold transition-colors"
            >
               Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
