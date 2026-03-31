import { Button } from "@/components/ui/button";
import { Dumbbell, Flame, Loader2, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  {
    icon: <UtensilsCrossed className="w-7 h-7" />,
    title: "Smart Meal Logging",
    desc: "Track calories, protein, carbs & fat with a tap. Build your macro masterplan.",
    accentColor: "oklch(0.80 0.18 75)",
    borderColor: "oklch(0.80 0.18 75 / 0.6)",
    bg: "oklch(0.15 0.04 60 / 0.3)",
    label: "Nutrition",
  },
  {
    icon: <Dumbbell className="w-7 h-7" />,
    title: "Workout Tracking",
    desc: "Log every rep and set. Visualize your strength gains over time.",
    accentColor: "oklch(0.72 0.20 150)",
    borderColor: "oklch(0.72 0.20 150 / 0.6)",
    bg: "oklch(0.14 0.05 150 / 0.3)",
    label: "Fitness",
  },
  {
    icon: <Flame className="w-7 h-7" />,
    title: "Streak Counter",
    desc: "Build unstoppable momentum. Your daily fire keeps you accountable.",
    accentColor: "oklch(0.65 0.22 15)",
    borderColor: "oklch(0.65 0.22 15 / 0.6)",
    bg: "oklch(0.14 0.05 15 / 0.3)",
    label: "Momentum",
  },
];

const galleryItems = [
  {
    src: "/assets/generated/gym-interior.dim_800x500.jpg",
    caption: "Train in Style",
    sub: "World-class gym environment",
  },
  {
    src: "/assets/generated/gym-deadlift.dim_800x500.jpg",
    caption: "Push Your Limits",
    sub: "Track every rep, every set",
  },
  {
    src: "/assets/generated/meal-prep.dim_800x500.jpg",
    caption: "Meal Prep Like a Pro",
    sub: "Hit your macros every day",
  },
  {
    src: "/assets/generated/healthy-meals.dim_800x500.jpg",
    caption: "Eat for Performance",
    sub: "Fuel your body right",
  },
];

const plans = [
  {
    label: "Weekly",
    price: "$0.99",
    period: "/week",
    color: "oklch(0.70 0.16 185)",
    border: "oklch(0.70 0.16 185 / 0.4)",
    bg: "oklch(0.14 0.04 185 / 0.3)",
  },
  {
    label: "6 Months",
    price: "$3.99",
    period: "/6 mo",
    highlight: true,
    color: "oklch(0.80 0.18 75)",
    border: "oklch(0.80 0.18 75 / 0.7)",
    bg: "oklch(0.15 0.04 60 / 0.5)",
  },
  {
    label: "Yearly",
    price: "$5.99",
    period: "/year",
    color: "oklch(0.65 0.22 280)",
    border: "oklch(0.65 0.22 280 / 0.4)",
    bg: "oklch(0.14 0.05 280 / 0.3)",
  },
];

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Hero background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('/assets/generated/fitfuel-cover-hero.dim_1600x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      {/* Multi-stop cinematic overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.10 0.05 280 / 0.85) 0%, oklch(0.08 0.02 240 / 0.55) 40%, oklch(0.10 0.04 35 / 0.70) 100%)",
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar strip */}
        <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/fitfuel-logo-transparent.dim_200x200.png"
              alt="FitFuel logo"
              className="w-10 h-10 object-contain drop-shadow-lg"
            />
            <span className="text-2xl font-bold tracking-tight text-white">
              FitFuel
            </span>
          </div>
          <Button
            data-ocid="landing.login.button"
            variant="outline"
            size="sm"
            onClick={login}
            disabled={isLoggingIn}
            className="border-primary/60 text-primary hover:bg-primary hover:text-white transition-all"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </header>

        {/* Hero section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div
                className="absolute inset-0 rounded-full blur-3xl scale-150"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.65 0.22 35 / 0.4), oklch(0.65 0.22 280 / 0.2))",
                }}
              />
              <img
                src="/assets/generated/fitfuel-logo-transparent.dim_200x200.png"
                alt="FitFuel Tracker"
                className="relative w-28 h-28 object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none mb-4">
              <span className="text-white">FitFuel</span>{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.80 0.18 75), oklch(0.65 0.22 35), oklch(0.65 0.22 15))",
                }}
              >
                Tracker
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl text-white font-extrabold tracking-tight mb-2">
              Fuel Smarter. Train Harder.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, oklch(0.72 0.20 150), oklch(0.80 0.18 75))",
                }}
              >
                Live Stronger.
              </span>
            </p>
            <p className="text-base sm:text-lg text-white/65 font-medium max-w-xl mx-auto leading-relaxed">
              Your all-in-one fitness companion — powered by data, driven by
              results.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <Button
              data-ocid="landing.get_started.button"
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              className="px-10 py-6 text-lg font-bold rounded-full text-white orange-glow"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.22 35), oklch(0.60 0.22 15))",
              }}
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              Get Started Free
            </Button>
            <p className="text-xs text-white/40">
              7-day free trial · No credit card required
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
                className="text-left p-5 rounded-2xl border-l-4 backdrop-blur-sm"
                style={{
                  background: f.bg,
                  borderColor: f.borderColor,
                  border: "1px solid oklch(0.30 0.02 270 / 0.4)",
                  borderLeftColor: f.borderColor,
                  borderLeftWidth: "4px",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `${f.accentColor.replace(")", " / 0.15)")}`,
                  }}
                >
                  <span style={{ color: f.accentColor }}>{f.icon}</span>
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-widest mb-1 block"
                  style={{ color: f.accentColor }}
                >
                  {f.label}
                </span>
                <h3 className="font-bold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </main>

        {/* Gallery section */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-extrabold text-white text-center mb-10"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, oklch(0.70 0.16 185), oklch(0.72 0.20 150))",
                }}
              >
                Real Results.
              </span>{" "}
              Real People.
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {galleryItems.map((item, i) => (
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-sm font-bold">
                      {item.caption}
                    </p>
                    <p className="text-white/60 text-xs">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscription section */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-extrabold text-white mb-2">
                Choose Your Plan
              </h2>
              <p className="text-white/50 text-base">
                Start free for 7 days, then pick the plan that fits your
                journey.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative p-6 rounded-2xl backdrop-blur-sm text-center ${
                    plan.highlight ? "ring-2" : ""
                  }`}
                  style={{
                    background: plan.bg,
                    border: `1px solid ${plan.border}`,
                    ...(plan.highlight ? { ringColor: plan.color } : {}),
                  }}
                >
                  {plan.highlight && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: plan.color,
                        color: "oklch(0.10 0.02 60)",
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  <p
                    className="text-xs uppercase font-bold tracking-widest mb-3"
                    style={{ color: plan.color }}
                  >
                    {plan.label}
                  </p>
                  <p className="text-4xl font-extrabold text-white mb-1">
                    {plan.price}
                  </p>
                  <p
                    className="text-sm mb-4"
                    style={{ color: `${plan.color}99` }}
                  >
                    {plan.period}
                  </p>
                  <Button
                    data-ocid={`landing.plan.${i + 1}.button`}
                    className="w-full font-semibold rounded-xl"
                    onClick={login}
                    style={{
                      background: plan.highlight
                        ? plan.color
                        : `${plan.color.replace(")", " / 0.20)")}`,
                      color: plan.highlight
                        ? "oklch(0.10 0.02 60)"
                        : plan.color,
                      border: `1px solid ${plan.border}`,
                    }}
                  >
                    Start Free Trial
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} FitFuel Tracker. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline hover:text-white/60 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
