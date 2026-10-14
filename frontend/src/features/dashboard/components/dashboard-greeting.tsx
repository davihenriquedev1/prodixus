"use client";

import { useAuth } from "@/features/auth/context/auth.context";
import { useEffect } from "react";
import { toast } from "sonner";

export function DashboardGreeting() {
  const { user } = useAuth();

  const name = user?.name
    ? user.name.split(" ")[0]?.replace(/^./, (char) => char.toUpperCase())
    : "";

  useEffect(() => {
    const shouldShow = sessionStorage.getItem("show_welcome_message");

    if (!shouldShow) {
      return;
    }

    sessionStorage.removeItem("show_welcome_message");

    toast.success(
      `${name ? `Bem vindo de volta, ${name}!` : "Bem vindo de volta!"}`,
    );
  }, [name]);

  return null;
}
