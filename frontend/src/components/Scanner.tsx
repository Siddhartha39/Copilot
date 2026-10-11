import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, RefreshCw, Zap, Shield, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { BenchmarkSample } from '../types';
import { InfoTooltip } from './InfoTooltip';

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
  const [scanMode, setScanMode] = useState<'free' | 'deep'>('free');
  const [forceRefresh, setForceRefresh] = useState(false);
  const [selectedSample, setSelectedSample] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [localFocus, setLocalFocus] = useState<'developer' | 'phishing'>(scannerFocus);

  const activeFocus = scannerFocus || localFocus;

  const handleSelectFocus = (focus: 'developer' | 'phishing') => {
    setLocalFocus(focus);
    onScannerFocusChange?.(focus);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onScan(url.trim(), true, forceRefresh, activeFocus);
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
      className="glass-panel"
      style={{
        padding: '26px 24px',
        margin: '0 24px 20px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Dual-Feature Persona Mode Selector */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleSelectFocus('developer')}
              style={{
                background: activeFocus === 'developer'
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)'
                  : 'var(--code-box-bg)',
                color: activeFocus === 'developer' ? '#38bdf8' : 'var(--text-secondary)',
                border: activeFocus === 'developer' ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeFocus === 'developer' ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              <Shield size={17} color={activeFocus === 'developer' ? '#38bdf8' : 'var(--text-muted)'} />
              <span>Feature 1: Developer Website Security &amp; Anti-Hacking Audit</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectFocus('phishing')}
              style={{
                background: activeFocus === 'phishing'
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(249, 115, 22, 0.25) 100%)'
                  : 'var(--code-box-bg)',
                color: activeFocus === 'phishing' ? '#f87171' : 'var(--text-secondary)',
                border: activeFocus === 'phishing' ? '2px solid #f87171' : '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeFocus === 'phishing' ? '0 0 16px rgba(248, 113, 113, 0.25)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              <Zap size={17} color={activeFocus === 'phishing' ? '#f87171' : 'var(--text-muted)'} />
              <span>Feature 2: Phishing &amp; Fraud Intelligence Scanner</span>
            </button>
          </div>

          {/* Persona Explainer Callout */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: activeFocus === 'developer' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: activeFocus === 'developer' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--text-primary)'
            }}
          >
            {activeFocus === 'developer' ? (
              <>
                <Shield size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Feature 1 Active (Webmaster &amp; Developer Mode):</strong> Audits your website's defensive HTTP headers (CSP, HSTS, X-Frame-Options), tests anti-code injection &amp; clickjacking immunity, evaluates TLS/DNS, and generates drop-in server hardening configurations (Nginx, Apache, Next.js, Node.js Helmet, Cloudflare).
                </span>
              </>
            ) : (
              <>
                <Zap size={16} color="#f87171" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Feature 2 Active (SOC &amp; Threat Intelligence Mode):</strong> Inspects suspicious URLs for brand impersonation, visual logo contradiction (64-bit pHash), 24-dimensional lexical URL ML, newly registered domain (NRD) risk, and credential-harvesting traps.
                </span>
              </>
            )}
          </div>

          {/* Main Input Row */}
          <div className="scanner-input-row" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <motion.div
              animate={{
                borderColor: isFocused
                  ? (activeFocus === 'developer' ? '#00f0ff' : '#f87171')
                  : 'var(--border-color)',
                boxShadow: isFocused
                  ? (activeFocus === 'developer' ? '0 0 20px rgba(0, 240, 255, 0.25)' : '0 0 20px rgba(239, 68, 68, 0.25)')
                  : 'inset 0 2px 4px rgba(0,0,0,0.3)'
              }}
              transition={{ duration: 0.2 }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: 'var(--code-box-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0 16px'
              }}
            >
              <Search size={18} color={isFocused ? (activeFocus === 'developer' ? 'var(--accent-cyan)' : '#f87171') : 'var(--text-muted)'} />
              <input
                type="text"
                placeholder={activeFocus === 'developer'
                  ? "Enter your website domain to audit defensive headers & server hardening (e.g. psit.ac.in, github.com)"
                  : "Enter suspicious URL to inspect phishing brand spoofing & credential harvesting (e.g. login-paypal-verify.xyz)"}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
                className="mono"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  padding: '14px 12px'
                }}
              />
              {url && !isLoading && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}
                >
                  Clear
                </button>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: isLoading || !url.trim() ? 1 : 1.03 }}
              whileTap={{ scale: isLoading || !url.trim() ? 1 : 0.97 }}
              type="submit"
              disabled={isLoading || !url.trim()}
              className={`scanner-submit-btn ${!isLoading && url.trim() ? 'cyber-shimmer-btn' : ''}`}
              style={{
                background: isLoading
                  ? 'rgba(55, 65, 81, 0.8)'
                  : activeFocus === 'developer'
                    ? 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                color: isLoading ? 'var(--text-muted)' : (activeFocus === 'developer' ? '#070a10' : '#ffffff'),
                border: 'none',
                borderRadius: '12px',
                padding: '0 24px',
                height: '50px',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isLoading || !url.trim()
                  ? 'none'
                  : activeFocus === 'developer'
                    ? '0 0 25px rgba(0, 240, 255, 0.45)'
                    : '0 0 25px rgba(239, 68, 68, 0.45)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span className="cyber-font">
                    {activeFocus === 'developer' ? 'AUDITING DEFENSE...' : 'ANALYZING THREAT...'}
                  </span>
                </>
              ) : (
                <>
                  {activeFocus === 'developer' ? <Shield size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  <span className="cyber-font">
                    {activeFocus === 'developer'
                      ? 'RUN FULL AUDIT & SERVER HARDENING'
                      : 'RUN FULL PHISHING & FRAUD SCAN'}
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
                  background: activeFocus === 'developer' ? 'rgba(0, 240, 255, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  border: activeFocus === 'developer' ? '1px solid var(--accent-cyan)' : '1px solid #f87171',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: activeFocus === 'developer' ? 'var(--accent-cyan)' : '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: activeFocus === 'developer' ? '0 0 12px rgba(0, 240, 255, 0.2)' : '0 0 12px rgba(239, 68, 68, 0.2)'
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Demo Target:
              </span>
              <select
                value={selectedSample}
                onChange={(e) => handleSelectSample(e.target.value)}
                disabled={isLoading}
                style={{
                  background: 'var(--code-box-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  padding: '7px 12px',
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer'
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

          {/* Quick 1-Tap Target Benchmark Pills Tailored to Feature */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {activeFocus === 'developer' ? 'DEVELOPER AUDIT TARGETS:' : 'PHISHING DETECTION TARGETS:'}
            </span>
            {activeQuickTargets.map((tgt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => { setUrl(tgt.url); }}
                style={{
                  background: url === tgt.url
                    ? (activeFocus === 'developer' ? 'rgba(0, 240, 255, 0.22)' : 'rgba(239, 68, 68, 0.22)')
                    : 'var(--code-box-bg)',
                  border: url === tgt.url
                    ? (activeFocus === 'developer' ? '1px solid var(--accent-cyan)' : '1px solid #f87171')
                    : '1px solid var(--border-color)',
                  color: url === tgt.url
                    ? (activeFocus === 'developer' ? 'var(--accent-cyan)' : '#f87171')
                    : 'var(--text-primary)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  boxShadow: url === tgt.url
                    ? (activeFocus === 'developer' ? '0 0 12px rgba(0, 240, 255, 0.3)' : '0 0 12px rgba(239, 68, 68, 0.3)')
                    : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <span className="mono">{tgt.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </form>
    </motion.div>
  );
};
