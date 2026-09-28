/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase.ts';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ManifestSection } from './components/ManifestSection.tsx';
import { Footer } from './components/Footer.tsx';
import { ImpressumModal } from './components/ImpressumModal.tsx';
import { AdminPanelModal } from './components/AdminPanelModal.tsx';
import { SecretAdminTrigger } from './components/SecretAdminTrigger.tsx';
import { IntroSplash } from './components/IntroSplash.tsx';
import { Language, SiteSettings, DEFAULT_SETTINGS } from './types.ts';
import { gravityAudio } from './utils/audio.ts';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('en');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'photo' | 'content' | 'whatsapp' | 'inquiries'>('photo');

  // Initialize from cache for instantaneous load, then sync with Firestore
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const cachedPhoto = localStorage.getItem('fahad_custom_portrait');
      const cachedFilter = localStorage.getItem('fahad_portrait_filter') as 'chiaroscuro' | 'normal';
      if (cachedPhoto) {
        return {
          ...DEFAULT_SETTINGS,
          customPortraitImage: cachedPhoto,
          portraitFilter: cachedFilter || 'chiaroscuro',
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Real-time synchronization of site content with Firebase Firestore
  useEffect(() => {
    try {
      const docRef = doc(db, 'settings', 'site');
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as Partial<SiteSettings>;
            setSettings((prev) => {
              const updated = {
                ...prev,
                ...data,
              };
              if (updated.customPortraitImage) {
                try {
                  localStorage.setItem('fahad_custom_portrait', updated.customPortraitImage);
                  if (updated.portraitFilter) {
                    localStorage.setItem('fahad_portrait_filter', updated.portraitFilter);
                  }
                } catch {
                  // localStorage quota check
                }
              }
              return updated;
            });
          }
        },
        (error) => {
          if (error.code === 'unavailable') {
            console.info('Firestore is operating in offline/cached mode while connecting.');
            return;
          }
          console.warn('Realtime settings sync notice:', error.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore subscription initialized locally:', err);
    }
  }, []);

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    const docRef = doc(db, 'settings', 'site');
    await setDoc(
      docRef,
      {
        ...newSettings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    setSettings(newSettings);
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    gravityAudio.enabled = nextState;
    if (nextState) {
      gravityAudio.playMiniTone();
    }
  };

  const scrollToManifest = () => {
    const el = document.getElementById('manifest');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Direct WhatsApp Integration on Hire Me click
  const handleHireMeWhatsApp = () => {
    gravityAudio.playMiniTone();
    const cleanNumber = (settings.whatsappNumber || '8801700000000').replace(/[^0-9]/g, '');
    const prefilledMessage = encodeURIComponent(
      settings.whatsappMessage || 'Hi Fahad, I saw your portfolio and would like to hire you for a website project!'
    );
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${prefilledMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const openAdminWithTab = (tab: 'photo' | 'content' | 'whatsapp' | 'inquiries') => {
    setAdminTab(tab);
    setIsAdminOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0c0c0e] text-white selection:bg-purple-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenHire={handleHireMeWhatsApp}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Content Stream: Hero (Portrait + Permanent Orbit) -> Manifest (Purple + Bold Ideas + Hire Me) */}
      <main>
        {/* Section 1: Hero with Portrait & Always-Orbiting Gravitational Planetary Circles */}
        <HeroSection
          language={language}
          settings={settings}
          onOpenImpressum={() => setIsImpressumOpen(true)}
          onScrollToManifest={scrollToManifest}
          onOpenHire={handleHireMeWhatsApp}
        />

        {/* Section 2: Radiant Purple Manifest ending at JUST BOLD IDEAS with Direct WhatsApp Hire Me */}
        <ManifestSection
          language={language}
          settings={settings}
          onOpenHire={handleHireMeWhatsApp}
        />
      </main>

      {/* Clean Minimalist Footer */}
      <Footer
        language={language}
        onOpenImpressum={() => setIsImpressumOpen(true)}
        onOpenHire={handleHireMeWhatsApp}
      />

      {/* Cinematic Fullscreen Intro Animation on Site Entry */}
      {showIntro && (
        <IntroSplash
          ownerName={settings.heroTitle || 'FAHAD'}
          roleTitle={settings.heroSubtitle || 'AI WEB DEVELOPER'}
          customPortraitImage={settings.customPortraitImage}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Secret Admin Trigger: Triple click at the bottom-right corner or Long Press */}
      <SecretAdminTrigger onTrigger={() => openAdminWithTab('photo')} />

      {/* Firebase Secured Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        initialTab={adminTab}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Legal Impressum & Datenschutz Modal */}
      <ImpressumModal
        isOpen={isImpressumOpen}
        onClose={() => setIsImpressumOpen(false)}
        language={language}
      />
    </div>
  );
}
