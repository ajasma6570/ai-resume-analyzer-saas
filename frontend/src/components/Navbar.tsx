import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  History,
  Settings,
  Sparkles,
} from "lucide-react";
import api, { clearAccessToken } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const logoutStore = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navRef = useRef<HTMLElement | null>(null);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      clearAccessToken();
      logoutStore();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);
  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md select-none"
    >
      {/* Changed mx-auto and max-w-7xl to w-full to ensure it spans across the entire viewport edge-to-edge */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand Accent */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 transition-transform group-hover:scale-105">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-neutral-900 leading-none">
                ResuMatch
              </span>
              <span className="text-xs text-emerald-600 font-bold tracking-wider mt-1 uppercase flex items-center gap-0.5">
                <Sparkles className="h-3 w-3" /> AI Analyzer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-emerald-700 font-semibold"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-bubble"
                      className="absolute inset-0 bg-emerald-50 rounded-lg -z-10 border border-emerald-100/30"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-neutral-400"}`}
                  />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side Profile & Actions */}
          <div className="hidden md:flex items-center gap-5">
            {user && (
              <div className="flex flex-col items-end text-right">
                <span className="text-sm font-medium text-neutral-900">
                  {user.name}
                </span>
                {/* <span className="text-xs font-medium text-neutral-400 mt-0.5">
                  free Account
                </span> */}
              </div>
            )}

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-neutral-500 hover:text-red-600 hover:bg-red-50 gap-2 h-10 px-4 text-sm font-semibold cursor-pointer rounded-lg"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            /* FIX: Changed to absolute positioning below the 16px header.
              Added backdrop-blur-lg and shadow-xl so it floats flawlessly over your main layout content.
            */
            className="md:hidden absolute top-16 left-0 w-full border-b border-neutral-200/60 bg-white/95 backdrop-blur-lg shadow-xl z-50"
          >
            <div className="space-y-1 px-4 py-4 pb-5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 font-semibold"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-neutral-400"}`}
                    />
                    {link.name}
                  </Link>
                );
              })}

              <div className="my-4 border-t border-neutral-100 pt-4 flex items-center justify-between px-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-neutral-900">
                    {user?.name || "User Profile"}
                  </span>
                  <span className="text-xs font-medium text-neutral-400 mt-0.5">
                    Premium Tier
                  </span>
                </div>

                <Button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  variant="ghost"
                  className="text-red-600 bg-red-50 hover:bg-red-100 gap-2 h-10 px-4 text-sm font-semibold rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
