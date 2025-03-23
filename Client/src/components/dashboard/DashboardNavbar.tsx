import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Globe,
  Sun,
  Moon,
  Plus,
  ChevronDown,
  Search,
  Bell,
  Compass,
  Map,
  Calendar,
  Heart,
  Settings,
  LogOut,
  Briefcase,
  MessageSquare,
  ChevronRight,
  User,
  History,
  Star,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

export const DashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const mainNavItems = [
    {
      label: "Overview",
      path: "/dashboard",
      icon: Compass,
    },
    {
      label: "Explore",
      path: "#",
      icon: Map,
      dropdown: [
        { label: "Destinations", path: "/dashboard/explore" },
        { label: "Popular Trips", path: "/dashboard/explore/popular" },
        { label: "Travel Guides", path: "/dashboard/explore/guides" },
      ],
    },
    {
      label: "My Travel",
      path: "#",
      icon: Briefcase,
      dropdown: [
        { label: "My Trips", path: "/dashboard/trips" },
        { label: "Saved Places", path: "/dashboard/saved" },
        { label: "Calendar", path: "/dashboard/calendar" },
        { label: "Messages", path: "/dashboard/messages" },
      ],
    },
  ] as const;

  type NavItem = (typeof mainNavItems)[number];
  type DropdownItem = { label: string; path: string };

  const notifications = [
    {
      id: 1,
      title: "Trip Reminder",
      message: "Your trip to Paris starts in 3 days!",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Special Offer",
      message: "Get 20% off on your next booking",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "New Message",
      message: "You have a new message from your guide",
      time: "1 day ago",
    },
  ];

  const NavItem = ({ item }: { item: NavItem }) => {
    const hasDropdown = "dropdown" in item;
    const isActive = !hasDropdown && location.pathname === item.path;
    const isDropdownActive = activeDropdown === item.label;

    return (
      <div className="relative">
        <button
          onClick={() => {
            if (hasDropdown) {
              setActiveDropdown(isDropdownActive ? null : item.label);
            } else {
              handleNavigation(item.path);
            }
          }}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive || isDropdownActive
              ? "text-white bg-gray-800"
              : "text-gray-300 hover:text-white hover:bg-gray-800/50"
          }`}
        >
          <item.icon className="h-4 w-4 mr-2" />
          <span>{item.label}</span>
          {hasDropdown && (
            <ChevronDown
              className={`h-4 w-4 ml-1 transition-transform ${
                isDropdownActive ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {hasDropdown && isDropdownActive && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 py-1">
            {item.dropdown.map((dropdownItem) => (
              <button
                key={dropdownItem.path}
                onClick={() => handleNavigation(dropdownItem.path)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <ChevronRight className="h-4 w-4 mr-2 opacity-50" />
                {dropdownItem.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">TravelAI</span>
            </Link>

            <div className="hidden md:flex items-center ml-10 space-x-1">
              {mainNavItems.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setActiveDropdown(null);
                }}
                className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <h3 className="text-white font-medium mb-4">
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start space-x-3 p-3 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-300">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/dashboard/create-trip")}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Trip</span>
            </motion.button>

            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setActiveDropdown(null);
                }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-400">
                    {user?.email ? user.email[0].toUpperCase() : "U"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm text-white font-medium truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard/history"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <History className="h-4 w-4 mr-2" />
                      Travel History
                    </Link>
                    <Link
                      to="/dashboard/favorites"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Favorites
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <Link
                      to="/help"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Support
                    </Link>
                    <div className="border-t border-gray-700">
                      <button
                        onClick={() => {
                          signOut();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="flex flex-col items-center px-4 space-y-4 max-w-sm mx-auto">
              {/* Search Bar for Mobile */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Navigation Items */}
              <div className="w-full space-y-2">
                {mainNavItems.map((item) => (
                  <div key={item.label} className="rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        if ("dropdown" in item) {
                          setActiveDropdown(
                            activeDropdown === item.label ? null : item.label
                          );
                        } else {
                          handleNavigation(item.path);
                        }
                      }}
                      className="flex items-center justify-between w-full px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors rounded-lg"
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </div>
                      {"dropdown" in item && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            activeDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {"dropdown" in item && activeDropdown === item.label && (
                      <div className="bg-gray-800/30 rounded-b-lg">
                        {item.dropdown.map((dropdownItem) => (
                          <button
                            key={dropdownItem.path}
                            onClick={() => handleNavigation(dropdownItem.path)}
                            className="flex items-center w-full px-12 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            <ChevronRight className="h-4 w-4 mr-2 opacity-50" />
                            {dropdownItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Create Trip Button */}
              <div className="w-full">
                <button
                  onClick={() => handleNavigation("/dashboard/create-trip")}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Trip</span>
                </button>
              </div>

              {/* Footer Actions */}
              <div className="w-full border-t border-gray-700 pt-4 mt-4">
                <div className="px-8 max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-6">
                    <Link
                      to="/dashboard/settings"
                      className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-6 w-6 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-300">
                        Settings
                      </span>
                    </Link>
                    <Link
                      to="/help"
                      className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <HelpCircle className="h-6 w-6 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-300">
                        Help
                      </span>
                    </Link>
                  </div>
                  <div className="mt-4 px-4">
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
