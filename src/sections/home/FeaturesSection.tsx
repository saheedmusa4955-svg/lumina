import { Globe, Zap, CreditCard, Shield, BarChart3, RefreshCw, Building, HelpCircle, Target } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { motion } from 'framer-motion';

const features = [
  { icon: Globe, title: 'Hold 40+ currencies', description: 'Open accounts in USD, EUR, GBP, JPY, and more. Switch between currencies instantly at real exchange rates.', link: 'Explore currencies', span: 'col-span-1 md:col-span-2', image: '/images/features/multi-currency.jpg' },
  { icon: Zap, title: 'Send in seconds', description: 'Transfer money instantly to other Lumina users, or same-day to external accounts worldwide.' },
  { icon: CreditCard, title: 'Virtual & physical cards', description: 'Generate virtual cards for online shopping. Freeze, unfreeze, or set spending limits instantly.', image: '/images/features/card-thumbnail.jpg' },
  { icon: Shield, title: 'Bank-grade security', description: '256-bit encryption, biometric login, and real-time transaction alerts keep your money safe.' },
  { icon: BarChart3, title: 'Spending insights', description: 'Track where your money goes with smart categorization. Set budgets and get notified before you overspend.', link: 'See how it works', span: 'col-span-1 md:col-span-2', image: '/images/features/insights-chart.jpg' },
  { icon: RefreshCw, title: 'Real exchange rates', description: 'No hidden markups. Get the mid-market rate for every currency exchange, with full transparency.' },
  { icon: Globe, title: '160+ countries', description: 'Send money to bank accounts in over 160 countries, with local banking details for major currencies.' },
  { icon: Building, title: 'Built for business', description: 'Multi-user access, expense cards, accounting integrations, and VAT tools for growing teams.', link: 'Learn more' },
  { icon: HelpCircle, title: 'Always here to help', description: 'Chat with our support team 24/7. Average response time under 2 minutes.' },
  { icon: Target, title: 'Save smarter', description: 'Create savings goals, round up spare change, and earn interest on your balances. Set it and forget it.', link: 'Start saving', span: 'col-span-1 md:col-span-2', image: '/images/features/savings-target.jpg' },
];

export function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 bg-lumina-bg">
      <div className="max-w-content mx-auto px-6">
        <SectionHeader
          eyebrow="Why choose Lumina"
          heading="One app, endless possibilities"
          description="From daily spending to global transfers, Lumina puts powerful banking tools in your pocket."
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <StaggerItem key={i} className={feature.span || ''}>
              <motion.div
                whileHover={{ y: -4, borderColor: '#334155' }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="h-full bg-lumina-surface border border-lumina-border rounded-xl p-8 hover:shadow-card-hover transition-all duration-400 group"
              >
                {feature.image && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img src={feature.image} alt={feature.title} className="w-full h-40 object-cover" loading="lazy" />
                  </div>
                )}
                {!feature.image && (
                  <feature.icon size={32} className="text-lumina-accent mb-5" />
                )}
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-lumina-text-secondary leading-relaxed">{feature.description}</p>
                {feature.link && (
                  <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-lumina-accent group-hover:gap-2.5 transition-all duration-200">
                    {feature.link} &rarr;
                  </span>
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
