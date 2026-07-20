import type { NavLink, CurrencyPair, Testimonial, BlogPost, FaqItem, FeeRow, Office, TimelineEvent, Founder, CaseStudy, HelpArticle, HelpCategory, VideoTutorial } from '@/types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Personal', href: '/personal' },
  { label: 'Business', href: '/business' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
  { label: 'Blog', href: '/blog' },
];

export const CURRENCY_PAIRS: CurrencyPair[] = [
  { from: 'GBP', to: 'USD', rate: 1.2847, change: 0.12 },
  { from: 'EUR', to: 'USD', rate: 1.0842, change: -0.05 },
  { from: 'USD', to: 'JPY', rate: 148.32, change: 0.23 },
  { from: 'GBP', to: 'EUR', rate: 1.1845, change: 0.08 },
  { from: 'USD', to: 'AUD', rate: 1.5234, change: -0.15 },
  { from: 'EUR', to: 'GBP', rate: 0.8442, change: -0.03 },
  { from: 'USD', to: 'CAD', rate: 1.3456, change: 0.07 },
  { from: 'GBP', to: 'JPY', rate: 190.54, change: 0.31 },
  { from: 'EUR', to: 'JPY', rate: 160.82, change: 0.19 },
  { from: 'USD', to: 'CHF', rate: 0.8765, change: -0.08 },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Lumina completely changed how I manage money across borders. As a freelancer working with clients in the US, EU, and Asia, having multi-currency accounts saves me hundreds in conversion fees every month.",
    author: 'Sarah Chen',
    role: 'Freelance Designer',
    avatar: '/images/avatars/sarah.jpg',
  },
  {
    quote: "The virtual cards feature is a game-changer. I create a new card for every subscription and online purchase. When a service got hacked, I just froze that one card \u2014 zero stress.",
    author: 'Marcus Johnson',
    role: 'Software Engineer',
    avatar: '/images/avatars/marcus.jpg',
  },
  {
    quote: "I travel for work constantly and Lumina is the only card I carry now. No foreign transaction fees, instant notifications, and the app is beautiful. My colleagues all switched after seeing mine.",
    author: 'Elena Rossi',
    role: 'Travel Consultant',
    avatar: '/images/avatars/elena.jpg',
  },
  {
    quote: "We switched our entire business banking to Lumina. Multi-user access, expense cards for the team, and QuickBooks integration means our bookkeeping takes half the time.",
    author: "James O'Brien",
    role: 'Founder, TechStart Ltd',
    avatar: '/images/avatars/james.jpg',
  },
  {
    quote: "As an international student, Lumina made managing my finances across two countries effortless. The savings goals feature helped me budget through my entire degree.",
    author: 'Priya Patel',
    role: 'PhD Student',
    avatar: '/images/avatars/priya.jpg',
  },
  {
    quote: "The real exchange rates alone saved my business \u00a32,000 last quarter. And the 24/7 support actually responds in minutes, not hours. Can't recommend enough.",
    author: 'Tom Anderson',
    role: 'E-commerce Owner',
    avatar: '/images/avatars/tom.jpg',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "How to Save \u00a3500 on Your Next Holiday",
    excerpt: "Discover the smart way to manage travel money with multi-currency accounts and avoid hidden foreign exchange fees.",
    category: 'Financial Tips',
    date: '8 Jan 2025',
    readTime: '4 min',
    image: '/images/blog/thumb-1.jpg',
    author: { name: 'Elena Rossi', avatar: '/images/avatars/elena.jpg' },
  },
  {
    title: "Behind the Scenes: Building Our New Card System",
    excerpt: "An engineering deep dive into how we rebuilt our card infrastructure for better security and instant virtual card generation.",
    category: 'Engineering',
    date: '3 Jan 2025',
    readTime: '7 min',
    image: '/images/blog/thumb-2.jpg',
    author: { name: 'James Chen', avatar: '/images/avatars/james-chen.jpg' },
  },
  {
    title: "Lumina Hits 3 Million Users: A Letter from the CEO",
    excerpt: "Alexandra Reed shares her thoughts on reaching this milestone and what's next for Lumina.",
    category: 'Company News',
    date: '20 Dec 2024',
    readTime: '3 min',
    image: '/images/blog/thumb-3.jpg',
    author: { name: 'Alexandra Reed', avatar: '/images/avatars/alexandra.jpg' },
  },
  {
    title: "5 Security Tips Every Digital Banking User Should Know",
    excerpt: "Protect your money with these essential security practices for the modern banking age.",
    category: 'Financial Tips',
    date: '15 Dec 2024',
    readTime: '5 min',
    image: '/images/blog/thumb-4.jpg',
    author: { name: 'Marcus Johnson', avatar: '/images/avatars/marcus.jpg' },
  },
  {
    title: "How TechFlow Uses Lumina to Power Global Payroll",
    excerpt: "Learn how one fast-growing startup streamlined their international payments with Lumina Business.",
    category: 'Customer Stories',
    date: '10 Dec 2024',
    readTime: '6 min',
    image: '/images/blog/thumb-5.jpg',
    author: { name: 'Tom Anderson', avatar: '/images/avatars/tom.jpg' },
  },
  {
    title: "Understanding Exchange Rates: A Complete Guide",
    excerpt: "Everything you need to know about mid-market rates, spreads, and how to get the best deal on currency conversion.",
    category: 'Financial Tips',
    date: '5 Dec 2024',
    readTime: '8 min',
    image: '/images/blog/thumb-6.jpg',
    author: { name: 'Sarah Chen', avatar: '/images/avatars/sarah.jpg' },
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  { question: 'How do I open a Lumina account?', answer: 'Download the Lumina app from the App Store or Google Play, tap "Open Account," and follow the prompts. You\'ll need a valid ID (passport or driver\'s licence) and about 5 minutes. Most accounts are approved instantly.', category: 'Getting started' },
  { question: 'Is there a monthly fee?', answer: 'No. Lumina personal accounts are completely free \u2014 no monthly charges, no minimum balance, no hidden fees.', category: 'Getting started' },
  { question: 'Who can open an account?', answer: 'Lumina is available to residents of the UK, EEA, Switzerland, Australia, and the US aged 18 or over. We\'re expanding to new countries regularly.', category: 'Getting started' },
  { question: 'How many currencies can I hold?', answer: 'You can hold and exchange between 40+ currencies in your Lumina account, including GBP, EUR, USD, JPY, AUD, CAD, CHF, and many more.', category: 'Accounts' },
  { question: 'Is my money protected?', answer: 'Yes. Lumina is authorised by the Financial Conduct Authority (FCA) and your funds are safeguarded in tier-1 partner banks. Eligible deposits are protected up to \u00a385,000 by the FSCS.', category: 'Accounts' },
  { question: 'Can I use my Lumina card abroad?', answer: 'Absolutely. Your Lumina card works in over 160 countries. We don\'t charge foreign transaction fees \u2014 you\'ll get the real exchange rate every time.', category: 'Cards' },
  { question: 'How do virtual cards work?', answer: 'You can create up to 20 virtual cards in the app, each with its own number. Use them for online shopping, subscriptions, or one-time purchases. Freeze or delete them anytime.', category: 'Cards' },
  { question: 'How fast are transfers?', answer: 'Transfers between Lumina accounts are instant. UK Faster Payments and SEPA transfers typically arrive within minutes. SWIFT transfers usually take 1-3 business days.', category: 'Transfers' },
  { question: 'What are the transfer limits?', answer: 'Personal accounts can send up to \u00a3100,000 per transaction with a \u00a3250,000 daily limit. Business accounts have higher limits \u2014 up to \u00a31M per transaction.', category: 'Transfers' },
  { question: 'How does Lumina protect my account?', answer: 'We use 256-bit SSL encryption, biometric authentication (Face ID / fingerprint), real-time transaction monitoring, and instant push notifications. You can freeze your card instantly from the app if needed.', category: 'Security' },
];

