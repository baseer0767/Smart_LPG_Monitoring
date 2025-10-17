import api from "./axios"; // your Axios instance

// Login with email + password
export async function loginUser({ username, password }) {
  try {
    const response = await api.post("/user/login", { username, password });

    if (response.status === 200) {
      const data = response.data;

      // ✅ Save auth details in localStorage (token is key)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId || "");
      localStorage.setItem("username", data.username); // changed from email
      localStorage.setItem("isAdmin", Boolean(data.isAdmin));

      return data; // return data for components
    }

    throw new Error(response.data?.message || "Invalid credentials");
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}

