import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Language } from '../types.ts';
import { gravityAudio } from '../utils/audio.ts';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenHire: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenHire,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-300 backdrop-blur-xs">
      {/* Zone 1: Brand title wordmark */}
      <a
        href="#hero"
        onClick={() => {
          gravityAudio.playMiniTone();
        }}
        className="group flex items-center text-xl md:text-2xl font-bold tracking-tight text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
      >
        <span>gravity</span>
        <span className="text-[#a855f7] inline-block transition-transform duration-300 group-hover:scale-125 ml-0.5">•</span>
      </a>

      {/* Zone 2: Clean unboxed navigation */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
        <a
          href="#manifest"
          className="hover:text-white transition-colors duration-200"
        >
          {language === 'de' ? 'Manifest' : 'Manifesto'}
        </a>
        <button
          onClick={onOpenHire}
          type="button"
          className="hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{language === 'de' ? 'Hire me' : 'Hire me'}</span>
        </button>
      </nav>

      {/* Zone 3: Actions (Sound, Language, Hire Me / Contact CTA) */}
      <div className="flex items-center gap-4 md:gap-6 text-sm">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          type="button"
          aria-label={soundEnabled ? 'Disable audio' : 'Enable audio'}
          className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 cursor-pointer"
          title={soundEnabled ? 'Ambient sound on' : 'Ambient sound off'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-purple-400" />
          ) : (
            <VolumeX className="w-4 h-4 opacity-60" />
          )}
        </button>

        {/* Hire Me / Kontakt CTA */}
        <button
          onClick={onOpenHire}
          type="button"
          className="text-base md:text-lg font-medium text-white hover:text-purple-300 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
        >
          Hire me
        </button>
      </div>
    </header>
  );
};
