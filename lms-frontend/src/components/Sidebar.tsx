import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart,
  FileText,
  Logs,
  FileSpreadsheet,
  ClipboardPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  isMobile?: boolean;
  onNavigate?: () => void;
};

const Sidebar = ({ isMobile = false, onNavigate }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/",
    },
    {
      name: "Analytics",
      icon: <BarChart className="h-5 w-5" />,
      path: "/analytics",
    },
    {
      name: "Input Leave Data",
      icon: <ClipboardPlus className="h-5 w-5" />,
      path: "/input-leave",
    },
    {
      name: "Spreadsheet Link",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      path: "/upload",
    },
    {
      name: "Logs",
      icon: <Logs className="h-5 w-5" />,
      path: "/logs",
    },
    {
      name: "API Documentation",
      icon: <FileText className="h-5 w-5" />,
      path: "/api-docs",
    },
  ];

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200",
        isMobile
          ? "w-full h-full pt-6"
          : "hidden md:block md:sticky top-0 left-0 h-screen overflow-y-auto min-w-64"
      )}>
      <div className="px-6 mt-4 mb-6">
        <Link to="/" className="flex items-center" onClick={handleClick}>
          <span className="font-bold text-2xl text-dhl-red">DHL</span>
          <span className="text-xl ml-2">Leave Management</span>
        </Link>
      </div>

      <div className="px-3 py-4">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">
          Main Menu
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-dhl-red text-white font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={handleClick}>
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
