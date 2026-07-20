export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface CurrencyPair {
  from: string;
  to: string;
  rate: number;
  change: number;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface FeeRow {
  service: string;
  lumina: string;
  traditional: string;
}

export interface Office {
  city: string;
  address: string;
  tag: 'HQ' | 'Regional';
  mapImage: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Founder {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  link?: { text: string; href: string };
}

export interface CaseStudy {
  company: string;
  quote: string;
  author: string;
  role: string;
  metric: string;
}

export interface HelpArticle {
  title: string;
  category: string;
  helpful: number;
}

export interface HelpCategory {
  name: string;
  icon: string;
  description: string;
}

export interface VideoTutorial {
  title: string;
  duration: string;
  thumbnail: string;
}
