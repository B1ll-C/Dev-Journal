"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [stars, setStars] = useState<
    { x: number; y: number; opacity: number; scale: number }[]
  >([]);

  useEffect(() => {
    // Only runs in the browser
    const generatedStars = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      opacity: Math.random(),
      scale: Math.random() * 0.8 + 0.2,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-indigo-900 to-purple-950 text-center p-6 overflow-hidden relative">
      {/* Floating Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: star.x, top: star.y }}
            initial={{ opacity: star.opacity, scale: star.scale }}
            animate={{
              y: ["0%", "100%"],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-4"
      >
        Daily Dev Journal
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-indigo-200 mb-8 max-w-md"
      >
        Reflect. Learn. Build. Your personal cosmic space for coding thoughts
        and progress logs.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex gap-4"
      >
        <Link
          href="/login"
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
        >
          Start Logging
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          className="border border-indigo-400 text-indigo-300 px-6 py-2 rounded-xl hover:bg-indigo-900/40 transition-all"
        >
          View on GitHub
        </a>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-12 text-indigo-300 text-sm"
      >
        Built with Next.js • Supabase • TailwindCSS 🚀
      </motion.footer>
    </main>
  );
}
