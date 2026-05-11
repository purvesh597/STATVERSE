"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPContext";
import { ACHIEVEMENTS } from "@/context/XPContext";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, Cell,
} from "recharts";

function generateData(studyHours: number, sleep: number, practice: number) {
  const points = [];
  for (let i = 0; i < 30; i++) {
    const sh = studyHours + (Math.random() - 0.5) * 4;
    const sl = sleep + (Math.random() - 0.5) * 3;
    const pr = practice + (Math.random() - 0.5) * 3;
    const marks = Math.min(
      100,
      Math.max(0, sh * 6 + sl * 3 + pr * 4 - 20 + (Math.random() - 0.5) * 15)
    );
    points.push({
      studyHours: +sh.toFixed(1),
      sleep: +sl.toFixed(1),
      practice: +pr.toFixed(1),
      marks: +marks.toFixed(0),
    });
  }
  return points;
}

function calcCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0);
  const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
  const sumY2 = y.reduce((s, yi) => s + yi * yi, 0);
  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
  return den === 0 ? 0 : +(num / den).toFixed(3);
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { studyHours: number; marks: number } }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#161625] border border-white/10 rounded-lg px-3 py-2 text-xs space-y-1">
      <div className="text-white/50">Study: <span className="text-white font-mono">{d.studyHours}h</span></div>
      <div className="text-white/50">Marks: <span className="text-white font-mono">{d.marks}</span></div>
    </div>
  );
};

export default function CorrelationSimulator() {
  const [studyHours, setStudyHours] = useState(6);
  const [sleep, setSleep] = useState(7);
  const [practice, setPractice] = useState(4);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { addXP, completeModule, unlockAchievement } = useXP();

  const data = useMemo(() => generateData(studyHours, sleep, practice), [studyHours, sleep, practice]);

  const predicted = useMemo(
    () => Math.min(100, Math.max(0, Math.round(studyHours * 6 + sleep * 3 + practice * 4 - 20))),
    [studyHours, sleep, practice]
  );

  const correlation = useMemo(
    () => calcCorrelation(data.map((d) => d.studyHours), data.map((d) => d.marks)),
    [data]
  );

  const corrType = correlation > 0.5 ? "Strong Positive" : correlation > 0.2 ? "Weak Positive" : correlation > -0.2 ? "No Correlation" : correlation > -0.5 ? "Weak Negative" : "Strong Negative";
  const corrColor = correlation > 0.3 ? "#22d3ee" : correlation > -0.3 ? "#f59e0b" : "#f43f5e";

  const handleInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      addXP(20);
      completeModule("correlation");
      unlockAchievement(ACHIEVEMENTS[2]);
    }
  }, [hasInteracted, addXP, completeModule, unlockAchievement]);

  const sliders = [
    { label: "Study Hours", value: studyHours, setter: setStudyHours, min: 1, max: 12, color: "#00d4ff", icon: "📖" },
    { label: "Sleep Hours", value: sleep, setter: setSleep, min: 3, max: 12, color: "#a855f7", icon: "😴" },
    { label: "Practice Time", value: practice, setter: setPractice, min: 0, max: 8, color: "#ec4899", icon: "✏️" },
  ];

  return (
    <section id="correlation" className="relative py-20 md:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="xp-badge mb-4">📈 +20 XP</div>
          <h2 className="section-title">
            <span className="gradient-text">Correlation</span> Simulator
          </h2>
          <p className="section-subtitle">
            Adjust variables and watch how they affect predicted marks. Can you achieve the highest score?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 space-y-6"
          >
            <h3 className="text-sm font-semibold text-white/70">Adjust Variables</h3>

            {sliders.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40">{s.icon} {s.label}</span>
                  <span className="text-sm font-mono" style={{ color: s.color }}>{s.value}h</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={0.5}
                  value={s.value}
                  onChange={(e) => {
                    s.setter(Number(e.target.value));
                    handleInteraction();
                  }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${s.color} ${((s.value - s.min) / (s.max - s.min)) * 100}%, rgba(255,255,255,0.06) ${((s.value - s.min) / (s.max - s.min)) * 100}%)`,
                  }}
                />
              </div>
            ))}

            {/* Predicted Marks */}
            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-white/30 mb-2">Predicted Marks</p>
              <div className="flex items-end gap-2">
                <motion.span
                  key={predicted}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold"
                  style={{ color: predicted > 80 ? "#22d3ee" : predicted > 60 ? "#f59e0b" : "#f43f5e" }}
                >
                  {predicted}
                </motion.span>
                <span className="text-sm text-white/30 mb-1">/100</span>
              </div>
              <div className="w-full h-2 bg-white/[0.04] rounded-full mt-3 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${predicted}%` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `linear-gradient(to right, ${predicted > 80 ? "#22d3ee" : predicted > 60 ? "#f59e0b" : "#f43f5e"}, transparent)`,
                  }}
                />
              </div>
              {predicted >= 90 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-green-400 mt-2"
                >
                  🏆 Outstanding! You&apos;ve maximized performance!
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Scatter Plot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/70">Study Hours vs Marks</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">r = </span>
                <span className="text-sm font-mono font-bold" style={{ color: corrColor }}>
                  {correlation}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full border"
                  style={{ borderColor: corrColor + "40", color: corrColor, background: corrColor + "10" }}
                >
                  {corrType}
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.03)"
                />
                <XAxis
                  dataKey="studyHours"
                  name="Study Hours"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                  label={{ value: "Study Hours", position: "insideBottom", offset: -5, style: { fill: "rgba(255,255,255,0.2)", fontSize: 10 } }}
                />
                <YAxis
                  dataKey="marks"
                  name="Marks"
                  domain={[0, 100]}
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "Marks", angle: -90, position: "insideLeft", offset: 10, style: { fill: "rgba(255,255,255,0.2)", fontSize: 10 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={predicted} stroke="#00d4ff" strokeDasharray="4 4" strokeWidth={1} />
                <Scatter data={data} fill="#a855f7" opacity={0.7}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={`rgba(168, 85, 247, ${0.4 + Math.random() * 0.4})`} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
                <span className="text-[10px] text-white/30">Data Points</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#00d4ff]" style={{ borderBottom: "1px dashed #00d4ff" }} />
                <span className="text-[10px] text-white/30">Predicted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
