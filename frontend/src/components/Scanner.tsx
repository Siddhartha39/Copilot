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
      transition={{ duration: 0.3 }}
      style={{
        background: 'var(--bg-card, #FFFFFF)',
        borderRadius: '0px',
        boxShadow: '8px 8px 0px 0px #000000',
        border: '4px solid #000000',
        padding: '28px 24px',
        margin: '0 0 24px 0',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Dual-Feature Persona Mode Selector -> Neo-Brutalist High-Contrast Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ translateY: -2, boxShadow: '6px 6px 0px 0px #000000' }}
              whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '2px 2px 0px 0px #000000' }}
              type="button"
              onClick={() => handleSelectFocus('developer')}
              style={{
                background: activeFocus === 'developer' ? '#4D96FF' : 'var(--bg-secondary, #FFFFFF)',
                color: activeFocus === 'developer' ? '#FFFFFF' : '#000000',
                border: '3px solid #000000',
                borderRadius: '0px',
                padding: '12px 20px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: activeFocus === 'developer' ? '4px 4px 0px 0px #000000' : '3px 3px 0px 0px #000000',
                transition: 'background 0.15s ease, color 0.15s ease',
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >
              <div
                style={{
                  background: activeFocus === 'developer' ? '#FFFFFF' : '#4D96FF',
                  padding: '4px',
                  borderRadius: '0px',
                  border: '2px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Shield size={16} color={activeFocus === 'developer' ? '#4D96FF' : '#FFFFFF'} />
              </div>
              <span>Feature 1: Developer Website Security &amp; Anti-Hacking Audit</span>
            </motion.button>

            <motion.button
              whileHover={{ translateY: -2, boxShadow: '6px 6px 0px 0px #000000' }}
              whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '2px 2px 0px 0px #000000' }}
              type="button"
              onClick={() => handleSelectFocus('phishing')}
              style={{
                background: activeFocus === 'phishing' ? '#FF6B6B' : 'var(--bg-secondary, #FFFFFF)',
                color: activeFocus === 'phishing' ? '#FFFFFF' : '#000000',
                border: '3px solid #000000',
                borderRadius: '0px',
                padding: '12px 20px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: activeFocus === 'phishing' ? '4px 4px 0px 0px #000000' : '3px 3px 0px 0px #000000',
                transition: 'background 0.15s ease, color 0.15s ease',
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >
              <div
                style={{
                  background: activeFocus === 'phishing' ? '#FFFFFF' : '#FF6B6B',
                  padding: '4px',
                  borderRadius: '0px',
                  border: '2px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Zap size={16} color={activeFocus === 'phishing' ? '#FF6B6B' : '#FFFFFF'} />
              </div>
              <span>Feature 2: Phishing &amp; Fraud Intelligence Scanner</span>
            </motion.button>
          </div>

          {/* Persona Explainer Callout -> Neo-Brutalist Sticker Box */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '0px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: activeFocus === 'developer' ? '#EBF4FF' : '#FFF1F2',
              boxShadow: '4px 4px 0px 0px #000000',
              border: '3px solid #000000',
              color: '#000000',
              lineHeight: 1.55,
              fontWeight: 500
            }}
          >
            {activeFocus === 'developer' ? (
              <>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '0px',
                    background: '#4D96FF',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0px 0px #000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Shield size={16} color="#FFFFFF" />
                </div>
                <span>
                  <strong style={{ color: '#000000', fontWeight: 800 }}>Feature 1 Active (Webmaster &amp; Developer Mode):</strong> Audits your website's defensive HTTP headers (CSP, HSTS, X-Frame-Options), tests anti-code injection &amp; clickjacking immunity, evaluates TLS/DNS, and generates drop-in server hardening configurations (Nginx, Apache, Next.js, Node.js Helmet, Cloudflare).
                </span>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '0px',
                    background: '#FF6B6B',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0px 0px #000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Zap size={16} color="#FFFFFF" />
                </div>
                <span>
                  <strong style={{ color: '#000000', fontWeight: 800 }}>Feature 2 Active (SOC &amp; Threat Intelligence Mode):</strong> Inspects suspicious URLs for brand impersonation, visual logo contradiction (64-bit pHash), 24-dimensional lexical URL ML, newly registered domain (NRD) risk, and credential-harvesting traps.
                </span>
              </>
            )}
          </div>

          {/* Main Input Row -> Neo-Brutalist Solid Input + Hard Action Button */}
          <div className="scanner-input-row" style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: '1 1 320px',
                display: 'flex',
                alignItems: 'center',
                background: '#FFFFFF',
                boxShadow: '4px 4px 0px 0px #000000',
                border: '3px solid #000000',
                borderRadius: '0px',
                padding: '0 16px',
                height: '54px'
              }}
            >
              <Search size={20} color={activeFocus === 'developer' ? '#4D96FF' : '#FF6B6B'} />
              <input
                type="text"
                placeholder={activeFocus === 'developer'
                  ? "Enter website domain to audit defensive headers & server hardening (e.g. psit.ac.in, github.com)"
                  : "Enter suspicious URL to inspect phishing brand spoofing & credential harvesting (e.g. login-paypal-verify.xyz)"}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#000000',
                  fontSize: '0.94rem',
                  padding: '12px 14px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600
                }}
              />
              {url && !isLoading && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  style={{
                    background: '#FFD93D',
                    boxShadow: '2px 2px 0px 0px #000000',
                    border: '2px solid #000000',
                    color: '#000000',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    borderRadius: '0px',
                    fontWeight: 800,
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                >
                  CLEAR
                </button>
              )}
            </div>

            <motion.button
              whileHover={{ translateY: isLoading || !url.trim() ? 0 : -2, boxShadow: isLoading || !url.trim() ? 'none' : '6px 6px 0px 0px #000000' }}
              whileTap={{ transform: isLoading || !url.trim() ? 'none' : 'translate(2px, 2px)', boxShadow: isLoading || !url.trim() ? 'none' : '2px 2px 0px 0px #000000' }}
              type="submit"
              disabled={isLoading || !url.trim()}
              style={{
                background: isLoading
                  ? '#CBD5E1'
                  : activeFocus === 'developer'
                    ? '#4D96FF'
                    : '#FF6B6B',
                color: '#FFFFFF',
                border: '3px solid #000000',
                borderRadius: '0px',
                padding: '0 26px',
                height: '54px',
                fontWeight: 900,
                fontSize: '0.92rem',
                cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: isLoading || !url.trim() ? 'none' : '4px 4px 0px 0px #000000',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '0.02em'
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>
                    {activeFocus === 'developer' ? 'AUDITING DEFENSE...' : 'ANALYZING THREAT...'}
                  </span>
                </>
              ) : (
                <>
                  {activeFocus === 'developer' ? <Shield size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
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
                  background: activeFocus === 'developer' ? '#4D96FF' : '#FF6B6B',
                  boxShadow: '3px 3px 0px 0px #000000',
                  border: '2px solid #000000',
                  borderRadius: '0px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Space Grotesk', sans-serif"
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
              <span style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>
                DEMO TARGET:
              </span>
              <select
                value={selectedSample}
                onChange={(e) => handleSelectSample(e.target.value)}
                disabled={isLoading}
                style={{
                  background: '#FFFFFF',
                  boxShadow: '3px 3px 0px 0px #000000',
                  border: '2px solid #000000',
                  borderRadius: '0px',
                  color: '#000000',
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700
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

          {/* Quick 1-Tap Target Benchmark Buttons -> Neo-Brutalist Sticker Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <span style={{ fontSize: '0.74rem', color: '#000000', fontWeight: 900, textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>
              {activeFocus === 'developer' ? 'QUICK TARGETS:' : 'PHISHING SAMPLES:'}
            </span>
            {activeQuickTargets.map((tgt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ translateY: -1, boxShadow: '4px 4px 0px 0px #000000' }}
                whileTap={{ transform: 'translate(1px, 1px)', boxShadow: '1px 1px 0px 0px #000000' }}
                type="button"
                onClick={() => { setUrl(tgt.url); }}
                style={{
                  background: url === tgt.url
                    ? (activeFocus === 'developer' ? '#4D96FF' : '#FF6B6B')
                    : '#FFFDF5',
                  boxShadow: '2px 2px 0px 0px #000000',
                  color: url === tgt.url ? '#FFFFFF' : '#000000',
                  borderRadius: '0px',
                  padding: '6px 14px',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  border: '2px solid #000000',
                  transition: 'background 0.15s ease, color 0.15s ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800
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
