"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPContext";
import { ACHIEVEMENTS } from "@/context/XPContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line,
} from "recharts";

function generateMarks(spread: number, noNoise: boolean = false): number[] {
  const base = [45, 52, 58, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 92, 95, 35, 60, 74, 90];
  return base.map((v) => {
    if (noNoise) return v;
    const noise = (Math.random() - 0.5) * spread * 2;
    return Math.max(0, Math.min(100, Math.round(v + noise)));
  });
}

function calcStats(data: number[]) {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

  const freq: Record<number, number> = {};
  data.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
  const maxFreq = Math.max(...Object.values(freq));
  const mode = Number(Object.keys(freq).find((k) => freq[Number(k)] === maxFreq));

  const variance = data.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  return { mean: +mean.toFixed(1), median, mode, stdDev: +stdDev.toFixed(1), sorted };
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { name: string } }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#161625] border border-white/10 rounded-lg px-3 py-2 text-xs">
      <span className="text-white/50">{payload[0].payload.name}: </span>
      <span className="text-white font-mono">{payload[0].value}</span>
    </div>
  );
};

export default function DescriptiveStatsLab() {
  const [spread, setSpread] = useState(10);
  const [isMounted, setIsMounted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { addXP, completeModule, unlockAchievement } = useXP();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const marks = useMemo(() => generateMarks(spread, !isMounted), [spread, isMounted]);
  const stats = useMemo(() => calcStats(marks), [marks]);

  // Distribution histogram
  const histogram = useMemo(() => {
    const bins = Array.from({ length: 10 }, (_, i) => ({
      name: `${i * 10}-${(i + 1) * 10}`,
      range: `${i * 10}`,
      count: 0,
    }));
    marks.forEach((m) => {
      const idx = Math.min(Math.floor(m / 10), 9);
      bins[idx].count++;
    });
    return bins;
  }, [marks]);

  // Line data for sorted marks
  const lineData = useMemo(
    () => stats.sorted.map((v, i) => ({ idx: i + 1, value: v })),
    [stats.sorted]
  );

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSpread(Number(e.target.value));
      if (!hasInteracted) {
        setHasInteracted(true);
        addXP(20);
        completeModule("statistics");
        unlockAchievement(ACHIEVEMENTS[1]);
      }
    },
    [hasInteracted, addXP, completeModule, unlockAchievement]
  );

  const statCards = [
    { label: "Mean", value: stats.mean, color: "#00d4ff", desc: "Average value" },
    { label: "Median", value: stats.median, color: "#a855f7", desc: "Middle value" },
    { label: "Mode", value: stats.mode, color: "#ec4899", desc: "Most frequent" },
    { label: "Std Dev", value: stats.stdDev, color: "#22d3ee", desc: "Spread measure" },
  ];

  return (
    <section id="statistics" className="relative py-20 md:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="xp-badge mb-4">📊 +20 XP</div>
          <h2 className="section-title">
            <span className="gradient-text">Descriptive Statistics</span> Lab
          </h2>
          <p className="section-subtitle">
            Drag the slider to reshape the data distribution and watch statistics update in real time.
          </p>
        </motion.div>

        {/* Slider Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/50">Data Spread</span>
            <span className="text-sm font-mono text-[#00d4ff]">{spread}</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={spread}
            onChange={handleSliderChange}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00d4ff ${(spread / 40) * 100}%, rgba(255,255,255,0.06) ${(spread / 40) * 100}%)`,
            }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-white/20">Clustered</span>
            <span className="text-[10px] text-white/20">Spread Out</span>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-5 text-center"
            >
              <p className="text-xs text-white/30 mb-1">{stat.desc}</p>
              <p className="stat-value !text-2xl md:!text-3xl" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-white/50 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Histogram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-white/70 mb-4">Distribution Histogram</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={histogram} barCategoryGap="15%">
                <XAxis
                  dataKey="range"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {histogram.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`rgba(0, 212, 255, ${0.15 + i * 0.07})`}
                      stroke="rgba(0, 212, 255, 0.3)"
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Sorted Line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-white/70 mb-4">Sorted Marks Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis
                  dataKey="idx"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#a855f7", stroke: "#a855f7" }}
                />
                {/* Mean line */}
                <Line
                  type="monotone"
                  dataKey={() => stats.mean}
                  stroke="#00d4ff"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Mean"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#a855f7] rounded" />
                <span className="text-[10px] text-white/30">Values</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#00d4ff] rounded" style={{ borderBottom: "1px dashed" }} />
                <span className="text-[10px] text-white/30">Mean ({stats.mean})</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
