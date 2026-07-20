import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Zap, Shield, Landmark } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionHeader } from '@/components/SectionHeader';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';

const tabs = ['Accounts', 'Cards', 'Transfers', 'Savings', 'Security'];

const tabContent: Record<string, { title: string; desc: string; features: string[]; image?: string }[]> = {
  Accounts: [
    { title: 'Hold 40+ currencies in one place', desc: 'Open accounts in GBP, EUR, USD, JPY, AUD, CAD, CHF, and 33 more. Switch between currencies instantly at the real exchange rate.', features: ['40+ supported currencies', 'Real exchange rates, always', 'Instant currency conversion', 'Local account details for GBP, EUR, USD, AUD'], image: '/images/pages/personal-accounts.jpg' },
    { title: 'Get local bank details', desc: 'Receive payments like a local with your own account numbers and sort codes for GBP, EUR, USD, and AUD.', features: ['UK sort code & account number', 'European IBAN', 'US routing & account number', 'Australian BSB & account number'], image: '/images/pages/personal-bank-details.jpg' },
  ],
  Cards: [
    { title: 'Virtual cards for safer spending', desc: 'Create up to 20 virtual cards for online shopping, subscriptions, and one-time purchases. Freeze or delete anytime.', features: ['Instant card creation', 'Spending limits', 'Merchant locking', 'Instant freeze'], image: '/images/pages/personal-card-stack.jpg' },
    { title: 'Spend anywhere, pay no foreign fees', desc: 'Your Lumina Mastercard works in 160+ countries. No foreign transaction fees — ever.', features: ['160+ countries', 'Zero foreign fees', 'Contactless & Apple Pay', 'Instant notifications'] },
  ],
  Transfers: [
    { title: 'Send money in seconds', desc: 'Transfer instantly to other Lumina users, or same-day to bank accounts worldwide.', features: ['Lumina-to-Lumina instant', 'UK Faster Payments', 'SEPA same-day', 'SWIFT 1-3 days'] },
    { title: 'Know where your money is', desc: 'Track every transfer in real-time. Get notified when it arrives.', features: ['Real-time tracking', 'Instant notifications', 'Transfer receipts', 'Recipient management'] },
  ],
  Savings: [
    { title: 'Save for what matters', desc: 'Create visual savings goals, set automatic round-ups, and watch your money grow.', features: ['Custom goals', 'Round-up spare change', 'Interest on balances', 'Visual progress tracking'], image: '/images/pages/personal-savings.jpg' },
    { title: 'Earn on your balance', desc: 'Earn competitive interest on your GBP and EUR balances. Paid daily, no lock-in.', features: ['Daily interest', 'No minimum balance', 'No lock-in period', 'Compound growth'] },
  ],
  Security: [
    { title: 'Your face is your password', desc: 'Log in with Face ID, fingerprint, or PIN. No passwords to remember or steal.', features: ['Face ID login', 'Fingerprint auth', 'Secure PIN', 'Biometric payments'] },
    { title: 'Freeze anything, anytime', desc: 'Lost your card? Freeze it in one tap. Suspicious transaction? Block it instantly.', features: ['Instant card freeze', 'Location-based security', 'Transaction alerts', 'PIN reminder'] },
  ],
};

const useCases = [
  { icon: Globe, title: 'Travellers', desc: 'No foreign fees in 160+ countries. Hold multiple currencies and spend like a local.' },
  { icon: Zap, title: 'Freelancers', desc: 'Get paid in USD, EUR, GBP — whatever your clients use. Convert at real rates.' },
  { icon: Shield, title: 'Students', desc: 'Budget with savings goals. No monthly fees. Perfect for studying abroad.' },
  { icon: Landmark, title: 'Expats', desc: 'Keep accounts in your home and new country. Transfer between them instantly.' },
];

export default function PersonalPage() {
  const [activeTab, setActiveTab] = useState('Accounts');

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="pt-24 lg:pt-32 pb-16 text-center" style={{ background: 'linear-gradient(180deg, #0A1428 0%, #0F172A 100%)' }}>
        <FadeIn>
          <span className="text-xs font-medium text-lumina-accent uppercase tracking-[0.1em]">Personal Banking</span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-3xl md:text-5xl font-normal text-white mt-4">Your money, everywhere you go</h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-base text-lumina-text-secondary mt-5 max-w-xl mx-auto">
            Hold 40+ currencies, spend with a global card, and send money instantly — all from one beautiful app.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/contact" className="inline-flex h-12 px-6 rounded-full items-center justify-center text-[15px] font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-all hover:scale-[1.02]">Open free account</Link>
            <button onClick={() => document.getElementById('features')?.scrollIntoView()} className="inline-flex h-12 px-6 rounded-full items-center justify-center text-[15px] font-medium border border-lumina-border text-white hover:border-lumina-border-hover transition-all">See all features</button>
          </div>
        </FadeIn>
      </section>

      {/* Sub-nav Tabs */}
      <div className="sticky top-16 z-30 bg-lumina-surface/95 backdrop-blur-xl border-b border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab ? 'bg-lumina-surface text-white shadow-sm' : 'text-lumina-text-tertiary hover:text-lumina-text-secondary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Showcase */}
      <section id="features" className="py-16 bg-lumina-bg">
        <div className="max-w-content mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {tabContent[activeTab].map((feature, i) => (
                <div key={i} className={`grid lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={i % 2 === 1 && feature.image ? 'lg:order-2' : ''}>
                    <h3 className="text-2xl font-normal text-white mb-4">{feature.title}</h3>
                    <p className="text-base text-lumina-text-secondary leading-relaxed mb-6">{feature.desc}</p>
                    <ul className="space-y-3">
                      {feature.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-lumina-text-secondary">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-lumina-accent shrink-0">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {feature.image && (
                    <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="rounded-xl overflow-hidden border border-lumina-border">
                        <img src={feature.image} alt={feature.title} className="w-full h-64 md:h-80 object-cover" loading="lazy" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-lumina-surface border-t border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <SectionHeader eyebrow="Who it's for" heading="Built for every lifestyle" />
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="bg-lumina-surface border border-lumina-border rounded-xl p-8 hover:shadow-card-hover transition-all h-full">
                  <uc.icon size={28} className="text-lumina-accent mb-4" />
                  <h3 className="text-base font-medium text-white mb-2">{uc.title}</h3>
                  <p className="text-sm text-lumina-text-secondary">{uc.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-lumina-surface border-t border-lumina-border">
        <FadeIn>
          <h2 className="text-3xl font-normal text-white">Ready to get started?</h2>
          <p className="text-base text-lumina-text-secondary mt-4">Open your free account in minutes. No credit check, no monthly fees.</p>
          <Link to="/contact" className="inline-flex h-12 px-8 rounded-full items-center text-[15px] font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-all hover:scale-[1.02] mt-8">Open free account</Link>
        </FadeIn>
      </section>
    </div>
  );
}
