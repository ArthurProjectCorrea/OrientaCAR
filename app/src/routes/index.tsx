import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/session";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      throw redirect({ to: getSession() ? "/inicio" : "/login" });
    }
  },
  component: () => null,
});
