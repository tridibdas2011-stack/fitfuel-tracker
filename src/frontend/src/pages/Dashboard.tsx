import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  Droplets,
  Dumbbell,
  Minus,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { toast } from "sonner";
import {
  useDailyGoals,
  useDailySummary,
  useGymStreak,
  useLogWater,
} from "../hooks/useQueries";

const MACRO_COLORS = [
  "oklch(0.80 0.18 75)",
  "oklch(0.65 0.22 280)",
  "oklch(0.70 0.16 185)",
];

const FALLBACK_GOALS = {
  calories: BigInt(2200),
  macros: { protein: BigInt(160), carbs: BigInt(220), fat: BigInt(70) },
  waterGoal: BigInt(8),
};

const FALLBACK_SUMMARY = {
  date: new Date().toISOString().split("T")[0],
  meals: [
    {
      name: "Oatmeal & Berries",
      calories: BigInt(380),
      protein: BigInt(14),
      carbs: BigInt(62),
      fat: BigInt(7),
    },
    {
      name: "Grilled Chicken Bowl",
      calories: BigInt(620),
      protein: BigInt(52),
      carbs: BigInt(58),
      fat: BigInt(14),
    },
    {
      name: "Protein Shake",
      calories: BigInt(210),
      protein: BigInt(28),
      carbs: BigInt(18),
      fat: BigInt(4),
    },
  ],
  waterIntake: BigInt(5),
  gymSession: {
    exercises: ["Barbell Squat", "Bench Press", "Deadlift", "Pull-ups"],
    durationMinutes: BigInt(65),
    caloriesBurned: BigInt(480),
  },
};

const weeklyCalories = [
  { day: "Mon", cal: 2050 },
  { day: "Tue", cal: 2180 },
  { day: "Wed", cal: 1920 },
  { day: "Thu", cal: 2310 },
  { day: "Fri", cal: 2100 },
  { day: "Sat", cal: 2450 },
  { day: "Sun", cal: 1850 },
];

