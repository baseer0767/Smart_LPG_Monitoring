import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {
  const location = useLocation();
  const params = useParams();

  const [subtitle, setSubtitle] = useState("Weight Monitoring Dashboard");
  const [refreshKey, setRefreshKey] = useState(0); // 🔑 triggers reloads

  // Reset subtitle when not on dashboard
  useEffect(() => {
    if (location.pathname === "/") {
      setSubtitle("Weight Monitoring Dashboard");
    } else if (location.pathname.startsWith("/devices")) {
      setSubtitle(""); // clear subtitle for registry
    }
  }, [location.pathname]);

  // 🔁 Auto-refresh every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 5000); // adjust interval as needed
    return () => clearInterval(interval);
  }, []);

  let headerProps = {
    title: "Dashboard",
    subtitle,
    showLogout: true,
  };

  if (location.pathname.startsWith("/devices/") && params.deviceName) {
    headerProps = {
      title: params.deviceName,
      subtitle,
      showLogout: false,
    };
  }

  
  return (
    <div className="min-h-screen flex flex-col">
      <Header {...headerProps} />
      <main className="flex-1 p-4">
        {/* ✅ Pass both subtitle setter & refresh signal */}
        <Outlet context={{ setSubtitle, refreshKey }} />
      </main>
    </div>
  );
}
