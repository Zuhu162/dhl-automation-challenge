import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart,
  FileText,
  ClipboardPlus,
  Timer,
  Github,
  ExternalLink,
  Heart,
  Calendar,
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
      id: "sidebar-dashboard-link",
    },
    {
      name: "Analytics",
      icon: <BarChart className="h-5 w-5" />,
      path: "/analytics",
      id: "sidebar-analytics-link",
    },
    {
      name: "Input Leave Data",
      icon: <ClipboardPlus className="h-5 w-5" />,
      path: "/input-leave",
      id: "sidebar-input-leave-link",
    },
    {
      name: "Calendar",
      icon: <Calendar className="h-5 w-5" />,
      path: "/calendar",
      id: "sidebar-calendar-link",
    },
    {
      name: "Automation Logs",
      icon: <Timer className="h-5 w-5" />,
      path: "/automation-logs",
      id: "sidebar-automation-logs-link",
    },
    {
      name: "API Documentation",
      icon: <FileText className="h-5 w-5" />,
      path: "/api-docs",
      id: "sidebar-api-docs-link",
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
        "bg-white border-r border-gray-200 flex flex-col",
        isMobile
          ? "w-full h-full pt-6"
          : "hidden lg:flex lg:sticky top-0 left-0 h-screen overflow-y-auto min-w-64"
      )}>
      <div className="px-6 mt-4 mb-6">
        <Link
          to="/"
          className="flex flex-col items-center"
          onClick={handleClick}
          id="sidebar-logo-link">
          <img src="/logo.png" alt="DHL Logo" className="h-10 w-auto mb-2" />
        </Link>
      </div>

      <div className="px-3 py-4 flex-grow">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">
          Main Menu
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              id={item.id}
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

      <div className="px-3 py-4 mt-auto border-t border-gray-100">
        <div className="flex justify-center space-x-2">
          <a
            href="https://github.com/Zuhu162/dhl-automation-challenge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 p-2 rounded-md transition-colors"
            id="sidebar-github-link">
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://zuhu.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 p-2 rounded-md transition-colors"
            id="sidebar-portfolio-link">
            <Heart className="h-4 w-4" />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
