import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Search, Heart, ShoppingCart, Bell, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  };

  const roleSegment = user?.role ? user.role.toLowerCase() : null;
  const dashboardLink = roleSegment ? `/${roleSegment}/dashboard` : "/";
  const profileLink = roleSegment ? `/${roleSegment}/profile` : "/profile";

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-sm z-50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="flex items-center h-16 px-4 mx-auto">
        {/* Logo - Always on Left */}
        <Link
          to="/"
          className="flex items-center flex-shrink-0"
          aria-label="Travel Agency"
        >
          <img src="/logo.png" alt="Travel Agency Logo" className="h-12" />
        </Link>

        {/* Navigation Links - Desktop (Centered) */}
        <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Home
          </Link>
          <Link
            to="/destinations"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Destinations
          </Link>
          <Link
            to="/services"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Services
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            About
          </Link>
        </div>

        {/* Search Bar - Desktop (Right of links) */}
        <div className="hidden md:flex items-center ml-6">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4 ml-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1 rounded transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <button
                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Favoris"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative" ref={ddRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-blue-600"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm bg-blue-600 text-white border-2 border-blue-600">
                      {getInitials(
                        user?.name ||
                          `${user?.firstName || ""} ${user?.lastName || ""}`
                      )}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <Link
                      to={dashboardLink}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Go to dashboard
                    </Link>
                    <Link
                      to={profileLink}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Actions - Right Side */}
        <div className="md:hidden flex items-center ml-auto space-x-2">
          {/* Theme Toggle - Mobile */}
          <ThemeToggle />
          {/* Search Icon - Mobile */}
          <button
            className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications & Favorites - Only if authenticated */}
          {isAuthenticated && (
            <>
              <button
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                title="Favoris"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </>
          )}

          {/* Menu Button - Mobile */}
          <button
            className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {searchOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3 animate-slideDown">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search destinations..."
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg animate-slideDown">
          <div className="p-5 space-y-1">
            {/* Navigation Links - Mobile */}
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                className="text-base text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-3 rounded-lg transition font-medium"
                onClick={() => setMobileOpen(false)}
              >
                🏠 Home
              </Link>
              <Link
                to="/about"
                className="text-base text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-3 rounded-lg transition font-medium"
                onClick={() => setMobileOpen(false)}
              >
                ℹ️ About
              </Link>
              <Link
                to="/services"
                className="text-base text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-3 rounded-lg transition font-medium"
                onClick={() => setMobileOpen(false)}
              >
                ⚙️ Services
              </Link>
              <Link
                to="/destinations"
                className="text-base text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-3 rounded-lg transition font-medium"
                onClick={() => setMobileOpen(false)}
              >
                🌍 Destinations
              </Link>
            </div>

            {/* Actions - Mobile */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3 w-full">
                  <Link
                    to="/login"
                    className="flex-1 text-center text-base font-medium text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 px-4 py-3 rounded-xl transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center text-base font-medium bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-xl transition shadow-md"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to={dashboardLink}
                    className="block w-full text-center text-base font-medium bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-xl transition shadow-md"
                    onClick={() => setMobileOpen(false)}
                  >
                    📊 Go to Dashboard
                  </Link>
                  <Link
                    to={profileLink}
                    className="block w-full text-center text-base font-medium text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-3 rounded-xl transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    👤 Profile
                  </Link>
                  <button
                    className="w-full text-center text-base font-medium text-red-600 dark:text-red-400 border-2 border-red-600 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-xl transition"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                  >
                    🚪 Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
