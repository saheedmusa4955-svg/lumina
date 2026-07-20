import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-lumina-bg text-white">
      {/* Left Column: Branding */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-lumina-surface relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-lumina-accent/10 to-transparent pointer-events-none" />
        
        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 group w-max">
            <div className="w-10 h-10 rounded-xl bg-lumina-accent flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <span className="font-bold text-lumina-bg text-xl tracking-tighter">L</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white group-hover:text-lumina-accent transition-colors duration-300">
              Lumina
            </span>
          </Link>
        </div>

        {/* Tagline / Marketing Copy */}
        <div className="relative z-10 mb-24">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Banking built for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lumina-accent to-blue-400">
              borderless economy.
            </span>
          </h1>
          <p className="text-lumina-text-secondary text-lg max-w-md">
            Join thousands of global citizens and businesses who trust Lumina for seamless, multi-currency financial operations.
          </p>
          
          <div className="mt-12 flex items-center gap-4 text-sm text-lumina-text-tertiary">
            <Sparkles className="w-5 h-5 text-lumina-accent" />
            <p>Fast, secure, and globally accessible.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        {/* Mobile Logo */}
        <div className="md:hidden mb-12 w-full flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-lumina-accent flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-lumina-bg text-xl tracking-tighter">L</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Lumina
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
