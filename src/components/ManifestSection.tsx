import React from 'react';
import { motion } from 'motion/react';
import { Language, SiteSettings } from '../types.ts';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

interface ManifestSectionProps {
  language: Language;
  settings: SiteSettings;
  onOpenHire: () => void;
}

export const ManifestSection: React.FC<ManifestSectionProps> = ({
  language,
  settings,
  onOpenHire,
}) => {
  return (
    <section
      id="manifest"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#9969f6] via-[#9462f4] to-[#864ce6] text-white py-24 px-6 md:px-12 select-none"
    >
      {/* Concentric gravitational orbital waves matching Screenshot 2 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Layer 1 - Inner ripple */}
        <div className="absolute w-[360px] h-[360px] md:w-[500px] md:h-[500px] rounded-full bg-white/10 blur-[1px] animate-pulse-ripple" />
        {/* Layer 2 - Middle ring */}
        <div
          className="absolute w-[560px] h-[560px] md:w-[780px] md:h-[780px] rounded-full border border-white/20 bg-white/5 animate-pulse-ripple"
          style={{ animationDelay: '2s' }}
        />
        {/* Layer 3 - Outer ring */}
        <div
          className="absolute w-[800px] h-[800px] md:w-[1100px] md:h-[1100px] rounded-full border border-white/15 animate-pulse-ripple"
          style={{ animationDelay: '4s' }}
        />
        {/* Layer 4 - Planetary horizon */}
        <div className="absolute w-[1100px] h-[1100px] md:w-[1500px] md:h-[1500px] rounded-full border border-white/10" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col justify-center my-auto">
        {/* Section Label: MANIFEST */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center gap-2"
        >
          <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-purple-200 uppercase">
            {language === 'de' ? 'MANIFEST' : 'MANIFESTO'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-300" />
          <span className="text-xs text-purple-200/80 font-medium">
            AI-Driven Creation
          </span>
        </motion.div>

        {/* Massive Bold Headline from dynamic settings */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-[1.08] mb-8 whitespace-pre-line"
        >
          {settings.manifestHeading}
        </motion.h2>

        {/* Manifest Body Prose tailored to AI Website Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 text-base sm:text-lg md:text-xl font-normal leading-relaxed text-purple-50"
        >
          {settings.manifestParagraph1 && <p>{settings.manifestParagraph1}</p>}
          {settings.manifestParagraph2 && <p>{settings.manifestParagraph2}</p>}
          {settings.manifestParagraph3 && <p>{settings.manifestParagraph3}</p>}
        </motion.div>

        {/* Small floating celestial dot as seen in Screenshot 2 */}
        <div className="flex justify-center my-8">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
          />
        </div>

        {/* Highlight Punchline Block matching Screenshot 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-4 border-t border-purple-400/30"
        >
          <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            {settings.manifestPunchline}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base text-purple-200">
            <span className="w-12 h-0.5 bg-purple-200/80 inline-block" />
            <span>{settings.manifestSubpunchline}</span>
          </div>

          {/* Direct WhatsApp "Hire me" button */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenHire}
              type="button"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-purple-900 font-extrabold text-sm sm:text-base hover:bg-purple-100 hover:shadow-2xl transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Hire me (WhatsApp)</span>
              <ArrowRight className="w-4 h-4 text-purple-800" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
