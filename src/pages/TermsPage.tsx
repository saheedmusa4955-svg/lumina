import { FadeIn } from '@/components/animations/FadeIn';

export default function TermsPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="pt-24 lg:pt-32 pb-16 text-center" style={{ background: 'linear-gradient(180deg, #0A1428 0%, #0F172A 100%)' }}>
        <FadeIn><span className="text-xs font-medium text-lumina-accent uppercase tracking-[0.1em]">Legal</span></FadeIn>
        <FadeIn delay={0.1}><h1 className="text-3xl md:text-5xl font-normal text-white mt-4">Terms and Conditions</h1></FadeIn>
        <FadeIn delay={0.2}><p className="text-base text-lumina-text-secondary mt-5 max-w-lg mx-auto">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></FadeIn>
      </section>

      {/* Content */}
      <section className="py-16 bg-lumina-bg">
        <div className="max-w-3xl mx-auto px-6 text-lumina-text-secondary space-y-8">
          <FadeIn>
            <h2 className="text-xl font-medium text-white mb-4">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing or using Lumina Bank's online banking services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you do not have permission to access the Service.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h2 className="text-xl font-medium text-white mb-4">2. Account Registration</h2>
            <p className="leading-relaxed">
              To use our services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h2 className="text-xl font-medium text-white mb-4">3. Security</h2>
            <p className="leading-relaxed">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <h2 className="text-xl font-medium text-white mb-4">4. Compliance and KYC</h2>
            <p className="leading-relaxed">
              As a financial institution, we are required to verify the identity of our users. You agree to provide valid identification and any other documents requested to complete our Know Your Customer (KYC) verification process. Your account may be limited or suspended until this process is successfully completed.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <h2 className="text-xl font-medium text-white mb-4">5. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:team@theluminaonlinebanking.com" className="text-lumina-accent hover:underline mt-2 inline-block">team@theluminaonlinebanking.com</a>
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
