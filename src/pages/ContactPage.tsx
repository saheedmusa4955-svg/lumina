import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { SectionHeader } from '@/components/SectionHeader';
import { OFFICES } from '@/lib/constants';
import { motion } from 'framer-motion';

const contactMethods = [
  { icon: MessageCircle, title: 'Live Chat', desc: 'Get instant help from our support team.', availability: 'Available 24/7', cta: 'Start chat', primary: true },
  { icon: Mail, title: 'Email us', desc: 'For non-urgent questions and detailed inquiries.', info: 'team@theluminaonlinebanking.com', response: 'We reply within 2 hours', cta: 'Send email' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', topic: 'General inquiry', message: '' });

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="pt-24 lg:pt-32 pb-16 text-center" style={{ background: 'linear-gradient(180deg, #0A1428 0%, #0F172A 100%)' }}>
        <FadeIn><span className="text-xs font-medium text-lumina-accent uppercase tracking-[0.1em]">Contact us</span></FadeIn>
        <FadeIn delay={0.1}><h1 className="text-3xl md:text-5xl font-normal text-white mt-4">We&apos;re here to help</h1></FadeIn>
        <FadeIn delay={0.2}><p className="text-base text-lumina-text-secondary mt-5 max-w-lg mx-auto">Choose the best way to reach us. Our team is available around the clock.</p></FadeIn>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-lumina-bg">
        <div className="max-w-4xl mx-auto px-6">
          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {contactMethods.map((method, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="bg-lumina-surface border border-lumina-border rounded-xl p-8 text-center hover:shadow-card-hover transition-all h-full flex flex-col">
                  <method.icon size={40} className="text-lumina-accent mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white">{method.title}</h3>
                  <p className="text-sm text-lumina-text-secondary mt-2">{method.desc}</p>
                  {method.info && <p className="text-sm text-lumina-accent mt-2 font-medium">{method.info}</p>}
                  <p className="text-xs text-lumina-text-tertiary mt-1">{method.availability || method.response}</p>
                  <div className="mt-auto pt-6">
                    <Link to="#" className={`inline-flex h-11 px-6 rounded-full items-center text-sm font-medium transition-all w-full justify-center ${method.primary ? 'bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark' : 'border border-lumina-border text-white hover:border-lumina-border-hover'}`}>
                      {method.cta}
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Offices */}
      <section className="py-24 bg-lumina-surface border-t border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <SectionHeader eyebrow="Visit us" heading="Our offices" />
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
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${office.tag === 'HQ' ? 'bg-lumina-accent/15 text-lumina-accent' : 'bg-lumina-surface-light text-lumina-text-tertiary'}`}>{office.tag}</span>
                    </div>
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin size={12} className="text-lumina-text-tertiary mt-0.5 shrink-0" />
                      <p className="text-xs text-lumina-text-secondary">{office.address}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-lumina-bg border-t border-lumina-border">
        <div className="max-w-lg mx-auto px-6">
          <FadeIn>
            <div className="bg-lumina-surface border border-lumina-border rounded-2xl p-8">
              <h3 className="text-xl font-normal text-white">Send us a message</h3>
              <p className="text-sm text-lumina-text-secondary mt-2">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
              <form className="space-y-5 mt-8" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 px-4 bg-lumina-surface border border-lumina-border rounded-xl text-sm text-white placeholder:text-lumina-text-tertiary focus:border-lumina-accent focus:outline-none focus:ring-2 focus:ring-lumina-accent/20 transition-all" />
                <input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-12 px-4 bg-lumina-surface border border-lumina-border rounded-xl text-sm text-white placeholder:text-lumina-text-tertiary focus:border-lumina-accent focus:outline-none focus:ring-2 focus:ring-lumina-accent/20 transition-all" />
                <select value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className="w-full h-12 px-4 bg-lumina-surface border border-lumina-border rounded-xl text-sm text-white focus:border-lumina-accent focus:outline-none focus:ring-2 focus:ring-lumina-accent/20 transition-all appearance-none">
                  {['General inquiry', 'Account issue', 'Business sales', 'Press', 'Partnerships', 'Other'].map((t) => <option key={t} value={t} className="bg-lumina-surface">{t}</option>)}
                </select>
                <textarea placeholder="How can we help?" rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 bg-lumina-surface border border-lumina-border rounded-xl text-sm text-white placeholder:text-lumina-text-tertiary focus:border-lumina-accent focus:outline-none focus:ring-2 focus:ring-lumina-accent/20 transition-all resize-none" />
                <button type="submit" className="w-full h-12 rounded-full text-sm font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-all hover:scale-[1.02]">Send message</button>
              </form>
              <p className="text-xs text-lumina-text-tertiary text-center mt-4">Prefer to chat? Our live support is usually faster.</p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
