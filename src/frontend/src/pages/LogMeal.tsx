import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLogMeal } from "../hooks/useQueries";

const QUICK_MEALS = [
  {
    name: "Chicken Salad",
    calories: "350",
    protein: "35",
    carbs: "15",
    fat: "12",
  },
  {
    name: "Oatmeal",
    calories: "300",
    protein: "10",
    carbs: "54",
    fat: "6",
  },
  {
    name: "Protein Shake",
    calories: "200",
    protein: "30",
    carbs: "10",
    fat: "3",
  },
  {
    name: "Banana",
    calories: "105",
    protein: "1",
    carbs: "27",
    fat: "0",
  },
  {
    name: "Grilled Salmon",
    calories: "400",
    protein: "42",
    carbs: "0",
    fat: "22",
  },
  {
    name: "Greek Yogurt",
    calories: "130",
    protein: "17",
    carbs: "9",
    fat: "0",
  },
];

export default function LogMeal() {
  const navigate = useNavigate();
  const logMeal = useLogMeal();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Meal name is required";
    if (!form.calories || Number(form.calories) <= 0)
      e.calories = "Enter valid calories";
    if (!form.protein || Number(form.protein) < 0)
      e.protein = "Enter valid protein";
    if (!form.carbs || Number(form.carbs) < 0) e.carbs = "Enter valid carbs";
    if (!form.fat || Number(form.fat) < 0) e.fat = "Enter valid fat";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function applyQuick(q: (typeof QUICK_MEALS)[0]) {
    setForm(q);
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    logMeal.mutate(
      {
        meal: {
          name: form.name,
          calories: BigInt(Math.round(Number(form.calories))),
          protein: BigInt(Math.round(Number(form.protein))),
          carbs: BigInt(Math.round(Number(form.carbs))),
          fat: BigInt(Math.round(Number(form.fat))),
        },
        date: today,
      },
      {
        onSuccess: () => {
          toast.success("Meal logged! 🍽️");
          navigate({ to: "/" });
        },
        onError: () => toast.error("Failed to log meal"),
      },
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.80 0.18 75 / 0.2)" }}
          >
            <UtensilsCrossed
              className="w-5 h-5"
              style={{ color: "oklch(0.80 0.18 75)" }}
            />
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "oklch(0.80 0.18 75)" }}
            >
              Nutrition Log
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase">
              Log Meal
            </h1>
          </div>
        </div>

        {/* Quick select */}
        <div className="card-amber p-5 mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            Quick Select
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {QUICK_MEALS.map((q, i) => (
              <button
                key={q.name}
                type="button"
                onClick={() => applyQuick(q)}
                data-ocid={`log_meal.quick.item.${i + 1}`}
                className="text-left px-3 py-2 rounded-lg bg-accent border border-border text-sm transition-all hover:glow-amber"
                style={{
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "oklch(0.80 0.18 75 / 0.15)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(0.80 0.18 75 / 0.4)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 12px oklch(0.80 0.18 75 / 0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.borderColor = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <p className="font-medium text-foreground truncate">{q.name}</p>
                <p className="text-xs text-muted-foreground">
                  {q.calories} kcal · P:{q.protein}g
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.15 0.04 60 / 0.4), oklch(0.13 0.02 260))",
            border: "1px solid oklch(0.80 0.18 75 / 0.2)",
          }}
          data-ocid="log_meal.form"
        >
          <div>
            <Label
              htmlFor="name"
              className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
            >
              Meal Name
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Grilled Chicken Salad"
              data-ocid="log_meal.name.input"
              className="mt-1 bg-accent border-border focus:ring-primary"
            />
            {errors.name && (
              <p
                className="text-destructive text-xs mt-1"
                data-ocid="log_meal.name.error_state"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="calories"
                className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
              >
                Calories (kcal)
              </Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={form.calories}
                onChange={(e) => set("calories", e.target.value)}
                placeholder="e.g. 350"
                data-ocid="log_meal.calories.input"
                className="mt-1 bg-accent border-border"
              />
              {errors.calories && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="log_meal.calories.error_state"
                >
                  {errors.calories}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="protein"
                className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
              >
                Protein (g)
              </Label>
              <Input
                id="protein"
                type="number"
                min="0"
                value={form.protein}
                onChange={(e) => set("protein", e.target.value)}
                placeholder="e.g. 35"
                data-ocid="log_meal.protein.input"
                className="mt-1 bg-accent border-border"
              />
              {errors.protein && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="log_meal.protein.error_state"
                >
                  {errors.protein}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="carbs"
                className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
              >
                Carbs (g)
              </Label>
              <Input
                id="carbs"
                type="number"
                min="0"
                value={form.carbs}
                onChange={(e) => set("carbs", e.target.value)}
                placeholder="e.g. 27"
                data-ocid="log_meal.carbs.input"
                className="mt-1 bg-accent border-border"
              />
              {errors.carbs && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="log_meal.carbs.error_state"
                >
                  {errors.carbs}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="fat"
                className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
              >
                Fat (g)
              </Label>
              <Input
                id="fat"
                type="number"
                min="0"
                value={form.fat}
                onChange={(e) => set("fat", e.target.value)}
                placeholder="e.g. 12"
                data-ocid="log_meal.fat.input"
                className="mt-1 bg-accent border-border"
              />
              {errors.fat && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="log_meal.fat.error_state"
                >
                  {errors.fat}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={logMeal.isPending}
            data-ocid="log_meal.submit.button"
            className="w-full py-6 text-base font-semibold text-white orange-glow"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.22 35), oklch(0.60 0.22 15))",
            }}
          >
            {logMeal.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging...
              </>
            ) : (
              "Log Meal 🍽️"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
