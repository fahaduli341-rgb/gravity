import React, { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SecretAdminTriggerProps {
  onTrigger: () => void;
}

export const SecretAdminTrigger: React.FC<SecretAdminTriggerProps> = ({ onTrigger }) => {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTriggerClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const nextCount = clickCount + 1;
    if (nextCount >= 3) {
      setClickCount(0);
      onTrigger();
    } else {
      setClickCount(nextCount);
      timerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2500);
    }
  };

  // Long press support for mobile
  const handleTouchStart = () => {
    pressTimerRef.current = setTimeout(() => {
      onTrigger();
    }, 1200);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
    handleTriggerClick(e);
  };

  // Keyboard shortcut as developer fallback (Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        onTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTrigger]);

  return (
    <>
      {/* Touch/click zone in the exact bottom right corner */}
      <div
        onClick={handleTriggerClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed bottom-0 right-0 w-20 h-20 z-40 cursor-pointer select-none flex items-end justify-end p-2 sm:p-3 opacity-40 hover:opacity-100 transition-opacity"
        title="Triple-click or Hold for Owner Admin Panel"
      >
        <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-lg">
          <Lock className="w-3 h-3" />
        </div>
      </div>

      {/* Discrete feedback banner when clicking */}
      <AnimatePresence>
        {clickCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-none flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/90 border border-purple-500/50 text-purple-200 text-xs font-mono shadow-2xl backdrop-blur-md"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Admin: {clickCount}/3 (Click {3 - clickCount} more times)</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
