import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, ProjectItem } from '../types.ts';
import { ArrowUpRight, X } from 'lucide-react';
import editorialShowcase from '../assets/images/editorial_showcase_1790503495733.jpg';

interface WorksSectionProps {
  language: Language;
}

const projects: ProjectItem[] = [
  {
    id: 'atelier-koschel',
    title: 'Monolith Architectural Brand & Editorial Book',
    category: 'Brand Identity · Editorial',
    year: '2026',
    description: {
      de: 'Ein kompromissloses Erscheinungsbild für ein avantgardistisches Architekturbüro. Geometrische Klarheit trifft auf haptische Materialität und monumentale Schweizer Typografie.',
      en: 'An uncompromising visual identity for an avant-garde architecture collective. Geometric precision meets tactile materiality and monumental Swiss typography.',
    },
    client: 'Monolith Studio, Zurich',
    services: ['Visual Strategy', 'Brand Identity', 'Editorial Design', 'Spatial Typography'],
    image: editorialShowcase,
    color: '#9e6ff4',
  },
  {
    id: 'quantum-report',
    title: 'Quantum Horizon Digital Annual Report',
    category: 'Digital World · Reporting',
    year: '2025',
    description: {
      de: 'Transformation komplexer Finanz- und Nachhaltigkeitskennzahlen in ein immersives, interaktives Weberlebnis mit Echtzeit-Datenvisualisierungen.',
      en: 'Transforming complex financial and sustainability metrics into an immersive, interactive web narrative with real-time data visualisations.',
    },
    client: 'Quantum Dynamics Group',
    services: ['Digital Strategy', 'Information Architecture', 'Interactive Web', 'Motion Design'],
    image: editorialShowcase,
    color: '#ffffff',
  },
  {
    id: 'aura-sound',
    title: 'Aura Spatial Acoustic System',
    category: 'Brand System · Digital',
    year: '2025',
    description: {
      de: 'Ganzheitliche Markenführung und UI-Konzept für ein High-End Audio-Ökosystem. Reduziert auf pure Physik und klangliche Ästhetik.',
      en: 'Holistic brand architecture and UI concept for a high-end acoustic ecosystem. Stripped to raw physics and sonic clarity.',
    },
    client: 'Aura Acoustics, Berlin',
    services: ['Creative Direction', 'Packaging Systems', 'Web Platform', 'Sound UI'],
    image: editorialShowcase,
    color: '#a855f7',
  },
];

export const WorksSection: React.FC<WorksSectionProps> = ({ language }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section
      id="works"
      className="relative w-full bg-[#0e0e11] text-white py-28 px-6 md:px-12 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#a855f7] font-bold mb-3">
              {language === 'de' ? 'AUSGEWÄHLTE ARBEITEN' : 'SELECTED WORKS'}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              {language === 'de' ? 'Marken, Berichte & digitale Welten.' : 'Brands, reports & digital worlds.'}
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-zinc-400 max-w-sm">
            {language === 'de'
              ? 'Direkt, fokussiert und ohne Reibungsverlust. Höchste gestalterische Präzision aus einer Hand.'
              : 'Direct, focused, and frictionless. Highest design precision from a single master mind.'}
          </div>
        </div>

        {/* Project List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer flex flex-col justify-between p-6 rounded-2xl bg-[#141418] border border-white/5 hover:border-purple-500/40 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-900 mb-5">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Metadata: Unboxed text with typographic separators (anti-slop rule) */}
                <div className="flex items-center gap-2 text-xs text-purple-400 font-medium mb-2">
                  <span>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-500">{project.year}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>
              </div>

              {/* Description preview */}
              <p className="mt-4 text-xs sm:text-sm text-zinc-400 line-clamp-2">
                {language === 'de' ? project.description.de : project.description.en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#16161b] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProject(null)}
                type="button"
                className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 bg-zinc-900">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-2">
                <span>{selectedProject.category}</span>
                <span>·</span>
                <span className="text-zinc-400">{selectedProject.year}</span>
              </div>

              <h3 className="text-2xl font-bold mb-3">{selectedProject.title}</h3>

              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base mb-6">
                {language === 'de' ? selectedProject.description.de : selectedProject.description.en}
              </p>

              <div className="border-t border-white/10 pt-4 flex flex-wrap gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block mb-1">CLIENT</span>
                  <span className="font-medium text-white">{selectedProject.client}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-1">SERVICES</span>
                  <div className="flex flex-wrap gap-1 text-zinc-300">
                    {selectedProject.services.join(' · ')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
