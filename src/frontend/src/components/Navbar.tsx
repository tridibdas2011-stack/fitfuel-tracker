import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Crown,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  TrendingUp,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navLinks = [
  {
    to: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    to: "/log-meal",
    label: "Log Meal",
    icon: <UtensilsCrossed className="w-4 h-4" />,
  },
  {
    to: "/log-workout",
    label: "Log Workout",
    icon: <Flame className="w-4 h-4" />,
  },
  {
    to: "/progress",
    label: "Progress",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  { to: "/goals", label: "Goals", icon: null },
  { to: "/subscribe", label: "Subscribe", icon: <Crown className="w-4 h-4" /> },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clear, identity } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="nav.link"
          className="flex items-center gap-2 group"
        >
          <img
            src="/assets/generated/fitfuel-logo-transparent.dim_200x200.png"
            alt="FitFuel logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold tracking-tight">FitFuel</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = currentPath === link.to;
            const isSubscribe = link.to === "/subscribe";
            return (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "text-foreground"
                    : isSubscribe
                      ? "text-primary hover:text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.icon && (
                  <span
                    style={{
                      color: isSubscribe
                        ? "oklch(0.80 0.18 75)"
                        : isActive
                          ? "oklch(0.80 0.18 75)"
                          : undefined,
                    }}
                  >
                    {link.icon}
                  </span>
                )}
                <span
                  style={{
                    color: isSubscribe ? "oklch(0.80 0.18 75)" : undefined,
                  }}
                  className={isSubscribe ? "text-shimmer" : ""}
                >
                  {link.label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.65 0.22 35), oklch(0.80 0.18 75))",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {identity && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              data-ocid="nav.logout.button"
              className="hidden md:flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs">Sign Out</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.menu.button"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = currentPath === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    data-ocid={`nav.mobile.${link.label.toLowerCase().replace(" ", "_")}.link`}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    style={{
                      background: isActive
                        ? "oklch(0.65 0.22 35 / 0.15)"
                        : undefined,
                      color: isActive
                        ? "oklch(0.80 0.18 75)"
                        : "oklch(0.58 0.015 255)",
                    }}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="justify-start text-muted-foreground hover:text-foreground mt-1"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
