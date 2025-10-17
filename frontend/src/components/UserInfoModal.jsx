import React from "react";

export default function UserInfoModal({ isOpen, onClose, user, loading, error }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-black dark:bg-gray-900 text-white-900 dark:text-gray-100 p-6 rounded-3xl shadow-2xl w-full max-w-lg transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
       <div className="relative border-b border-gray-200 dark:border-gray-700 pb-3 mb-5">
  <h2 className="text-2xl font-bold bg-clip-text text-white text-center">
    User Details
  </h2>
  <button
    onClick={onClose}
    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:text-red-500 text-2xl leading-none transition-colors"
  >
    ×
  </button>
</div>


        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-500 py-6 font-medium">
            Loading user details...
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center text-red-500 py-6 font-semibold">{error}</div>
        )}

        {/* User Info */}
        {user && !loading && !error && (
          <div className="space-y-5">
            {/* User Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm text-white md:text-base">
              <p>
                <span className="font-semibold">Username:</span> {user.username}
              </p>
              <p>
                <span className="font-semibold">Name:</span> {user.name || "—"}
              </p>
              <p>
                <span className="font-semibold">Organization:</span> {user.organization || "—"}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {user.phone || "—"}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {user.location || "—"}
              </p>
              <p>
                <span className="font-semibold">City:</span> {user.city || "—"}
              </p>
            </div>

            {/* Devices Section */}
            <div>
              <h3 className="font-semibold text-white dark:text-gray-200 mb-2">Devices</h3>
              {user.devices?.length > 0 ? (
                <p className="bg-[#8e0b0b] text-white px-4 py-2 rounded-xl inline-block shadow">
                  Total Devices: <span className="font-bold">{user.devices.length}</span>
                </p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic text-sm">No devices</p>
              )}
            </div>

            {/* Created At */}
            <p className="text-gray-300 dark:text-gray-400 text-xs mt-4 flex items-center justify-center">
              <span className="font-semibold">Created At:</span> {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