export const FAQ_CATEGORIES = ['Getting started', 'Accounts', 'Cards', 'Transfers', 'Security', 'Business'];

export const PERSONAL_FEE_ROWS: FeeRow[] = [
  { service: 'Monthly account fee', lumina: 'Free', traditional: '\u00a36-15' },
  { service: 'Account opening', lumina: 'Free', traditional: '\u00a30-25' },
  { service: 'UK card delivery', lumina: 'Free', traditional: '\u00a35-10' },
  { service: 'Card replacement', lumina: '\u00a35', traditional: '\u00a35-10' },
  { service: 'Foreign card spending', lumina: '0%', traditional: '2.75-3%' },
  { service: 'Currency conversion', lumina: '0.5%', traditional: '3-5%' },
  { service: 'Foreign ATM (up to \u00a3200/mo)', lumina: 'Free', traditional: '\u00a31.50-3' },
  { service: 'Foreign ATM (above \u00a3200)', lumina: '2%', traditional: '\u00a31.50-3 + 2.75%' },
  { service: 'UK bank transfers', lumina: 'Free', traditional: '\u00a30-25' },
  { service: 'Euro SEPA transfers', lumina: 'Free', traditional: '\u00a310-30' },
  { service: 'SWIFT transfers (standard)', lumina: 'From \u00a31.50', traditional: '\u00a315-40' },
  { service: 'SWIFT transfers (express)', lumina: '\u00a33', traditional: '\u00a325-50' },
];

