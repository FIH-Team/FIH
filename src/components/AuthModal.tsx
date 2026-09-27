import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AppleLogo, LogoMark } from './Primitives';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess?: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const msg =
        mode === 'login'
          ? `Welcome back! Logged in as ${email}`
          : `Account created successfully for ${name || email}!`;
      setSuccessMessage(msg);
      if (onSuccess) {
        onSuccess(email);
      }
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1400);
    }, 600);
  };

  const handleSocialAuth = (provider: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const dummyEmail = `user@${provider.toLowerCase()}.com`;
      setSuccessMessage(`Authenticated with ${provider}!`);
      if (onSuccess) {
        onSuccess(dummyEmail);
      }
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#13151b] border border-white/15 rounded-3xl p-7 shadow-2xl z-10 overflow-hidden"
          >
            {/* Ambient subtle card glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

            {/* Header with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <LogoMark className="w-6 h-6 text-white" />
                <span className="font-semibold text-white tracking-wide text-sm">Campus Karma ID</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success Notification */}
            {successMessage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center flex flex-col items-center"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-1">Success</h3>
                <p className="text-sm text-neutral-300 max-w-xs">{successMessage}</p>
              </motion.div>
            ) : (
              <div className="mt-5">
                {/* Tab Switcher */}
                <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 mb-6">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      mode === 'login'
                        ? 'bg-white text-black shadow-sm font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      mode === 'signup'
                        ? 'bg-white text-black shadow-sm font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Social Login Options */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('Apple')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all cursor-pointer"
                  >
                    <AppleLogo className="w-4 h-4 text-white" />
                    <span>Apple</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('Google')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-1.9.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center mb-5">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-[#13151b] px-3 text-[11px] text-neutral-500 uppercase tracking-wider">
                    or continue with email
                  </span>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-white hover:bg-white/95 active:scale-[0.99] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? 'Processing...'
                        : mode === 'login'
                        ? 'Log In'
                        : 'Create Account'}
                    </span>
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="mt-5 text-center text-xs text-neutral-400">
                  {mode === 'login' ? (
                    <p>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-white hover:underline font-medium cursor-pointer"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-white hover:underline font-medium cursor-pointer"
                      >
                        Log in
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
