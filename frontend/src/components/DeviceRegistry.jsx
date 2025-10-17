
import { useState, useEffect } from "react";
import DeviceTable from "./DeviceTable";
import EditDevice from "./EditDevice";
import { getDevices, deleteUserDevice, updateDevice } from "../api/deviceApi";
import { getLatestReadings } from "../api/readingsApi";
import { io } from "socket.io-client";

export default function DeviceRegistry() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null); // for edit modal

  // 🔹 Fetch devices + readings
  const fetchDevicesWithReadings = async () => {
    setLoading(true);
    setError("");
    try {
      const [deviceList, latestReadings] = await Promise.all([
        getDevices(),
        getLatestReadings(),
      ]);

      const devicesWithReadings = deviceList.map((d) => {
        const match = latestReadings.find(
          (r) => r.deviceName === d.deviceName
        );
        return {
          ...d,
          latestReading: match?.latestReading || null,
        };
      });

      setDevices(devicesWithReadings);
    } catch (errMsg) {
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 On mount: load data + connect socket
  useEffect(() => {
    fetchDevicesWithReadings();

    const socket = io(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://smart-lpg-tracker-production.up.railway.app"
    );

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket:", socket.id);
    });

    socket.on("newReading", (newReading) => {
      console.log("📡 Live update:", newReading);
      setDevices((prev) =>
        prev.map((device) =>
          device.deviceName === newReading.deviceName
            ? { ...device, latestReading: newReading }
            : device
        )
      );
    });

    socket.on("disconnect", () => {
      console.log("🔴 WebSocket disconnected");
    });

    return () => socket.disconnect();
  }, []);

  // 🔹 Handle Delete
  const handleDelete = async (deviceId) => {
    if (!confirm("Are you sure you want to delete this device?")) return;
    try {
      const username = localStorage.getItem("username");
      await deleteUserDevice(username, deviceId);
      await fetchDevicesWithReadings();
    } catch (errMsg) {
      alert(errMsg);
    }
  };

  // 🔹 Handle Edit actions
  const handleEdit = (device) => setSelectedDevice(device);
  const closeModal = () => setSelectedDevice(null);

  const handleSave = async (updates) => {
    try {
      await updateDevice(selectedDevice.deviceName, updates);
      closeModal();
      await fetchDevicesWithReadings(); // refresh after edit
    } catch (err) {
      alert("Failed to update device: " + err.message);
    }
  };

  return (
    <div className="p-6 text-black">
      <DeviceTable
        devices={devices}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        onEdit={handleEdit} // 👈 pass this to open modal
      />

      {/* ✅ Show edit modal when selected */}
      {selectedDevice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <EditDevice
              device={selectedDevice}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
