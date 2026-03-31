import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.185 0.02 240)",
            border: "1px solid oklch(0.28 0.02 240)",
            color: "oklch(0.955 0.005 240)",
          },
        }}
      />
    </>
  );
}
