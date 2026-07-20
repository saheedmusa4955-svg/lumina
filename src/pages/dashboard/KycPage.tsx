import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { ShieldCheck, UploadCloud, FileText, User, Camera, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function KycPage() {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('passport');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: ''
  });
  
  const [files, setFiles] = useState({
    front: null as File | null,
    back: null as File | null,
    selfie: null as File | null,
    proof: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const submitKyc = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('docType', docType);
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('dob', formData.dob);
      data.append('address', formData.address);
      if (files.front) data.append('front', files.front);
      if (files.back) data.append('back', files.back);
      if (files.selfie) data.append('selfie', files.selfie);
      if (files.proof) data.append('proof', files.proof);

      await api.post('/kyc/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await refreshUser();
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit KYC');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.kycStatus === 'APPROVED') {
    return (
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full pt-12 pb-24 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
          <ShieldCheck className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">Identity Verified</h1>
        <p className="text-lumina-text-secondary mb-8">
          Your identity has been successfully verified. You have full access to all Lumina Bank features.
        </p>
        <Button onClick={() => window.location.href = '/dashboard'} className="bg-indigo-500 hover:bg-indigo-600 text-white h-12 px-8 rounded-xl">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (user?.kycStatus === 'PENDING' || submitted) {
    return (
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full pt-12 pb-24 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">Verification Pending</h1>
        <p className="text-lumina-text-secondary mb-8">
          Your documents have been securely transmitted to our compliance team. Review typically takes between 5 to 15 minutes. We will notify you once your account is fully unlocked.
        </p>
        <Button onClick={() => window.location.href = '/dashboard'} className="bg-indigo-500 hover:bg-indigo-600 text-white h-12 px-8 rounded-xl">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full pt-4 md:pt-0 pb-16">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Identity Verification</h1>
        <p className="text-sm text-lumina-text-secondary mt-2 max-w-md">
          To comply with international financial regulations and keep your account secure, we need to verify your identity.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between relative mt-4 mb-2">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-lumina-surface-light rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-500"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>
        
        {[
          { num: 1, label: 'Personal' },
          { num: 2, label: 'Document' },
          { num: 3, label: 'Selfie' },
          { num: 4, label: 'Address' }
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= s.num ? 'bg-indigo-500 text-white' : 'bg-lumina-surface border border-lumina-border text-lumina-text-tertiary'
            }`}>
              {s.num}
            </div>
            <span className={`text-[10px] font-medium uppercase tracking-wider absolute -bottom-6 ${
              step >= s.num ? 'text-white' : 'text-lumina-text-tertiary'
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <Card className="bg-lumina-surface border-lumina-border rounded-2xl shadow-xl mt-8 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          {error && <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg mb-4">{error}</div>}
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Personal Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-lumina-text-secondary uppercase tracking-wider">First Name</label>
                  <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="John" className="bg-lumina-bg border-lumina-border h-12 rounded-xl text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-lumina-text-secondary uppercase tracking-wider">Last Name</label>
                  <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" className="bg-lumina-bg border-lumina-border h-12 rounded-xl text-white" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-lumina-text-secondary uppercase tracking-wider">Date of Birth</label>
                  <Input value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} type="date" className="bg-lumina-bg border-lumina-border h-12 rounded-xl text-white [color-scheme:dark]" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Identity Document</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'passport', label: 'Passport' },
                    { id: 'id_card', label: 'National ID' },
                    { id: 'driving_license', label: "Driver's License" }
                  ].map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => setDocType(doc.id)}
                      className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all border ${
                        docType === doc.id 
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                          : 'bg-lumina-bg border-lumina-border text-lumina-text-secondary hover:text-white'
                      }`}
                    >
                      {doc.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative border-2 border-dashed border-lumina-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] hover:border-indigo-500/50 transition-colors cursor-pointer group">
                    <input type="file" onChange={e => handleFileChange(e, 'front')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*,.pdf" />
                    <UploadCloud className={`w-8 h-8 mb-3 transition-colors ${files.front ? 'text-indigo-400' : 'text-lumina-text-tertiary group-hover:text-indigo-400'}`} />
                    <p className="text-sm font-medium text-white mb-1">{files.front ? files.front.name : 'Upload Front'}</p>
                    <p className="text-xs text-lumina-text-secondary">JPEG, PNG or PDF</p>
                  </div>
                  <div className="relative border-2 border-dashed border-lumina-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] hover:border-indigo-500/50 transition-colors cursor-pointer group">
                    <input type="file" onChange={e => handleFileChange(e, 'back')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*,.pdf" />
                    <UploadCloud className={`w-8 h-8 mb-3 transition-colors ${files.back ? 'text-indigo-400' : 'text-lumina-text-tertiary group-hover:text-indigo-400'}`} />
                    <p className="text-sm font-medium text-white mb-1">{files.back ? files.back.name : 'Upload Back'}</p>
                    <p className="text-xs text-lumina-text-secondary">JPEG, PNG or PDF</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Liveness Check</h2>
              </div>
              
                <div className="relative flex flex-col items-center justify-center py-8 group">
                  <input type="file" onChange={e => handleFileChange(e, 'selfie')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" capture="user" />
                  <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center mb-6 relative overflow-hidden bg-lumina-bg transition-colors ${files.selfie ? 'border-indigo-500' : 'border-indigo-500/30 border-t-indigo-500'}`}>
                    <Camera className={`w-12 h-12 ${files.selfie ? 'text-indigo-500' : 'text-lumina-text-tertiary'}`} />
                    {/* Decorative scan line */}
                    {!files.selfie && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400/50 shadow-[0_0_20px_theme(colors.indigo.400)] animate-pulse"></div>}
                  </div>
                  <p className="text-sm font-medium text-white text-center max-w-xs mb-6">
                    {files.selfie ? files.selfie.name : 'We need to take a quick selfie to match your face with your identity document.'}
                  </p>
                  <Button variant="outline" className="border-lumina-border bg-lumina-bg text-white hover:bg-lumina-surface-light rounded-xl h-12 px-8 pointer-events-none">
                    <Camera className="w-4 h-4 mr-2" /> {files.selfie ? 'Retake Selfie' : 'Take Selfie'}
                  </Button>
                </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Proof of Address</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-lumina-text-secondary uppercase tracking-wider">Full Residential Address</label>
                  <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Finance Street, NY 10001" className="bg-lumina-bg border-lumina-border h-12 rounded-xl text-white" />
                </div>
                
                <div className="relative border-2 border-dashed border-lumina-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] hover:border-indigo-500/50 transition-colors cursor-pointer group">
                  <input type="file" onChange={e => handleFileChange(e, 'proof')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*,.pdf" />
                  <UploadCloud className={`w-8 h-8 mb-3 transition-colors ${files.proof ? 'text-indigo-400' : 'text-lumina-text-tertiary group-hover:text-indigo-400'}`} />
                  <p className="text-sm font-medium text-white mb-1">{files.proof ? files.proof.name : 'Upload Utility Bill or Bank Statement'}</p>
                  <p className="text-xs text-lumina-text-secondary">Must be dated within the last 3 months</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-lumina-border">
            <Button 
              variant="ghost" 
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`text-lumina-text-secondary hover:text-white ${step === 1 ? 'invisible' : ''}`}
            >
              Back
            </Button>
            
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-8">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button disabled={isLoading} onClick={submitKyc} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 shadow-lg shadow-emerald-500/20">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Submit Verification</>
                )}
              </Button>
            )}
          </div>
          
        </CardContent>
      </Card>

    </div>
  );
}
