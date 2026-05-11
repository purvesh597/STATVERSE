"use client";

import { motion } from "framer-motion";
import { useXP } from "@/context/XPContext";

export default function ProgressDashboard() {
  const { xp, level, completedModules, achievements, progressPercent } = useXP();

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="section-title mx-auto">
            Your <span className="gradient-text">Progress</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Track your journey through STATVERSE
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* XP Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 text-center"
          >
            <p className="text-xs text-white/25 uppercase tracking-wider mb-2">Total XP</p>
            <p className="text-4xl font-bold gradient-text">{xp}</p>
            <p className="text-xs text-white/30 mt-2">Level {level}</p>
          </motion.div>

          {/* Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 text-center"
          >
            <p className="text-xs text-white/25 uppercase tracking-wider mb-2">Completion</p>
            <p className="text-4xl font-bold text-[#00d4ff]">{Math.round(progressPercent)}%</p>
            <div className="w-full h-1.5 bg-white/[0.04] rounded-full mt-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 text-center"
          >
            <p className="text-xs text-white/25 uppercase tracking-wider mb-2">Achievements</p>
            <p className="text-4xl font-bold text-[#ec4899]">{achievements.length}</p>
            <p className="text-xs text-white/30 mt-2">of 6 unlocked</p>
          </motion.div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {modules.map((mod, i) => {
            const completed = completedModules.includes(mod.id);
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`glass-card p-4 flex items-center gap-3 ${
                  completed ? "border-green-500/20" : ""
                }`}
              >
                <span className="text-xl">{mod.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/70 truncate">{mod.name}</p>
                  <p className={`text-[10px] ${completed ? "text-green-400" : "text-white/20"}`}>
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
            <h3 className="text-sm font-semibold text-white/50 mb-4">Unlocked Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {achievements.map((ach) => (
                <motion.div
                  key={ach.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#a855f7]/[0.06] border border-[#a855f7]/15"
                >
                  <span>{ach.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-white/70">{ach.title}</p>
                    <p className="text-[10px] text-white/25">{ach.description}</p>
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