export const BUSINESS_FEE_ROWS: FeeRow[] = [
  { service: 'Monthly account fee', lumina: 'Free', traditional: '\u00a310-30' },
  { service: 'Account opening', lumina: 'Free', traditional: '\u00a350-100' },
  { service: 'Team member seats', lumina: 'Free up to 3, then \u00a35/user/mo', traditional: '\u00a310-25/user' },
  { service: 'UK card delivery', lumina: 'Free', traditional: '\u00a35-10' },
  { service: 'Card replacement', lumina: '\u00a35', traditional: '\u00a35-10' },
  { service: 'Foreign card spending', lumina: '0%', traditional: '2.75-3%' },
  { service: 'Currency conversion', lumina: '0.5%', traditional: '3-5%' },
  { service: 'Foreign ATM (up to \u00a3500/mo)', lumina: 'Free', traditional: '\u00a31.50-3' },
  { service: 'Foreign ATM (above \u00a3500)', lumina: '2%', traditional: '\u00a31.50-3 + 2.75%' },
  { service: 'UK bank transfers', lumina: 'Free', traditional: '\u00a30-25' },
  { service: 'Bulk payments (up to 1,000)', lumina: '\u00a30.20/recipient', traditional: '\u00a30.50-1.50' },
  { service: 'Euro SEPA transfers', lumina: 'Free', traditional: '\u00a310-30' },
  { service: 'SWIFT transfers (standard)', lumina: 'From \u00a31.50', traditional: '\u00a315-40' },
  { service: 'SWIFT transfers (express)', lumina: '\u00a33', traditional: '\u00a325-50' },
  { service: 'Accounting integrations', lumina: 'Free', traditional: '\u00a35-15/mo' },
  { service: 'API access', lumina: 'Free', traditional: '\u00a350-200/mo' },
];

export const OFFICES: Office[] = [
  { city: 'London', address: '12 Farringdon Road, London EC1M 3EN, UK', tag: 'HQ', mapImage: '/images/maps/london.jpg' },
  { city: 'Berlin', address: 'Torstra\u00dfe 123, 10119 Berlin, Germany', tag: 'Regional', mapImage: '/images/maps/berlin.jpg' },
  { city: 'New York', address: '150 Broadway, New York, NY 10038, USA', tag: 'Regional', mapImage: '/images/maps/newyork.jpg' },
  { city: 'Singapore', address: '71 Robinson Road, Singapore 068895', tag: 'Regional', mapImage: '/images/maps/singapore.jpg' },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { year: '2018', title: 'The spark', description: "Alexandra leaves Monzo with a vision. James codes the first prototype in 48 hours at a fintech hackathon." },
  { year: '2019', title: 'Beta launch', description: "1,000 beta testers get their Lumina cards. The waiting list grows to 50,000 in three weeks." },
  { year: '2020', title: 'Going global', description: "Launched in 30 EEA countries. Raised \u00a315M Series A. Team grows from 8 to 45." },
  { year: '2021', title: '1 million users', description: "Hit 1M users. Launched business accounts. Introduced 20 new currencies." },
  { year: '2022', title: 'US launch', description: "Expanded to the United States. Partnered with Mastercard for global card acceptance." },
  { year: '2023', title: '3 million strong', description: "3M+ users across 160 countries. Launched savings goals and virtual cards." },
  { year: '2024', title: 'The future', description: "Building AI-powered insights and expanding to Asia-Pacific. The journey continues." },
];

export const FOUNDERS: Founder[] = [
  { name: 'Alexandra Reed', role: 'CEO & Co-founder', bio: "Former VP at Monzo. Obsessed with making banking human. Loves long-distance running and terrible puns.", avatar: '/images/avatars/alexandra.jpg' },
  { name: 'James Chen', role: 'CTO & Co-founder', bio: "Ex-Google engineer. Built the first prototype in a Hackathon. Believes great code is invisible.", avatar: '/images/avatars/james-chen.jpg' },
  { name: 'Priya Sharma', role: 'COO & Co-founder', bio: "15 years in compliance at Barclays. Makes sure we move fast without breaking things (or laws).", avatar: '/images/avatars/priya-sharma.jpg' },
];

