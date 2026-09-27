import React, { useState } from 'react';
import { Award, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AwwwardsBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating ribbon badge on the left edge as seen in screenshot */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        title="Awwwards Site of the Day Nominee"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center bg-white text-black px-2 py-3 rounded-r-md shadow-2xl transition-all duration-300 hover:pl-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 cursor-pointer"
        style={{ width: '38px' }}
      >
        <span className="font-bold text-base tracking-tighter leading-none mb-2">w.</span>
        <span
          className="text-[10px] uppercase font-semibold tracking-wider text-neutral-800"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Nominee
        </span>
      </button>

      {/* Awards Details Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-md w-full p-6 text-white shadow-2xl relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
                  w.
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Awwwards Nominee</h3>
                  <p className="text-xs text-neutral-400">Site of the Day · Mobile Excellence</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-neutral-300">
                <p>
                  Recognized for exceptional interaction design, physics-driven fluid animation, and typographic distinction.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
                    <div className="text-lg font-bold text-purple-400">8.4</div>
                    <div className="text-[11px] text-neutral-400">Design</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
                    <div className="text-lg font-bold text-purple-400">8.8</div>
                    <div className="text-[11px] text-neutral-400">Creativity</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
                    <div className="text-lg font-bold text-purple-400">8.6</div>
                    <div className="text-[11px] text-neutral-400">Usability</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
