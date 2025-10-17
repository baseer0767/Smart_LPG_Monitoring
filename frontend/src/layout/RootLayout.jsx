import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="bg-tpl">
      <Outlet />
    </div>
  );
};

export default RootLayout;
