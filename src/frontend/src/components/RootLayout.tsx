import { Link, Outlet } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import LoginGuard from "./LoginGuard";
import Navbar from "./Navbar";

const TRIAL_DAYS = 7;
const JOIN_KEY = "fitfuel_join_date";

function TrialBanner() {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let joinDate = localStorage.getItem(JOIN_KEY);
    if (!joinDate) {
      joinDate = new Date().toISOString();
      localStorage.setItem(JOIN_KEY, joinDate);
    }
    const elapsed = Math.floor(
      (Date.now() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    const remaining = TRIAL_DAYS - elapsed;
    if (remaining >= 0) {
      setDaysRemaining(remaining);
    }
  }, []);

  if (dismissed || daysRemaining === null) return null;

  return (
    <div
      className="relative z-40 flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
      style={{
        background: "oklch(0.22 0.02 240)",
        borderBottom: "1px solid oklch(0.65 0.22 35 / 0.3)",
      }}
      data-ocid="trial.banner"
    >
      <p className="text-muted-foreground flex-1 text-center text-xs sm:text-sm">
        🎉 Your{" "}
        <span className="text-foreground font-semibold">7-day free trial</span>{" "}
        ends in{" "}
        <span className="text-primary font-bold">
          {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
        </span>
        . Subscribe to keep full access.{" "}
        <Link
          to="/subscribe"
          className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80 ml-1"
          data-ocid="trial.subscribe.link"
        >
          See Plans →
        </Link>
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        data-ocid="trial.close.button"
        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function RootLayout() {
  return (
    <LoginGuard>
      <div className="min-h-screen flex flex-col bg-background font-jakarta">
        <TrialBanner />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LoginGuard>
  );
}
