import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { gravityAudio } from '../utils/audio.ts';

interface RippleWave {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const GravityCircles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<RippleWave[]>([]);

  // Smooth 3D perspective tilt reacting to cursor or finger movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 85, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(smoothX, [-300, 300], [-18, 18]);
  const rotateX = useTransform(smoothY, [-300, 300], [18, -18]);
  const lightShiftX = useTransform(smoothX, [-300, 300], [-25, 25]);
  const lightShiftY = useTransform(smoothY, [-300, 300], [-25, 25]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    const handlePointerLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      handlePointerLeave();
    };
  }, [mouseX, mouseY]);

  // Trigger quantum gravitational shockwaves
  const triggerRipple = (e: React.MouseEvent, color: string, toneFn: () => void) => {
    toneFn();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1400);
  };

  return (
    <div className="relative flex items-center justify-center pointer-events-auto select-none perspective-[1200px]">
      <motion.div
        ref={containerRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative flex items-center justify-center transition-transform duration-75"
      >
        {/* Dynamic Gravitational Harmonic Waves */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 animate-ping"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: '160px',
              height: '160px',
              borderColor: ripple.color,
              borderWidth: '2px',
              backgroundColor: ripple.color,
              opacity: 0.4,
            }}
          />
        ))}

        {/* Ambient Cosmic Horizon Glow */}
        <motion.div
          style={{ x: lightShiftX, y: lightShiftY }}
          className="absolute w-80 h-80 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] rounded-full bg-gradient-to-tr from-purple-900/30 via-violet-600/20 to-transparent blur-[70px] pointer-events-none"
        />

        {/* Main Celestial Planetary Stage */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center">
          
          {/* ORBITAL RING 1 - Outer Holographic Track (Slow Graceful Spin) */}
          <div
            className="absolute inset-0 rounded-full border border-purple-500/20 border-dashed pointer-events-none animate-spin"
            style={{ animationDuration: '40s', animationTimingFunction: 'linear' }}
          >
            {/* Luminous orbital node */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-400/60 shadow-[0_0_8px_#c084fc]" />
          </div>

          {/* ORBITAL RING 2 - Middle Luminous Track (Reversed Rotation with Gradient Ring) */}
          <div
            className="absolute inset-8 sm:inset-10 rounded-full border border-white/15 pointer-events-none animate-spin"
            style={{ animationDuration: '24s', animationDirection: 'reverse', animationTimingFunction: 'linear' }}
          >
            <div className="absolute bottom-0 right-1/4 w-2 h-2 rounded-full bg-white/70 shadow-[0_0_12px_#ffffff]" />
          </div>

          {/* ORBITAL RING 3 - Inner Resonant Ring */}
          <div
            className="absolute inset-16 sm:inset-20 rounded-full border border-purple-400/20 pointer-events-none animate-spin"
            style={{ animationDuration: '14s', animationTimingFunction: 'linear' }}
          >
            <div className="absolute top-1/4 left-0 w-1 h-1 rounded-full bg-purple-300 shadow-[0_0_6px_#a855f7]" />
          </div>

          {/* ORBITING BODY 3 (MICRO-PHOTON): Fast Inner Pulsing Spark */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'linear' }}
            className="absolute inset-14 pointer-events-none flex items-center justify-start z-10"
          >
            <div className="ml-0 w-2.5 h-2.5 rounded-full bg-purple-300 shadow-[0_0_16px_#c084fc] blur-[0.4px] animate-pulse" />
          </motion.div>

          {/* CENTER: THE GRAVITATIONAL CORE SPHERE */}
          <div className="relative z-20 flex items-center justify-center">
            {/* Multi-layered corona pulse rings */}
            <motion.div
              animate={{
                scale: [1, 1.22, 1],
                opacity: [0.35, 0.7, 0.35],
              }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-purple-500/20 blur-md pointer-events-none"
            />
            <motion.div
              animate={{
                scale: [1.1, 1.35, 1.1],
                opacity: [0.15, 0.45, 0.15],
              }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border border-purple-400/30 blur-xs pointer-events-none"
            />

            {/* Core Interactive Sphere */}
            <motion.div
              onClick={(e) => triggerRipple(e, '#9e6ff4', () => gravityAudio.playOrbTone(330))}
              whileHover={{ scale: 1.14 }}
              whileTap={{ scale: 0.94 }}
              animate={{
                boxShadow: [
                  '0 0 35px rgba(168,85,247,0.55), inset 0 0 20px rgba(255,255,255,0.3)',
                  '0 0 65px rgba(168,85,247,0.85), inset 0 0 30px rgba(255,255,255,0.5)',
                  '0 0 35px rgba(168,85,247,0.55), inset 0 0 20px rgba(255,255,255,0.3)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
              title="Gravitational Core · Click for harmonic wave"
              className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-[#7c3aed] via-[#9333ea] to-[#c084fc] shadow-[0_0_50px_rgba(168,85,247,0.7)] cursor-pointer flex items-center justify-center border border-white/30 backdrop-blur-xs"
            >
              {/* Glass reflection highlight */}
              <div className="absolute top-1.5 left-2 w-5 h-2.5 sm:w-7 sm:h-3.5 rounded-full bg-white/40 blur-[1px] rotate-[-25deg]" />
              {/* Subtle inner core glow */}
              <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-white/30 blur-[2px]" />
            </motion.div>
          </div>

          {/* ORBITING BODY 1: Smooth Solid White Satellite (Continuous Clockwise Orbit) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
            className="absolute inset-0 pointer-events-none flex items-center justify-start z-30"
          >
            {/* Orbiting Satellite with glowing comet-aura */}
            <div className="relative flex items-center pointer-events-auto">
              <motion.div
                onClick={(e) => triggerRipple(e, '#ffffff', () => gravityAudio.playMiniTone())}
                whileHover={{ scale: 1.35 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(192,132,252,0.6)',
                    '0 0 35px rgba(255,255,255,1), 0 0 55px rgba(192,132,252,0.85)',
                    '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(192,132,252,0.6)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                title="Orbiting White Satellite · Click"
                className="ml-1 sm:ml-2 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white cursor-pointer border border-white/60 relative flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-purple-200/40 blur-[1px]" />
              </motion.div>
            </div>
          </motion.div>

          {/* ORBITING BODY 2: Architectural Torus Ring (Counter-Clockwise Elliptical Orbit) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
            className="absolute inset-0 pointer-events-none flex items-center justify-end z-25"
          >
            <motion.div
              onClick={(e) => triggerRipple(e, '#ffffff', () => gravityAudio.playTorusTone())}
              whileHover={{
                scale: 1.18,
                filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.95))',
              }}
              whileTap={{ scale: 0.94 }}
              animate={{
                filter: [
                  'drop-shadow(0 0 20px rgba(255,255,255,0.45)) drop-shadow(0 0 35px rgba(168,85,247,0.35))',
                  'drop-shadow(0 0 35px rgba(255,255,255,0.75)) drop-shadow(0 0 55px rgba(168,85,247,0.55))',
                  'drop-shadow(0 0 20px rgba(255,255,255,0.45)) drop-shadow(0 0 35px rgba(168,85,247,0.35))',
                ],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              title="Orbiting Architectural Torus · Click"
              className="pointer-events-auto mr-1 sm:mr-2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-[18px] sm:border-[22px] md:border-[24px] border-white/95 bg-transparent cursor-pointer flex items-center justify-center transition-all duration-300"
            />
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};
