import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import LandingPage from "../pages/LandingPage";

export default function LoginGuard({ children }: { children: ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity) {
    return <LandingPage />;
  }

  return <>{children}</>;
}
