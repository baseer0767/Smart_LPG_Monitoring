import React from "react";
import LogoutButton from "./Logout.";
import { Button } from "./ui/button";
import AddDevice from "./AddDevice";
import DeviceSearch from "./DeviceSearch";
import AddUser from "./AddUser";

const Header = ({
  title = "Dashboard",
  subtitle = "Monitoring Dashboard",
  showSearch = false,
  showAddDevice = false,
  showAddUser = false,
  onAddUser,
  onAddDevice,
  showLogout = false,
}) => {
  return (
    <header className="w-full bg-[#A72C32] py-5 border-b border-white/10 shadow-md relative">
  <div className="flex flex-col md:flex-row items-center justify-between px-6">
    {/* Left Section */}
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-white text-2xl font-bold">TPL</span>
        <span className="text-white/80 text-2xl font-light ml-1">Trakker</span>
      </div>
      <span className="text-white/60 text-xs tracking-widest">
        Safety • Innovation • Connectivity
      </span>
    </div>

    {/* Centered Title */}
    <div className="absolute left-1/2 -translate-x-1/2 text-center">
      <h1 className="text-white text-xl font-bold">{title}</h1>
      <p className="text-white/60 text-sm">{subtitle}</p>
    </div>

    {/* Right Section */}
    <div className="flex items-center gap-4 md:mt-0">
      {showSearch && <DeviceSearch />}
      {showAddUser && <AddUser onAddUser={onAddUser} />}
      {showAddDevice && <AddDevice onAddDevice={onAddDevice} />}
      {showLogout && <LogoutButton />}
    </div>
  </div>
</header>

  );
};

export default Header;
