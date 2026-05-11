"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPContext";
import { ACHIEVEMENTS } from "@/context/XPContext";
import { useTheme } from "@/context/ThemeContext";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function generateTimeData() {
  const data = [];
  const now = Date.now();
  for (let i = 20; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 3000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      predictions: Math.floor(Math.random() * 400 + 800),
      accuracy: +(85 + Math.random() * 12).toFixed(1),
      processed: Math.floor(Math.random() * 2000 + 5000),
    });
  }
  return data;
}

const recommendations = [
  { id: 1, title: "High-Risk Student Alert", desc: "3 students below 40% — trigger intervention", confidence: 94, type: "alert" },
  { id: 2, title: "Optimal Study Schedule", desc: "8hrs study + 7hrs sleep = peak performance", confidence: 89, type: "success" },
  { id: 3, title: "Attendance Correlation", desc: "90%+ attendance → 23% higher marks", confidence: 91, type: "info" },
  { id: 4, title: "Subject Difficulty Index", desc: "Mathematics ranked hardest across cohorts", confidence: 87, type: "warning" },
];

export default function AIDashboard() {
  const [timeData, setTimeData] = useState(generateTimeData);
  const [modelStatus, setModelStatus] = useState("Training");
  const [epoch, setEpoch] = useState(0);
  const [hasVisited, setHasVisited] = useState(false);
  const { addXP, completeModule, unlockAchievement } = useXP();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleVisit = useCallback(() => {
    if (!hasVisited) { setHasVisited(true); addXP(15); completeModule("ai-dashboard"); unlockAchievement(ACHIEVEMENTS[4]); }
  }, [hasVisited, addXP, completeModule, unlockAchievement]);

  useEffect(() => { handleVisit(); }, [handleVisit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({ time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), predictions: Math.floor(Math.random() * 400 + 800), accuracy: +(85 + Math.random() * 12).toFixed(1), processed: Math.floor(Math.random() * 2000 + 5000) });
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEpoch((prev) => { if (prev >= 100) { setModelStatus("Ready"); return 100; } return prev + 1; });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const DARK_M = ["#00d4ff", "#a855f7", "#22d3ee", "#ec4899"];
  const LIGHT_M = ["#111111", "#444444", "#666666", "#888888"];
  const mColors = isDark ? DARK_M : LIGHT_M;

  const metrics = [
    { label: "Predictions/sec", value: timeData[timeData.length - 1]?.predictions || 0, suffix: "", colorIdx: 0 },
    { label: "Model Accuracy", value: timeData[timeData.length - 1]?.accuracy || 0, suffix: "%", colorIdx: 1 },
    { label: "Records Processed", value: timeData[timeData.length - 1]?.processed || 0, suffix: "", colorIdx: 2 },
    { label: "Active Models", value: 4, suffix: "", colorIdx: 3 },
  ];

  const axisTick = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.35)";
  const axisLine = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
  const areaStroke = isDark ? "#00d4ff" : "#333";
  const areaFillId = "colorPredThemed";
  const liveColor = isDark ? "#4ade80" : "#1a7a1a";

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }> }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)" }}>
        {payload.map((p, i) => (
          <div key={i} style={{ color: "var(--text-muted)" }}>{p.dataKey}: <span className="font-mono" style={{ color: "var(--text-primary)" }}>{p.value}</span></div>
        ))}
      </div>
    );
  };

  const recBg = (type: string) => {
    if (isDark) return type === "alert" ? "rgba(239,68,68,0.1)" : type === "success" ? "rgba(34,211,238,0.1)" : type === "warning" ? "rgba(245,158,11,0.1)" : "rgba(168,85,247,0.1)";
    return type === "alert" ? "rgba(200,0,0,0.04)" : type === "success" ? "rgba(0,100,0,0.04)" : type === "warning" ? "rgba(150,100,0,0.04)" : "rgba(0,0,0,0.03)";
  };
  const recBorder = (type: string) => {
    if (isDark) return type === "alert" ? "rgba(239,68,68,0.2)" : type === "success" ? "rgba(34,211,238,0.2)" : type === "warning" ? "rgba(245,158,11,0.2)" : "rgba(168,85,247,0.2)";
    return type === "alert" ? "rgba(200,0,0,0.12)" : type === "success" ? "rgba(0,100,0,0.12)" : type === "warning" ? "rgba(150,100,0,0.12)" : "rgba(0,0,0,0.08)";
  };

  return (
    <section id="ai-lab" className="relative py-20 md:py-32">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
          <div className="xp-badge mb-4">🤖 +15 XP</div>
          <h2 className="section-title"><span className="gradient-text">AI &amp; Computing</span> Dashboard</h2>
          <p className="section-subtitle">A futuristic control room with live AI analytics, predictions, and recommendation engine.</p>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {metrics.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="glass-card p-4">
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-faint)" }}>{m.label}</p>
              <motion.p key={m.value} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="text-xl md:text-2xl font-bold font-mono" style={{ color: mColors[m.colorIdx] }}>
                {typeof m.value === "number" ? m.value.toLocaleString() : m.value}{m.suffix}
              </motion.p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: liveColor }} />
                <span className="text-[9px]" style={{ color: liveColor, opacity: 0.7 }}>Live</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Live Prediction Stream</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: liveColor }} />
                <span className="text-[10px]" style={{ color: liveColor, opacity: 0.7 }}>Real-time</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id={areaFillId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={areaStroke} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={areaStroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: axisTick, fontSize: 9 }} axisLine={{ stroke: axisLine }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: axisTick, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="predictions" stroke={areaStroke} strokeWidth={1.5} fill={`url(#${areaFillId})`} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Model Training */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>Model Training</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Status</span>
                  <span className="text-xs font-mono" style={{ color: modelStatus === "Ready" ? (isDark ? "#22d3ee" : "#1a7a1a") : (isDark ? "#f59e0b" : "#996600") }}>{modelStatus}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Epoch</span>
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{epoch}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--progress-bg)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: isDark ? "linear-gradient(to right, #00d4ff, #a855f7)" : "linear-gradient(to right, #333, #111)" }} animate={{ width: `${epoch}%` }} transition={{ duration: 0.2 }} />
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "var(--card-bg)", border: "1px solid var(--border-secondary)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-xs">⚙️</motion.div>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Processing Pipeline</span>
                </div>
                <div className="space-y-1.5">
                  {["Data Cleaning", "Feature Engineering", "Model Fitting", "Validation"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <motion.div className="w-1.5 h-1.5 rounded-full" animate={{ backgroundColor: epoch > i * 25 ? (isDark ? "#22d3ee" : "#1a7a1a") : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") }} />
                      <span className="text-[10px]" style={{ color: epoch > i * 25 ? "var(--text-muted)" : "var(--text-faint)" }}>{step}</span>
                      {epoch > (i + 1) * 25 && <span className="text-[9px] ml-auto" style={{ color: "var(--success-text)" }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>AI Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <motion.div key={rec.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }} className="glass-card p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5" style={{ background: recBg(rec.type), border: `1px solid ${recBorder(rec.type)}` }}>
                  {rec.type === "alert" ? "⚠️" : rec.type === "success" ? "✅" : rec.type === "warning" ? "📋" : "💡"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{rec.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{rec.desc}</p>
                </div>
                <span className="text-[10px] font-mono flex-shrink-0" style={{ color: "var(--accent)", opacity: 0.6 }}>{rec.confidence}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
