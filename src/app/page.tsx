"use client";

import dynamic from "next/dynamic";
import { XPProvider, useXP } from "@/context/XPContext";
import Navbar from "@/components/Navbar";
import XPToast from "@/components/XPToast";
import Footer from "@/components/Footer";

// Dynamic imports for code splitting
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });
const HeroSection = dynamic(() => import("@/components/sections/HeroSection"));
const DataDetectiveLab = dynamic(() => import("@/components/sections/DataDetectiveLab"));
const DescriptiveStatsLab = dynamic(() => import("@/components/sections/DescriptiveStatsLab"));
const CorrelationSimulator = dynamic(() => import("@/components/sections/CorrelationSimulator"));
const ProbabilityMiniLab = dynamic(() => import("@/components/sections/ProbabilityMiniLab"));
const AIDashboard = dynamic(() => import("@/components/sections/AIDashboard"));
const FutureSection = dynamic(() => import("@/components/sections/FutureSection"));
const ProgressDashboard = dynamic(() => import("@/components/sections/ProgressDashboard"));
const QRSection = dynamic(() => import("@/components/sections/QRSection"));

function AppContent() {
  const { showXPToast, lastXPGain } = useXP();

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f] to-transparent opacity-50 pointer-events-none" />
          <DataDetectiveLab />
        </div>
        <DescriptiveStatsLab />
        <CorrelationSimulator />
        <ProbabilityMiniLab />
        <AIDashboard />
        <FutureSection />
        <ProgressDashboard />
        <QRSection />
      </main>
      <Footer />
      <XPToast show={showXPToast} amount={lastXPGain} />
    </>
  );
}

export default function Home() {
  return (
    <XPProvider>
      <AppContent />
    </XPProvider>
  );
}
