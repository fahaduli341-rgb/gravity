import React from 'react';
import { motion } from 'motion/react';
import { GravityCircles } from './GravityCircles.tsx';
import { Language, SiteSettings } from '../types.ts';
import { ChevronDown, Linkedin, Instagram, Sparkles, MessageCircle, Camera, Lock } from 'lucide-react';
import defaultPortrait from '../assets/images/gorden_portrait_1790503476779.jpg';

interface HeroSectionProps {
  language: Language;
  settings: SiteSettings;
  onOpenImpressum: () => void;
  onScrollToManifest: () => void;
  onOpenHire: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  settings,
  onOpenImpressum,
  onScrollToManifest,
  onOpenHire,
}) => {
  const currentPortrait = settings.customPortraitImage || defaultPortrait;
  const isChiaroscuro = settings.portraitFilter !== 'normal';

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#0c0c0e] text-white pt-20 pb-6 px-6 md:px-12"
    >
      {/* Background Portrait with Chiaroscuro or Natural Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <img
          src={currentPortrait}
          alt={settings.heroTitle}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center md:max-w-4xl transition-all duration-700 ${
            isChiaroscuro
              ? 'filter grayscale contrast-125 brightness-90'
              : 'filter brightness-95'
          }`}
        />
        {/* Cinematic gradient overlays for contrast & legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-[#0c0c0e]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0e]/80 via-transparent to-[#0c0c0e]/80" />
      </div>

      {/* Main Layout: Spreads content with GravityCircles situated in the lower right corner */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex-1 flex flex-col justify-end pt-8 pb-2">
        {/* Lower Row: Typography on the Left, Orbiting Gravity Circles in the Right Corner */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-4">
          
          {/* Typography on Bottom-Left */}
          <div className="space-y-2 max-w-lg order-2 md:order-1">
            {/* Category kicker */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider text-[#a855f7] uppercase"
            >
              {settings.heroTags}
            </motion.div>

            {/* Clean Hero Headline: "HI I AM FAHAD" and "AI WEB DEVELOPER" */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-1"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-none">
                {settings.heroTitle}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-semibold tracking-wide uppercase">
                {settings.heroSubtitle}
              </p>
            </motion.div>
          </div>

          {/* Lower Right Corner: Planetary System Animation */}
          <div className="order-1 md:order-2 self-end flex items-center justify-end scale-80 sm:scale-90 md:scale-100 origin-bottom-right">
            <GravityCircles />
          </div>
        </div>

        {/* Bottom Footer Bar matching clean minimal design */}
        <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
          <div>
            <span>© gravity 2026 · {settings.heroTitle}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
