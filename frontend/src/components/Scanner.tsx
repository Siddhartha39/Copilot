import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, RefreshCw, Zap, Shield } from 'lucide-react';
import type { BenchmarkSample } from '../types';

interface ScannerProps {
  onScan: (url: string, deep: boolean, forceRefresh: boolean, focus?: 'developer' | 'phishing') => void;
  isLoading: boolean;
  benchmarkSamples: BenchmarkSample[];
  scannerFocus?: 'developer' | 'phishing';
  onScannerFocusChange?: (focus: 'developer' | 'phishing') => void;
}

export const Scanner: React.FC<ScannerProps> = ({
  onScan,
  isLoading,
  benchmarkSamples,
  scannerFocus = 'developer',
  onScannerFocusChange
}) => {
  const [url, setUrl] = useState('');
  const [selectedSample, setSelectedSample] = useState('');
  const [localFocus, setLocalFocus] = useState<'developer' | 'phishing'>(scannerFocus);

  const activeFocus = scannerFocus || localFocus;

  const handleSelectFocus = (focus: 'developer' | 'phishing') => {
    setLocalFocus(focus);
    onScannerFocusChange?.(focus);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onScan(url.trim(), true, false, activeFocus);
  };

  const handleSelectSample = (sampleId: string) => {
    setSelectedSample(sampleId);
    const found = benchmarkSamples.find((s) => s.id === sampleId);
    if (found) {
      setUrl(found.url);
    }
  };

  // Quick targets tailored specifically for each feature
  const developerTargets = [
    { label: 'psit.ac.in (Edu Web Portal)', url: 'https://psit.ac.in', desc: 'Audit headers & student portal posture' },
    { label: 'github.com (Hardened Grade A+)', url: 'https://github.com', desc: 'Enterprise baseline defense' },
    { label: 'example.com (Basic Web Server)', url: 'http://example.com', desc: 'Missing CSP/HSTS baseline' },
    { label: 'wikipedia.org (Knowledge Base)', url: 'https://wikipedia.org', desc: 'Public content delivery' }
  ];

  const phishingTargets = [
    { label: 'PayPal Spoof (.xyz)', url: 'http://login-paypal-security-verification.xyz/auth/signin', desc: 'Brand Contradiction' },
    { label: 'Microsoft 365 Fake Portal (.top)', url: 'http://microsoft-onedrive-sharepoint-verify.top/login.php', desc: 'Credential Harvester' },
    { label: 'Apple ID Punycode (Homograph)', url: 'http://xn--appl-1na.com/icloud/find-my-iphone', desc: 'IDN Spoof' },
    { label: 'campuskart.shop (43d NRD)', url: 'https://campuskart.shop', desc: 'Newly Registered Domain' }
  ];

  const activeQuickTargets = activeFocus === 'developer' ? developerTargets : phishingTargets;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background: 'var(--neu-bg, #E0E5EC)',
        borderRadius: '28px',
        boxShadow: 'var(--neu-extruded)',
        padding: '28px 24px',
        margin: '0 0 24px 0',
        position: 'relative',
        overflow: 'hidden',
        border: 'none',
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Dual-Feature Persona Mode Selector -> Neumorphic Extruded & Inset Tabs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleSelectFocus('developer')}
              style={{
                background: 'var(--neu-bg, #E0E5EC)',
                color: activeFocus === 'developer' ? '#3B82F6' : 'var(--neu-muted, #6B7280)',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 18px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeFocus === 'developer' ? 'var(--neu-inset)' : 'var(--neu-extruded-sm)',
                transition: 'all 0.2s ease',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              <Shield size={17} color={activeFocus === 'developer' ? '#3B82F6' : 'var(--neu-muted, #6B7280)'} />
              <span>Feature 1: Developer Website Security &amp; Anti-Hacking Audit</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectFocus('phishing')}
              style={{
                background: 'var(--neu-bg, #E0E5EC)',
                color: activeFocus === 'phishing' ? '#EF4444' : 'var(--neu-muted, #6B7280)',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 18px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeFocus === 'phishing' ? 'var(--neu-inset)' : 'var(--neu-extruded-sm)',
                transition: 'all 0.2s ease',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              <Zap size={17} color={activeFocus === 'phishing' ? '#EF4444' : 'var(--neu-muted, #6B7280)'} />
              <span>Feature 2: Phishing &amp; Fraud Intelligence Scanner</span>
            </button>
          </div>

          {/* Persona Explainer Callout -> Inset Well */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '16px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'var(--neu-bg, #E0E5EC)',
              boxShadow: 'var(--neu-inset-sm)',
              border: 'none',
              color: 'var(--neu-foreground, #3D4852)',
              lineHeight: 1.55
            }}
          >
            {activeFocus === 'developer' ? (
              <>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--neu-bg)', boxShadow: 'var(--neu-inset-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={16} color="#3B82F6" />
                </div>
                <span>
                  <strong style={{ color: '#3B82F6' }}>Feature 1 Active (Webmaster &amp; Developer Mode):</strong> Audits your website's defensive HTTP headers (CSP, HSTS, X-Frame-Options), tests anti-code injection &amp; clickjacking immunity, evaluates TLS/DNS, and generates drop-in server hardening configurations (Nginx, Apache, Next.js, Node.js Helmet, Cloudflare).
                </span>
              </>
            ) : (
              <>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--neu-bg)', boxShadow: 'var(--neu-inset-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={16} color="#EF4444" />
                </div>
                <span>
                  <strong style={{ color: '#EF4444' }}>Feature 2 Active (SOC &amp; Threat Intelligence Mode):</strong> Inspects suspicious URLs for brand impersonation, visual logo contradiction (64-bit pHash), 24-dimensional lexical URL ML, newly registered domain (NRD) risk, and credential-harvesting traps.
                </span>
              </>
            )}
          </div>

          {/* Main Input Row -> Neumorphic Deep Inset Input Well */}
          <div className="scanner-input-row" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: 'var(--neu-bg, #E0E5EC)',
                boxShadow: 'var(--neu-inset-deep)',
                border: 'none',
                borderRadius: '20px',
                padding: '0 18px',
                height: '52px'
              }}
            >
              <Search size={18} color={activeFocus === 'developer' ? '#3B82F6' : '#EF4444'} />
              <input
                type="text"
                placeholder={activeFocus === 'developer'
                  ? "Enter your website domain to audit defensive headers & server hardening (e.g. psit.ac.in, github.com)"
                  : "Enter suspicious URL to inspect phishing brand spoofing & credential harvesting (e.g. login-paypal-verify.xyz)"}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--neu-foreground, #3D4852)',
                  fontSize: '0.92rem',
                  padding: '12px 14px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600
                }}
              />
              {url && !isLoading && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  style={{
                    background: 'var(--neu-bg, #E0E5EC)',
                    boxShadow: 'var(--neu-extruded-sm)',
                    border: 'none',
                    color: 'var(--neu-muted, #6B7280)',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontWeight: 700
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: isLoading || !url.trim() ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !url.trim() ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading || !url.trim()}
              style={{
                background: isLoading
                  ? 'var(--neu-bg, #E0E5EC)'
                  : activeFocus === 'developer'
                    ? 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)'
                    : 'linear-gradient(135deg, #6C63FF 0%, #8B84FF 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '18px',
                padding: '0 26px',
                height: '52px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isLoading || !url.trim()
                  ? 'none'
                  : '4px 4px 14px rgba(108, 99, 255, 0.4)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span>
                    {activeFocus === 'developer' ? 'AUDITING DEFENSE...' : 'ANALYZING THREAT...'}
                  </span>
                </>
              ) : (
                <>
                  {activeFocus === 'developer' ? <Shield size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  <span>
                    {activeFocus === 'developer'
                      ? 'RUN AUDIT & HARDENING'
                      : 'RUN PHISHING & FRAUD SCAN'}
                  </span>
                </>
              )}
            </motion.button>
          </div>

          {/* Options & Scan Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: 'var(--neu-bg, #E0E5EC)',
                  boxShadow: 'var(--neu-inset-sm)',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: activeFocus === 'developer' ? '#3B82F6' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              >
                {activeFocus === 'developer' ? <Shield size={14} /> : <Zap size={14} />}
                <span>
                  {activeFocus === 'developer' ? 'Defensive Posture & Exploit Immunity' : 'Multi-Modal Phishing Intelligence'}
                </span>
              </div>
            </div>

            {/* Benchmark Samples Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 700 }}>
                Demo Target:
              </span>
              <select
                value={selectedSample}
                onChange={(e) => handleSelectSample(e.target.value)}
                disabled={isLoading}
                style={{
                  background: 'var(--neu-bg, #E0E5EC)',
                  boxShadow: 'var(--neu-inset-sm)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'var(--neu-foreground, #3D4852)',
                  padding: '7px 14px',
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600
                }}
              >
                <option value="">Select a Benchmark Case...</option>
                {benchmarkSamples.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.name} ({sample.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick 1-Tap Target Benchmark Pills -> Soft Extruded Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {activeFocus === 'developer' ? 'DEVELOPER AUDIT TARGETS:' : 'PHISHING DETECTION TARGETS:'}
            </span>
            {activeQuickTargets.map((tgt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => { setUrl(tgt.url); }}
                style={{
                  background: 'var(--neu-bg, #E0E5EC)',
                  boxShadow: url === tgt.url ? 'var(--neu-inset)' : 'var(--neu-extruded-sm)',
                  color: url === tgt.url
                    ? (activeFocus === 'developer' ? '#3B82F6' : '#EF4444')
                    : 'var(--neu-foreground, #3D4852)',
                  borderRadius: '9999px',
                  padding: '5px 14px',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.15s ease',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: url === tgt.url ? 800 : 600
                }}
              >
                <span>{tgt.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </form>
    </motion.div>
  );
};
