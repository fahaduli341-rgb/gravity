import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Language } from '../types.ts';
import { gravityAudio } from '../utils/audio.ts';
import { Compass, Sparkles, Zap, Layers } from 'lucide-react';

interface PhilosophySectionProps {
  language: Language;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({ language }) => {
  const [pulseActive, setPulseActive] = useState(false);

  const handlePulseTrigger = () => {
    setPulseActive(true);
    gravityAudio.playGravityPulse();
    setTimeout(() => setPulseActive(false), 800);
  };

  const principles = [
    {
      num: '01',
      title: language === 'de' ? 'Anziehungskraft statt Lautstärke' : 'Attraction over volume',
      desc:
        language === 'de'
          ? 'Echte Gravitation drängt sich nicht auf. Sie wirkt durch Masse, Relevanz und gestalterische Präzision. Marken brauchen keinen Lärm, sondern Substanz.'
          : 'True gravity never shouts. It exerts pull through mass, relevance, and typographic precision. Brands don’t need noise; they need substance.',
      icon: Compass,
    },
    {
      num: '02',
      title: language === 'de' ? 'Kein Agentur-Overhead' : 'Zero agency overhead',
      desc:
        language === 'de'
          ? 'Keine Account Manager, keine zeitraubenden Abstimmungskaskaden. Direkter Dialog von Entscheider zu Gestalter. Das spart Budget und rettet mutige Ideen.'
          : 'No account handlers, no endless approval cascades. Direct dialogue between decision-maker and visual master. Preserves budget and protects bold ideas.',
      icon: Zap,
    },
    {
      num: '03',
      title: language === 'de' ? '35 Jahre Meisterschaft' : '35 years of craftsmanship',
      desc:
        language === 'de'
          ? 'Gorden Koschel vereint jahrzehntelange Erfahrung aus internationalen Leitagenturen mit dem agilen Tempo moderner digitaler Workflows.'
          : 'Gorden Koschel unites decades of creative direction in global agencies with the speed and dexterity of modern digital tools.',
      icon: Layers,
    },
  ];

  return (
    <section
      id="philosophy"
      className="relative w-full bg-[#0c0c0e] text-white py-28 px-6 md:px-12 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section kicker */}
        <div className="text-xs uppercase tracking-[0.25em] text-[#a855f7] font-bold mb-3">
          {language === 'de' ? 'DAS PRINZIP GRAVITATION' : 'THE GRAVITY PRINCIPLE'}
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-20">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {language === 'de'
                ? 'Warum Ideen echte Schwerkraft brauchen.'
                : 'Why bold ideas demand genuine gravitational pull.'}
            </h2>
          </div>

          <div className="max-w-md text-zinc-400 text-base leading-relaxed flex flex-col justify-between">
            <p>
              {language === 'de'
                ? 'In einer überladenen Welt siegt nicht der Lauteste, sondern derjenige, dessen Botschaft das Zentrum der Aufmerksamkeit anzieht.'
                : 'In an overloaded world, victory belongs not to the loudest voice, but to the message whose clarity exerts undeniable gravitational pull.'}
            </p>

            <button
              onClick={handlePulseTrigger}
              type="button"
              className="mt-6 inline-flex items-center gap-2 self-start text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${pulseActive ? 'animate-spin' : ''}`} />
              <span>{language === 'de' ? 'Gravitationswelle testen' : 'Simulate gravity pulse'}</span>
            </button>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="p-8 rounded-2xl bg-[#121216] border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono text-purple-400 tracking-wider">
                      {item.num}.
                    </span>
                    <Icon className="w-5 h-5 text-zinc-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
