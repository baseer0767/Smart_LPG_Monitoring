import api from "./axios"; // your Axios instance

// ✅ Admin: Add a new user
export async function addUser({
  username,
  password,
  isAdmin = false,
  name,
  organization,
  phone,
  city,
}) {
  try {
    const token = localStorage.getItem("token"); // admin's token

    const response = await api.post(
      "admin/users",
      { username, password, isAdmin, name, organization, phone, city }, // ✅ include new fields
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // contains new user info
  } catch (error) {
    console.error("Add user error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}

// ✅ Get single user by username (includes devices + details)
export async function getUserByUsername(username) {
  try {
    const token = localStorage.getItem("token"); // admin's token

    const response = await api.get(`/admin/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // contains user info + devices
  } catch (error) {
    console.error("Get user by username error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}
export const updateUser = async (id, updatedData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(
      `/admin/users/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update user error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
};


// ✅ Get all users
export async function getAllUsers() {
  try {
    const token = localStorage.getItem("token"); // admin's JWT

    const response = await api.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // array of users with their devices
  } catch (error) {
    console.error("Get all users error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}

// ✅ Delete user (and their devices)
export async function deleteUser(username) {
  try {
    const token = localStorage.getItem("token"); // admin's JWT

    const response = await api.delete(`/admin/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data; // { success: true, message: "User and their devices deleted" }
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}
