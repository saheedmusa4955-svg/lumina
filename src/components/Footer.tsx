import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/animations/FadeIn';
import {
  FOOTER_PRODUCT_LINKS,
  FOOTER_COMPANY_LINKS,
  FOOTER_RESOURCES_LINKS,
  FOOTER_LEGAL_LINKS,
} from '@/lib/constants';

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-medium text-white uppercase tracking-wider mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              className="text-sm text-lumina-text-secondary hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-lumina-surface border-t border-lumina-border">
      <FadeIn>
        <div className="max-w-content mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-lumina-accent">
                  <path d="M4 20L12 4L8 12H16L12 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 4L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <span className="text-base font-semibold text-white">Lumina</span>
              </Link>
              <p className="text-xs text-lumina-text-tertiary mb-6">Banking without borders</p>
              <div>
                <p className="text-xs font-medium text-lumina-text-secondary mb-2">Get the app</p>
                <div className="flex gap-2">
                  <div className="w-[100px] h-[34px] bg-white/10 rounded-md flex items-center justify-center text-[10px] text-lumina-text-tertiary">
                    App Store
                  </div>
                  <div className="w-[100px] h-[34px] bg-white/10 rounded-md flex items-center justify-center text-[10px] text-lumina-text-tertiary">
                    Google Play
                  </div>
                </div>
              </div>
            </div>

            <FooterColumn title="Product" links={FOOTER_PRODUCT_LINKS} />
            <FooterColumn title="Company" links={FOOTER_COMPANY_LINKS} />
            <FooterColumn title="Resources" links={FOOTER_RESOURCES_LINKS} />
            <FooterColumn title="Legal" links={FOOTER_LEGAL_LINKS} />
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-lumina-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs text-lumina-text-tertiary">
                &copy; 2025 Lumina Bank Ltd. All rights reserved.
              </p>
              <p className="text-xs text-lumina-text-tertiary mt-1 max-w-xl">
                Lumina Bank Ltd is authorised by the Financial Conduct Authority (FCA) as an e-money institution. Firm reference number: 900000.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {['X', 'in', 'IG', 'YT'].map((social) => (
                <span
                  key={social}
                  className="text-xs text-lumina-text-tertiary hover:text-white transition-colors cursor-pointer"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </footer>
  );
}
