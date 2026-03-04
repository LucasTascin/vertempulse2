import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-vertem-primary/50"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        initial={false}
        animate={{
          x: isDark ? 28 : 4,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon size={14} className="text-vertem-primary" />
        ) : (
          <Sun size={14} className="text-yellow-500" />
        )}
      </motion.div>
    </button>
  );
};
