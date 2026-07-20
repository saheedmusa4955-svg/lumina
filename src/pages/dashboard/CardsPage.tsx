import { Plus, CreditCard, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CardsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pt-2 md:pt-0 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Cards</h1>
        <p className="text-sm text-lumina-text-secondary mt-1">Manage your virtual and physical cards.</p>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
        
        {/* Abstract Card Graphic */}
        <div className="relative mb-8 group">
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
          
          <div className="w-64 h-40 bg-gradient-to-br from-lumina-surface to-lumina-bg border border-lumina-border rounded-2xl p-6 relative overflow-hidden shadow-2xl z-10 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
            {/* Chip */}
            <div className="w-10 h-7 bg-white/10 rounded flex items-center px-1 mb-6">
              <div className="w-full h-px bg-white/20 my-1" />
            </div>
            {/* Number placeholder */}
            <div className="flex gap-4">
              <div className="h-2 w-12 bg-white/10 rounded-full" />
              <div className="h-2 w-12 bg-white/10 rounded-full" />
              <div className="h-2 w-12 bg-white/10 rounded-full" />
              <div className="h-2 w-12 bg-white/10 rounded-full" />
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 w-64 h-40 bg-gradient-to-br from-gray-900 to-black border border-white/5 rounded-2xl p-6 overflow-hidden shadow-2xl z-0 transform rotate-3 opacity-50"></div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">No active cards</h2>
        <p className="text-lumina-text-secondary max-w-md mx-auto mb-8 text-sm">
          Get a Lumina card to spend globally with zero hidden fees. Choose between an instant virtual card or a physical card delivered to your door.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white h-12 rounded-xl text-sm font-bold transition-transform active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-2" /> Get Virtual Card
          </Button>
          <Button className="flex-1 bg-white hover:bg-gray-100 text-[#0d1117] h-12 rounded-xl text-sm font-bold transition-transform active:scale-[0.98]">
            <CreditCard className="w-4 h-4 mr-2" /> Order Physical
          </Button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="bg-lumina-surface border-lumina-border rounded-2xl shadow-none">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Global Spending</h3>
              <p className="text-xs text-lumina-text-secondary mt-1">Pay in any currency anywhere MasterCard is accepted.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-lumina-surface border-lumina-border rounded-2xl shadow-none">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Advanced Security</h3>
              <p className="text-xs text-lumina-text-secondary mt-1">Freeze cards and generate single-use numbers instantly.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lumina-surface border-lumina-border rounded-2xl shadow-none">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Instant Access</h3>
              <p className="text-xs text-lumina-text-secondary mt-1">Start spending online immediately with virtual cards.</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
