import { Rocket, CreditCard, Send, Wallet, Shield, Receipt, Building, Smartphone, MessageCircle, Mail, Play, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';

import { HELP_CATEGORIES, HELP_ARTICLES, VIDEO_TUTORIALS } from '@/lib/constants';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = {
  rocket: Rocket, 'credit-card': CreditCard, send: Send, wallet: Wallet,
  shield: Shield, receipt: Receipt, building: Building, smartphone: Smartphone,
};

const contactMethods = [
  { icon: MessageCircle, title: 'Live Chat', desc: 'Get instant help from our support team.', info: 'Available 24/7', cta: 'Start chat', primary: true },
  { icon: Mail, title: 'Email us', desc: 'For non-urgent questions and detailed inquiries.', info: 'team@theluminaonlinebanking.com', cta: 'Send email', response: 'We reply within 2 hours' },
];

export default function HelpPage() {
  return (
    <div className="pt-16">
      {/* Hero with Search */}
      <section className="pt-24 lg:pt-32 pb-20 text-center" style={{ background: 'linear-gradient(180deg, #0A1428 0%, #0F172A 100%)' }}>
        <FadeIn><span className="text-xs font-medium text-lumina-accent uppercase tracking-[0.1em]">Help Centre</span></FadeIn>
        <FadeIn delay={0.1}><h1 className="text-3xl md:text-5xl font-normal text-white mt-4">How can we help?</h1></FadeIn>
        <FadeIn delay={0.2}><p className="text-base text-lumina-text-secondary mt-4">Search our knowledge base or browse categories below.</p></FadeIn>
        <FadeIn delay={0.3}>
          <div className="max-w-xl mx-auto mt-8 relative">
            <input
              type="text"
              placeholder="Search for articles, topics, or keywords..."
              className="w-full h-14 bg-lumina-surface border border-lumina-border rounded-xl pl-5 pr-20 text-base text-white placeholder:text-lumina-text-tertiary focus:border-lumina-accent focus:outline-none focus:ring-2 focus:ring-lumina-accent/20 transition-all"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-lumina-text-tertiary">Press /</span>
          </div>
        </FadeIn>
      </section>

      {/* Categories */}
      <section className="py-16 bg-lumina-bg">
        <div className="max-w-content mx-auto px-6">
          <h3 className="text-xl font-normal text-white mb-6">Browse by topic</h3>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HELP_CATEGORIES.map((cat, i) => {
              const Icon = iconMap[cat.icon] || HelpCircle;
              return (
                <StaggerItem key={i}>
                  <motion.div whileHover={{ y: -2, borderColor: '#334155' }} transition={{ duration: 0.3 }} className="bg-lumina-surface border border-lumina-border rounded-xl p-5 hover:shadow-card-hover transition-all cursor-pointer h-full">
                    <Icon size={24} className="text-lumina-accent mb-3" />
                    <p className="text-sm font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-lumina-text-tertiary mt-1">{cat.description}</p>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-lumina-surface border-t border-lumina-border">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="text-xl font-normal text-white mb-6">Popular articles</h3>
          <div className="space-y-2">
            {HELP_ARTICLES.map((article, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <motion.div whileHover={{ borderColor: '#334155' }} className="bg-lumina-surface border border-lumina-border rounded-xl p-5 flex items-center justify-between cursor-pointer hover:bg-lumina-surface-light/50 transition-all">
                  <div>
                    <p className="text-sm font-medium text-white">{article.title}</p>
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-lumina-accent/15 text-lumina-accent text-[10px] font-medium">{article.category}</span>
                  </div>
                  <span className="text-xs text-lumina-text-tertiary shrink-0 ml-4">
                    <span className="text-lumina-accent mr-1">&#x1F44D;</span>{article.helpful.toLocaleString()}
                  </span>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 bg-lumina-bg border-t border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <h3 className="text-xl font-normal text-white mb-6">Video tutorials</h3>
          <StaggerContainer className="grid sm:grid-cols-3 gap-6">
            {VIDEO_TUTORIALS.map((video, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="bg-lumina-surface border border-lumina-border rounded-xl overflow-hidden hover:shadow-card-hover transition-all cursor-pointer">
                  <div className="relative aspect-video">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <Play size={20} className="text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{video.title}</p>
                    <span className="text-xs text-lumina-text-tertiary bg-lumina-surface-light px-2 py-0.5 rounded-full">{video.duration}</span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-24 bg-lumina-surface border-t border-lumina-border">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="bg-lumina-surface border border-lumina-border rounded-2xl p-10 text-center">
              <h3 className="text-2xl font-normal text-white">Still need help?</h3>
              <p className="text-sm text-lumina-text-secondary mt-3">Our support team is available 24/7. Average response time: 2 minutes.</p>
              <div className="grid sm:grid-cols-2 gap-6 mt-10 max-w-xl mx-auto">
                {contactMethods.map((method, i) => (
                  <div key={i} className="text-center">
                    <method.icon size={32} className="text-lumina-accent mx-auto mb-3" />
                    <p className="text-base font-medium text-white">{method.title}</p>
                    <p className="text-xs text-lumina-text-secondary mt-1">{method.desc}</p>
                    <p className="text-xs text-lumina-text-tertiary mt-1">{method.info}</p>
                    <Link to="/contact" className={`inline-flex h-10 px-5 rounded-full items-center text-xs font-medium mt-4 transition-all ${method.primary ? 'bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark' : 'border border-lumina-border text-white hover:border-lumina-border-hover'}`}>
                      {method.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
