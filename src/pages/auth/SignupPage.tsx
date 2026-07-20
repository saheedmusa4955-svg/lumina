import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Mail, Lock, User, Globe, Phone } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'EU', name: 'European Union', flag: '🇪🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', { 
        email, 
        password, 
        fullName: name,
        country
      });
      login(res.data.token, res.data.user);
      
      if (res.data.user.role === 'ADMIN') {
        navigate('/adminxyz');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center sm:text-left mb-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
        <p className="text-lumina-text-secondary">
          Join Lumina to unlock borderless banking
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-text-tertiary w-5 h-5" />
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              className="pl-10 h-12 bg-lumina-surface border-lumina-border focus-visible:ring-lumina-accent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-text-tertiary w-5 h-5" />
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              className="pl-10 h-12 bg-lumina-surface border-lumina-border focus-visible:ring-lumina-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select onValueChange={setCountry} value={country}>
              <SelectTrigger id="country" className="h-12 bg-lumina-surface border-lumina-border hover:bg-lumina-surface-light transition-colors focus:ring-lumina-accent">
                <div className="flex items-center gap-2">
                  <Globe className="text-lumina-text-tertiary w-5 h-5" />
                  <SelectValue placeholder="Select Country" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-lumina-surface border-lumina-border text-white max-h-[300px]">
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="focus:bg-lumina-surface-light focus:text-white cursor-pointer">
                    <span className="mr-2">{c.flag}</span> {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-text-tertiary w-5 h-5" />
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+1 (555) 000-0000" 
                className="pl-10 h-12 bg-lumina-surface border-lumina-border focus-visible:ring-lumina-accent"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-text-tertiary w-5 h-5" />
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="pl-10 h-12 bg-lumina-surface border-lumina-border focus-visible:ring-lumina-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <p className="text-xs text-lumina-text-tertiary mt-1">
            Must be at least 8 characters long
          </p>
        </div>
        <p className="text-xs text-lumina-text-tertiary text-center">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-white hover:text-lumina-accent underline transition-colors">
            Terms of Service
          </Link>
          .
        </p>

        <Button 
          type="submit" 
          className="w-full h-12 mt-2 bg-lumina-accent hover:bg-lumina-accent-dark text-lumina-bg font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-lumina-bg/30 border-t-lumina-bg rounded-full animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-lumina-text-secondary text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-medium hover:text-lumina-accent transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
