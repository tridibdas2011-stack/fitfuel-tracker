import { createRootRoute, createRoute } from "@tanstack/react-router";
import { RootLayout } from "./components/RootLayout";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import LogMeal from "./pages/LogMeal";
import LogWorkout from "./pages/LogWorkout";
import Progress from "./pages/Progress";
import Subscribe from "./pages/Subscribe";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const logMealRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/log-meal",
  component: LogMeal,
});

const logWorkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/log-workout",
  component: LogWorkout,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/progress",
  component: Progress,
});

const goalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/goals",
  component: Goals,
});

const subscribeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscribe",
  component: Subscribe,
});

export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  logMealRoute,
  logWorkoutRoute,
  progressRoute,
  goalsRoute,
  subscribeRoute,
]);
