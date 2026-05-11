"use client";

import { motion } from "framer-motion";

export default function QRSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title mx-auto mb-2">
            Scan to Experience <span className="gradient-text">STATVERSE</span>
          </h2>
          <p className="section-subtitle mx-auto text-center mb-10">
            Open this interactive lab on your device
          </p>

          {/* QR Placeholder */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card neon-glow w-56 h-56 mx-auto flex items-center justify-center mb-8"
          >
            <div className="relative w-40 h-40">
              {/* QR pattern placeholder */}
              <div className="absolute inset-0 grid grid-cols-7 grid-rows-7 gap-0.5">
                {Array.from({ length: 49 }, (_, i) => {
                  // Create a QR-like pattern
                  const row = Math.floor(i / 7);
                  const col = i % 7;
                  const isCorner =
                    (row < 3 && col < 3) ||
                    (row < 3 && col > 3) ||
                    (row > 3 && col < 3);
                  const isInner =
                    (row === 1 && col === 1) ||
                    (row === 1 && col === 5) ||
                    (row === 5 && col === 1);
                  const isRandom = Math.random() > 0.5;

                  return (
                    <div
                      key={i}
                      className="rounded-sm"
                      style={{
                        background: isInner
                          ? "#00d4ff"
                          : isCorner
                          ? "rgba(168, 85, 247, 0.5)"
                          : isRandom
                          ? "rgba(255,255,255,0.15)"
                          : "transparent",
                      }}
                    />
                  );
                })}
              </div>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center">
                  <span className="text-xs font-bold text-white">S</span>
                </div>
              </div>
            </div>
          </motion.div>

          <p className="text-xs text-white/20">
            Replace this placeholder with your actual deployment QR code
          </p>
        </motion.div>
      </div>
    </section>
  );
}