export default function Dashboard() {
  const { data: summary } = useDailySummary();
  const { data: goals } = useDailyGoals();
  const { data: streakRaw } = useGymStreak();
  const logWater = useLogWater();

  const today = new Date().toISOString().split("T")[0];
  const g = goals ?? FALLBACK_GOALS;
  const s = summary ?? FALLBACK_SUMMARY;
  const streak = Number(streakRaw ?? 42);

  const totalCals = s.meals.reduce((sum, m) => sum + Number(m.calories), 0);
  const totalProtein = s.meals.reduce((sum, m) => sum + Number(m.protein), 0);
  const totalCarbs = s.meals.reduce((sum, m) => sum + Number(m.carbs), 0);
  const totalFat = s.meals.reduce((sum, m) => sum + Number(m.fat), 0);
  const water = Number(s.waterIntake);
  const waterGoal = Number(g.waterGoal);
  const calGoal = Number(g.calories);

  const macroData = [
    { name: "Protein", value: totalProtein, goal: Number(g.macros.protein) },
    { name: "Carbs", value: totalCarbs, goal: Number(g.macros.carbs) },
    { name: "Fat", value: totalFat, goal: Number(g.macros.fat) },
  ];

  function handleWater(delta: number) {
    const newCups = Math.max(0, water + delta);
    logWater.mutate(
      { cups: BigInt(newCups), date: today },
      {
        onSuccess: () =>
          toast.success(
            delta > 0 ? "Water intake updated! 💧" : "Water updated",
          ),
        onError: () => toast.error("Failed to update water"),
      },
    );
  }

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero header */}
      <motion.div
        {...fadeUp(0)}
        className="relative rounded-2xl overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bg.dim_1920x400.jpg')",
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.05 280 / 0.85), oklch(0.12 0.04 35 / 0.70))",
          }}
        />
        <div className="relative z-10 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-1"
              style={{ color: "oklch(0.80 0.18 75)" }}
            >
              Today's Overview
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div
            data-ocid="dashboard.streak.card"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl streak-ring"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.16 0.05 35 / 0.6), oklch(0.14 0.04 55 / 0.4))",
              border: "1px solid oklch(0.65 0.22 35 / 0.4)",
            }}
          >
            <span className="text-3xl">🔥</span>
            <div>
              <p
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: "oklch(0.80 0.18 75)" }}
              >
                Gym Streak
              </p>
              <p className="text-3xl font-extrabold text-foreground">
                {streak} Days
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top row: Calories + Macros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          {...fadeUp(0.1)}
          className="card-amber p-6"
          data-ocid="dashboard.calories.card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p
                className="text-xs uppercase tracking-widest font-semibold mb-1"
                style={{ color: "oklch(0.80 0.18 75)" }}
              >
                Calories
              </p>
              <p className="text-3xl font-bold text-foreground">
                {totalCals.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                of {calGoal.toLocaleString()} kcal goal
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.80 0.18 75 / 0.15)" }}
            >
              <Target
                className="w-6 h-6"
                style={{ color: "oklch(0.80 0.18 75)" }}
              />
            </div>
          </div>
          <Progress
            value={Math.min(100, (totalCals / calGoal) * 100)}
            className="h-3 bg-muted"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{totalCals} consumed</span>
            <span>{Math.max(0, calGoal - totalCals)} remaining</span>
          </div>
          <div className="mt-4 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyCalories}>
                <Line
                  type="monotone"
                  dataKey="cal"
                  stroke="oklch(0.80 0.18 75)"
                  strokeWidth={2}
                  dot={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "oklch(0.58 0.015 255)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.15 0.025 275)",
                    border: "1px solid oklch(0.80 0.18 75 / 0.3)",
                    borderRadius: "8px",
                    color: "oklch(0.96 0.005 240)",
                    fontSize: 12,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.15)}
          className="card-violet p-6"
          data-ocid="dashboard.macros.card"
        >
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-4"
            style={{ color: "oklch(0.65 0.22 280)" }}
          >
            Macro Split
          </p>
          <div className="flex items-center gap-6">
            <div className="w-36 h-36 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={60}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {macroData.map((entry, i) => (
                      <Cell key={entry.name} fill={MACRO_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.15 0.025 275)",
                      border: "none",
                      borderRadius: "8px",
                      color: "oklch(0.96 0.005 240)",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v}g`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {macroData.map((m, i) => (
                <div key={m.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{m.name}</span>
                    <span
                      className="font-semibold"
                      style={{ color: MACRO_COLORS[i] }}
                    >
                      {m.value}g / {m.goal}g
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (m.value / m.goal) * 100)}%`,
                        background: MACRO_COLORS[i],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row: Water + Gym session */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          {...fadeUp(0.2)}
          className="card-teal p-6"
          data-ocid="dashboard.water.card"
        >
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "oklch(0.70 0.16 185)" }}
            >
              Water Intake
            </p>
            <Droplets
              className="w-5 h-5"
              style={{ color: "oklch(0.70 0.16 185)" }}
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleWater(-1)}
              disabled={water <= 0 || logWater.isPending}
              data-ocid="dashboard.water.decrement.button"
              className="rounded-full border-border hover:bg-accent"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">
              <p className="text-4xl font-extrabold text-foreground">{water}</p>
              <p className="text-xs text-muted-foreground">
                of {waterGoal} cups
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleWater(1)}
              disabled={logWater.isPending}
              data-ocid="dashboard.water.increment.button"
              className="rounded-full border-border hover:bg-accent"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: waterGoal }, (_, idx) => idx + 1).map(
              (cupNum) => (
                <div
                  key={`cup-${cupNum}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
                    cupNum <= water
                      ? "text-[oklch(0.70_0.16_185)]"
                      : "bg-muted text-muted-foreground/30"
                  }`}
                  style={
                    cupNum <= water
                      ? { background: "oklch(0.70 0.16 185 / 0.2)" }
                      : {}
                  }
                >
                  💧
                </div>
              ),
            )}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.25)}
          className="card-green p-6"
          data-ocid="dashboard.gym.card"
        >
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "oklch(0.72 0.20 150)" }}
            >
              Gym Session
            </p>
            <Dumbbell
              className="w-5 h-5"
              style={{ color: "oklch(0.72 0.20 150)" }}
            />
          </div>
          {s.gymSession ? (
            <div>
              <div className="flex gap-2 mb-3">
                <Badge
                  style={{
                    background: "oklch(0.72 0.20 150 / 0.2)",
                    color: "oklch(0.72 0.20 150)",
                    borderColor: "oklch(0.72 0.20 150 / 0.4)",
                  }}
                >
                  ✓ Logged
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {Number(s.gymSession.durationMinutes)} min
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  -{Number(s.gymSession.caloriesBurned)} kcal
                </Badge>
              </div>
              <div className="space-y-1.5">
                {s.gymSession.exercises.map((ex) => (
                  <div key={ex} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "oklch(0.72 0.20 150)" }}
                    />
                    <span className="text-foreground">{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <TrendingUp className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                No workout logged yet today
              </p>
              <Link to="/log-workout">
                <Button
                  data-ocid="dashboard.log_workout.button"
                  className="text-white"
                  style={{ background: "oklch(0.72 0.20 150)" }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Log Workout
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Today's meals */}
      <motion.div
        {...fadeUp(0.3)}
        className="card-rose p-6"
        data-ocid="dashboard.meals.card"
      >
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: "oklch(0.65 0.22 15)" }}
          >
            Today's Meals
          </p>
          <Link to="/log-meal">
            <Button
              size="sm"
              data-ocid="dashboard.add_meal.button"
              className="text-white"
              style={{ background: "oklch(0.65 0.22 35)" }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Meal
            </Button>
          </Link>
        </div>
        {s.meals.length === 0 ? (
          <div
            className="text-center py-8"
            data-ocid="dashboard.meals.empty_state"
          >
            <p className="text-muted-foreground">
              No meals logged yet. Start tracking!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {s.meals.map((meal, i) => (
              <div
                key={meal.name}
                data-ocid={`dashboard.meals.item.${i + 1}`}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{meal.name}</p>
                  <p className="text-xs text-muted-foreground">
                    P: {Number(meal.protein)}g · C: {Number(meal.carbs)}g · F:{" "}
                    {Number(meal.fat)}g
                  </p>
                </div>
                <Badge
                  style={{
                    background: "oklch(0.65 0.22 35 / 0.2)",
                    color: "oklch(0.80 0.18 75)",
                    borderColor: "oklch(0.65 0.22 35 / 0.3)",
                  }}
                >
                  {Number(meal.calories)} kcal
                </Badge>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
