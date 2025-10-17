import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/api/authApi"; // ✅ use your login API

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ username, password });

      // ✅ Redirect based on admin or normal user
      if (data.isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="bg-[#8e0b0b]/85 backdrop-blur-[15px] p-12 rounded-3xl border border-white/20 shadow-2xl text-center min-w-[400px] max-w-[500px] w-full">
        <h1 className="text-white text-2xl font-bold mb-6">Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-800 text-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="text-left">
            <label className="block text-white font-semibold text-sm mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder:text-white/60"
            />
          </div>

          {/* Password */}
          <div className="text-left">
            <label className="block text-white font-semibold text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder:text-white/60"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 text-white font-semibold text-base bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
