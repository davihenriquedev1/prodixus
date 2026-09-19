"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth/context/auth.context";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
