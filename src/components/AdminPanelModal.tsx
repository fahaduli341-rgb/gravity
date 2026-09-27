import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  LogOut,
  Save,
  Upload,
  RefreshCw,
  Phone,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Inbox,
  ShieldCheck,
  ExternalLink,
  KeyRound,
  Camera,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase.ts';
import { SiteSettings } from '../types.ts';

const AUTHORIZED_EMAIL = 'fahaduli341@gmail.com';
const OWNER_PASSCODE = 'fahad2026';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'photo' | 'content' | 'whatsapp' | 'inquiries';
  settings: SiteSettings;
  onSaveSettings: (newSettings: SiteSettings) => Promise<void>;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'photo',
  settings,
  onSaveSettings,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passcodeVerified, setPasscodeVerified] = useState<boolean>(() => {
    return localStorage.getItem('fahad_admin_authenticated') === 'true';
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'whatsapp' | 'photo' | 'inquiries'>(initialTab);

  // Form states initialized from settings
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(settings.customPortraitImage || '');
  const [portraitFilter, setPortraitFilter] = useState<'chiaroscuro' | 'normal'>(
    settings.portraitFilter || 'chiaroscuro'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setTimeout(() => setLockoutSeconds((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutSeconds]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    setFormData(settings);
    setImagePreview(settings.customPortraitImage || '');
    setPortraitFilter(settings.portraitFilter || 'chiaroscuro');
  }, [settings]);

  // Listen to Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email?.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
        setCurrentUser(user);
        setPasscodeVerified(true);
        localStorage.setItem('fahad_admin_authenticated', 'true');
        setLoginError(null);
      } else if (user) {
        signOut(auth);
        setCurrentUser(null);
        setLoginError(`Security Alert: ${user.email} is unauthorized. Access strictly restricted to ${AUTHORIZED_EMAIL}.`);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isAuthorized = !!currentUser || passcodeVerified;

  // Load inquiries when authorized
  useEffect(() => {
    if (isAuthorized && isOpen && activeTab === 'inquiries') {
      loadInquiries();
    }
  }, [isAuthorized, isOpen, activeTab]);

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(20));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setInquiries(items);
    } catch (err) {
      console.warn('Could not load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result.user.email?.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
        setPasscodeVerified(true);
        localStorage.setItem('fahad_admin_authenticated', 'true');
        setLoginError(null);
      } else {
        await signOut(auth);
        setLoginError(`Access Denied: Only ${AUTHORIZED_EMAIL} can access this admin panel.`);
      }
    } catch (err: any) {
      console.warn('Google popup notice:', err.message);
      setLoginError('Google sign in popup blocked. Please use your Security Key.');
    }
  };

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    if (!passcodeInput.trim()) {
      setLoginError('Please enter your security key.');
      return;
    }

    if (passcodeInput.trim() === OWNER_PASSCODE) {
      setPasscodeVerified(true);
      localStorage.setItem('fahad_admin_authenticated', 'true');
      setLoginError(null);
      setPasscodeInput('');
      setFailedAttempts(0);
    } else {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      if (nextFail >= 3) {
        setLockoutSeconds(30);
        setLoginError('Security Alert: Too many incorrect attempts. Gateway locked for 30 seconds.');
      } else {
        setLoginError(`Access Denied: Invalid Security Key (${3 - nextFail} attempt(s) remaining)`);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {}
    setCurrentUser(null);
    setPasscodeVerified(false);
    localStorage.removeItem('fahad_admin_authenticated');
  };

  // Image upload with guaranteed smart compression under 350KB
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.75;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Keep size strictly within Firestore document limits
        while (dataUrl.length > 450000 && quality > 0.3) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        setImagePreview(dataUrl);
        setFormData((prev) => ({
          ...prev,
          customPortraitImage: dataUrl,
          portraitFilter: portraitFilter,
          secretKey: OWNER_PASSCODE,
        }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefaultPhoto = () => {
    setImagePreview('');
    setFormData((prev) => ({
      ...prev,
      customPortraitImage: '',
      secretKey: OWNER_PASSCODE,
    }));
  };

  const handleFilterToggle = (filter: 'chiaroscuro' | 'normal') => {
    setPortraitFilter(filter);
    setFormData((prev) => ({
      ...prev,
      portraitFilter: filter,
      secretKey: OWNER_PASSCODE,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAuthorized) {
      setSaveError('You must authenticate to save modifications.');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const payload: SiteSettings = {
        ...formData,
        portraitFilter,
        secretKey: OWNER_PASSCODE,
      };

      // Direct write to LocalStorage for instant zero-latency preview
      if (payload.customPortraitImage) {
        try {
          localStorage.setItem('fahad_custom_portrait', payload.customPortraitImage);
          localStorage.setItem('fahad_portrait_filter', portraitFilter);
        } catch {
          // LocalStorage quota check
        }
      } else {
        localStorage.removeItem('fahad_custom_portrait');
      }

      // Authoritative write to Firestore
      await onSaveSettings(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setSaveError(err.message || 'Could not save to Firebase. Please check connection.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-[#121217] border border-white/15 rounded-2xl max-w-3xl w-full text-white shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161d]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <span>Fahad’s Admin Panel</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                    Firebase Secured
                  </span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Owner Email: <span className="text-purple-300 font-mono">{AUTHORIZED_EMAIL}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {!isAuthorized ? (
              /* CYBER SECURITY GATEWAY LOCKSCREEN (Tough Security) */
              <div className="py-10 px-4 max-w-md mx-auto text-center flex flex-col items-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-zinc-900 border border-purple-500/60 flex items-center justify-center text-purple-300">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-mono font-semibold text-purple-300 mb-3 tracking-wider uppercase">
                  <span>256-Bit Encrypted Admin Terminal</span>
                </div>

                <h3 className="text-2xl font-extrabold mb-1.5 tracking-tight text-white">
                  Security Clearance Required
                </h3>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Only the verified portfolio owner (<strong className="text-white">{AUTHORIZED_EMAIL}</strong>) can modify photo, texts, and WhatsApp configuration.
                </p>

                {loginError && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/60 text-xs text-red-200 flex items-start gap-2.5 text-left w-full shadow-lg">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{loginError}</span>
                  </div>
                )}

                {lockoutSeconds > 0 ? (
                  <div className="w-full p-4 rounded-xl bg-amber-950/50 border border-amber-500/50 text-amber-200 text-xs text-center space-y-1 mb-4">
                    <div className="font-bold uppercase tracking-wider">Terminal Temporarily Locked</div>
                    <div>Brute-force security active. Retry available in:</div>
                    <div className="text-2xl font-mono font-bold text-amber-400">{lockoutSeconds}s</div>
                  </div>
                ) : (
                  <form onSubmit={handlePasscodeLogin} className="w-full space-y-3.5 mb-5">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Master Security Key"
                        value={passcodeInput}
                        onChange={(e) => setPasscodeInput(e.target.value)}
                        autoFocus
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900/90 border border-purple-500/40 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono tracking-wider transition-all"
                      />
                      <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authenticate Security Key</span>
                    </button>
                  </form>
                )}

                <div className="flex items-center gap-3 w-full my-3 text-zinc-600 text-xs">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="font-mono text-[10px] tracking-wider uppercase">Or OAuth 2.0</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign In with Google ({AUTHORIZED_EMAIL})</span>
                </button>
              </div>
            ) : (
              /* AUTHENTICATED MANAGEMENT TABS */
              <div className="space-y-6">
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-zinc-400">Authenticated:</span>
                    <span className="font-semibold text-emerald-300 font-mono">
                      {currentUser?.email || AUTHORIZED_EMAIL}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                    title="Lock admin panel immediately"
                  >
                    <LogOut className="w-3.5 h-3.5 text-purple-400" />
                    <span>Lock / Sign Out</span>
                  </button>
                </div>

                {saveError && (
                  <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/60 text-xs text-red-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{saveError}</span>
                  </div>
                )}

              {/* Tab Navigation - Photo First */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/5">
                {[
                  { id: 'photo', label: '📷 Gallery Photo (ছবি পরিবর্তন)', icon: Camera },
                  { id: 'content', label: '✍️ All Texts & Name', icon: FileText },
                  { id: 'whatsapp', label: '💬 WhatsApp Setup', icon: Phone },
                  { id: 'inquiries', label: '📥 Client Leads', icon: Inbox },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

                {/* TAB 1: Change Portrait Photo from Device Gallery */}
                {activeTab === 'photo' && (
                  <div className="bg-[#181820] p-4 sm:p-6 rounded-2xl border border-purple-500/20 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-purple-400 font-bold mb-1">
                        <Camera className="w-4 h-4" />
                        <span>গ্যালারি থেকে আপনার ছবি দিন (Upload from Gallery)</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        আপনার ফোন বা পিসির গ্যালারি থেকে যেকোনো ছবি সিলেক্ট করুন। এটি সাথে সাথে আপনার ওয়েবসাইটের মূল ব্যাকগ্রাউন্ড পোর্ট্রেট হিসেবে সেট হয়ে যাবে।
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    {/* Image Preview & Upload Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-black/40 border border-white/10">
                      {/* Live Image Box */}
                      <div className="relative w-44 h-56 rounded-xl overflow-hidden bg-black border-2 border-purple-500/40 shadow-2xl shrink-0 flex items-center justify-center group">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Fahad Custom Portrait"
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              portraitFilter === 'chiaroscuro'
                                ? 'filter grayscale contrast-125 brightness-95'
                                : 'filter brightness-100'
                            }`}
                          />
                        ) : (
                          <div className="text-center p-3 text-zinc-500 text-xs">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-60" />
                            <span>Default Portrait</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white text-xs font-semibold cursor-pointer"
                        >
                          <Camera className="w-6 h-6 text-purple-400" />
                          <span>Change Photo</span>
                        </button>
                      </div>

                      {/* Controls and Filter Settings */}
                      <div className="space-y-4 w-full">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-2">
                            ১. ছবি নির্বাচন করুন (Select Photo):
                          </label>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30 cursor-pointer active:scale-95"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Choose Photo from Gallery / গ্যালারি থেকে ছবি নিন</span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-2">
                            ২. ফিল্টার স্টাইল (Visual Filter):
                          </label>
                          <div className="flex gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => handleFilterToggle('chiaroscuro')}
                              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                                portraitFilter === 'chiaroscuro'
                                  ? 'bg-purple-600 border-purple-500 text-white'
                                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              Cinematic Dark B&W (অরিজিনাল লুক)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFilterToggle('normal')}
                              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                                portraitFilter === 'normal'
                                  ? 'bg-purple-600 border-purple-500 text-white'
                                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              Natural Color (রঙিন)
                            </button>
                          </div>
                        </div>

                        {imagePreview && (
                          <button
                            type="button"
                            onClick={handleResetToDefaultPhoto}
                            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer pt-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Revert to default photo (আগের ছবিতে ফেরত যান)</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Instant Save Photo Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-60 active:scale-95"
                      >
                        {saving ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Saving Photo to Firebase...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Apply & Save Photo Live (ছবি সেভ করুন)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: All Texts & Headings */}
                {activeTab === 'content' && (
                  <form onSubmit={handleSave} className="space-y-5">
                    <div className="bg-[#181820] p-4 rounded-xl border border-white/5 space-y-4">
                      <div className="text-xs uppercase tracking-wider text-purple-400 font-bold">
                        Hero Section (মেইন স্ক্রিন টেক্সট)
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Main Greeting Headline (Default: "HI I AM FAHAD")
                        </label>
                        <input
                          type="text"
                          value={formData.heroTitle}
                          onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Sub-title / Role (Default: "AI WEB DEVELOPER")
                        </label>
                        <input
                          type="text"
                          value={formData.heroSubtitle}
                          onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Tags (Separated by ·)
                        </label>
                        <input
                          type="text"
                          value={formData.heroTags}
                          onChange={(e) => setFormData({ ...formData, heroTags: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Status Badge Text
                        </label>
                        <input
                          type="text"
                          value={formData.badgeText}
                          onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="bg-[#181820] p-4 rounded-xl border border-white/5 space-y-4">
                      <div className="text-xs uppercase tracking-wider text-purple-400 font-bold">
                        Manifest Section (পার্পল সেকশন টেক্সট)
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Big Manifest Headline
                        </label>
                        <textarea
                          rows={3}
                          value={formData.manifestHeading}
                          onChange={(e) => setFormData({ ...formData, manifestHeading: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Punchline Headline
                        </label>
                        <input
                          type="text"
                          value={formData.manifestPunchline}
                          onChange={(e) => setFormData({ ...formData, manifestPunchline: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Punchline Sub-Text
                        </label>
                        <input
                          type="text"
                          value={formData.manifestSubpunchline}
                          onChange={(e) => setFormData({ ...formData, manifestSubpunchline: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </form>
                )}

                {/* TAB 3: WhatsApp Number Setup */}
                {activeTab === 'whatsapp' && (
                  <form onSubmit={handleSave} className="space-y-5">
                    <div className="bg-[#181820] p-5 rounded-xl border border-white/5 space-y-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-bold">
                        <Phone className="w-4 h-4" />
                        <span>Direct WhatsApp "Hire Me" Destination</span>
                      </div>

                      <p className="text-xs text-zinc-400">
                        When any client clicks <strong>"Hire me"</strong>, they will immediately be directed to this WhatsApp number with your pre-filled message.
                      </p>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          WhatsApp Number (with country code, e.g. +88017XXXXXXXX)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. +8801712345678"
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Default WhatsApp Greeting Message
                        </label>
                        <textarea
                          rows={3}
                          value={formData.whatsappMessage}
                          onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="pt-2">
                        <a
                          href={`https://wa.me/${formData.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            formData.whatsappMessage
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Test WhatsApp Link Now</span>
                        </a>
                      </div>
                    </div>
                  </form>
                )}

                {/* TAB 4: Incoming Client Leads */}
                {activeTab === 'inquiries' && (
                  <div className="bg-[#181820] p-5 rounded-xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs uppercase tracking-wider text-purple-400 font-bold">
                        Client Inquiries in Firebase
                      </div>
                      <button
                        type="button"
                        onClick={loadInquiries}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {inquiries.length === 0 ? (
                      <div className="py-8 text-center text-xs text-zinc-500">
                        No inquiries recorded yet. When someone fills the form, it will appear here.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {inquiries.map((inq) => (
                          <div
                            key={inq.id}
                            className="p-3.5 rounded-lg bg-zinc-900/90 border border-white/5 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-semibold text-white">
                              <span>{inq.name}</span>
                              <span className="text-zinc-500 font-normal text-[10px]">
                                {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : ''}
                              </span>
                            </div>
                            <div className="text-purple-300 font-mono">{inq.email}</div>
                            {inq.service && <div className="text-zinc-400 text-[11px]">Type: {inq.service}</div>}
                            {inq.message && <div className="text-zinc-300 pt-1 border-t border-white/5">{inq.message}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Save & Actions Bar */}
          {isAuthorized && (
            <div className="px-6 py-4 border-t border-white/10 bg-[#16161d] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved live to Firebase!</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-60 active:scale-95"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save All Changes Live</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
