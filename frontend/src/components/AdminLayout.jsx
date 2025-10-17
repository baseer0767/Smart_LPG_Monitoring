import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Header from "@/components/Header";

export default function AdminLayout() {
  const location = useLocation();
  const params = useParams();
  const [subtitle, setSubtitle] = useState("Device Management Dashboard");

  useEffect(() => {
    if (location.pathname === "/admin") {
      setSubtitle("Device Management Dashboard");
    } else if (location.pathname.startsWith("/admin/devices/") && params.deviceName) {
      setSubtitle(`Device: ${params.deviceName}`);
    } else {
      setSubtitle("");
    }
  }, [location.pathname, params.deviceName]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Only one header for all admin pages */}
      <Header title="Admin Panel" subtitle={subtitle} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
