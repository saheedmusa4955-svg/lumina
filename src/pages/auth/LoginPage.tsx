import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { 
        email, 
        password,
        ...(requires2FA && { twoFactorCode })
      });
      
      login(res.data.token, res.data.user);
      
      if (res.data.user.role === 'ADMIN') {
        navigate('/adminxyz');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.requiresTwoFactor) {
        setRequires2FA(true);
      } else {
        setError(err.response?.data?.error || 'Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center sm:text-left mb-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
        <p className="text-lumina-text-secondary">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">{error}</div>}
        
        {!requires2FA ? (
          <>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-lumina-accent hover:text-lumina-accent-dark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
            <Label htmlFor="twoFactorCode">Authenticator Code</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-accent w-5 h-5" />
              <Input 
                id="twoFactorCode" 
                type="text" 
                placeholder="000000" 
                maxLength={6}
                className="pl-10 h-12 bg-lumina-surface border-lumina-accent/50 focus-visible:ring-lumina-accent text-lg font-mono tracking-widest text-white"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-lumina-text-secondary mt-2">Please enter the 6-digit code from your authenticator app.</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 mt-2 bg-lumina-accent hover:bg-lumina-accent-dark text-lumina-bg font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-lumina-bg/30 border-t-lumina-bg rounded-full animate-spin" />
          ) : (
            <>
              {requires2FA ? 'Verify Code' : 'Sign In'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-lumina-text-secondary text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white font-medium hover:text-lumina-accent transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
