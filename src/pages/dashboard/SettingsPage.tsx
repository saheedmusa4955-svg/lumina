import { useState, useEffect } from 'react';
import { User, Bell, Shield, Moon, Check, Smartphone, Monitor, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth(); // We might use a token update if we had a setToken, but we can just reload for now
  
  // --- Profile State ---
  const [firstName, ...lastNameParts] = (user?.fullName || '').split(' ');
  const initialLastName = lastNameParts.join(' ');
  const [fName, setFName] = useState(firstName || '');
  const [lName, setLName] = useState(initialLastName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // --- Password State ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // --- 2FA State ---
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [show2FADisable, setShow2FADisable] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // --- Devices State ---
  const [showDevices, setShowDevices] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);

  // Fetch devices when toggled
  useEffect(() => {
    if (showDevices) {
      fetchDevices();
    }
  }, [showDevices]);

  const fetchDevices = async () => {
    try {
      const res = await api.get('/settings/devices');
      setDevices(res.data.devices);
    } catch (err) {
      toast.error('Failed to load active sessions');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      const res = await api.put('/settings/profile', { firstName: fName, lastName: lName });
      toast.success(res.data.message);
      // To strictly update the context we'd need a setToken or setUser from auth, but let's just refresh
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsChangingPassword(true);
      const res = await api.post('/settings/password', { currentPassword, newPassword });
      toast.success(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleGenerate2FA = async () => {
    try {
      const res = await api.post('/settings/2fa/generate');
      setQrCodeUrl(res.data.qrCode);
      setTwoFactorSecret(res.data.secret);
      setShow2FASetup(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to generate 2FA');
    }
  };

  const handleVerify2FA = async () => {
    try {
      const res = await api.post('/settings/2fa/verify', { code: twoFactorCode });
      toast.success(res.data.message);
      setShow2FASetup(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid 2FA code');
    }
  };

  const handleDisable2FA = async () => {
    try {
      const res = await api.post('/settings/2fa/disable', { currentPassword });
      toast.success(res.data.message);
      setShow2FADisable(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to disable 2FA');
    }
  };

  const handleRevokeDevice = async (id: string) => {
    try {
      const res = await api.post(`/settings/devices/${id}/revoke`);
      toast.success(res.data.message);
      setDevices(devices.filter(d => d.id !== id));
    } catch (err: any) {
      toast.error('Failed to revoke session');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-lumina-text-secondary mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="flex flex-row overflow-x-auto md:flex-col gap-2 pb-2 md:pb-0 scrollbar-hide border-b border-lumina-border md:border-none">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('profile')}
            className={`justify-start shrink-0 ${activeTab === 'profile' ? 'bg-lumina-surface-light text-white font-semibold' : 'text-lumina-text-secondary hover:text-white hover:bg-lumina-surface'}`}
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('security')}
            className={`justify-start shrink-0 ${activeTab === 'security' ? 'bg-lumina-surface-light text-white font-semibold' : 'text-lumina-text-secondary hover:text-white hover:bg-lumina-surface'}`}
          >
            <Shield className="w-4 h-4 mr-2" /> Security
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('notifications')}
            className={`justify-start shrink-0 ${activeTab === 'notifications' ? 'bg-lumina-surface-light text-white font-semibold' : 'text-lumina-text-secondary hover:text-white hover:bg-lumina-surface'}`}
          >
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('appearance')}
            className={`justify-start shrink-0 ${activeTab === 'appearance' ? 'bg-lumina-surface-light text-white font-semibold' : 'text-lumina-text-secondary hover:text-white hover:bg-lumina-surface'}`}
          >
            <Moon className="w-4 h-4 mr-2" /> Appearance
          </Button>
        </div>

        {/* Main Settings Form */}
        <div className="md:col-span-3 flex flex-col gap-6">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <Card className="bg-lumina-surface border-lumina-border animate-in fade-in zoom-in-95 duration-200">
              <CardHeader>
                <CardTitle className="text-lg text-white">Personal Information</CardTitle>
                <CardDescription className="text-lumina-text-secondary">Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-lumina-text-secondary">First Name</Label>
                    <Input id="firstName" value={fName} onChange={e => setFName(e.target.value)} className="bg-lumina-bg border-lumina-border text-white focus-visible:ring-lumina-accent" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-lumina-text-secondary">Last Name</Label>
                    <Input id="lastName" value={lName} onChange={e => setLName(e.target.value)} className="bg-lumina-bg border-lumina-border text-white focus-visible:ring-lumina-accent" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lumina-text-secondary">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} readOnly className="bg-lumina-bg border-lumina-border text-white focus-visible:ring-lumina-accent opacity-70" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-lumina-text-secondary">Lumina Account Number</Label>
                  <div className="flex gap-2">
                    <Input id="accountNumber" type="text" defaultValue={user?.accountNumber || ''} readOnly className="bg-lumina-bg border-lumina-border text-white focus-visible:ring-lumina-accent font-mono text-lg tracking-widest" />
                    <Button variant="outline" className="shrink-0 border-lumina-border text-white hover:bg-lumina-surface-light" onClick={() => {
                      if (user?.accountNumber) {
                        navigator.clipboard.writeText(user.accountNumber);
                        toast.success("Account number copied!");
                      }
                    }}>
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-lumina-text-tertiary">Share this 8-digit number to receive internal transfers instantly.</p>
                </div>
                <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="mt-4 bg-lumina-accent hover:bg-lumina-accent-dark text-lumina-bg font-semibold">
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <Card className="bg-lumina-surface border-lumina-border animate-in fade-in zoom-in-95 duration-200">
              <CardHeader>
                <CardTitle className="text-lg text-white">Security Preferences</CardTitle>
                <CardDescription className="text-lumina-text-secondary">Manage your password and 2FA settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* 2FA Section */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-lumina-text-secondary mt-1">
                      {user?.isTwoFactorEnabled ? '2FA is currently enabled on your account.' : 'Add an extra layer of security to your account.'}
                    </p>
                  </div>
                  {user?.isTwoFactorEnabled ? (
                    <Button onClick={() => setShow2FADisable(!show2FADisable)} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                      Disable
                    </Button>
                  ) : (
                    <Button onClick={handleGenerate2FA} variant="outline" className="border-lumina-accent text-lumina-accent hover:bg-lumina-accent/10">
                      Enable
                    </Button>
                  )}
                </div>

                {show2FASetup && !user?.isTwoFactorEnabled && (
                  <div className="bg-lumina-surface-light p-6 rounded-xl border border-lumina-border">
                    <h3 className="font-bold text-white mb-2">Setup Authenticator</h3>
                    <p className="text-sm text-lumina-text-secondary mb-4">Scan the QR code below using Google Authenticator, Authy, or your preferred 2FA app.</p>
                    
                    <div className="bg-white p-4 inline-block rounded-lg mb-4">
                      <img src={qrCodeUrl} alt="2FA QR Code" />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-lumina-text-secondary">Manual Secret Key</Label>
                        <Input readOnly value={twoFactorSecret} className="bg-lumina-bg border-lumina-border text-white font-mono" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-lumina-text-secondary">Enter 6-Digit Code</Label>
                        <Input 
                          value={twoFactorCode} 
                          onChange={e => setTwoFactorCode(e.target.value)} 
                          placeholder="000000" 
                          maxLength={6}
                          className="bg-lumina-bg border-lumina-border text-white font-mono tracking-widest text-lg" 
                        />
                      </div>
                      <Button onClick={handleVerify2FA} className="w-full bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark">
                        Verify and Enable
                      </Button>
                    </div>
                  </div>
                )}

                {show2FADisable && (
                  <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20">
                    <h3 className="font-bold text-red-400 mb-2">Disable Two-Factor Authentication</h3>
                    <p className="text-sm text-red-400/80 mb-4">To disable 2FA, please enter your current password.</p>
                    <div className="space-y-4">
                      <Input 
                        type="password"
                        value={currentPassword} 
                        onChange={e => setCurrentPassword(e.target.value)} 
                        placeholder="Current Password" 
                        className="bg-lumina-bg border-red-500/30 text-white" 
                      />
                      <Button onClick={handleDisable2FA} variant="destructive" className="w-full">
                        Disable 2FA
                      </Button>
                    </div>
                  </div>
                )}

                {/* Password Section */}
                <div className="border-t border-lumina-border/50 pt-6">
                  <div className="mb-4">
                    <p className="font-medium text-white">Change Password</p>
                    <p className="text-sm text-lumina-text-secondary mt-1">Update your password regularly to keep your account secure.</p>
                  </div>
                  <div className="space-y-4 max-w-sm">
                    <div className="space-y-2">
                      <Label className="text-lumina-text-secondary">Current Password</Label>
                      <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="bg-lumina-bg border-lumina-border text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lumina-text-secondary">New Password</Label>
                      <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="bg-lumina-bg border-lumina-border text-white" />
                    </div>
                    <Button onClick={handleChangePassword} disabled={isChangingPassword} variant="outline" className="border-lumina-border text-white hover:bg-lumina-surface-light w-full">
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </div>

                {/* Devices Section */}
                <div className="flex items-center justify-between border-t border-lumina-border/50 pt-6">
                  <div>
                    <p className="font-medium text-white">Active Sessions</p>
                    <p className="text-sm text-lumina-text-secondary mt-1">Manage the devices currently logged into your account.</p>
                  </div>
                  <Button onClick={() => setShowDevices(!showDevices)} variant="link" className="text-lumina-accent p-0 h-auto font-medium">
                    {showDevices ? 'Hide Devices' : 'View Devices'}
                  </Button>
                </div>

                {showDevices && (
                  <div className="mt-4 space-y-3">
                    {devices.map((device, idx) => {
                      const isDesktop = device.userAgent.toLowerCase().includes('windows') || device.userAgent.toLowerCase().includes('mac');
                      return (
                        <div key={device.id} className="flex items-center justify-between p-4 bg-lumina-surface-light border border-lumina-border rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-lumina-bg flex items-center justify-center shrink-0">
                              {isDesktop ? <Monitor className="w-5 h-5 text-indigo-400" /> : <Smartphone className="w-5 h-5 text-indigo-400" />}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{device.userAgent}</p>
                              <p className="text-xs text-lumina-text-secondary mt-0.5">
                                IP: {device.ipAddress} • Last active: {new Date(device.lastActive).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {idx !== 0 && (
                            <Button onClick={() => handleRevokeDevice(device.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                          {idx === 0 && <span className="text-xs text-emerald-400 font-medium px-2 py-1 bg-emerald-500/10 rounded-full">Current</span>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <Card className="bg-lumina-surface border-lumina-border animate-in fade-in zoom-in-95 duration-200">
              <CardHeader>
                <CardTitle className="text-lg text-white">Notification Settings</CardTitle>
                <CardDescription className="text-lumina-text-secondary">Control what alerts you receive and how.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Email Alerts</p>
                    <p className="text-sm text-lumina-text-secondary mt-1">Receive account statements and security alerts via email.</p>
                  </div>
                  <div className="w-12 h-6 bg-lumina-accent rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-lumina-border/50 pt-6">
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-sm text-lumina-text-secondary mt-1">Get instant alerts for transactions and incoming transfers.</p>
                  </div>
                  <div className="w-12 h-6 bg-lumina-accent rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-lumina-border/50 pt-6">
                  <div>
                    <p className="font-medium text-white">Marketing Updates</p>
                    <p className="text-sm text-lumina-text-secondary mt-1">Receive news about new features and promotions.</p>
                  </div>
                  <div className="w-12 h-6 bg-lumina-surface-light border border-lumina-border rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-lumina-text-tertiary rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <Card className="bg-lumina-surface border-lumina-border animate-in fade-in zoom-in-95 duration-200">
              <CardHeader>
                <CardTitle className="text-lg text-white">Appearance</CardTitle>
                <CardDescription className="text-lumina-text-secondary">Customize how the application looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="font-medium text-white mb-4">Theme Preference</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button className="flex flex-col items-center gap-2 border-2 border-lumina-accent bg-lumina-bg p-4 rounded-xl relative">
                      <div className="absolute top-2 right-2 w-4 h-4 bg-lumina-accent rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-lumina-bg" />
                      </div>
                      <div className="w-full h-16 bg-lumina-surface rounded-md border border-lumina-border overflow-hidden flex flex-col">
                        <div className="h-4 bg-lumina-surface-light border-b border-lumina-border" />
                        <div className="flex-1 p-2 flex gap-2">
                          <div className="w-1/3 h-full bg-lumina-surface-light rounded-sm" />
                          <div className="w-2/3 h-full bg-lumina-surface-light rounded-sm" />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-white mt-1">Dark Mode</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 border-2 border-lumina-border bg-lumina-bg p-4 rounded-xl opacity-50 cursor-not-allowed">
                      <div className="w-full h-16 bg-gray-100 rounded-md border border-gray-200 overflow-hidden flex flex-col">
                        <div className="h-4 bg-white border-b border-gray-200" />
                        <div className="flex-1 p-2 flex gap-2">
                          <div className="w-1/3 h-full bg-white rounded-sm" />
                          <div className="w-2/3 h-full bg-white rounded-sm" />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-white mt-1">Light Mode</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 border-2 border-lumina-border bg-lumina-bg p-4 rounded-xl opacity-50 cursor-not-allowed">
                      <div className="w-full h-16 rounded-md border border-lumina-border overflow-hidden flex flex-col relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-lumina-surface" />
                      </div>
                      <span className="text-sm font-medium text-white mt-1">System</span>
                    </button>
                  </div>
                  <p className="text-xs text-lumina-text-secondary mt-4">Note: Lumina Bank currently supports dark mode exclusively for the best visual experience.</p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
