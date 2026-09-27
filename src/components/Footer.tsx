import React from 'react';
import { Linkedin, Instagram, ArrowUp } from 'lucide-react';
import { Language } from '../types.ts';

interface FooterProps {
  language: Language;
  onOpenImpressum: () => void;
  onOpenHire: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenImpressum,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#08080a] border-t border-white/10 text-zinc-400 py-8 px-6 md:px-12 select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white tracking-tight">
            gravity<span className="text-[#a855f7]">•</span>
          </span>
          <span className="text-xs text-zinc-500">© 2026 Fahadul Islam · AI Website Creator</span>
        </div>

        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top"
          className="p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
