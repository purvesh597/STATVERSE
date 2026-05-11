"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">S</span>
            </div>
            <span className="text-sm font-semibold text-white/60">STATVERSE</span>
          </div>

          <p className="text-xs text-white/20 text-center">
            Statistical Techniques in Data Analysis & Computing — Interactive Virtual Lab
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-white/15"
          >
            Built with Next.js, Framer Motion & Recharts
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
