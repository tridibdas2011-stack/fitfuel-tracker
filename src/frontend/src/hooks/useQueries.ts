import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DailyGoals, GymSession, Meal } from "../backend.d";
import { useActor } from "./useActor";

const today = () => new Date().toISOString().split("T")[0];

export function useDailySummary(date?: string) {
  const { actor, isFetching } = useActor();
  const d = date ?? today();
  return useQuery({
    queryKey: ["dailySummary", d],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailySummary(d);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDailyGoals() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dailyGoals"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailyGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGymStreak() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["gymStreak"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getGymStreak();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userHistory"],
    queryFn: async () => {
      if (!actor) return [];
      await actor.getCallerUserProfile();
      // Use a dummy principal-based history — getUserHistory needs principal
      // Fall back to fetching last 7 days manually
      const dates: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split("T")[0]);
      }
      const results = await Promise.all(
        dates.map((d) => actor.getDailySummary(d)),
      );
      return results;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogMeal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ meal, date }: { meal: Meal; date: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logMeal(meal, date);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dailySummary"] });
    },
  });
}

export function useLogWorkout() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      session,
      date,
    }: { session: GymSession; date: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logGymSession(session, date);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dailySummary"] });
      qc.invalidateQueries({ queryKey: ["gymStreak"] });
    },
  });
}

export function useLogWater() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ cups, date }: { cups: bigint; date: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logWaterIntake(cups, date);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dailySummary"] });
    },
  });
}

export function useSetGoals() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goals: DailyGoals) => {
      if (!actor) throw new Error("Not connected");
      return actor.setDailyGoals(goals);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dailyGoals"] });
    },
  });
}
