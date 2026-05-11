"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="relative" style={{ borderTop: "1px solid var(--border-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{
                background: theme === "dark"
                  ? "linear-gradient(135deg, #00d4ff, #a855f7)"
                  : "#111111",
              }}
            >
              <span className="text-[10px] font-bold text-white">S</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
              STATVERSE
            </span>
          </div>

          <p className="text-xs text-center" style={{ color: "var(--text-faint)" }}>
            Statistical Techniques in Data Analysis &amp; Computing — Interactive Virtual Lab
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs"
            style={{ color: "var(--text-faint)", opacity: 0.6 }}
          >
            Built with Next.js, Framer Motion &amp; Recharts
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
