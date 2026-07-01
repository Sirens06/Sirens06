'use client';

import { motion } from 'framer-motion';

export function DonationButton() {
  return (
    <motion.div className="fixed bottom-6 right-6 z-40" whileHover={{ scale: 1.05 }}>
      <a
        href="https://buymeacoffee.com/your-username"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold hover:shadow-lg transition"
      >
        ☕ Buy me a coffee
        <span className="text-sm opacity-80 hidden sm:inline">Help keep games free!</span>
      </a>
    </motion.div>
  );
}
