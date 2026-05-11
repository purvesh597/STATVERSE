"use client";

import { motion } from "framer-motion";
import { useXP } from "@/context/XPContext";

export default function Navbar() {
  const { xp, level, progressPercent } = useXP();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"
      style={{ background: "rgba(10, 10, 15, 0.8)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center">
            <span className="text-xs font-bold text-white">S</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-white/90">STATVERSE</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {["Detective", "Statistics", "Correlation", "Probability", "AI Lab"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-xs text-white/40 hover:text-white/80 transition-colors duration-200 tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] text-white/30 font-mono">{Math.round(progressPercent)}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <span className="text-[10px] text-[#a855f7] font-semibold">LV{level}</span>
            <span className="text-[10px] text-white/50 font-mono">{xp} XP</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
