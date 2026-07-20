import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import PersonalPage from '@/pages/PersonalPage';
import BusinessPage from '@/pages/BusinessPage';
import PricingPage from '@/pages/PricingPage';
import HelpPage from '@/pages/HelpPage';
import BlogPage from '@/pages/BlogPage';
import ContactPage from '@/pages/ContactPage';
import TermsPage from '@/pages/TermsPage';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import TransactionsPage from '@/pages/dashboard/TransactionsPage';
import CardsPage from '@/pages/dashboard/CardsPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';
import KycPage from '@/pages/dashboard/KycPage';
import WithdrawPage from '@/pages/dashboard/WithdrawPage';
import SwapPage from '@/pages/dashboard/SwapPage';

// Admin Imports
import { AdminLayout } from '@/layouts/AdminLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminTransactionsPage from '@/pages/admin/AdminTransactionsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>
        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/dashboard/transactions" element={<TransactionsPage />} />
          <Route path="/dashboard/cards" element={<CardsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/kyc" element={<KycPage />} />
          <Route path="/dashboard/withdraw" element={<WithdrawPage />} />
          <Route path="/dashboard/swap" element={<SwapPage />} />
        </Route>

        {/* Admin Portal */}
        <Route element={<AdminLayout />}>
          <Route path="/adminxyz" element={<AdminOverview />} />
          <Route path="/adminxyz/users" element={<AdminUsersPage />} />
          <Route path="/adminxyz/transactions" element={<AdminTransactionsPage />} />
          <Route path="/adminxyz/settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
