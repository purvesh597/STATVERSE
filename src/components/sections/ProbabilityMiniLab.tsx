"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/context/XPContext";
import { ACHIEVEMENTS } from "@/context/XPContext";
import { useTheme } from "@/context/ThemeContext";

export default function ProbabilityMiniLab() {
  const [coinResults, setCoinResults] = useState<string[]>([]);
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [totalSims, setTotalSims] = useState(0);
  const { addXP, completeModule, unlockAchievement } = useXP();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const coinHeads = coinResults.filter((r) => r === "H").length;
  const coinTails = coinResults.filter((r) => r === "T").length;
  const diceFreq = Array.from({ length: 6 }, (_, i) => diceResults.filter((r) => r === i + 1).length);

  useEffect(() => {
    if (totalSims >= 50) { completeModule("probability"); unlockAchievement(ACHIEVEMENTS[3]); }
  }, [totalSims, completeModule, unlockAchievement]);

  const flipCoin = useCallback(() => {
    setIsFlipping(true);
    setTimeout(() => {
      const result = Math.random() > 0.5 ? "H" : "T";
      setCoinResults((p) => [...p, result]); setTotalSims((p) => p + 1); setIsFlipping(false);
      if (coinResults.length % 10 === 9) addXP(5);
    }, 400);
  }, [coinResults.length, addXP]);

  const flipMany = useCallback((count: number) => {
    const r = Array.from({ length: count }, () => (Math.random() > 0.5 ? "H" : "T"));
    setCoinResults((p) => [...p, ...r]); setTotalSims((p) => p + count); addXP(10);
  }, [addXP]);

  const rollDice = useCallback(() => {
    setIsRolling(true);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResults((p) => [...p, result]); setTotalSims((p) => p + 1); setIsRolling(false);
      if (diceResults.length % 10 === 9) addXP(5);
    }, 400);
  }, [diceResults.length, addXP]);

  const rollMany = useCallback((count: number) => {
    const r = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
    setDiceResults((p) => [...p, ...r]); setTotalSims((p) => p + count); addXP(10);
  }, [addXP]);

  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  const hColor = isDark ? "#00d4ff" : "#111";
  const tColor = isDark ? "#a855f7" : "#555";
  const btn2 = { color: isDark ? "#a855f7" : "#444", borderColor: isDark ? "rgba(168,85,247,0.3)" : "rgba(0,0,0,0.12)" };
  const btn3 = { color: isDark ? "#ec4899" : "#666", borderColor: isDark ? "rgba(236,72,153,0.3)" : "rgba(0,0,0,0.12)" };

  const coinBg = (last: string) => last === "H"
    ? (isDark ? "rgba(0,212,255,0.1)" : "rgba(0,0,0,0.04)")
    : (isDark ? "rgba(168,85,247,0.1)" : "rgba(0,0,0,0.06)");
  const coinBorder = (last: string) => last === "H"
    ? (isDark ? "rgba(0,212,255,0.3)" : "rgba(0,0,0,0.15)")
    : (isDark ? "rgba(168,85,247,0.3)" : "rgba(0,0,0,0.2)");

  return (
    <section id="probability" className="relative py-20 md:py-32">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
          <div className="xp-badge mb-4">🎲 +5 XP per 10 sims</div>
          <h2 className="section-title"><span className="gradient-text">Probability</span> Mini Lab</h2>
          <p className="section-subtitle">Run coin tosses and dice rolls. Watch probability converge to theory with more trials.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coin Toss */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-secondary)" }}>🪙 Coin Toss</h3>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{coinResults.length} flips</span>
            </div>
            <div className="flex justify-center mb-6">
              <motion.div animate={isFlipping ? { rotateY: [0, 720] } : {}} transition={{ duration: 0.4 }}
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl border-2"
                style={{ background: coinResults.length === 0 ? "var(--card-bg)" : coinBg(coinResults[coinResults.length - 1]), borderColor: coinResults.length === 0 ? "var(--card-border)" : coinBorder(coinResults[coinResults.length - 1]), color: "var(--text-primary)" }}>
                {coinResults.length === 0 ? "?" : coinResults[coinResults.length - 1]}
              </motion.div>
            </div>
            <div className="flex gap-2 mb-6">
              <button onClick={flipCoin} disabled={isFlipping} className="btn-primary flex-1 text-xs !py-2.5">Flip 1x</button>
              <button onClick={() => flipMany(10)} className="btn-primary flex-1 text-xs !py-2.5" style={btn2}>Flip 10x</button>
              <button onClick={() => flipMany(100)} className="btn-primary flex-1 text-xs !py-2.5" style={btn3}>Flip 100x</button>
            </div>
            {coinResults.length > 0 && (
              <div className="space-y-3">
                {[{ label: "Heads", count: coinHeads, color: hColor, barBg: isDark ? "rgba(0,212,255,0.2)" : "rgba(0,0,0,0.1)" },
                  { label: "Tails", count: coinTails, color: tColor, barBg: isDark ? "rgba(168,85,247,0.2)" : "rgba(0,0,0,0.15)" }].map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="text-xs w-12" style={{ color: "var(--text-muted)" }}>{r.label}</span>
                    <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: "var(--progress-bg)" }}>
                      <motion.div className="h-full rounded-lg" style={{ background: r.barBg }} animate={{ width: `${(r.count / coinResults.length) * 100}%` }} transition={{ duration: 0.3 }} />
                    </div>
                    <span className="text-xs font-mono w-16 text-right" style={{ color: r.color }}>{((r.count / coinResults.length) * 100).toFixed(1)}%</span>
                  </div>
                ))}
                <p className="text-[10px] mt-2" style={{ color: "var(--text-faint)" }}>Expected: 50% each · Deviation: {Math.abs(50 - (coinHeads / coinResults.length) * 100).toFixed(1)}%</p>
              </div>
            )}
            <button onClick={() => setCoinResults([])} className="text-[10px] mt-4 transition-colors" style={{ color: "var(--text-faint)" }}>Reset</button>
          </motion.div>

          {/* Dice Roll */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-secondary)" }}>🎲 Dice Roll</h3>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{diceResults.length} rolls</span>
            </div>
            <div className="flex justify-center mb-6">
              <AnimatePresence mode="wait">
                <motion.div key={diceResults.length} initial={{ scale: 0.8, rotateZ: -30 }} animate={{ scale: 1, rotateZ: 0 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-2"
                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}>
                  {diceResults.length === 0 ? "?" : diceFaces[diceResults[diceResults.length - 1] - 1]}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex gap-2 mb-6">
              <button onClick={rollDice} disabled={isRolling} className="btn-primary flex-1 text-xs !py-2.5">Roll 1x</button>
              <button onClick={() => rollMany(10)} className="btn-primary flex-1 text-xs !py-2.5" style={btn2}>Roll 10x</button>
              <button onClick={() => rollMany(100)} className="btn-primary flex-1 text-xs !py-2.5" style={btn3}>Roll 100x</button>
            </div>
            {diceResults.length > 0 && (
              <div className="space-y-2">
                {diceFreq.map((freq, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm w-6 text-center">{diceFaces[i]}</span>
                    <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: "var(--progress-bg)" }}>
                      <motion.div className="h-full rounded-lg" animate={{ width: `${(freq / diceResults.length) * 100}%` }} transition={{ duration: 0.3 }}
                        style={{ background: isDark ? `rgba(${i * 30 + 100}, ${140 - i * 15}, 255, 0.25)` : `rgba(0,0,0,${0.08 + i * 0.03})` }} />
                    </div>
                    <span className="text-[10px] font-mono w-12 text-right" style={{ color: "var(--text-muted)" }}>{((freq / diceResults.length) * 100).toFixed(1)}%</span>
                  </div>
                ))}
                <p className="text-[10px] mt-2" style={{ color: "var(--text-faint)" }}>Expected: 16.7% each</p>
              </div>
            )}
            <button onClick={() => setDiceResults([])} className="text-[10px] mt-4 transition-colors" style={{ color: "var(--text-faint)" }}>Reset</button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6 text-center">
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>
            Total Simulations: <span className="font-mono" style={{ color: "var(--text-muted)" }}>{totalSims}</span>
            {totalSims >= 50 && <span className="ml-2" style={{ color: "var(--success-text)" }}>🏆 Achievement Unlocked!</span>}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
