import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Home,
  Users,
  Briefcase,
  User,
  Plane,
  FileText,
  ChevronLeft,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarItem {
  path: string;
  label: string;
}

interface SidebarProps {
  items: SidebarItem[];
  role: string;
}

type SidebarLabelKey =
  | "dashboard"
  | "users"
  | "bookings"
  | "profile"
  | "plane"
  | "visa";

const labelToKey: Record<string, SidebarLabelKey> = {
  Dashboard: "dashboard",
  Users: "users",
  Bookings: "bookings",
  Profile: "profile",
  Planes: "plane",
  Visas: "visa",
};

// Lucide icon mapping
const getIcon = (key: SidebarLabelKey) => {
  const className = "w-6 h-6";
  switch (key) {
    case "dashboard":
      return <LayoutDashboard  className={className} />;
    case "users":
      return <Users className={className} />;
    case "bookings":
      return <Briefcase className={className} />;
    case "profile":
      return <User className={className} />;
    case "plane":
      return <Plane className={className} />;
    case "visa":
      return <FileText className={className} />;
    default:
      return <Home className={className} />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();

  const translateLabel = (originalLabel: string) => {
    const key = labelToKey[originalLabel];
    if (!key) return originalLabel;
    return t(`sidebar.${key}`);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`relative hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } h-screen overflow-hidden`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-3 py-2">
          {isOpen ? (
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center min-w-0">
                <img src="/logo.png" alt="Travel Agency Logo" className="h-12" />
              </div>

              <ChevronLeft
                role="button"
                tabIndex={0}
                aria-label="Close sidebar"
                onClick={() => setIsOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setIsOpen(false);
                }}
                className="w-6 h-6 flex-shrink-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <img src="/Icon.png" alt="Travel Agency Logo" className="h-10" />
              <ChevronLeft
                role="button"
                tabIndex={0}
                aria-label="Open sidebar"
                onClick={() => setIsOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setIsOpen(true);
                }}
                className="w-6 h-6 rotate-180 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center ${
                    isOpen ? "px-4" : "px-3 justify-center"
                  } py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title={!isOpen ? translateLabel(item.label) : ""}
                >
                  <span className="flex-shrink-0">
                    {getIcon(labelToKey[item.label] ?? "dashboard")}
                  </span>
                  {isOpen && (
                    <span className="ml-3 font-medium">
                      {translateLabel(item.label)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg">
        <nav className="flex justify-around items-center h-16">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="flex-shrink-0">
                {getIcon(labelToKey[item.label] ?? "dashboard")}
              </span>
              <span className="text-xs mt-1 font-medium">
                {translateLabel(item.label)}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
