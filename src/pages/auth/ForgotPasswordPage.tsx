import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  if (isSent) {
    return (
      <div className="w-full flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 bg-lumina-accent/10 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="w-8 h-8 text-lumina-accent" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-3">Check your email</h2>
          <p className="text-lumina-text-secondary mb-8">
            We've sent a password reset link to <br />
            <span className="font-medium text-white">{email}</span>
          </p>
        </div>
        <Link to="/login" className="w-full">
          <Button 
            className="w-full h-12 bg-lumina-surface border border-lumina-border hover:bg-lumina-surface-light text-white font-semibold"
          >
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center sm:text-left mb-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Reset password</h2>
        <p className="text-lumina-text-secondary">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

        <Button 
          type="submit" 
          className="w-full h-12 mt-2 bg-lumina-accent hover:bg-lumina-accent-dark text-lumina-bg font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-lumina-bg/30 border-t-lumina-bg rounded-full animate-spin" />
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>

      <div className="text-center mt-6">
        <Link to="/login" className="inline-flex items-center text-lumina-text-secondary hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
