import api from "./axios";

// ✅ Fetch all readings for a specific device
export async function getReadings(deviceName) {
  try {
    const response = await api.get(`/loadcell/readings/${deviceName}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return response.data; // { success: true, readings: [...] }
  } catch (error) {
    console.error("Error fetching readings:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}

// ✅ Fetch latest reading(s) for devices
export async function getLatestReadings() {
  try {
    const response = await api.get("/latestreading", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return response.data; 
    // For admin: [ { device, latestReading }, ... ]
    // For user:  [ { device, latestReading }, ... ]
  } catch (error) {
    console.error("Error fetching latest readings:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}



export async function search(query) {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(`/search/${query}`, {
      params: { q: query }, // send ?q=xyz
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // { type: "device"|"user", data: {...} }
  } catch (error) {
    console.error(
      "Error searching:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || error.message;
  }
}

