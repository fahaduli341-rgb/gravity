import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gravityAudio } from '../utils/audio.ts';

interface IntroSplashProps {
  onComplete: () => void;
  ownerName?: string;
  roleTitle?: string;
  customPortraitImage?: string;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({
  onComplete,
  ownerName = 'FAHAD',
  customPortraitImage,
}) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [paletteIndex, setPaletteIndex] = useState(0);

  // Artistic color palettes inspired by editorial design (defaults to picture's exact pink)
  const palettes = [
    { bg: '#f46c87', face: '#8c1630', label: 'Coral Rose' },
    { bg: '#a855f7', face: '#3b0764', label: 'Cyber Violet' },
    { bg: '#3b82f6', face: '#172554', label: 'Electric Blue' },
    { bg: '#10b981', face: '#022c22', label: 'Emerald Mint' },
  ];

  const currentPalette = palettes[paletteIndex];

  // Derive Left & Right text tokens ("FA" and "HAD" like "PAMI" and "DOR")
  const cleanName = ownerName.trim().toUpperCase();
  let leftText = 'FA';
  let rightText = 'HAD';

  if (cleanName.includes('FAHAD')) {
    leftText = 'FA';
    rightText = 'HAD';
  } else {
    const mid = Math.ceil(cleanName.length / 2);
    leftText = cleanName.slice(0, mid);
    rightText = cleanName.slice(mid);
  }

  const handleEnter = () => {
    if (isExpanding) return;
    gravityAudio.playOrbTone(480, 0.7);
    setIsExpanding(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  // Automatic smooth transition after 2.4 seconds
  useEffect(() => {
    const autoEnterTimer = setTimeout(() => {
      handleEnter();
    }, 2400);

    return () => clearTimeout(autoEnterTimer);
  }, []);

  const cyclePalette = (e: React.MouseEvent) => {
    e.stopPropagation();
    gravityAudio.playMiniTone();
    setPaletteIndex((prev) => (prev + 1) % palettes.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="editorial-intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.05,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        }}
        onClick={handleEnter}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f4f2ec] text-[#111111] overflow-hidden select-none cursor-pointer"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Subtle Fine Art Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #1a1a1a 0.8px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        {/* CENTERPIECE ONLY: EXACT CLEAN MINIMAL ICONIC LOCKUP */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4">
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 tracking-tight">
            
            {/* Left Word ("FA" like "PAMI") */}
            <motion.span
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-black tracking-normal uppercase"
              style={{ letterSpacing: '0.04em' }}
            >
              {leftText}
            </motion.span>

            {/* Central Colored Square with Stylized Portrait (Exact match to uploaded picture) */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{
                scale: isExpanding ? 38 : 1,
                rotate: isExpanding ? 0 : 0,
              }}
              transition={{
                duration: isExpanding ? 0.85 : 0.65,
                ease: isExpanding ? [0.65, 0, 0.35, 1] : [0.34, 1.56, 0.64, 1],
              }}
              onClick={cyclePalette}
              title="Click to change color"
              className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-sm overflow-hidden flex items-center justify-center shadow-lg cursor-pointer shrink-0 transition-colors duration-300"
              style={{ backgroundColor: currentPalette.bg }}
            >
              {customPortraitImage ? (
                /* User's uploaded custom portrait with editorial duotone styling */
                <img
                  src={customPortraitImage}
                  alt={ownerName}
                  className="w-full h-full object-cover mix-blend-multiply filter contrast-125 saturate-150"
                />
              ) : (
                /* Stylized Vector Face with Sunglasses & Artistic Texture matching user's photo */
                <svg
                  viewBox="0 0 100 100"
                  className="w-[82%] h-[82%] transition-transform duration-300 hover:scale-105"
                  style={{ fill: currentPalette.face }}
                >
                  {/* Hair / Headband Crown texture */}
                  <path d="M28 32 C 26 22, 34 14, 48 13 C 62 13, 72 20, 72 32 C 76 27, 80 34, 76 40 C 78 48, 72 52, 68 52 C 67 48, 67 40, 68 34 C 64 24, 36 24, 32 34 C 32 40, 33 46, 31 52 C 27 50, 24 44, 25 38 C 24 35, 27 33, 28 32 Z" />
                  
                  {/* Headband / Banner text detail */}
                  <rect x="30" y="27" width="40" height="6" rx="1.5" opacity="0.3" />
                  <line x1="33" y1="30" x2="67" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />

                  {/* Face Base */}
                  <path d="M32 38 C 32 32, 68 32, 68 38 C 68 56, 64 68, 50 71 C 36 68, 32 56, 32 38 Z" />

                  {/* Iconic Sunglasses */}
                  <rect x="34" y="42" width="13" height="9" rx="2" fill="#ffffff" />
                  <rect x="53" y="42" width="13" height="9" rx="2" fill="#ffffff" />
                  <line x1="47" y1="45" x2="53" y2="45" stroke="#ffffff" strokeWidth="2.5" />
                  <line x1="36" y1="44" x2="44" y2="49" stroke={currentPalette.face} strokeWidth="1" />
                  <line x1="55" y1="44" x2="63" y2="49" stroke={currentPalette.face} strokeWidth="1" />

                  {/* Nose */}
                  <path d="M48 50 L48 56 L52 56" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

                  {/* Distinctive Moustache & Beard */}
                  <path d="M37 60 C 42 58, 47 62, 50 62 C 53 62, 58 58, 63 60 C 60 66, 40 66, 37 60 Z" fill="#ffffff" />
                  <path d="M45 66 C 48 68, 52 68, 55 66 C 53 70, 47 70, 45 66 Z" fill="#ffffff" />

                  {/* Micro typographic dot */}
                  <circle cx="50" cy="77" r="1.5" fill="#ffffff" opacity="0.7" />
                </svg>
              )}

              {/* Shimmer light flare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
            </motion.div>

            {/* Right Word ("HAD" like "DOR") */}
            <motion.span
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-black tracking-normal uppercase"
              style={{ letterSpacing: '0.04em' }}
            >
              {rightText}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
