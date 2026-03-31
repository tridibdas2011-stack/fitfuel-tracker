import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, Loader2, Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLogWorkout } from "../hooks/useQueries";

const EXERCISE_TEMPLATES = [
  "Squat",
  "Bench Press",
  "Deadlift",
  "Pull-ups",
  "Shoulder Press",
  "Barbell Row",
  "Leg Press",
  "Bicep Curl",
  "Tricep Extension",
  "Plank",
];

const WORKOUT_IMAGES = [
  {
    src: "/assets/generated/workout-squat.dim_800x500.jpg",
    label: "Squat Form",
    exercise: "Squat",
  },
  {
    src: "/assets/generated/workout-bench.dim_800x500.jpg",
    label: "Bench Press Form",
    exercise: "Bench Press",
  },
];

type ExerciseEntry = { id: number; name: string };
let nextId = 0;

export default function LogWorkout() {
  const navigate = useNavigate();
  const logWorkout = useLogWorkout();
  const today = new Date().toISOString().split("T")[0];

  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    { id: nextId++, name: "Squat" },
    { id: nextId++, name: "Bench Press" },
  ]);
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function addExercise() {
    setExercises((prev) => [...prev, { id: nextId++, name: "" }]);
  }

  function updateExercise(id: number, val: string) {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, name: val } : e)),
    );
  }

  function removeExercise(id: number) {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }

  function addTemplate(t: string) {
    if (!exercises.some((e) => e.name === t)) {
      setExercises((prev) => [...prev, { id: nextId++, name: t }]);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    const valid = exercises.filter((x) => x.name.trim());
    if (valid.length === 0) e.exercises = "Add at least one exercise";
    if (!duration || Number(duration) <= 0) e.duration = "Enter valid duration";
    if (!caloriesBurned || Number(caloriesBurned) < 0)
      e.caloriesBurned = "Enter calories burned";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const validExercises = exercises
      .filter((x) => x.name.trim())
      .map((x) => x.name);
    logWorkout.mutate(
      {
        session: {
          exercises: validExercises,
          durationMinutes: BigInt(Math.round(Number(duration))),
          caloriesBurned: BigInt(Math.round(Number(caloriesBurned))),
        },
        date: today,
      },
      {
        onSuccess: () => {
          toast.success("Workout logged! 💪");
          navigate({ to: "/" });
        },
        onError: () => toast.error("Failed to log workout"),
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
            style={{ background: "oklch(0.72 0.20 150 / 0.2)" }}
          >
            <Dumbbell
              className="w-5 h-5"
              style={{ color: "oklch(0.72 0.20 150)" }}
            />
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "oklch(0.72 0.20 150)" }}
            >
              Workout Log
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase">
              Log Workout
            </h1>
          </div>
        </div>

        {/* Posture / technique photos */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {WORKOUT_IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
              className="relative rounded-xl overflow-hidden aspect-video"
              data-ocid={`log_workout.photo.item.${i + 1}`}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <p className="absolute bottom-2 left-3 text-xs font-bold text-foreground">
                {img.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick templates */}
        <div className="card-green p-5 mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            Quick Add Exercises
          </p>
          <div className="flex flex-wrap gap-2">
            {EXERCISE_TEMPLATES.map((t, i) => {
              const selected = exercises.some((e) => e.name === t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => addTemplate(t)}
                  data-ocid={`log_workout.template.item.${i + 1}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                  style={{
                    background: selected
                      ? "oklch(0.72 0.20 150 / 0.2)"
                      : "oklch(0.18 0.022 270)",
                    color: selected
                      ? "oklch(0.72 0.20 150)"
                      : "oklch(0.58 0.015 255)",
                    borderColor: selected
                      ? "oklch(0.72 0.20 150 / 0.5)"
                      : "oklch(0.21 0.02 270)",
                    boxShadow: selected
                      ? "0 0 12px oklch(0.72 0.20 150 / 0.3)"
                      : "none",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          data-ocid="log_workout.form"
        >
          <div
            className="p-6 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.14 0.05 150 / 0.35), oklch(0.13 0.02 260))",
              border: "1px solid oklch(0.72 0.20 150 / 0.2)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Exercises
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExercise}
                data-ocid="log_workout.add_exercise.button"
                style={{
                  borderColor: "oklch(0.72 0.20 150 / 0.4)",
                  color: "oklch(0.72 0.20 150)",
                }}
                className="hover:bg-[oklch(0.72_0.20_150/0.1)]"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            {errors.exercises && (
              <p
                className="text-destructive text-xs mb-2"
                data-ocid="log_workout.exercises.error_state"
              >
                {errors.exercises}
              </p>
            )}
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className="flex gap-2 items-center"
                  data-ocid={`log_workout.exercise.item.${i + 1}`}
                >
                  <Input
                    value={ex.name}
                    onChange={(e) => updateExercise(ex.id, e.target.value)}
                    placeholder={`Exercise ${i + 1}`}
                    data-ocid={`log_workout.exercise.input.${i + 1}`}
                    className="bg-accent border-border flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(ex.id)}
                    data-ocid={`log_workout.exercise.delete_button.${i + 1}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.14 0.05 150 / 0.35), oklch(0.13 0.02 260))",
              border: "1px solid oklch(0.72 0.20 150 / 0.2)",
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="duration"
                  className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                >
                  Duration (min)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    setErrors((p) => ({ ...p, duration: "" }));
                  }}
                  placeholder="e.g. 60"
                  data-ocid="log_workout.duration.input"
                  className="mt-1 bg-accent border-border"
                />
                {errors.duration && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="log_workout.duration.error_state"
                  >
                    {errors.duration}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="cals"
                  className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                >
                  Calories Burned
                </Label>
                <Input
                  id="cals"
                  type="number"
                  min="0"
                  value={caloriesBurned}
                  onChange={(e) => {
                    setCaloriesBurned(e.target.value);
                    setErrors((p) => ({ ...p, caloriesBurned: "" }));
                  }}
                  placeholder="e.g. 480"
                  data-ocid="log_workout.calories.input"
                  className="mt-1 bg-accent border-border"
                />
                {errors.caloriesBurned && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="log_workout.calories.error_state"
                  >
                    {errors.caloriesBurned}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={logWorkout.isPending}
            data-ocid="log_workout.submit.button"
            className="w-full py-6 text-base font-semibold text-white glow-green"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.22 35), oklch(0.60 0.20 150))",
            }}
          >
            {logWorkout.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging...
              </>
            ) : (
              "Log Workout 💪"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
