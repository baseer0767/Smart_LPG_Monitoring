
import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function DeviceTable({ devices, loading, error, onDelete, onEdit }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  if (loading) return <p className="text-gray-300">Loading devices...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!Array.isArray(devices) || devices.length === 0)
    return (
      <div className="text-center text-gray-400 py-6">
        📭 No devices registered yet.
      </div>
    );

  return (
    <div className="overflow-x-auto border border-white/20 rounded-lg mt-6 backdrop-blur-md bg-white/10 shadow-md">
      <div className="min-w-[950px]">
        {/* Header Row */}
        <div className="grid grid-cols-9 w-full text-center bg-black/10 p-5 font-semibold text-sm text-black uppercase tracking-wide">
          <div>Device Info</div>
          <div>Empty Cylinder Weight</div>
          <div>Total Weight With Cylinder</div>
          <div>Gas Reserved</div>
          <div>Gas Capacity</div>
          <div>Percentage</div>
          <div>Last Refill</div>
          <div>Last Updated</div>
          <div>Actions</div>
        </div>

        {/* Device Rows */}
        {devices.map((device) => {
          const r = device.latestReading ?? {};
          const pct = r.percentage || 0;

          return (
            <div
              key={device._id}
              className="grid grid-cols-9 w-full text-center border-t bg-white/50 border-gray-200 p-5 text-sm items-center hover:bg-white/90 transition cursor-pointer"
              onClick={() => navigate(`/devices/${device.deviceName}`)}
            >
              {/* Device Info */}
              <div className="font-medium text-gray-900">
                {device.deviceName || device.deviceId}
              </div>

              {/* Empty Cylinder Weight */}
              <div className="text-gray-700">
                {device.tareWeight != null
                  ? `${device.tareWeight} kg`
                  : device.tare != null
                  ? `${device.tare} kg`
                  : "—"}
              </div>

              {/* Total Weight */}
              <div className="text-gray-700">
                {r.totalWeightKg != null ? r.totalWeightKg.toFixed(1) : "0"} kg
              </div>

              {/* Gas Reserved */}
              <div className="text-gray-700">
                {r.availableGasKg != null ? r.availableGasKg.toFixed(1) : "0"} kg
              </div>

              {/* Gas Capacity */}
              <div className="text-gray-700">
                {device.capacity != null ? device.capacity : "0"} kg
              </div>

              {/* Percentage Bar */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-full bg-gray-300 h-2 rounded overflow-hidden">
                  <div
                    className={`h-2 rounded transition-all duration-700 ease-out ${
                      pct >= 70
                        ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600"
                        : pct < 30
                        ? "bg-gradient-to-r from-red-400 via-red-500 to-red-600"
                        : "bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {pct}%
                </span>
              </div>

                    {/* Last Refill */}
                {/* Last Refill */}
                <div className="text-gray-700">
                  {r.lastRefill
                    ? new Date(r.lastRefill).toLocaleDateString()
                    : "Never"}
                </div>

              {/* Last Updated */}
              <div className="text-gray-600 text-sm">
                {r.timestamp ? new Date(r.timestamp).toLocaleString() : "N/A"}
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-2">
                {/* ✏️ Edit Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(device);
                  }}
                  className="bg-[#8e0b0b] text-white text-sm px-4 py-1 rounded "
                >
                  ✏️ Edit
                </Button>

               
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
