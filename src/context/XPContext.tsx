"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

interface XPState {
  xp: number;
  level: number;
  completedModules: string[];
  achievements: Achievement[];
}

interface XPContextType extends XPState {
  addXP: (amount: number, source?: string) => void;
  completeModule: (moduleId: string) => void;
  unlockAchievement: (achievement: Achievement) => void;
  progressPercent: number;
  showXPToast: boolean;
  lastXPGain: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_analysis", title: "Data Detective", description: "Completed your first analysis", icon: "🔍" },
  { id: "stat_master", title: "Stat Master", description: "Explored descriptive statistics", icon: "📊" },
  { id: "correlator", title: "Correlator", description: "Found a strong correlation", icon: "📈" },
  { id: "probability_pro", title: "Probability Pro", description: "Ran 50+ probability simulations", icon: "🎲" },
  { id: "ai_explorer", title: "AI Explorer", description: "Visited the AI Dashboard", icon: "🤖" },
  { id: "futurist", title: "Futurist", description: "Explored the Future of Data Science", icon: "🚀" },
];

const XPContext = createContext<XPContextType | undefined>(undefined);

export function XPProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<XPState>({
    xp: 0,
    level: 1,
    completedModules: [],
    achievements: [],
  });
  const [showXPToast, setShowXPToast] = useState(false);
  const [lastXPGain, setLastXPGain] = useState(0);

  const addXP = useCallback((amount: number) => {
    setLastXPGain(amount);
    setShowXPToast(true);
    setTimeout(() => setShowXPToast(false), 2000);

    setState((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    setState((prev) => {
      if (prev.completedModules.includes(moduleId)) return prev;
      return { ...prev, completedModules: [...prev.completedModules, moduleId] };
    });
  }, []);

  const unlockAchievement = useCallback((achievement: Achievement) => {
    setState((prev) => {
      if (prev.achievements.find((a) => a.id === achievement.id)) return prev;
      return {
        ...prev,
        achievements: [...prev.achievements, { ...achievement, unlockedAt: Date.now() }],
      };
    });
  }, []);

  const totalModules = 6;
  const progressPercent = Math.min(100, (state.completedModules.length / totalModules) * 100);

  return (
    <XPContext.Provider
      value={{ ...state, addXP, completeModule, unlockAchievement, progressPercent, showXPToast, lastXPGain }}
    >
      {children}
    </XPContext.Provider>
  );
}

export function useXP() {
  const context = useContext(XPContext);
  if (!context) throw new Error("useXP must be used within XPProvider");
  return context;
}

export { ACHIEVEMENTS };
