"use client";

import { motion } from "framer-motion";

export default function XPToast({ show, amount }: { show: boolean; amount: number }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-8 right-8 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-xl border border-[#a855f7]/30"
      style={{ background: "rgba(168, 85, 247, 0.12)" }}
    >
      <span className="text-lg">⚡</span>
      <span className="text-sm font-semibold text-[#a855f7]">+{amount} XP</span>
    </motion.div>
  );
}
