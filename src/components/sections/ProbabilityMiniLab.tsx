"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/context/XPContext";
import { ACHIEVEMENTS } from "@/context/XPContext";

export default function ProbabilityMiniLab() {
  const [coinResults, setCoinResults] = useState<string[]>([]);
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [totalSims, setTotalSims] = useState(0);
  const { addXP, completeModule, unlockAchievement } = useXP();

  const coinHeads = coinResults.filter((r) => r === "H").length;
  const coinTails = coinResults.filter((r) => r === "T").length;

  const diceFreq = Array.from({ length: 6 }, (_, i) => diceResults.filter((r) => r === i + 1).length);

  useEffect(() => {
    if (totalSims >= 50) {
      completeModule("probability");
      unlockAchievement(ACHIEVEMENTS[3]);
    }
  }, [totalSims, completeModule, unlockAchievement]);

  const flipCoin = useCallback(() => {
    setIsFlipping(true);
    setTimeout(() => {
      const result = Math.random() > 0.5 ? "H" : "T";
      setCoinResults((prev) => [...prev, result]);
      setTotalSims((prev) => prev + 1);
      setIsFlipping(false);
      if (coinResults.length % 10 === 9) addXP(5);
    }, 400);
  }, [coinResults.length, addXP]);

  const flipMany = useCallback(
    (count: number) => {
      const results = Array.from({ length: count }, () => (Math.random() > 0.5 ? "H" : "T"));
      setCoinResults((prev) => [...prev, ...results]);
      setTotalSims((prev) => prev + count);
      addXP(10);
    },
    [addXP]
  );

  const rollDice = useCallback(() => {
    setIsRolling(true);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResults((prev) => [...prev, result]);
      setTotalSims((prev) => prev + 1);
      setIsRolling(false);
      if (diceResults.length % 10 === 9) addXP(5);
    }, 400);
  }, [diceResults.length, addXP]);

  const rollMany = useCallback(
    (count: number) => {
      const results = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
      setDiceResults((prev) => [...prev, ...results]);
      setTotalSims((prev) => prev + count);
      addXP(10);
    },
    [addXP]
  );

  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  return (
    <section id="probability" className="relative py-20 md:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="xp-badge mb-4">🎲 +5 XP per 10 sims</div>
          <h2 className="section-title">
            <span className="gradient-text">Probability</span> Mini Lab
          </h2>
          <p className="section-subtitle">
            Run coin tosses and dice rolls. Watch probability converge to theory with more trials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coin Toss */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white/90">🪙 Coin Toss</h3>
              <span className="text-xs text-white/30 font-mono">{coinResults.length} flips</span>
            </div>

            {/* Coin visual */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={isFlipping ? { rotateY: [0, 720] } : {}}
                transition={{ duration: 0.4 }}
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl border-2"
                style={{
                  background: coinResults.length === 0 ? "rgba(255,255,255,0.04)" : coinResults[coinResults.length - 1] === "H" ? "rgba(0,212,255,0.1)" : "rgba(168,85,247,0.1)",
                  borderColor: coinResults.length === 0 ? "rgba(255,255,255,0.08)" : coinResults[coinResults.length - 1] === "H" ? "rgba(0,212,255,0.3)" : "rgba(168,85,247,0.3)",
                }}
              >
                {coinResults.length === 0 ? "?" : coinResults[coinResults.length - 1] === "H" ? "H" : "T"}
              </motion.div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mb-6">
              <button onClick={flipCoin} disabled={isFlipping} className="btn-primary flex-1 text-xs !py-2.5">
                Flip 1x
              </button>
              <button onClick={() => flipMany(10)} className="btn-primary flex-1 text-xs !py-2.5 !text-[#a855f7] !border-[#a855f7]/30">
                Flip 10x
              </button>
              <button onClick={() => flipMany(100)} className="btn-primary flex-1 text-xs !py-2.5 !text-[#ec4899] !border-[#ec4899]/30">
                Flip 100x
              </button>
            </div>

            {/* Results */}
            {coinResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30 w-12">Heads</span>
                  <div className="flex-1 h-6 bg-white/[0.03] rounded-lg overflow-hidden">
                    <motion.div
                      className="h-full rounded-lg bg-[#00d4ff]/20"
                      animate={{ width: `${coinResults.length > 0 ? (coinHeads / coinResults.length) * 100 : 50}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#00d4ff] w-16 text-right">
                    {coinResults.length > 0 ? ((coinHeads / coinResults.length) * 100).toFixed(1) : "50.0"}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30 w-12">Tails</span>
                  <div className="flex-1 h-6 bg-white/[0.03] rounded-lg overflow-hidden">
                    <motion.div
                      className="h-full rounded-lg bg-[#a855f7]/20"
                      animate={{ width: `${coinResults.length > 0 ? (coinTails / coinResults.length) * 100 : 50}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#a855f7] w-16 text-right">
                    {coinResults.length > 0 ? ((coinTails / coinResults.length) * 100).toFixed(1) : "50.0"}%
                  </span>
                </div>
                <p className="text-[10px] text-white/20 mt-2">
                  Expected: 50% each · Deviation: {Math.abs(50 - (coinHeads / coinResults.length) * 100).toFixed(1)}%
                </p>
              </div>
            )}

            <button
              onClick={() => setCoinResults([])}
              className="text-[10px] text-white/20 hover:text-white/40 mt-4 transition-colors"
            >
              Reset
            </button>
          </motion.div>

          {/* Dice Roll */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white/90">🎲 Dice Roll</h3>
              <span className="text-xs text-white/30 font-mono">{diceResults.length} rolls</span>
            </div>

            {/* Dice visual */}
            <div className="flex justify-center mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={diceResults.length}
                  initial={{ scale: 0.8, rotateZ: -30 }}
                  animate={{ scale: 1, rotateZ: 0 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-2 bg-white/[0.04] border-white/[0.08]"
                >
                  {diceResults.length === 0 ? "?" : diceFaces[diceResults[diceResults.length - 1] - 1]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mb-6">
              <button onClick={rollDice} disabled={isRolling} className="btn-primary flex-1 text-xs !py-2.5">
                Roll 1x
              </button>
              <button onClick={() => rollMany(10)} className="btn-primary flex-1 text-xs !py-2.5 !text-[#a855f7] !border-[#a855f7]/30">
                Roll 10x
              </button>
              <button onClick={() => rollMany(100)} className="btn-primary flex-1 text-xs !py-2.5 !text-[#ec4899] !border-[#ec4899]/30">
                Roll 100x
              </button>
            </div>

            {/* Frequency bars */}
            {diceResults.length > 0 && (
              <div className="space-y-2">
                {diceFreq.map((freq, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm w-6 text-center">{diceFaces[i]}</span>
                    <div className="flex-1 h-5 bg-white/[0.03] rounded-lg overflow-hidden">
                      <motion.div
                        className="h-full rounded-lg"
                        animate={{ width: `${diceResults.length > 0 ? (freq / diceResults.length) * 100 : 0}%` }}
                        transition={{ duration: 0.3 }}
                        style={{
                          background: `rgba(${i * 30 + 100}, ${140 - i * 15}, 255, 0.25)`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 w-12 text-right">
                      {diceResults.length > 0 ? ((freq / diceResults.length) * 100).toFixed(1) : "0.0"}%
                    </span>
                  </div>
                ))}
                <p className="text-[10px] text-white/20 mt-2">
                  Expected: 16.7% each
                </p>
              </div>
            )}

            <button
              onClick={() => setDiceResults([])}
              className="text-[10px] text-white/20 hover:text-white/40 mt-4 transition-colors"
            >
              Reset
            </button>
          </motion.div>
        </div>

        {/* Sims Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <span className="text-xs text-white/20">
            Total Simulations: <span className="font-mono text-white/40">{totalSims}</span>
            {totalSims >= 50 && <span className="text-green-400 ml-2">🏆 Achievement Unlocked!</span>}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
