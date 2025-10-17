import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDeviceByName, updateDevice } from "@/api/deviceApi";
import { toast } from "react-hot-toast";

export default function EditDevicePage() {
  const { deviceName } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchDevice() {
      try {
        const data = await getDeviceByName(deviceName);
        setDevice(data);
      } catch (err) {
        toast.error("Failed to load device");
      } finally {
        setLoading(false);
      }
    }
    fetchDevice();
  }, [deviceName]);

  const handleChange = (e) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDevice(deviceName, device);
      toast.success("Device updated!");
      navigate("/admin");
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-400 py-10 font-medium">
        Loading device...
      </div>
    );

  if (!device)
    return (
      <div className="text-center text-red-500 py-10 font-semibold">
        Device not found
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div
        className="bg-black text-white p-4 rounded-2xl shadow-xl w-full max-w-md transform transition-transform duration-300 scale-100"
      >
        <div className="relative border-b border-gray-700 pb-2 mb-4">
          <h2 className="text-xl font-bold text-center text-[#8e0b0b]">
            Edit Device: {device.deviceName}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:text-red-500 text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSave}>
  {["deviceName", "tareWeight", "capacity"].map((key) => (
    <div key={key} className="flex flex-col text-left">
      <label className="text-sm text-gray-400 capitalize">{key}</label>
      <input
        type="text"
        name={key}
        value={device[key] || ""}
        onChange={handleChange}
        className="p-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
      />
    </div>
  ))}

  <div className="flex justify-center gap-2 mt-3">
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="px-3 py-1.5 bg-gray-700 rounded-lg hover:bg-gray-600 text-sm"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={saving}
      className="px-3 py-1.5 bg-[#8e0b0b] text-white rounded-lg hover:bg-[#a55a5a] text-sm"
    >
      {saving ? "Saving..." : "Save"}
    </button>
  </div>
</form>
 </div>
    </div>
  );
}
