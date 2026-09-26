import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

export default function AuthModal({ isOpen, onClose }) {
  const { setUser, triggerToast } = useInventory();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot' | 'otp'
  const [email, setEmail] = useState('alex.vance@stocksense.io');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Vance');
  const [role, setRole] = useState('manager');
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('820194');

  if (!isOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    setUser({
      name: name || 'Alex Vance',
      email,
      role,
      isLoggedIn: true
    });
    triggerToast(`Welcome back, ${name || 'Alex Vance'}! Logged in as ${role === 'manager' ? 'Manager' : 'Staff'}.`);
    onClose();
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(generated);
    setMode('otp');
    triggerToast(`OTP dispatched! Simulated code: ${generated}`);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otp === simulatedOtp) {
      triggerToast('OTP verified! Password reset successful.');
      setMode('signin');
    } else {
      triggerToast('Invalid OTP entered. Please try again.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-primary">lock</span>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {mode === 'signin' && 'Sign In to StockSense'}
                {mode === 'signup' && 'Create Staff / Manager Account'}
                {mode === 'forgot' && 'Reset Password (OTP)'}
                {mode === 'otp' && 'Enter 6-Digit OTP'}
              </h3>
              <p className="text-xs text-secondary font-mono">Odoo Security &amp; Role-Based Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

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
              <label className="text-xs font-bold text-on-surface mb-1 block">Role Attribution</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-semibold"
              >
                <option value="manager">Manager Mode (Lead - Alex Vance)</option>
                <option value="staff">Warehouse Staff Mode (Floor Scanner)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-primary hover:underline font-semibold"
              >
                Forgot Password?
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-secondary hover:underline"
              >
                Create Account
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
            >
              Sign In to StockSense IMS
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3">
            <p className="text-xs text-secondary leading-relaxed">
              Enter your registered warehouse email. We will dispatch a 6-digit verification OTP.
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
            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
            >
              Send Verification OTP
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-center text-xs text-secondary hover:underline"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={handleOtpVerify} className="flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-secondary-container/50 border border-secondary-container text-xs text-on-secondary-fixed">
              <span>Simulated SMS/Email Gateway Code: </span>
              <strong className="font-mono text-sm tracking-wider">{simulatedOtp}</strong>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Enter 6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-center font-mono text-lg font-bold tracking-widest text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
            >
              Verify OTP &amp; Reset Access
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                <option value="manager">Inventory Manager</option>
                <option value="staff">Warehouse Floor Staff</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
            >
              Register &amp; Launch Dashboard
            </button>

            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-center text-xs text-secondary hover:underline"
            >
              Already have an account? Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
