import { SectionHeader } from '@/components/SectionHeader';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import { INTEGRATION_PARTNERS } from '@/lib/constants';

const partnerColors: Record<string, string> = {
  QuickBooks: 'bg-green-600',
  Xero: 'bg-blue-500',
  Sage: 'bg-red-500',
  Stripe: 'bg-purple-600',
  PayPal: 'bg-blue-700',
  Shopify: 'bg-green-700',
  Slack: 'bg-purple-500',
  FreeAgent: 'bg-red-600',
  Zapier: 'bg-orange-500',
  HubSpot: 'bg-orange-600',
  Salesforce: 'bg-blue-600',
  AWS: 'bg-orange-400',
};

export function IntegrationsSection() {
  return (
    <section className="py-24 lg:py-32 bg-lumina-bg border-t border-lumina-border">
      <div className="max-w-content mx-auto px-6">
        <SectionHeader
          eyebrow="Integrations"
          heading="Connects with your favourite tools"
          description="Sync transactions, automate bookkeeping, and streamline your workflow with 50+ integrations."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Partners Grid */}
          <StaggerContainer className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {INTEGRATION_PARTNERS.map((partner) => (
              <StaggerItem key={partner}>
                <motion.div
                  whileHover={{ scale: 1.05, borderColor: '#334155' }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="bg-lumina-surface border border-lumina-border rounded-xl p-4 flex items-center justify-center h-20 hover:bg-lumina-surface-light transition-colors cursor-default"
                  title={partner}
                >
                  <div className={`w-8 h-8 rounded-lg ${partnerColors[partner] || 'bg-lumina-surface-lighter'} flex items-center justify-center text-white text-xs font-bold`}>
                    {partner[0]}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
            <StaggerItem>
              <div className="flex items-center justify-center h-20 text-sm text-lumina-accent font-medium">
                +42 more &rarr;
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Video Placeholder */}
          <FadeIn direction="right">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-lumina-border shadow-card bg-lumina-surface group cursor-pointer">
              <img
                src="/images/pages/business-dashboard.jpg"
                alt="Lumina app demo"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <polygon points="8,5 20,12 8,19" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
