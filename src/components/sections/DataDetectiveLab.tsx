"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/context/XPContext";
import { ACHIEVEMENTS } from "@/context/XPContext";

const datasets = [
  {
    id: "netflix",
    title: "Netflix Watch Data",
    icon: "🎬",
    description: "Analyze viewer patterns across genres",
    data: [
      { label: "Action", value: 340, color: "#00d4ff" },
      { label: "Drama", value: 280, color: "#a855f7" },
      { label: "Comedy", value: 220, color: "#ec4899" },
      { label: "Sci-Fi", value: 190, color: "#22d3ee" },
      { label: "Horror", value: 120, color: "#f97316" },
      { label: "Romance", value: 160, color: "#f43f5e" },
    ],
    insight: "Action dominates with 340 hours — that's 26% of total watch time!",
    quiz: {
      question: "Which genre has the highest watch time?",
      options: ["Drama", "Action", "Comedy", "Sci-Fi"],
      answer: 1,
    },
  },
  {
    id: "cricket",
    title: "Cricket Performance",
    icon: "🏏",
    description: "Player stats across T20 matches",
    data: [
      { label: "Kohli", value: 89, color: "#00d4ff" },
      { label: "Rohit", value: 76, color: "#a855f7" },
      { label: "Dhoni", value: 62, color: "#ec4899" },
      { label: "Hardik", value: 55, color: "#22d3ee" },
      { label: "Bumrah", value: 45, color: "#f97316" },
      { label: "Jadeja", value: 51, color: "#f43f5e" },
    ],
    insight: "Kohli leads with an avg of 89 — 17% higher than the next best!",
    quiz: {
      question: "Who has the lowest average?",
      options: ["Dhoni", "Jadeja", "Bumrah", "Hardik"],
      answer: 2,
    },
  },
  {
    id: "students",
    title: "Student Marks",
    icon: "📚",
    description: "Performance across subjects",
    data: [
      { label: "Math", value: 78, color: "#00d4ff" },
      { label: "Science", value: 82, color: "#a855f7" },
      { label: "English", value: 91, color: "#ec4899" },
      { label: "History", value: 65, color: "#22d3ee" },
      { label: "CS", value: 95, color: "#f97316" },
      { label: "Art", value: 73, color: "#f43f5e" },
    ],
    insight: "CS tops at 95 marks — History needs 46% more effort to catch up!",
    quiz: {
      question: "Which subject scored highest?",
      options: ["English", "Math", "CS", "Science"],
      answer: 2,
    },
  },
];

export default function DataDetectiveLab() {
  const [activeDataset, setActiveDataset] = useState(0);
  const [analyzed, setAnalyzed] = useState<boolean[]>([false, false, false]);
  const [quizAnswered, setQuizAnswered] = useState<boolean[]>([false, false, false]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const { addXP, completeModule, unlockAchievement } = useXP();

  const current = datasets[activeDataset];
  const maxVal = Math.max(...current.data.map((d) => d.value));

  const handleAnalyze = () => {
    if (!analyzed[activeDataset]) {
      const newAnalyzed = [...analyzed];
      newAnalyzed[activeDataset] = true;
      setAnalyzed(newAnalyzed);
      addXP(15);
    }
    setShowInsight(true);
  };

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizAnswered[activeDataset]) return;
    setSelectedAnswer(optionIndex);

    if (optionIndex === current.quiz.answer) {
      const newQuiz = [...quizAnswered];
      newQuiz[activeDataset] = true;
      setQuizAnswered(newQuiz);
      addXP(25);

      if (newQuiz.every(Boolean)) {
        completeModule("detective");
        unlockAchievement(ACHIEVEMENTS[0]);
      }
    }
  };

  return (
    <section id="detective" className="relative py-20 md:py-32">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="xp-badge">🔍 +15 XP per analysis</div>
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Data Detective</span> Lab
          </h2>
          <p className="section-subtitle">
            Analyze real datasets. Find hidden patterns. Answer quiz challenges.
          </p>
        </motion.div>

        {/* Dataset Selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {datasets.map((ds, i) => (
            <button
              key={ds.id}
              onClick={() => {
                setActiveDataset(i);
                setShowInsight(false);
                setSelectedAnswer(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeDataset === i
                  ? "bg-white/[0.08] border border-white/[0.12] text-white"
                  : "bg-white/[0.02] border border-white/[0.06] text-white/40 hover:text-white/60"
              }`}
            >
              <span>{ds.icon}</span>
              <span>{ds.title}</span>
              {analyzed[i] && <span className="text-[10px] text-green-400">✓</span>}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <motion.div
            layout
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white/90">{current.title}</h3>
                <p className="text-xs text-white/30 mt-1">{current.description}</p>
              </div>
              <button onClick={handleAnalyze} className="btn-primary text-xs !px-4 !py-2">
                {analyzed[activeDataset] ? "Re-analyze" : "Analyze"} ⚡
              </button>
            </div>

            {/* Bar Chart */}
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                {current.data.map((item, i) => (
                  <motion.div
                    key={`${current.id}-${item.label}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xs text-white/40 w-16 text-right font-mono">
                      {item.label}
                    </span>
                    <div className="flex-1 h-7 bg-white/[0.03] rounded-lg overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / maxVal) * 100}%` }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-lg relative"
                        style={{
                          background: `linear-gradient(90deg, ${item.color}20, ${item.color}40)`,
                          borderRight: `2px solid ${item.color}`,
                        }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/40">
                        {item.value}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Insight */}
            <AnimatePresence>
              {showInsight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 rounded-xl bg-[#00d4ff]/[0.05] border border-[#00d4ff]/[0.15]"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm">💡</span>
                    <p className="text-sm text-[#00d4ff]/80">{current.insight}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quiz */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg">🧠</span>
              <h3 className="text-lg font-semibold text-white/90">Quick Challenge</h3>
              <div className="xp-badge ml-auto">+25 XP</div>
            </div>

            <p className="text-sm text-white/60 mb-6">{current.quiz.question}</p>

            <div className="space-y-2">
              {current.quiz.options.map((option, i) => {
                const isCorrect = i === current.quiz.answer;
                const isSelected = selectedAnswer === i;
                const isAnswered = quizAnswered[activeDataset];

                return (
                  <button
                    key={option}
                    onClick={() => handleQuizAnswer(i)}
                    disabled={isAnswered}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 border ${
                      isAnswered && isCorrect
                        ? "bg-green-500/[0.08] border-green-500/30 text-green-400"
                        : isSelected && !isCorrect
                        ? "bg-red-500/[0.08] border-red-500/30 text-red-400"
                        : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:bg-white/[0.04] hover:border-white/[0.12]"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-white/20 mr-3">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                    {isAnswered && isCorrect && <span className="float-right">✓</span>}
                    {isSelected && !isCorrect && <span className="float-right">✗</span>}
                  </button>
                );
              })}
            </div>

            {quizAnswered[activeDataset] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl bg-green-500/[0.06] border border-green-500/20"
              >
                <p className="text-xs text-green-400/80">
                  🎉 Correct! You earned 25 XP
                </p>
              </motion.div>
            )}

            {/* Progress */}
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/30">Datasets Analyzed</span>
                <span className="text-xs font-mono text-white/40">
                  {analyzed.filter(Boolean).length}/3
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
                  animate={{ width: `${(analyzed.filter(Boolean).length / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
