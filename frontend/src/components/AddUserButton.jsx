import { Button } from "@/components/ui/button"; // adjust path if needed
import { Plus } from "lucide-react"; // optional icon

const AddUserButton = ({ onClick, label = "Add User" }) => (
  <Button
    onClick={onClick}
    variant="default"
    size="sm" // ⬅️ smaller preset
    className="px-2 py-1 flex gap-1 items-center bg-red-600 hover:bg-red-700 rounded-md text-white font-medium text-xs shadow-md transition-all duration-200"
  >
    <Plus className="w-3 h-3" /> {/* smaller icon */}
    {label}
  </Button>
);

export default AddUserButton;
