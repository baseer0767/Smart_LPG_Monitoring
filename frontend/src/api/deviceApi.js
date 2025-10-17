import api from "./axios"; // axios instance

// Search device by ID
export const searchDeviceByDeviceName = async (deviceName) => {
  try {

     const token = localStorage.getItem("token");

    const response = await api.get(`/user/devices/${deviceName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    return response.data; // return device data

  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error("No device found with ID ");
    }
    throw new Error("Search error. Please try again.");
  }
};





// ✅ Add device to a user by username
export async function addDeviceToUser(username, { deviceName, tareWeight, capacity }) {
  try {
    const token = localStorage.getItem("token"); // admin's JWT

    const response = await api.post(
      `/admin/users/${username}/device`,
      { deviceName, tareWeight, capacity }, // ✅ send all required fields
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // { success: true, device: {...} }
  } catch (error) {
    console.error("Add device error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}


// ✅ Delete a specific device from a user by username
export async function deleteUserDevice(username, deviceId) {
  try {
    const token = localStorage.getItem("token"); // admin's JWT

    const response = await api.delete(`/admin/users/${username}/device/${deviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // { success: true, message: "Device removed from user" }
  } catch (error) {
    console.error("Delete device error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}

// ✅ Get devices for a user
// - Normal user: fetches own devices
// - Admin: can pass `username` to fetch a specific user's devices
export async function getDevices(username = null) {
  try {
    let url = "/devices";
    if (username) url += `?username=${username}`;

    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    // 👇 return only devices array
    return response.data.devices || [];
  } catch (error) {
    console.error("Error fetching devices:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}



// ✅ Admin only: fetch all devices
export async function getAllDevices() {
  try {
    const response = await api.get("/devices/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching all devices:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}

export const getDeviceByName = async (deviceName) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/devices/${deviceName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getDeviceReadings = async (deviceName) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get(`/loadcell/readings/${deviceName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.readings; // match backend structure
  } catch (err) {
    console.error("Error fetching readings:", err);
    throw err.response?.data?.message || "Failed to fetch readings";
  }
};


export const updateDevice = async (deviceName, data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.put(`/devices/${deviceName}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Update device error:", err.response?.data || err.message);
    throw err.response?.data?.message || "Failed to update device";
  }
};

