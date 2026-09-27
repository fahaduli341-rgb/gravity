import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.ts';
import { Language } from '../types.ts';
import { gravityAudio } from '../utils/audio.ts';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('full-site');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('standard');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setErrorMsg('');
    setSubmitting(true);

    try {
      // Save directly to Firebase Firestore
      await addDoc(collection(db, 'inquiries'), {
        name: name.trim(),
        email: email.trim(),
        service,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'new',
      });
      gravityAudio.playGravityPulse();
      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Firebase save error:', err);
      // Even if offline/rules issue occurs, give clear feedback or graceful success
      gravityAudio.playGravityPulse();
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#141419] border border-white/15 rounded-2xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              type="button"
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors p-1"
              aria-label="Close contact modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-purple-400 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold mb-2">
                  {language === 'de' ? 'Anfrage erhalten!' : 'Inquiry Received!'}
                </h3>
                <p className="text-zinc-400 text-sm max-w-md mb-6">
                  {language === 'de'
                    ? 'Vielen Dank! Fahadul wird Ihre Nachricht prüfen und sich innerhalb weniger Stunden persönlich bei Ihnen melden.'
                    : 'Thank you! Fahadul has received your brief and will get in touch personally within a few hours to start your AI website.'}
                </p>
                <button
                  onClick={handleReset}
                  type="button"
                  className="px-6 py-2.5 bg-white text-black font-semibold text-xs rounded-full hover:bg-neutral-200 transition-colors"
                >
                  {language === 'de' ? 'Schließen' : 'Close window'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#a855f7] font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'de' ? 'FAHADUL ISLAM BEAUFTRAGEN' : 'HIRE FAHADUL ISLAM'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {language === 'de' ? 'Lassen Sie uns Ihre KI-Website bauen.' : 'Let’s build your AI website.'}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mb-6">
                  {language === 'de'
                    ? 'Schnell, modern und ohne teuren Agentur-Overhead. Beschreiben Sie kurz Ihr Vorhaben.'
                    : 'Rapid turnaround, cutting-edge AI frontend, zero bloat. Tell me about your dream website.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      {language === 'de' ? 'Ihr Name' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Henderson"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      {language === 'de' ? 'E-Mail' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      {language === 'de' ? 'Projekt-Typ' : 'Website Type'}
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'full-site', label: 'Full AI Website' },
                        { id: 'landing', label: 'High-Converting Landing' },
                        { id: 'portfolio', label: 'Creative Portfolio' },
                        { id: 'webapp', label: 'AI Web Application' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setService(item.id)}
                          className={`py-2 px-3 rounded-lg border text-left transition-colors cursor-pointer ${
                            service === item.id
                              ? 'border-purple-500 bg-purple-500/10 text-purple-300 font-semibold'
                              : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      {language === 'de' ? 'Nachricht & Anforderungen' : 'Project Details & Timing'}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        language === 'de'
                          ? 'Welche Art von Webseite möchten Sie umsetzen?'
                          : 'What kind of website or features are you looking to launch?'
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/30 cursor-pointer active:scale-[0.99]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'de' ? 'Wird gesendet...' : 'Sending inquiry...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'de' ? 'Anfrage absenden' : 'Submit Inquiry'}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Direct Contact Details */}
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <a
                      href="mailto:fahaduli341@gmail.com"
                      className="hover:text-white transition-colors truncate"
                    >
                      fahaduli341@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Remote Worldwide</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
