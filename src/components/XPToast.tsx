"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function XPToast({ show, amount }: { show: boolean; amount: number }) {
  const { theme } = useTheme();

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-8 right-8 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-xl"
      style={{
        background: theme === "dark" ? "rgba(168, 85, 247, 0.12)" : "rgba(0, 0, 0, 0.06)",
        border: theme === "dark" ? "1px solid rgba(168, 85, 247, 0.3)" : "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <span className="text-lg">⚡</span>
      <span
        className="text-sm font-semibold"
        style={{ color: theme === "dark" ? "#a855f7" : "#111111" }}
      >
        +{amount} XP
      </span>
    </motion.div>
  );
}
