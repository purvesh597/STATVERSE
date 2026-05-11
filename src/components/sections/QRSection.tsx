"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function QRSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

          {/* QR Code */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="glass-card neon-glow w-64 h-64 md:w-72 md:h-72 mx-auto flex items-center justify-center mb-8 p-4"
          >
            <Image
              src="/statverse-qr.png"
              alt="Scan to visit statverse.vercel.app"
              width={280}
              height={280}
              className="rounded-lg"
              priority
            />
          </motion.div>

          <p className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>
            Point your camera to open{" "}
            <a
              href="https://statverse.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}
              className="hover:underline"
            >
              statverse.vercel.app
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
