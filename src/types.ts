export type Language = 'de' | 'en';

export type PhysicsMode = 'float' | 'orbit' | 'magnetic' | 'chaos';

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroTags: string;
  badgeText: string;
  whatsappNumber: string;
  whatsappMessage: string;
  manifestHeading: string;
  manifestParagraph1: string;
  manifestParagraph2: string;
  manifestParagraph3: string;
  manifestPunchline: string;
  manifestSubpunchline: string;
  customPortraitImage?: string;
  portraitFilter?: 'chiaroscuro' | 'normal';
  secretKey?: string;
  updatedAt?: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "HI I AM FAHAD",
  heroSubtitle: "AI WEB DEVELOPER",
  heroTags: "ai web development · modern frontend · design",
  badgeText: "Available for projects",
  whatsappNumber: "8801700000000",
  whatsappMessage: "Hi Fahad, I saw your portfolio and would like to hire you for a website project!",
  manifestHeading: "AGENCY QUALITY.\nPOWERED BY AI.\nZERO OVERHEAD.",
  manifestParagraph1: "Great ideas are fragile at the start. Too many bureaucratic rounds, endless compromises, and bloated processes strip them of what makes them formidable: their courage and momentum.",
  manifestParagraph2: "I craft award-grade, high-performance websites leveraging state-of-the-art AI tooling and bespoke frontend code. What once demanded an entire agency floor and months of budget is now forged with surgical speed and pinpoint craft.",
  manifestParagraph3: "It is not the ambition that has changed, but the instruments. Zero overhead, no middlemen — direct dialogue, lightning delivery, and undeniable gravitational pull for your brand.",
  manifestPunchline: "JUST BOLD IDEAS.",
  manifestSubpunchline: "for brands, reports and digital worlds",
  customPortraitImage: "",
  portraitFilter: 'chiaroscuro',
  secretKey: 'fahad2026',
};

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  description: {
    de: string;
    en: string;
  };
  client: string;
  services: string[];
  image: string;
  color: string;
}
