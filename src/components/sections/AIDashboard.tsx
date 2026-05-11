"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPContext";
import { ACHIEVEMENTS } from "@/context/XPContext";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

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

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#161625] border border-white/10 rounded-lg px-3 py-2 text-xs">
      {payload.map((p, i) => (
        <div key={i} className="text-white/50">
          {p.dataKey}: <span className="text-white font-mono">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AIDashboard() {
  const [timeData, setTimeData] = useState(generateTimeData);
  const [modelStatus, setModelStatus] = useState("Training");
  const [epoch, setEpoch] = useState(0);
  const [hasVisited, setHasVisited] = useState(false);
  const { addXP, completeModule, unlockAchievement } = useXP();

  const handleVisit = useCallback(() => {
    if (!hasVisited) {
      setHasVisited(true);
      addXP(15);
      completeModule("ai-dashboard");
      unlockAchievement(ACHIEVEMENTS[4]);
    }
  }, [hasVisited, addXP, completeModule, unlockAchievement]);

  useEffect(() => {
    handleVisit();
  }, [handleVisit]);

  // Simulated live data
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          predictions: Math.floor(Math.random() * 400 + 800),
          accuracy: +(85 + Math.random() * 12).toFixed(1),
          processed: Math.floor(Math.random() * 2000 + 5000),
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Epoch counter
  useEffect(() => {
    const interval = setInterval(() => {
      setEpoch((prev) => {
        if (prev >= 100) {
          setModelStatus("Ready");
          return 100;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: "Predictions/sec", value: timeData[timeData.length - 1]?.predictions || 0, suffix: "", color: "#00d4ff" },
    { label: "Model Accuracy", value: timeData[timeData.length - 1]?.accuracy || 0, suffix: "%", color: "#a855f7" },
    { label: "Records Processed", value: timeData[timeData.length - 1]?.processed || 0, suffix: "", color: "#22d3ee" },
    { label: "Active Models", value: 4, suffix: "", color: "#ec4899" },
  ];

  return (
    <section id="ai-lab" className="relative py-20 md:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="xp-badge mb-4">🤖 +15 XP</div>
          <h2 className="section-title">
            <span className="gradient-text">AI & Computing</span> Dashboard
          </h2>
          <p className="section-subtitle">
            A futuristic control room with live AI analytics, predictions, and recommendation engine.
          </p>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-card p-4"
            >
              <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">{m.label}</p>
              <motion.p
                key={m.value}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-xl md:text-2xl font-bold font-mono"
                style={{ color: m.color }}
              >
                {typeof m.value === "number" ? m.value.toLocaleString() : m.value}{m.suffix}
              </motion.p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[9px] text-green-400/60">Live</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/70">Live Prediction Stream</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400/60">Real-time</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.04)" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="predictions"
                  stroke="#00d4ff"
                  strokeWidth={1.5}
                  fill="url(#colorPred)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Model Training */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-white/70 mb-4">Model Training</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/30">Status</span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: modelStatus === "Ready" ? "#22d3ee" : "#f59e0b" }}
                  >
                    {modelStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/30">Epoch</span>
                  <span className="text-xs font-mono text-white/50">{epoch}/100</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
                    animate={{ width: `${epoch}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              {/* Processing animation */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-xs"
                  >
                    ⚙️
                  </motion.div>
                  <span className="text-[10px] text-white/30">Processing Pipeline</span>
                </div>
                <div className="space-y-1.5">
                  {["Data Cleaning", "Feature Engineering", "Model Fitting", "Validation"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        animate={{
                          backgroundColor: epoch > i * 25 ? "#22d3ee" : "rgba(255,255,255,0.1)",
                        }}
                      />
                      <span className={`text-[10px] ${epoch > i * 25 ? "text-white/50" : "text-white/15"}`}>
                        {step}
                      </span>
                      {epoch > (i + 1) * 25 && <span className="text-[9px] text-green-400 ml-auto">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <h3 className="text-sm font-semibold text-white/70 mb-4">AI Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="glass-card p-4 flex items-start gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      rec.type === "alert" ? "rgba(239,68,68,0.1)" :
                      rec.type === "success" ? "rgba(34,211,238,0.1)" :
                      rec.type === "warning" ? "rgba(245,158,11,0.1)" :
                      "rgba(168,85,247,0.1)",
                    border: `1px solid ${
                      rec.type === "alert" ? "rgba(239,68,68,0.2)" :
                      rec.type === "success" ? "rgba(34,211,238,0.2)" :
                      rec.type === "warning" ? "rgba(245,158,11,0.2)" :
                      "rgba(168,85,247,0.2)"
                    }`,
                  }}
                >
                  {rec.type === "alert" ? "⚠️" : rec.type === "success" ? "✅" : rec.type === "warning" ? "📋" : "💡"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80">{rec.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">{rec.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-[#00d4ff]/60 flex-shrink-0">{rec.confidence}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
