import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { authService, AdminUser } from '../../services/authService';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup mode toggle if first-time initialization is required
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupName, setSetupName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const admin = await authService.login(email, password);
      onLoginSuccess(admin);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupName || !email || !password) {
      setError('Please fill in all setup fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const admin = await authService.setupInitialAdmin({
        name: setupName,
        email,
        password,
      });
      onLoginSuccess(admin);
    } catch (err: any) {
      setError(err.message || 'Failed to setup initial admin account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#19191B] font-sans antialiased flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#EBE8E0] shadow-xl overflow-hidden p-8 space-y-6">
        {/* Brand & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2D5A27]/10 text-[#2D5A27] mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#19191B] font-serif">
            TOYORA Store Admin
          </h1>
          <p className="text-sm text-[#666660]">
            {isSetupMode
              ? 'Initialize administrator account for Toyora backend'
              : 'Sign in to access inventory, orders, and store management'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-2 animate-fadeIn">
            <Lock className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={isSetupMode ? handleSetup : handleLogin} className="space-y-4">
          {isSetupMode && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#666660] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  placeholder="Manager Name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE8E0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent transition-all"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#666660] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@toyora.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE8E0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent transition-all"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#666660] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE8E0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent transition-all"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#2D5A27] hover:bg-[#23471F] text-white font-medium text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{isSetupMode ? 'Create Initial Admin' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer / Initial Setup Link */}
        <div className="pt-4 border-t border-[#EBE8E0] text-center">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setIsSetupMode(!isSetupMode);
            }}
            className="text-xs text-[#2D5A27] hover:underline font-medium focus:outline-none"
          >
            {isSetupMode
              ? 'Back to Admin Login'
              : 'Need to setup initial admin account?'}
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs text-[#888880] text-center">
        Protected by Express JWT Authentication & Bcrypt Authorization
      </p>
    </div>
  );
};
