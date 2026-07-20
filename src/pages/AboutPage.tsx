import { Link } from 'react-router-dom';
import { Globe, Landmark, Sparkles, Zap, Shield } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { motion } from 'framer-motion';
import { FOUNDERS, TIMELINE_EVENTS, OFFICES, PRESS_MENTIONS } from '@/lib/constants';

const values = [
  { icon: Globe, title: 'Customer first', desc: "We build what our customers actually need, not what bankers think they want. Every feature starts with a conversation." },
  { icon: Landmark, title: 'Radical transparency', desc: "No hidden fees, no confusing terms. We explain everything in plain English and show you exactly what you're paying." },
  { icon: Sparkles, title: 'Design matters', desc: "Banking doesn't have to be boring. We obsess over every pixel, every interaction, every millisecond of load time." },
  { icon: Globe, title: 'Global from day one', desc: "We designed Lumina for a world without borders. Multi-currency, multi-language, multi-timezone support built in." },
  { icon: Shield, title: 'Security without friction', desc: "Bank-grade security that stays out of your way. Biometric login, instant freezes, real-time alerts." },
  { icon: Zap, title: 'Move fast, build responsibly', desc: "We ship fast and iterate constantly, but never at the expense of security or compliance." },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="pt-24 lg:pt-32 pb-16 text-center" style={{ background: 'linear-gradient(180deg, #0A1428 0%, #0F172A 100%)' }}>
        <FadeIn>
          <span className="text-xs font-medium text-lumina-accent uppercase tracking-[0.1em]">About Lumina</span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-3xl md:text-5xl font-normal text-white mt-4 max-w-xl mx-auto leading-tight">
            Building the bank the world deserves
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-base text-lumina-text-secondary mt-5 max-w-lg mx-auto leading-relaxed">
            We&apos;re a team of designers, engineers, and banking veterans on a mission to make global banking simple, fair, and beautiful.
          </p>
        </FadeIn>
      </section>

      {/* Mission */}
      <section className="py-24 lg:py-32 bg-lumina-bg">
        <div className="max-w-content mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h2 className="text-3xl font-normal text-white mb-6">Our mission</h2>
                <p className="text-base text-lumina-text-secondary leading-relaxed mb-4">
                  Lumina was founded in 2018 with a simple belief: banking should be as easy as sending a message. No hidden fees, no confusing jargon, no weeks of waiting. Just a beautiful app that puts you in control of your money — wherever you are in the world.
                </p>
                <p className="text-base text-lumina-text-secondary leading-relaxed">
                  Today, over 3 million people in 160+ countries use Lumina to hold 40+ currencies, send money across borders, and spend with confidence. But we&apos;re just getting started.
                </p>
                <div className="flex gap-10 mt-8">
                  {[{ n: '3M+', l: 'Active users' }, { n: '\u00a312B+', l: 'Transactions' }, { n: '160+', l: 'Countries' }].map((s) => (
                    <div key={s.l}>
                      <p className="text-2xl font-normal text-lumina-accent">{s.n}</p>
                      <p className="text-xs text-lumina-text-tertiary mt-1">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="rounded-xl overflow-hidden border border-lumina-border">
                <img src="/images/pages/about-team.jpg" alt="Lumina team" className="w-full h-80 object-cover" loading="lazy" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32 bg-lumina-surface border-t border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <SectionHeader eyebrow="Our values" heading="What drives us every day" />
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -4, borderColor: '#334155' }} transition={{ duration: 0.4 }} className="h-full bg-lumina-surface border border-lumina-border rounded-xl p-8 hover:shadow-card-hover transition-all">
                  <v.icon size={32} className="text-lumina-accent mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-lumina-text-secondary leading-relaxed">{v.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Founders */}
      <section className="py-24 lg:py-32 bg-lumina-bg border-t border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <SectionHeader eyebrow="Meet the founders" heading="The people behind Lumina" />
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {FOUNDERS.map((f, i) => (
              <StaggerItem key={i}>
                <div className="text-center">
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-lumina-border hover:border-lumina-accent transition-colors">
                    <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="text-lg font-medium text-white mt-4">{f.name}</h3>
                  <p className="text-xs text-lumina-accent mt-1">{f.role}</p>
                  <p className="text-sm text-lumina-text-secondary mt-3 max-w-xs mx-auto">{f.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-32 bg-lumina-surface border-t border-lumina-border">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeader eyebrow="Our journey" heading="From idea to 3 million users" />
          <div className="relative">
            {/* Center line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-lumina-accent/20 origin-top"
            />
            <div className="space-y-12">
              {TIMELINE_EVENTS.map((event, i) => (
                <FadeIn key={i} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:text-${i % 2 === 0 ? 'left' : 'right'}`}>
                    <div className="hidden md:block md:w-1/2" />
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-lumina-accent z-10 mt-1.5" />
                    <div className="pl-10 md:pl-0 md:w-1/2">
                      <span className="text-xs font-medium text-lumina-accent">{event.year}</span>
                      <h4 className="text-lg font-medium text-white mt-1">{event.title}</h4>
                      <p className="text-sm text-lumina-text-secondary mt-1">{event.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-24 lg:py-32 bg-lumina-bg border-t border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <SectionHeader eyebrow="Our offices" heading="Where we work" />
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFICES.map((office, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="bg-lumina-surface border border-lumina-border rounded-xl overflow-hidden hover:shadow-card-hover transition-all">
                  <div className="aspect-video">
                    <img src={office.mapImage} alt={office.city} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-medium text-white">{office.city}</h4>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${office.tag === 'HQ' ? 'bg-lumina-accent/15 text-lumina-accent' : 'bg-lumina-surface-light text-lumina-text-tertiary'}`}>
                        {office.tag}
                      </span>
                    </div>
                    <p className="text-xs text-lumina-text-secondary mt-2">{office.address}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Press */}
      <section className="py-24 lg:py-32 bg-lumina-surface border-t border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <SectionHeader eyebrow="In the press" heading="What they're saying about us" />
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {PRESS_MENTIONS.map((press, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="bg-lumina-surface border border-lumina-border rounded-xl p-8 hover:shadow-card-hover transition-all">
                  <p className="text-lg font-semibold text-white mb-4">{press.publication}</p>
                  <p className="text-sm text-lumina-text-secondary italic leading-relaxed">&ldquo;{press.quote}&rdquo;</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-xs text-lumina-accent">Read article &rarr;</span>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center" style={{ background: 'linear-gradient(135deg, #00E5C0 0%, #00C4A0 100%)' }}>
        <FadeIn>
          <h2 className="text-3xl font-normal text-lumina-bg">Ready to join us?</h2>
          <p className="text-base text-lumina-bg/70 mt-4 max-w-md mx-auto">
            Open your account in minutes and see why 3 million people trust Lumina.
          </p>
          <Link to="/contact" className="inline-flex h-12 px-8 rounded-full items-center text-[15px] font-semibold bg-lumina-bg text-white hover:bg-lumina-surface transition-all duration-300 hover:scale-[1.02] mt-8">
            Open free account
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
