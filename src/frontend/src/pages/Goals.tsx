import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Target } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDailyGoals, useSetGoals } from "../hooks/useQueries";

const DEFAULTS = {
  calories: "2200",
  protein: "160",
  carbs: "220",
  fat: "70",
  water: "8",
};

export default function Goals() {
  const { data: goals, isLoading } = useDailyGoals();
  const setGoals = useSetGoals();

  const [form, setForm] = useState(DEFAULTS);

  useEffect(() => {
    if (goals) {
      setForm({
        calories: String(Number(goals.calories)),
        protein: String(Number(goals.macros.protein)),
        carbs: String(Number(goals.macros.carbs)),
        fat: String(Number(goals.macros.fat)),
        water: String(Number(goals.waterGoal)),
      });
    }
  }, [goals]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGoals.mutate(
      {
        calories: BigInt(Math.round(Number(form.calories))),
        macros: {
          protein: BigInt(Math.round(Number(form.protein))),
          carbs: BigInt(Math.round(Number(form.carbs))),
          fat: BigInt(Math.round(Number(form.fat))),
        },
        waterGoal: BigInt(Math.round(Number(form.water))),
      },
      {
        onSuccess: () => toast.success("Goals updated! 🎯"),
        onError: () => toast.error("Failed to save goals"),
      },
    );
  }

  const presets = [
    {
      label: "Cut",
      description: "Caloric deficit for fat loss",
      calories: "1800",
      protein: "180",
      carbs: "160",
      fat: "55",
      water: "10",
    },
    {
      label: "Maintain",
      description: "Balanced maintenance diet",
      calories: "2200",
      protein: "160",
      carbs: "220",
      fat: "70",
      water: "8",
    },
    {
      label: "Bulk",
      description: "Caloric surplus for muscle gain",
      calories: "2800",
      protein: "200",
      carbs: "320",
      fat: "85",
      water: "10",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">
              Daily Targets
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase">
              Goals
            </h1>
          </div>
        </div>

        {/* Presets */}
        <div className="card-surface p-5 mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            Quick Presets
          </p>
          <div className="grid grid-cols-3 gap-3">
            {presets.map((p, i) => (
              <button
                key={p.label}
                type="button"
                onClick={() =>
                  setForm({
                    calories: p.calories,
                    protein: p.protein,
                    carbs: p.carbs,
                    fat: p.fat,
                    water: p.water,
                  })
                }
                data-ocid={`goals.preset.item.${i + 1}`}
                className="text-left p-3 rounded-xl bg-accent border border-border hover:border-primary/40 hover:bg-primary/10 transition-all group"
              >
                <p className="font-bold text-foreground group-hover:text-primary">
                  {p.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.description}
                </p>
                <p className="text-xs text-primary mt-1 font-semibold">
                  {p.calories} kcal
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="card-surface p-6 space-y-5"
          data-ocid="goals.form"
        >
          {isLoading ? (
            <div
              className="flex items-center justify-center py-8"
              data-ocid="goals.loading_state"
            >
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div>
                <Label
                  htmlFor="g-calories"
                  className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                >
                  Daily Calories (kcal)
                </Label>
                <Input
                  id="g-calories"
                  type="number"
                  min="500"
                  max="6000"
                  value={form.calories}
                  onChange={(e) => set("calories", e.target.value)}
                  data-ocid="goals.calories.input"
                  className="mt-1 bg-accent border-border text-lg font-bold"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="g-protein"
                    className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                  >
                    Protein (g)
                  </Label>
                  <Input
                    id="g-protein"
                    type="number"
                    min="0"
                    value={form.protein}
                    onChange={(e) => set("protein", e.target.value)}
                    data-ocid="goals.protein.input"
                    className="mt-1 bg-accent border-border"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="g-carbs"
                    className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                  >
                    Carbs (g)
                  </Label>
                  <Input
                    id="g-carbs"
                    type="number"
                    min="0"
                    value={form.carbs}
                    onChange={(e) => set("carbs", e.target.value)}
                    data-ocid="goals.carbs.input"
                    className="mt-1 bg-accent border-border"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="g-fat"
                    className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                  >
                    Fat (g)
                  </Label>
                  <Input
                    id="g-fat"
                    type="number"
                    min="0"
                    value={form.fat}
                    onChange={(e) => set("fat", e.target.value)}
                    data-ocid="goals.fat.input"
                    className="mt-1 bg-accent border-border"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="g-water"
                  className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                >
                  Daily Water Goal (cups)
                </Label>
                <Input
                  id="g-water"
                  type="number"
                  min="1"
                  max="20"
                  value={form.water}
                  onChange={(e) => set("water", e.target.value)}
                  data-ocid="goals.water.input"
                  className="mt-1 bg-accent border-border"
                />
              </div>
              <Button
                type="submit"
                disabled={setGoals.isPending}
                data-ocid="goals.submit.button"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold orange-glow"
              >
                {setGoals.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Goals 🎯"
                )}
              </Button>
              {setGoals.isSuccess && (
                <p
                  className="text-center text-sm text-[oklch(0.72_0.2_150)]"
                  data-ocid="goals.success_state"
                >
                  ✓ Goals saved successfully!
                </p>
              )}
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
}
