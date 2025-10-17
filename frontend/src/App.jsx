
import NotFound from "./components/NotFound";
import RootLayout from "./layout/RootLayout";
import Login from "./components/Login";
import Admin from "./pages/Admin";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import DeviceDashboard from "./components/DeviceDashboard";
import DeviceRegistry from "./components/DeviceRegistry";
import EditDevicePage from "./pages/EditDevicePage";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

// ✅ Auth hooks
const useAuth = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return { isLoggedIn: !!token, isAdmin };
};

// ✅ Protected routes
const UserRoute = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <Outlet />;
};

const AdminRoute = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        {/* Public */}
        <Route path="login" element={<Login />} />

        {/* 🏠 User routes */}
        <Route element={<UserRoute />}>
          <Route path="/" element={<Home />}>
            <Route index element={<DeviceRegistry />} />
            <Route path="devices" element={<DeviceRegistry />} />
            <Route path="devices/:deviceName" element={<DeviceDashboard />} />
          </Route>
        </Route>

        {/* ✅ Admin routes */}
        <Route element={<AdminRoute />}>
          {/* /admin (no layout) */}
          <Route path="admin" element={<Admin />} />

          {/* /admin/... with layout */}
          <Route path="admin/*" element={<AdminLayout />}>
            <Route path="edit-device/:deviceName" element={<EditDevicePage />} />
            <Route path="devices/:deviceName" element={<DeviceDashboard />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
