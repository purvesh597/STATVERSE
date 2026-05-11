"use client";

import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPContext";
import { ACHIEVEMENTS } from "@/context/XPContext";
import { useTheme } from "@/context/ThemeContext";

const futureCards = [
  { icon: "🧠", title: "Artificial Intelligence", description: "Neural networks that learn, adapt, and make decisions from complex data patterns.", stat: "87% of enterprises will adopt AI by 2026", colorIdx: 0 },
  { icon: "🤖", title: "Robotics & Automation", description: "Intelligent machines performing tasks with precision beyond human capability.", stat: "14M industrial robots operational worldwide", colorIdx: 1 },
  { icon: "🏙️", title: "Smart Cities", description: "Data-driven urban ecosystems optimizing energy, traffic, and resource allocation.", stat: "Smart city market valued at $820B by 2030", colorIdx: 2 },
  { icon: "⚛️", title: "Quantum Computing", description: "Harnessing quantum mechanics for problems impossible for classical computers.", stat: "1,000+ qubit processors in development", colorIdx: 3 },
  { icon: "🏥", title: "Healthcare AI", description: "Predictive diagnostics, drug discovery, and personalized treatment plans.", stat: "AI diagnosis accuracy surpassing 95%", colorIdx: 4 },
  { icon: "🔐", title: "Cybersecurity", description: "AI-powered threat detection analyzing billions of signals in milliseconds.", stat: "$248B cybersecurity market by 2028", colorIdx: 5 },
];

const DARK_COLORS = ["#00d4ff", "#a855f7", "#ec4899", "#22d3ee", "#f97316", "#f43f5e"];
const LIGHT_COLORS = ["#111111", "#333333", "#555555", "#444444", "#666666", "#777777"];

export default function FutureSection() {
  const [hasVisited, setHasVisited] = useState(false);
  const { addXP, completeModule, unlockAchievement } = useXP();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const handleVisit = useCallback(() => {
    if (!hasVisited) { setHasVisited(true); addXP(10); completeModule("future"); unlockAchievement(ACHIEVEMENTS[5]); }
  }, [hasVisited, addXP, completeModule, unlockAchievement]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) handleVisit(); }, { threshold: 0.3 });
    const el = document.getElementById("future");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [handleVisit]);

  return (
    <section id="future" className="relative py-20 md:py-32">
      {/* Ambient glow — dark only */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#a855f7]/[0.03] blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00d4ff]/[0.03] blur-[100px]" />
        </div>
      )}

      <div className="section-container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
          <div className="xp-badge mb-4 mx-auto">🚀 +10 XP</div>
          <h2 className="section-title mx-auto">The <span className="gradient-text">Future</span> of Data Science</h2>
          <p className="section-subtitle mx-auto text-center">Where statistics meets the frontier of technology.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {futureCards.map((card, i) => {
            const color = colors[card.colorIdx];
            return (
              <motion.div key={card.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card p-6 group cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                  {card.icon}
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>{card.title}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>{card.description}</p>
                <div className="text-[10px] font-mono px-3 py-1.5 rounded-lg inline-block"
                  style={{ background: `${color}08`, border: `1px solid ${color}15`, color: `${color}99` }}>
                  {card.stat}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
