import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { setUser, switchRole, triggerToast } = useInventory();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot' | 'otp'
  const [email, setEmail] = useState('alex.vance@stocksense.io');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Vance');
  const [role, setRole] = useState('manager');
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('820194');
  const [otpError, setOtpError] = useState('');

  if (!isOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    setUser({
      name: name || 'Alex Vance',
      email,
      role,
      isLoggedIn: true
    });
    switchRole(role);
    triggerToast(`Welcome back, ${name || 'Alex Vance'}! Logged in as ${role === 'manager' ? 'Inventory Manager' : 'Warehouse Staff'}.`);
    onClose();
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setUser({
      name: name || 'New Warehouse User',
      email,
      role,
      isLoggedIn: true
    });
    switchRole(role);
    triggerToast(`Account created for ${name}! Logged in as ${role === 'manager' ? 'Inventory Manager' : 'Warehouse Staff'}.`);
    onClose();
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(generated);
    setOtp('');
    setOtpError('');
    setMode('otp');
    triggerToast(`Simulated OTP generated: ${generated}`);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otp === simulatedOtp || otp === '820194') {
      triggerToast('OTP verified successfully! Password reset unlocked.');
      setMode('signin');
      setPassword('newpassword123');
    } else {
      setOtpError('Invalid OTP entered. Please try the simulated 6-digit code shown above.');
      triggerToast('Invalid OTP entered', 'error');
    }
  };

  const handleQuickDemoLogin = (demoRole) => {
    if (demoRole === 'manager') {
      setName('Alex Vance');
      setEmail('alex.vance@stocksense.io');
      setRole('manager');
      setUser({
        name: 'Alex Vance',
        email: 'alex.vance@stocksense.io',
        role: 'manager',
        isLoggedIn: true
      });
      switchRole('manager');
    } else {
      setName('Ravi Kumar');
      setEmail('ravi.kumar@stocksense.io');
      setRole('staff');
      setUser({
        name: 'Ravi Kumar',
        email: 'ravi.kumar@stocksense.io',
        role: 'staff',
        isLoggedIn: true
      });
      switchRole('staff');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <img src="/stocksense-icon.png" alt="StockSense" className="w-10 h-10 rounded-xl object-contain shadow-purple-glow" />
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {mode === 'signin' && 'Sign In to StockSense'}
                {mode === 'signup' && 'Register New Staff / Manager'}
                {mode === 'forgot' && 'Reset Password (OTP)'}
                {mode === 'otp' && 'Enter 6-Digit Verification OTP'}
              </h3>
              <p className="text-xs text-secondary font-mono">Role-Based Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5">
          <span className="text-[10px] font-mono uppercase font-bold text-secondary">1-Click Fast Demo Login:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('manager')}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary-light flex items-center justify-center gap-1.5 border border-surface-container"
            >
              <span>👔 Manager (Alex)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('staff')}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-tertiary flex items-center justify-center gap-1.5 border border-surface-container"
            >
              <span>👷 Staff (Ravi)</span>
            </button>
          </div>
        </div>

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-semibold"
              >
                <option value="manager">Inventory Manager (Executive Dashboard &amp; Valuations)</option>
                <option value="staff">Warehouse Staff (Barcode Scanner &amp; Pick Tasks)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-primary-light hover:underline font-semibold"
              >
                Forgot Password?
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-secondary hover:text-on-surface hover:underline"
              >
                Create Account
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow"
            >
              Sign In to StockSense
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Siratpreet Kaur"
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@stocksense.io"
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Role Selection</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-semibold"
              >
                <option value="manager">Inventory Manager (Purchasing, Valuation, Audits)</option>
                <option value="staff">Warehouse Staff (Picking, Packing, Laser Scanning)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-secondary">Already registered?</span>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-primary-light hover:underline font-semibold"
              >
                Back to Sign In
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow"
            >
              Register Account &amp; Log In
            </button>
          </form>
        )}

        {/* Forgot Password Flow */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3">
            <p className="text-xs text-secondary leading-relaxed">
              Enter your registered warehouse email. StockSense will simulate dispatching a 6-digit OTP to your terminal.
            </p>
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-secondary hover:underline"
              >
                Back to Sign In
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow"
            >
              Generate 6-Digit OTP
            </button>
          </form>
        )}

        {/* OTP Verification Flow */}
        {mode === 'otp' && (
          <form onSubmit={handleOtpVerify} className="flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-primary-container/20 border border-primary/30 flex flex-col gap-1">
              <span className="text-xs text-on-surface font-semibold">Simulated OTP Received:</span>
              <div className="font-mono text-xl font-bold tracking-widest text-primary-light">
                {simulatedOtp}
              </div>
              <span className="text-[10px] text-secondary">
                Enter the 6-digit verification code below to authorize password reset.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError('');
                }}
                placeholder="e.g. 820194"
                className="w-full h-11 px-3 text-center tracking-widest font-mono text-base font-bold rounded-lg bg-surface-container-low text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
              {otpError && (
                <span className="text-[11px] text-error mt-1 block">{otpError}</span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-secondary hover:underline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setOtp(simulatedOtp)}
                className="text-primary-light font-semibold hover:underline"
              >
                Auto-fill Code
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow"
            >
              Verify OTP &amp; Unlock
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
