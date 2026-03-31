import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Droplets,
  Dumbbell,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useUserHistory } from "../hooks/useQueries";

const FALLBACK_HISTORY = (() => {
  const days: Array<{
    date: string;
    meals: Array<{
      name: string;
      calories: bigint;
      protein: bigint;
      carbs: bigint;
      fat: bigint;
    }>;
    waterIntake: bigint;
    gymSession?: {
      exercises: string[];
      durationMinutes: bigint;
      caloriesBurned: bigint;
    };
  }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0],
      meals: [
        {
          name: "Meal 1",
          calories: BigInt(350 + i * 40),
          protein: BigInt(28),
          carbs: BigInt(45),
          fat: BigInt(10),
        },
        {
          name: "Meal 2",
          calories: BigInt(580 + i * 20),
          protein: BigInt(42),
          carbs: BigInt(55),
          fat: BigInt(16),
        },
      ],
      waterIntake: BigInt(4 + (i % 4)),
      gymSession:
        i % 3 !== 0
          ? {
              exercises: ["Squat", "Bench", "Deadlift"],
              durationMinutes: BigInt(55 + i * 5),
              caloriesBurned: BigInt(420 + i * 20),
            }
          : undefined,
    });
  }
  return days;
})();

const DAY_ACCENT_COLORS = [
  {
    color: "oklch(0.70 0.16 185)",
    border: "oklch(0.70 0.16 185 / 0.5)",
    bg: "oklch(0.14 0.04 185 / 0.2)",
  },
  {
    color: "oklch(0.72 0.20 150)",
    border: "oklch(0.72 0.20 150 / 0.5)",
    bg: "oklch(0.14 0.05 150 / 0.2)",
  },
  {
    color: "oklch(0.65 0.22 280)",
    border: "oklch(0.65 0.22 280 / 0.5)",
    bg: "oklch(0.14 0.05 280 / 0.2)",
  },
  {
    color: "oklch(0.80 0.18 75)",
    border: "oklch(0.80 0.18 75 / 0.5)",
    bg: "oklch(0.15 0.04 60 / 0.2)",
  },
  {
    color: "oklch(0.70 0.16 185)",
    border: "oklch(0.70 0.16 185 / 0.5)",
    bg: "oklch(0.14 0.04 185 / 0.2)",
  },
  {
    color: "oklch(0.72 0.20 150)",
    border: "oklch(0.72 0.20 150 / 0.5)",
    bg: "oklch(0.14 0.05 150 / 0.2)",
  },
  {
    color: "oklch(0.65 0.22 280)",
    border: "oklch(0.65 0.22 280 / 0.5)",
    bg: "oklch(0.14 0.05 280 / 0.2)",
  },
];

export default function Progress() {
  const { data: history } = useUserHistory();
  const logs = (history && history.length > 0 ? history : FALLBACK_HISTORY)
    .slice(-7)
    .reverse();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.65 0.22 280 / 0.2)" }}
          >
            <TrendingUp
              className="w-5 h-5"
              style={{ color: "oklch(0.65 0.22 280)" }}
            />
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "oklch(0.65 0.22 280)" }}
            >
              7-Day History
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase">
              Progress
            </h1>
          </div>
        </div>

        <div className="space-y-4">
          {logs.map((log, i) => {
            const totalCals = log.meals.reduce(
              (s, m) => s + Number(m.calories),
              0,
            );
            const totalP = log.meals.reduce((s, m) => s + Number(m.protein), 0);
            const totalC = log.meals.reduce((s, m) => s + Number(m.carbs), 0);
            const totalF = log.meals.reduce((s, m) => s + Number(m.fat), 0);
            const water = Number(log.waterIntake);
            const gymmed = !!log.gymSession;
            const dateStr = new Date(`${log.date}T00:00:00`).toLocaleDateString(
              "en-US",
              {
                weekday: "short",
                month: "short",
                day: "numeric",
              },
            );
            const isToday = log.date === new Date().toISOString().split("T")[0];
            const accent = DAY_ACCENT_COLORS[i % DAY_ACCENT_COLORS.length];

            return (
              <motion.div
                key={log.date}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                data-ocid={`progress.item.${i + 1}`}
                className="p-5 rounded-2xl border-l-4"
                style={{
                  background: `linear-gradient(135deg, ${accent.bg}, oklch(0.12 0.02 260))`,
                  border: "1px solid oklch(0.21 0.02 270)",
                  borderLeftColor: accent.border,
                  borderLeftWidth: "4px",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                      style={{
                        background: `${accent.color.replace(")", " / 0.15)")}`,
                      }}
                    >
                      <p
                        className="text-xs font-bold uppercase"
                        style={{ color: accent.color }}
                      >
                        {dateStr.split(", ")[0]}
                      </p>
                      <p className="text-lg font-extrabold text-foreground leading-none">
                        {new Date(`${log.date}T00:00:00`).getDate()}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {dateStr.split(", ")[1]}{" "}
                        {isToday && (
                          <span
                            className="text-xs font-bold ml-1"
                            style={{ color: accent.color }}
                          >
                            TODAY
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.meals.length} meals logged
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3">
                    <div className="card-surface px-3 py-2 rounded-lg">
                      <p className="text-xs text-muted-foreground">Calories</p>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "oklch(0.80 0.18 75)" }}
                      >
                        {totalCals}
                      </p>
                    </div>
                    <div className="card-surface px-3 py-2 rounded-lg">
                      <p className="text-xs text-muted-foreground">Macros</p>
                      <p className="text-xs font-semibold text-foreground">
                        P:{totalP}g C:{totalC}g F:{totalF}g
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 card-surface px-3 py-2 rounded-lg">
                      <Droplets
                        className="w-4 h-4"
                        style={{ color: "oklch(0.70 0.16 185)" }}
                      />
                      <p className="text-sm font-bold text-foreground">
                        {water}
                      </p>
                      <p className="text-xs text-muted-foreground">cups</p>
                    </div>
                    <div className="flex items-center gap-1.5 card-surface px-3 py-2 rounded-lg">
                      <Dumbbell className="w-4 h-4 text-muted-foreground" />
                      {gymmed ? (
                        <Badge
                          style={{
                            background: "oklch(0.72 0.20 150 / 0.2)",
                            color: "oklch(0.72 0.20 150)",
                            borderColor: "oklch(0.72 0.20 150 / 0.4)",
                          }}
                          className="text-xs"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Gym
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          style={{
                            color: "oklch(0.65 0.22 15 / 0.7)",
                            borderColor: "oklch(0.65 0.22 15 / 0.3)",
                          }}
                          className="text-xs"
                        >
                          <XCircle className="w-3 h-3 mr-1" /> Rest
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gym session details */}
                {gymmed && log.gymSession && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      {Number(log.gymSession.durationMinutes)}min · -
                      {Number(log.gymSession.caloriesBurned)}kcal burned
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {log.gymSession.exercises.map((ex) => (
                        <span
                          key={ex}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: `${accent.color.replace(")", " / 0.12)")}`,
                            color: accent.color,
                          }}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
