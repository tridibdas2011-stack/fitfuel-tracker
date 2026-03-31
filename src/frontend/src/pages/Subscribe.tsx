import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CrownIcon, Flame, Zap } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const PLANS = [
  {
    id: "weekly",
    name: "Weekly",
    price: "$0.99",
    period: "per week",
    badge: null,
    icon: <Flame className="w-5 h-5" />,
    color: "oklch(0.65 0.22 35)",
    colorMuted: "oklch(0.65 0.22 35 / 0.15)",
    features: [
      "Full meal & macro tracking",
      "Gym workout logging",
      "Daily dashboard",
      "Water intake tracker",
      "7-day history",
    ],
    cta: "Start Weekly",
  },
  {
    id: "halfyearly",
    name: "Half-Yearly",
    price: "$3.99",
    period: "per 6 months",
    badge: "Save 38%",
    icon: <Zap className="w-5 h-5" />,
    color: "oklch(0.72 0.2 150)",
    colorMuted: "oklch(0.72 0.2 150 / 0.15)",
    features: [
      "Everything in Weekly",
      "Streak analytics",
      "Progress charts",
      "Goal presets (Cut/Maintain/Bulk)",
      "Priority support",
    ],
    cta: "Get Half-Yearly",
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$5.99",
    period: "per year",
    badge: "Best Value — Save 88%",
    icon: <CrownIcon className="w-5 h-5" />,
    color: "oklch(0.65 0.22 35)",
    colorMuted: "oklch(0.65 0.22 35 / 0.15)",
    features: [
      "Everything in Half-Yearly",
      "Unlimited history",
      "Advanced macro analytics",
      "Custom meal plans (coming soon)",
      "Early access to new features",
    ],
    cta: "Get Full Year",
  },
];

function handleSubscribe(plan: string) {
  toast.success(`Redirecting to checkout for ${plan} plan…`, {
    description:
      "You'll be redirected to Stripe to complete your subscription.",
    duration: 4000,
  });
}

export default function Subscribe() {
  return (
    <div className="relative min-h-[80vh]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/subscription-bg.dim_1200x600.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-background/85" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Unlock Full Access
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase mb-4">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Invest in your fitness journey. All plans include full access to
            FitFuel's tracking features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.1,
                ease: "easeOut",
              }}
              className="card-surface p-6 flex flex-col relative overflow-hidden"
              data-ocid={`subscribe.plan.item.${i + 1}`}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <Badge
                    className="text-xs font-semibold px-2 py-0.5"
                    style={{
                      background: plan.color,
                      color: "oklch(0.1 0 0)",
                      border: "none",
                    }}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              {/* Icon + Name */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: plan.colorMuted, color: plan.color }}
              >
                {plan.icon}
              </div>
              <p
                className="text-xs uppercase tracking-widest font-bold mb-1"
                style={{ color: plan.color }}
              >
                {plan.name}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: plan.color }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.name)}
                data-ocid={`subscribe.plan.${plan.id}.button`}
                className="w-full font-semibold py-5"
                style={{
                  background: plan.color,
                  color: "oklch(0.1 0 0)",
                }}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Secure payments powered by Stripe. Cancel anytime. No hidden fees.
        </motion.p>
      </div>
    </div>
  );
}
