import React, { useState, useRef, useEffect, useCallback } from "react";
import { search } from "@/api/readingsApi"; // ✅ use the unified search API
import { debounce } from "lodash";

export default function DeviceSearch() {
  const [query, setQuery] = useState("");
  const [device, setDevice] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef(null);
  const cacheRef = useRef({});
  const MIN_QUERY_LENGTH = 3;
  const lastQueryRef = useRef("");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setQuery("");
        setDevice(null);
        setUser(null);
        setError("");
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchData = async (value) => {
    try {
      setLoading(true);
      setError("");
      setDevice(null);
      setUser(null);

      // ✅ Check cache first
      if (cacheRef.current[value]) {
        const { type, data } = cacheRef.current[value];
        if (type === "device") setDevice(data);
        else if (type === "user") setUser(data);
        return;
      }

      // ✅ Use unified search API
      const result = await search(value);

      if (result.type === "device") {
        const reading = result.data.latestReading || {};
        const formatted = {
          deviceName: result.data.deviceName ?? value,
          totalWeightKg: reading.totalWeightKg ?? "N/A",
          percentage: reading.percentage ?? "N/A",
          MaxGasCapacity: reading.capacityKg ?? "N/A",
          availableGasKg: reading.availableGasKg ?? "N/A",
          lastRefill: reading.lastRefill ?? "N/A",
        };
        cacheRef.current[value] = { type: "device", data: formatted };
        setDevice(formatted);
      } else if (result.type === "user") {
        cacheRef.current[value] = { type: "user", data: result.data };
        setUser(result.data);
      } else {
        setError("No device or user found.");
      }
    } catch (finalError) {
      setError("No device or user found.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(debounce(fetchData, 500), []);

  // Cancel debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (value) => {
    const trimmed = value.trim();
    setQuery(trimmed);

    if (trimmed.length < MIN_QUERY_LENGTH) {
      debouncedSearch.cancel();
      setDevice(null);
      setUser(null);
      setError("");
      setShowDropdown(false);
      lastQueryRef.current = trimmed;
      return;
    }

    if (trimmed.length >= MIN_QUERY_LENGTH && trimmed.length >= lastQueryRef.current.length) {
      setShowDropdown(true);
      debouncedSearch(trimmed);
    }

    lastQueryRef.current = trimmed;
  };

  return (
    <div ref={containerRef} className="relative min-w-[280px]">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search Users and Devices..."
        className="w-full px-4 py-2 border border-black/30 rounded-md bg-black/10 backdrop-blur text-black text-sm placeholder:text-black focus:outline-none focus:border-black focus:ring-2 focus:ring-white/20"
      />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-[#333333] backdrop-blur-lg border border-white/20 border-t-0 rounded-b-md shadow-xl z-50 max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-20 text-sm">Searching...</div>
          )}

          {error && (
            <div className="p-6 flex flex-col items-center gap-2 text-red-500 text-center text-sm">
              <span className="text-2xl opacity-60">⚠️</span>
              {error}
            </div>
          )}

          {/* Device Result */}
          {!error && !loading && device && (
            <div className="p-4 border-b border-white/10 last:border-b-0 hover:bg-white/10 transition">
              <div className="mb-4 flex justify-between items-center">
                <strong className="text-white text-base font-semibold">
                  {device.deviceName}
                </strong>
                <span
                  className={`w-2 h-2 rounded-full ${
                    device.percentage !== "N/A"
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-500"
                  }`}
                ></span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Available Gas */}
                <div className="bg-white/10 rounded-sm p-2 border-l-4 border-white">
                  <span className="block text-xs text-gray-400 uppercase mb-1">Gas Reserved</span>
                  <span className="text-sm text-white font-bold">
                    {device.availableGasKg !== "N/A" ? `${device.availableGasKg} Kg` : "N/A"}
                  </span>
                </div>

                {/* Total Weight */}
                <div className="bg-white/10 rounded-sm p-2 border-l-4 border-white">
                  <span className="block text-xs text-gray-400 uppercase mb-1">Total Weight</span>
                  <span className="text-sm text-white font-bold">
                    {device.totalWeightKg !== "N/A" ? `${device.totalWeightKg} Kg` : "N/A"}
                  </span>
                </div>

                {/* Capacity */}
                <div className="bg-white/10 rounded-sm p-2 border-l-4 border-white">
                  <span className="block text-xs text-gray-400 uppercase mb-1">Max Gas Capacity</span>
                  <span className="text-sm text-white font-bold">
                    {device.MaxGasCapacity !== "N/A" ? `${device.MaxGasCapacity} Kg` : "N/A"}
                  </span>
                </div>

                {/* Gas Level */}
                <div
                  className={`bg-white/10 rounded-sm p-2 border-l-4 ${
                    device.percentage !== "N/A" ? "border-green-500" : "border-gray-500"
                  }`}
                >
                  <span className="block text-xs text-gray-400 uppercase mb-1">Gas Level</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        device.percentage !== "N/A" ? "text-green-500" : "text-gray-400"
                      }`}
                    >
                      {device.percentage !== "N/A" ? `${device.percentage}%` : "N/A"}
                    </span>
                    <div className="flex-1 h-2 bg-black/30 rounded border border-white/20 overflow-hidden">
                      {device.percentage !== "N/A" && (
                        <div
                          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                          style={{ width: `${Number(device.percentage) || 0}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Last Refill */}
                <div className="bg-white/10 rounded-sm p-2 border-l-4 border-white col-span-2">
  <span className="block text-xs text-gray-400 uppercase mb-1">Last Refill</span>
  <span className="text-sm text-white font-bold">
    {device.lastRefill && device.lastRefill !== "N/A" ? (() => {
      const now = new Date();
      const refill = new Date(device.lastRefill);
      const diffMs = now - refill;
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return `${days} Day${days !== 1 ? "s" : ""} Ago`;
    })() : "N/A"}
  </span>
</div>

              </div>
            </div>
          )}

          {/* User Result */}
          {user && !loading && (
            <div className="p-4 border-b border-white/10">
              <div className="text-white font-bold">{user.username}</div>
              <div className="mt-2">
                {user.devices && user.devices.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300 text-sm">
                    {user.devices.map((d, i) => (
                      <li key={i}>
                        {d.deviceName} {d.capacityKg}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm italic">No devices</div>
                )}
              </div>
            </div>
          )}

          {!loading && !error && !device && !user && query.length >= 3 && (
            <div className="p-6 flex flex-col items-center gap-2 text-gray-400 text-center text-sm">
              <span className="text-2xl opacity-60">🔍</span>
              No device or user found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
