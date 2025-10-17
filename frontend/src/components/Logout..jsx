import { Button } from "@/components/ui/button"; // ✅ same base Button
import { LogOut } from "lucide-react"; // ⬅️ logout icon

const LogoutButton = () => {
  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Delete token cookie if present
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <Button
      onClick={handleLogout}
      variant="default"
      size="sm" // ⬅️ small size like Add buttons
      className="px-2 py-1 flex gap-1 items-center bg-red-600 hover:bg-red-700 rounded-md text-white font-medium text-xs shadow-md transition-all duration-200"
    >
      <LogOut className="w-3 h-3" /> {/* ⬅️ small logout icon */}
      Logout
    </Button>
  );
};

export default LogoutButton;
