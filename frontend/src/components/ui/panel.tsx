"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
}

export function Panel({ children }: PanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{
        duration: 0.15,
        ease: "easeOut",
      }}
      className="absolute inset-y-0 right-0 z-30 w-full max-w-md border-l border-slate-800 bg-[#0A0C10] text-[#E2E8F0] shadow-2xl"
    >
      {children}
    </motion.aside>
  );
}