export const CASE_STUDIES: CaseStudy[] = [
  { company: 'TechFlow', quote: "Switching to Lumina cut our payment admin by 60%. The multi-currency accounts alone saved us \u00a315K last year.", author: 'David Kim', role: 'CFO', metric: '60% less admin time' },
  { company: 'GreenLeaf Co', quote: "We issue cards to all 25 field staff. Real-time spending visibility means no more surprise expenses at month-end.", author: 'Maria Lopez', role: 'Operations Director', metric: '25 team cards' },
  { company: 'Atlas Consulting', quote: "Our clients pay us in 6 currencies. Lumina handles the conversion automatically at rates the banks can't match.", author: 'Robert Chen', role: 'Founder', metric: '6 currencies' },
];

export const HELP_CATEGORIES: HelpCategory[] = [
  { name: 'Getting started', icon: 'rocket', description: 'Setting up your account' },
  { name: 'Cards', icon: 'credit-card', description: 'Virtual & physical cards' },
  { name: 'Transfers', icon: 'send', description: 'Sending & receiving money' },
  { name: 'Accounts', icon: 'wallet', description: 'Account management' },
  { name: 'Security', icon: 'shield', description: 'Keeping your account safe' },
  { name: 'Fees & Pricing', icon: 'receipt', description: 'Understanding our fees' },
  { name: 'Business', icon: 'building', description: 'Business accounts' },
  { name: 'App & Technical', icon: 'smartphone', description: 'App issues & features' },
];

export const HELP_ARTICLES: HelpArticle[] = [
  { title: 'How do I verify my identity?', category: 'Getting started', helpful: 1247 },
  { title: 'How long do transfers take?', category: 'Transfers', helpful: 892 },
  { title: 'What are the card spending limits?', category: 'Cards', helpful: 756 },
  { title: 'How do I freeze my card?', category: 'Security', helpful: 643 },
  { title: 'What exchange rate will I get?', category: 'Fees & Pricing', helpful: 598 },
  { title: 'How do I add a team member?', category: 'Business', helpful: 445 },
  { title: 'Why was my transfer declined?', category: 'Transfers', helpful: 389 },
  { title: 'How do I close my account?', category: 'Accounts', helpful: 312 },
];

export const VIDEO_TUTORIALS: VideoTutorial[] = [
  { title: 'Getting started with Lumina', duration: '3:45', thumbnail: '/images/help/video-1.jpg' },
  { title: 'Setting up your first virtual card', duration: '2:30', thumbnail: '/images/help/video-2.jpg' },
  { title: 'Making your first transfer', duration: '4:15', thumbnail: '/images/help/video-3.jpg' },
];

export const BLOG_CATEGORIES = ['All', 'Product Updates', 'Financial Tips', 'Company News', 'Engineering', 'Customer Stories'];

export const INTEGRATION_PARTNERS = [
  'QuickBooks', 'Xero', 'Sage', 'Stripe', 'PayPal', 'Shopify',
  'Slack', 'FreeAgent', 'Zapier', 'HubSpot', 'Salesforce', 'AWS',
];

export const PRESS_MENTIONS = [
  { publication: 'TechCrunch', quote: "Lumina is building the banking infrastructure for a borderless world, and 3 million users seem to agree." },
  { publication: 'Forbes', quote: "The most beautifully designed banking app on the market. Lumina makes managing multi-currency finances feel effortless." },
  { publication: 'Wired', quote: "A genuine challenger to traditional banking. Lumina's transparency on fees alone could disrupt the industry." },
];

export const FOOTER_PRODUCT_LINKS: NavLink[] = [
  { label: 'Personal', href: '/personal' },
  { label: 'Business', href: '/business' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Cards', href: '/personal' },
  { label: 'Exchange rates', href: '/pricing' },
  { label: 'Security', href: '/personal' },
];

export const FOOTER_COMPANY_LINKS: NavLink[] = [
  { label: 'About us', href: '/about' },
  { label: 'Careers', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Press', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_RESOURCES_LINKS: NavLink[] = [
  { label: 'Help centre', href: '/help' },
  { label: 'Community', href: '/help' },
  { label: 'Developers (API)', href: '/business' },
  { label: 'Status page', href: '#' },
  { label: 'Sitemap', href: '#' },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: 'Privacy policy', href: '#' },
  { label: 'Terms of service', href: '/terms' },
  { label: 'Cookie policy', href: '#' },
  { label: 'FSCS information', href: '#' },
  { label: 'Modern slavery statement', href: '#' },
];
