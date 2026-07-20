import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CurrencyFeed } from '@/components/CurrencyFeed';

export function MarketingLayout() {
  return (
    <div className="min-h-screen bg-lumina-bg text-white pb-12">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CurrencyFeed />
    </div>
  );
}
