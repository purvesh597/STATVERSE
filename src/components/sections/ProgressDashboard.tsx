"use client";

import { motion } from "framer-motion";
import { useXP } from "@/context/XPContext";
import { useTheme } from "@/context/ThemeContext";

export default function ProgressDashboard() {
  const { xp, level, completedModules, achievements, progressPercent } = useXP();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const modules = [
    { id: "detective", name: "Data Detective", icon: "🔍" },
    { id: "statistics", name: "Descriptive Stats", icon: "📊" },
    { id: "correlation", name: "Correlation", icon: "📈" },
    { id: "probability", name: "Probability", icon: "🎲" },
    { id: "ai-dashboard", name: "AI Dashboard", icon: "🤖" },
    { id: "future", name: "Future Section", icon: "🚀" },
  ];

  return (
    <section className="relative py-20 md:py-32">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
          <h2 className="section-title mx-auto">Your <span className="gradient-text">Progress</span></h2>
          <p className="section-subtitle mx-auto text-center">Track your journey through STATVERSE</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* XP Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6 text-center">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-faint)" }}>Total XP</p>
            <p className="text-4xl font-bold gradient-text">{xp}</p>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Level {level}</p>
          </motion.div>

          {/* Completion */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-6 text-center">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-faint)" }}>Completion</p>
            <p className="text-4xl font-bold" style={{ color: "var(--accent)" }}>{Math.round(progressPercent)}%</p>
            <div className="w-full h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: "var(--progress-bg)" }}>
              <motion.div className="h-full rounded-full" style={{ background: isDark ? "linear-gradient(to right, #00d4ff, #a855f7)" : "linear-gradient(to right, #333, #111)" }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-6 text-center">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-faint)" }}>Achievements</p>
            <p className="text-4xl font-bold" style={{ color: isDark ? "#ec4899" : "#555" }}>{achievements.length}</p>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>of 6 unlocked</p>
          </motion.div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {modules.map((mod, i) => {
            const completed = completedModules.includes(mod.id);
            return (
              <motion.div key={mod.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}
                className="glass-card p-4 flex items-center gap-3"
                style={{ borderColor: completed ? "var(--success-border)" : undefined }}>
                <span className="text-xl">{mod.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--text-secondary)" }}>{mod.name}</p>
                  <p className="text-[10px]" style={{ color: completed ? "var(--success-text)" : "var(--text-faint)" }}>
                    {completed ? "✓ Completed" : "Pending"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-muted)" }}>Unlocked Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {achievements.map((ach) => (
                <motion.div key={ach.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: isDark ? "rgba(168,85,247,0.06)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(168,85,247,0.15)" : "rgba(0,0,0,0.08)"}` }}>
                  <span>{ach.icon}</span>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{ach.title}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{ach.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
