import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  User,
  Crown,
  Sparkles,
  Zap,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  X,
  CreditCard,
  RefreshCw,
  LogOut,
  ChevronRight,
  Database,
  Lock,
  Layers,
  Award,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  type UserProfile
} from '../services/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUpdateUser: (user: UserProfile | null) => void;
  onOpenAuthModal?: () => void;
  theme?: 'dark' | 'light';
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      setTimeout(() => resolve(!!(window as any).Razorpay), 2500);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onOpenAuthModal,
  theme = 'dark'
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'booster'>('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const isPro = currentUser?.plan === 'premium';
  const currentCredits = currentUser?.credits ?? (isPro ? 5000 : 50);
  const maxCredits = currentUser?.max_credits ?? (isPro ? 5000 : 50);
  const creditPct = Math.min(100, Math.max(0, Math.round((currentCredits / maxCredits) * 100)));

  const memoryUsedKb = currentUser?.memory_used_kb ?? 48.0;
  const memoryMaxKb = currentUser?.memory_max_kb ?? (isPro ? 8192.0 : 256.0);
  const memoryPct = currentUser?.memory_used_pct ?? Math.min(100, Math.round((memoryUsedKb / memoryMaxKb) * 100));

  // Razorpay Checkout Trigger
  const handleRazorpayCheckout = async (planType: 'pro' | 'booster') => {
    setStatusMsg(null);
    setIsProcessing(true);

    const amountPaise = planType === 'pro' ? 200 : 100; // ₹2 or ₹1 in paise (< ₹5 for testing)
    const planName = planType === 'pro' ? 'premium' : (currentUser?.plan || 'free');
    const creditsToAdd = planType === 'pro' ? 5000 : 500;

    try {
      // 1. Ensure Razorpay script is loaded
      let isLoaded = typeof window !== 'undefined' && !!(window as any).Razorpay;
      if (!isLoaded) {
        setStatusMsg({ type: 'info', text: 'Initializing Razorpay Checkout engine...' });
        isLoaded = await loadRazorpayScript();
      }
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay Checkout SDK could not be loaded. Please disable ad-blockers or check internet.');
      }

      // 2. Create Order (via FastAPI or Vercel serverless /api/create-order, with direct test fallback)
      let order: any = null;
      try {
        order = await createRazorpayOrder(amountPaise, planName, creditsToAdd);
      } catch (orderErr) {
        console.warn('Backend order creation returned fallback, continuing with direct test checkout:', orderErr);
      }

      const keyId = order?.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TmTfojTcJlfmux';

      // 3. Configure Razorpay Standard Modal
      const options: any = {
        key: keyId,
        amount: order?.amount || amountPaise,
        currency: order?.currency || 'INR',
        name: 'CyberGuard AI',
        description: planType === 'pro' 
          ? 'CyberGuard Pro Operator Pass (5,000 Credits)' 
          : 'CyberGuard AI Credit Booster (500 Credits)',
        image: 'https://cyberguard-ai-one.vercel.app/logo.png',
        prefill: {
          name: currentUser?.username || 'Cyber Operator',
          email: currentUser?.email || 'operator@cyberguard.ai',
          contact: '9999999999'
        },
        theme: {
          color: '#00f0ff'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setStatusMsg({ type: 'info', text: 'Checkout modal closed. Payment was not completed.' });
          }
        },
        handler: async (response: any) => {
          // 4. Verify Signature
          try {
            setStatusMsg({ type: 'info', text: 'Verifying payment signature with security gateway...' });
            let verification: any = null;
            if (response.razorpay_order_id && response.razorpay_signature) {
              try {
                verification = await verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan: planName,
                  credits: creditsToAdd
                });
              } catch (vErr) {
                console.warn('Backend verification notice:', vErr);
              }
            }

            if (verification.success) {
              const updated: UserProfile = verification.user || {
                id: currentUser?.id || 'guest_op',
                username: currentUser?.username || 'Operator',
                email: currentUser?.email || 'operator@cyberguard.ai',
                created_at: currentUser?.created_at || new Date().toISOString(),
                plan: planName as any,
                credits: (currentUser?.credits || 0) + creditsToAdd,
                max_credits: planName === 'premium' ? 5000 : (currentUser?.max_credits || 50),
                memory_max_kb: planName === 'premium' ? 8192.0 : 256.0,
                memory_used_kb: memoryUsedKb,
                memory_used_pct: Math.min(100, Math.round((memoryUsedKb / (planName === 'premium' ? 8192.0 : 256.0)) * 100))
              };
              onUpdateUser(updated);
              setStatusMsg({
                type: 'success',
                text: `Payment Confirmed! Order: ${order.order_id}. Upgraded with ${creditsToAdd.toLocaleString()} AI Credits!`
              });
            }
          } catch (verifyErr: any) {
            setStatusMsg({
              type: 'error',
              text: verifyErr.message || 'Payment signature verification failed. Please contact support.'
            });
          } finally {
            setIsProcessing(false);
          }
        }
      };

      if (order?.order_id) {
        options.order_id = order.order_id;
      }

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', (resp: any) => {
        setIsProcessing(false);
        setStatusMsg({
          type: 'error',
          text: `Payment Failed: ${resp.error?.description || resp.error?.reason || 'Transaction could not be completed.'}`
        });
      });

      rzpInstance.open();
    } catch (err: any) {
      setIsProcessing(false);
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to initiate Razorpay checkout.'
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 14, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 100020,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.22 }}
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--accent-cyan)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          boxShadow: '0 25px 65px rgba(0,0,0,0.85), 0 0 35px rgba(0,240,255,0.22)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: isPro ? 'rgba(234, 179, 8, 0.15)' : 'rgba(0, 240, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isPro ? '1px solid #eab308' : '1px solid var(--accent-cyan)'
              }}
            >
              {isPro ? <Crown size={20} color="#eab308" /> : <Shield size={20} color="var(--accent-cyan)" />}
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Operator Profile &amp; Quota</span>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: isPro ? 'rgba(234, 179, 8, 0.2)' : 'rgba(0, 240, 255, 0.15)',
                    color: isPro ? '#facc15' : 'var(--accent-cyan)',
                    border: isPro ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(0, 240, 255, 0.35)'
                  }}
                >
                  {isPro ? '👑 PRO OPERATOR' : 'FREE TIER'}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                ChatGPT-Style Free Quotas, Copilot Memory &amp; Premium Perks
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ padding: '20px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Status Message Banner */}
          {statusMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.76rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: statusMsg.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.16)' 
                  : statusMsg.type === 'error'
                  ? 'rgba(239, 68, 68, 0.16)'
                  : 'rgba(0, 240, 255, 0.12)',
                border: statusMsg.type === 'success'
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : statusMsg.type === 'error'
                  ? '1px solid rgba(239, 68, 68, 0.4)'
                  : '1px solid rgba(0, 240, 255, 0.3)',
                color: statusMsg.type === 'success' ? '#10b981' : statusMsg.type === 'error' ? '#ef4444' : 'var(--accent-cyan)'
              }}
            >
              {statusMsg.type === 'success' && <CheckCircle2 size={16} />}
              {statusMsg.type === 'error' && <AlertTriangle size={16} />}
              {statusMsg.type === 'info' && <RefreshCw size={16} className="spinning" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* User Identity Card */}
          <div
            style={{
              background: 'var(--code-box-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: isPro ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #00f0ff 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#070a10',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  border: isPro ? '2px solid #facc15' : '2px solid var(--accent-cyan)'
                }}
              >
                {currentUser?.username ? currentUser.username.substring(0, 1).toUpperCase() : 'G'}
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {currentUser?.username || 'Guest Cyber Operator'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {currentUser?.email || 'Anonymous Guest Session (No account)'}
                </div>
              </div>
            </div>

            {!currentUser && onOpenAuthModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 240, 255, 0.12)',
                  border: '1px solid rgba(0, 240, 255, 0.35)',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Sign In / Sync
              </button>
            )}
          </div>

          {/* Metrics Grid: Credits + Memory Fill-Up */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            
            {/* AI Credits Meter */}
            <div
              style={{
                background: 'var(--code-box-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Zap size={14} color="#00f0ff" />
                  <span>AI Credits Remaining</span>
                </span>
                <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                  {currentCredits.toLocaleString()} / {maxCredits.toLocaleString()}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${creditPct}%`,
                    background: creditPct > 20 ? 'linear-gradient(90deg, #00f0ff 0%, #10b981 100%)' : '#ef4444',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                <span>{isPro ? 'Priority AI Processing' : 'Daily Quota (50/day)'}</span>
                <span>{creditPct}% left</span>
              </div>
            </div>

            {/* Copilot Memory Fill-Up */}
            <div
              style={{
                background: 'var(--code-box-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <HardDrive size={14} color="#a855f7" />
                  <span>Copilot Memory Fill-Up</span>
                </span>
                <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 900, color: '#a855f7' }}>
                  {memoryPct}% ({memoryUsedKb} KB)
                </span>
              </div>

              {/* Memory progress bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${memoryPct}%`,
                    background: memoryPct > 80 ? '#ef4444' : 'linear-gradient(90deg, #a855f7 0%, #3b82f6 100%)',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                <span>{isPro ? 'Extended 8 MB Context' : '256 KB Session Memory'}</span>
                <span>Max: {memoryMaxKb >= 1024 ? `${(memoryMaxKb / 1024).toFixed(0)} MB` : `${memoryMaxKb} KB`}</span>
              </div>
            </div>

          </div>

          {/* Tier Overview (Free vs Premium) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} color="var(--accent-cyan)" />
              <span>Subscription &amp; Feature Comparison</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {/* Free Tier Card */}
              <div
                style={{
                  border: isPro ? '1px solid var(--border-color)' : '1.5px solid var(--accent-cyan)',
                  borderRadius: '12px',
                  padding: '12px',
                  background: isPro ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 240, 255, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Free Tier</span>
                  <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                    {!isPro ? 'Active Plan' : 'Standard'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={12} color="#10b981" />
                    <span>All 8 security scanners (100% Free)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={12} color="#10b981" />
                    <span>50 Daily AI analysis credits</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={12} color="#10b981" />
                    <span>256 KB Copilot context memory</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={12} color="#10b981" />
                    <span>Community threat feed</span>
                  </div>
                </div>
              </div>

              {/* Premium Pro Card */}
              <div
                style={{
                  border: isPro ? '1.5px solid #eab308' : '1px solid rgba(234, 179, 8, 0.4)',
                  borderRadius: '12px',
                  padding: '12px',
                  background: 'rgba(234, 179, 8, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#facc15', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Crown size={13} color="#facc15" />
                    <span>Premium Pro</span>
                  </span>
                  <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '8px', background: isPro ? 'rgba(234, 179, 8, 0.25)' : 'rgba(234, 179, 8, 0.15)', color: '#facc15', fontWeight: 800 }}>
                    {isPro ? 'Active' : 'Upgrade'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={12} color="#facc15" />
                    <span><strong>5,000 AI Credits</strong> per pool</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={12} color="#facc15" />
                    <span><strong>8 MB</strong> Copilot Context Memory</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={12} color="#facc15" />
                    <span>Priority Zero-Day Sandbox Execution</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={12} color="#facc15" />
                    <span>PDF/CSV Export &amp; Dedicated AI Analyst</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Razorpay Standard Web Checkout Purchase Section */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.06) 0%, rgba(99, 102, 241, 0.06) 100%)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <CreditCard size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Upgrade or Top-Up with Razorpay Checkout
                </span>
              </div>
              <span className="mono" style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                Powered by Razorpay
              </span>
            </div>

            {/* Selection Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              
              {/* Option 1: Pro Pass */}
              <div
                onClick={() => setSelectedPlan('pro')}
                style={{
                  border: selectedPlan === 'pro' ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  background: selectedPlan === 'pro' ? 'rgba(0, 240, 255, 0.12)' : 'var(--code-box-bg)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>Pro Pass</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>₹2</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  5,000 Credits + 8MB Memory + Pro Status
                </div>
              </div>

              {/* Option 2: Booster */}
              <div
                onClick={() => setSelectedPlan('booster')}
                style={{
                  border: selectedPlan === 'booster' ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  background: selectedPlan === 'booster' ? 'rgba(0, 240, 255, 0.12)' : 'var(--code-box-bg)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>Credit Booster</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>₹1</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  500 AI Credits Instant Top-Up
                </div>
              </div>

            </div>

            {/* Razorpay Standard Checkout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isProcessing}
              onClick={() => handleRazorpayCheckout(selectedPlan)}
              style={{
                background: 'linear-gradient(135deg, #00f0ff 0%, #3b82f6 100%)',
                color: '#070a10',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 18px',
                fontSize: '0.85rem',
                fontWeight: 900,
                cursor: isProcessing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(0, 240, 255, 0.35)',
                opacity: isProcessing ? 0.75 : 1
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="spinning" />
                  <span>Connecting to Razorpay Gateway...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>
                    Pay {selectedPlan === 'pro' ? '₹2' : '₹1'} via Razorpay Checkout
                  </span>
                  <ArrowUpRight size={16} />
                </>
              )}
            </motion.button>

            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              🔒 Verified HMAC-SHA256 Server Signature Validation • Cards, UPI, NetBanking &amp; Wallets
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: '12px 22px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)'
          }}
        >
          {currentUser ? (
            <button
              onClick={() => {
                onUpdateUser(null);
                onClose();
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          ) : (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Sign in to preserve scan history across devices
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              background: 'var(--code-box-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

      </motion.div>
    </div>
  );
};
