import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    MAINTENANCE_MODE: 'false',
    REQUIRE_MANUAL_APPROVAL: 'false',
    NEW_USER_REGISTRATION: 'true',
    EMAIL_PROVIDER: 'SMTP',
    SMTP_HOST: '',
    SMTP_PORT: '587',
    SMTP_USER: '',
    SMTP_PASS: '',
    SMTP_SECURE: 'false',
    BREVO_API_KEY: '',
    SMTP_FROM: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load settings');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.post('/admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleFlag = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: prev[key] === 'true' ? 'false' : 'true' }));
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Admin Settings</h1>
        <p className="text-lumina-text-secondary mt-1">Configure global system parameters.</p>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="bg-lumina-surface border-lumina-border">
          <CardHeader>
            <CardTitle className="text-lg text-white">Global System Flags</CardTitle>
            <CardDescription className="text-lumina-text-secondary">Toggle core system functionalities on or off.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Maintenance Mode</p>
                <p className="text-sm text-lumina-text-secondary mt-1">Disable user logins and transactions temporarily.</p>
              </div>
              <div 
                onClick={() => toggleFlag('MAINTENANCE_MODE')}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.MAINTENANCE_MODE === 'true' ? 'bg-red-500' : 'bg-lumina-surface-light border border-lumina-border'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${settings.MAINTENANCE_MODE === 'true' ? 'right-0.5' : 'left-0.5 bg-lumina-text-tertiary'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-lumina-border/50 pt-6">
              <div>
                <p className="font-medium text-white">Require Manual Approval for Large Transfers</p>
                <p className="text-sm text-lumina-text-secondary mt-1">Transactions over $10,000 will be flagged automatically.</p>
              </div>
              <div 
                onClick={() => toggleFlag('REQUIRE_MANUAL_APPROVAL')}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.REQUIRE_MANUAL_APPROVAL === 'true' ? 'bg-indigo-500' : 'bg-lumina-surface-light border border-lumina-border'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${settings.REQUIRE_MANUAL_APPROVAL === 'true' ? 'right-0.5' : 'left-0.5 bg-lumina-text-tertiary'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-lumina-border/50 pt-6">
              <div>
                <p className="font-medium text-white">New User Registration</p>
                <p className="text-sm text-lumina-text-secondary mt-1">Allow new users to sign up via the public site.</p>
              </div>
              <div 
                onClick={() => toggleFlag('NEW_USER_REGISTRATION')}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.NEW_USER_REGISTRATION === 'true' ? 'bg-green-500' : 'bg-lumina-surface-light border border-lumina-border'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${settings.NEW_USER_REGISTRATION === 'true' ? 'right-0.5' : 'left-0.5 bg-lumina-text-tertiary'}`}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lumina-surface border-lumina-border">
          <CardHeader>
            <CardTitle className="text-lg text-white">Email Configuration</CardTitle>
            <CardDescription className="text-lumina-text-secondary">Configure SMTP or Brevo API for transactional emails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <Label className="text-lumina-text-secondary">Email Provider</Label>
              <Select value={settings.EMAIL_PROVIDER} onValueChange={(val) => handleChange('EMAIL_PROVIDER', val)}>
                <SelectTrigger className="w-full bg-lumina-bg border-lumina-border text-white">
                  <SelectValue placeholder="Select Provider" />
                </SelectTrigger>
                <SelectContent className="bg-lumina-surface border-lumina-border text-white">
                  <SelectItem value="SMTP" className="focus:bg-lumina-surface-light focus:text-white cursor-pointer">Standard SMTP</SelectItem>
                  <SelectItem value="BREVO" className="focus:bg-lumina-surface-light focus:text-white cursor-pointer">Brevo HTTP API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-lumina-text-secondary">Sender Email Address (From)</Label>
              <Input 
                type="email" 
                value={settings.SMTP_FROM || ''} 
                onChange={(e) => handleChange('SMTP_FROM', e.target.value)}
                placeholder="noreply@luminabank.com"
                className="bg-lumina-bg border-lumina-border text-white" 
              />
            </div>

            {settings.EMAIL_PROVIDER === 'BREVO' ? (
              <div className="space-y-2 pt-2">
                <Label className="text-lumina-text-secondary">Brevo API Key (v3)</Label>
                <Input 
                  type="password" 
                  value={settings.BREVO_API_KEY || ''} 
                  onChange={(e) => handleChange('BREVO_API_KEY', e.target.value)}
                  placeholder="xkeysib-..."
                  className="bg-lumina-bg border-lumina-border text-white font-mono" 
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-lumina-text-secondary">SMTP Host</Label>
                  <Input 
                    value={settings.SMTP_HOST || ''} 
                    onChange={(e) => handleChange('SMTP_HOST', e.target.value)}
                    placeholder="smtp.mailtrap.io"
                    className="bg-lumina-bg border-lumina-border text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-lumina-text-secondary">SMTP Port</Label>
                  <Input 
                    type="number"
                    value={settings.SMTP_PORT || '587'} 
                    onChange={(e) => handleChange('SMTP_PORT', e.target.value)}
                    placeholder="587"
                    className="bg-lumina-bg border-lumina-border text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-lumina-text-secondary">SMTP User</Label>
                  <Input 
                    value={settings.SMTP_USER || ''} 
                    onChange={(e) => handleChange('SMTP_USER', e.target.value)}
                    className="bg-lumina-bg border-lumina-border text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-lumina-text-secondary">SMTP Password</Label>
                  <Input 
                    type="password"
                    value={settings.SMTP_PASS || ''} 
                    onChange={(e) => handleChange('SMTP_PASS', e.target.value)}
                    className="bg-lumina-bg border-lumina-border text-white" 
                  />
                </div>
              </div>
            )}

            <Button onClick={handleSave} disabled={isLoading} className="mt-6 w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold">
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
