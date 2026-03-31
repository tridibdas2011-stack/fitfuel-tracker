import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Meal {
    fat: bigint;
    carbs: bigint;
    calories: bigint;
    name: string;
    protein: bigint;
}
export interface GymSession {
    exercises: Array<string>;
    durationMinutes: bigint;
    caloriesBurned: bigint;
}
export interface Macronutrients {
    fat: bigint;
    carbs: bigint;
    protein: bigint;
}
export interface DailyLog {
    meals: Array<Meal>;
    waterIntake: bigint;
    date: string;
    gymSession?: GymSession;
}
export interface DailyGoals {
    calories: bigint;
    macros: Macronutrients;
    waterGoal: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyGoals(): Promise<DailyGoals>;
    getDailySummary(date: string): Promise<DailyLog>;
    getGymStreak(): Promise<bigint>;
    getUserHistory(user: Principal): Promise<Array<DailyLog>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logGymSession(session: GymSession, date: string): Promise<void>;
    logMeal(meal: Meal, date: string): Promise<void>;
    logWaterIntake(cups: bigint, date: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setDailyGoals(goals: DailyGoals): Promise<void>;
}
