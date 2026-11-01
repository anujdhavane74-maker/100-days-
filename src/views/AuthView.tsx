import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  LogOut,
  User,
} from 'lucide-react';
import {
  getSupabaseClient,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
} from '../services/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthViewProps {
  currentUser: SupabaseUser | null;
  onAuthSuccess: (user: SupabaseUser | null) => void;
  onClose: () => void;
  onSyncNow?: () => Promise<void>;
  isSyncing?: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentUser,
  onAuthSuccess,
  onClose,
  onSyncNow,
  isSyncing,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manual Supabase Config Form
  const existingConfig = getSupabaseConfig();
  const [customUrl, setCustomUrl] = useState(existingConfig.url);
  const [customKey, setCustomKey] = useState(existingConfig.anonKey);
  const [showConfigDrawer, setShowConfigDrawer] = useState(!existingConfig.url);
  const [copiedSql, setCopiedSql] = useState(false);

  const supabase = getSupabaseClient();
  const isConfigured = Boolean(supabase);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const client = getSupabaseClient();
    if (!client) {
      setErrorMessage('Please configure your Supabase URL and Anon Key below first.');
      setShowConfigDrawer(true);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data.user) {
          if (data.session) {
            setSuccessMessage('Account created and signed in successfully!');
            onAuthSuccess(data.user);
          } else {
            setSuccessMessage(
              'Sign up successful! Please check your email to confirm your account (or disable email confirmation in your Supabase Auth settings).'
            );
          }
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data.user) {
          setSuccessMessage('Signed in successfully! Telemetry syncing with cloud...');
          onAuthSuccess(data.user);
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim() || !customKey.trim()) {
      setErrorMessage('Both Supabase URL and Anon Key are required.');
      return;
    }

    saveSupabaseConfig(customUrl.trim(), customKey.trim());
    setSuccessMessage('Supabase credentials saved. You can now sign in or sign up!');
    setShowConfigDrawer(false);
    setErrorMessage(null);
  };

  const handleSignOut = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
      onAuthSuccess(null);
      setSuccessMessage('Signed out. Local storage remains active.');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md my-8 glass-panel p-6 sm:p-8 bg-slate-900/90 border-white/15 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md mx-auto flex items-center justify-center shadow-lg">
            <Cloud className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            {currentUser ? 'Cloud Sync Profile' : isSignUp ? 'Create Cloud Account' : 'Cloud Sync Sign In'}
          </h1>
          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            {currentUser
              ? `Logged in as ${currentUser.email}. Seamless sync between phone & laptop.`
              : 'Sync your 100-day progress, habits, and tasks seamlessly between your mobile and laptop.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start space-x-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Logged In View */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>ACCOUNT:</span>
                <span className="text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CONNECTED</span>
                </span>
              </div>
              <div className="text-sm font-bold text-white truncate">
                {currentUser.email}
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                User ID: {currentUser.id.slice(0, 16)}...
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {onSyncNow && (
                <button
                  type="button"
                  onClick={onSyncNow}
                  disabled={isSyncing}
                  className="w-full py-3 rounded-xl bg-cyan-600/80 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Cloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                  <span>{isSyncing ? 'SYNCING DATA NOW...' : 'SYNC WITH CLOUD NOW'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white font-mono text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-all"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>SIGN OUT OF CLOUD</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-mono">
            {/* Tab Toggle */}
            <div className="flex rounded-xl p-1 bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  !isSignUp ? 'bg-white/15 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  isSignUp ? 'bg-white/15 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                CREATE ACCOUNT
              </button>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-slate-300 uppercase mb-1.5 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="driver@championship.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-9 pr-3 py-2.5 text-sm text-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-slate-300 uppercase mb-1.5 font-bold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-9 pr-10 py-2.5 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600/90 hover:bg-red-500 active:scale-98 text-white font-bold uppercase shadow-xl shadow-red-950/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2 text-sm"
            >
              {loading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'CREATE ACCOUNT & SYNC' : 'SIGN IN & SYNC'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Collapsible Supabase Project Config Drawer */}
        <div className="pt-2 border-t border-white/10 text-xs font-mono space-y-3">
          <button
            type="button"
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className="w-full flex items-center justify-between text-slate-400 hover:text-white py-1 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {isConfigured ? 'Supabase Connected' : 'Configure Supabase Keys'}
              </span>
            </span>
            {showConfigDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showConfigDrawer && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 animate-fadeIn">
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                You can configure your Supabase URL & Anon Key here or provide them as environment variables (<code>VITE_SUPABASE_URL</code> & <code>VITE_SUPABASE_ANON_KEY</code>).
              </p>

              <form onSubmit={handleSaveCustomConfig} className="space-y-2.5">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Project URL</label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full glass-input px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Anon Key</label>
                  <input
                    type="text"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className="w-full glass-input px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-slate-300 text-[10px] flex items-center space-x-1"
                    title="Copy required SQL statement to run in Supabase SQL editor"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'COPIED SQL' : 'COPY TABLE SQL'}</span>
                  </button>

                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                  >
                    SAVE CONFIG
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Continue in Offline Mode button */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-mono text-slate-400 hover:text-white underline transition-colors"
          >
            Continue in Offline Mode (Local Storage Only)
          </button>
        </div>
      </div>
    </div>
  );
};

