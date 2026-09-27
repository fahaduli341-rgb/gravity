import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck } from 'lucide-react';
import { Language } from '../types.ts';

interface ImpressumModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ImpressumModal: React.FC<ImpressumModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#141419] border border-white/15 rounded-2xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              type="button"
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors p-1"
              aria-label="Close legal modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-[#a855f7]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-[0.2em]">
                {language === 'de' ? 'RECHTLICHE HINWEISE' : 'LEGAL INFORMATION'}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-6">
              {language === 'de' ? 'Impressum & Datenschutz' : 'Imprint & Privacy Policy'}
            </h2>

            <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <div>
                <h3 className="font-semibold text-white mb-1">Angaben gemäß § 5 TMG</h3>
                <p>
                  gravity • strategy · concept · design
                  <br />
                  Gorden Koschel
                  <br />
                  Creative Director & Visual Strategist
                  <br />
                  Hamburg / Berlin, Deutschland
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Kontakt</h3>
                <p>
                  E-Mail: kontakt@gravity-design.de
                  <br />
                  Web: gravity-design.de
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Umsatzsteuer-Identifikationsnummer</h3>
                <p>USt-IdNr. gemäß § 27 a Umsatzsteuergesetz: DE 294 810 472</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Datenschutz & DSGVO</h3>
                <p>
                  Diese Website verwendet keine Tracking-Cookies von Drittanbietern und speichert keine personenbezogenen Daten ohne Ihre ausdrückliche Kontaktaufnahme. Anfragen über das Kontaktformular werden vertraulich und zweckgebunden verarbeitet.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                type="button"
                className="px-5 py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
              >
                {language === 'de' ? 'Schließen' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
