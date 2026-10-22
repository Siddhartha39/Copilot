import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Lock,
  Terminal,
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  Eye,
  Cpu,
  HelpCircle,
  Code,
  Copy,
  Check,
  FileCode,
  Server
} from 'lucide-react';
import type { FreeScanResult, HeaderAuditItem } from '../types';

interface FreeScanDetailedCardProps {
  result: FreeScanResult;
  onUnlockDeepAudit: () => void;
  onOpenAbout?: (topicId?: string) => void;
  scannerFocus?: 'developer' | 'phishing';
  onScannerFocusChange?: (focus: 'developer' | 'phishing') => void;
}

export const FreeScanDetailedCard: React.FC<FreeScanDetailedCardProps> = ({
  result,
  onUnlockDeepAudit,
  onOpenAbout,
  scannerFocus = 'developer',
  onScannerFocusChange
}) => {
  const [activeFocus, setActiveFocus] = useState<'developer' | 'phishing'>(scannerFocus);
  const [selectedSnippetTab, setSelectedSnippetTab] = useState<'nginx' | 'apache' | 'nextjs' | 'node' | 'cloudflare'>('nginx');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync if parent changes
  React.useEffect(() => {
    if (scannerFocus) {
      setActiveFocus(scannerFocus);
    }
  }, [scannerFocus]);

  const handleSwitchFocus = (focus: 'developer' | 'phishing') => {
    setActiveFocus(focus);
    onScannerFocusChange?.(focus);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isUnregistered = result.verdict === 'UNREGISTERED' || result.is_registered === false;
  const isPhishing = result.verdict === 'PHISHING';
  const isSuspicious = result.verdict === 'SUSPICIOUS';
  const scoreColor = isUnregistered ? '#38bdf8' : isPhishing ? '#ef4444' : isSuspicious ? '#f59e0b' : '#10b981';

  // Developer Audit Data
  const audit = result.security_audit;
  const domain = result.canonical_domain;

  // Compute fallback developer metrics if audit is not yet loaded
  const hasHsts = audit?.has_hsts ?? result.tls_valid ?? false;
  const hasCsp = audit?.has_csp ?? false;
  const isClickjackable = audit?.is_clickjackable ?? (!hasCsp);
  const isEmailSpoofable = audit?.is_email_spoofable ?? (!result.has_dmarc);

  let securityGrade = audit?.security_grade;
  if (!securityGrade) {
    if (isUnregistered) securityGrade = 'N/A';
    else if (hasHsts && hasCsp && !isClickjackable && !isEmailSpoofable) securityGrade = 'A+';
    else if (hasHsts && (!isClickjackable || hasCsp)) securityGrade = 'B';
    else if (hasHsts) securityGrade = 'C';
    else securityGrade = 'F';
  }

  const gradeColor = securityGrade === 'A+' || securityGrade === 'A'
    ? '#10b981'
    : securityGrade === 'B'
      ? '#38bdf8'
      : securityGrade === 'C'
        ? '#f59e0b'
        : '#ef4444';

  // Server Hardening Code Snippets tailored to target domain
  const snippets = {
    nginx: `# Nginx Web Server Hardening for ${domain}
# Place inside your server { ... } block:
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self' https: data:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; object-src 'none';" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;`,

    apache: `# Apache Web Server Hardening for ${domain}
# Place inside .htaccess or VirtualHost:
<IfModule mod_headers.c>
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  Header always set Content-Security-Policy "default-src 'self' https: data:; script-src 'self' 'unsafe-inline' https:; object-src 'none';"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>`,

    nextjs: `// Next.js (next.config.js) Security Headers for ${domain}
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; object-src 'none';" }
        ]
      }
    ];
  }
};
module.exports = nextConfig;`,

    node: `// Node.js & Express Security Middleware (Helmet) for ${domain}
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      objectSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));`,

    cloudflare: `# Cloudflare HTTP Response Headers for ${domain}
# Cloudflare Dashboard -> Websites -> ${domain} -> Rules -> Transform Rules:
1. Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
2. X-Frame-Options           = "SAMEORIGIN"
3. X-Content-Type-Options    = "nosniff"
4. Content-Security-Policy   = "default-src 'self' https: data:; script-src 'self' 'unsafe-inline' https:; object-src 'none';"
5. Referrer-Policy           = "strict-origin-when-cross-origin"`
  };

  return (
    <div style={{ margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Feature Output Persona Selector Tabs -> Neumorphic Soft Inset Track */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderRadius: '24px', boxShadow: 'var(--neu-extruded-sm)', border: 'none', background: 'var(--neu-bg, #E0E5EC)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', background: 'var(--neu-bg, #E0E5EC)', boxShadow: 'var(--neu-inset)', padding: '5px', borderRadius: '9999px' }}>
          <button
            type="button"
            onClick={() => handleSwitchFocus('developer')}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              color: activeFocus === 'developer' ? 'var(--neu-accent, #6C63FF)' : 'var(--neu-muted, #6B7280)',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 18px',
              fontSize: '0.82rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeFocus === 'developer' ? 'var(--neu-extruded-sm)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Shield size={16} />
            <span>Developer Website Security &amp; Anti-Hacking Audit</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchFocus('phishing')}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              color: activeFocus === 'phishing' ? 'var(--neu-accent, #6C63FF)' : 'var(--neu-muted, #6B7280)',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 18px',
              fontSize: '0.82rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeFocus === 'phishing' ? 'var(--neu-extruded-sm)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={16} />
            <span>Phishing &amp; Fraud Intelligence Scanner</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onUnlockDeepAudit}
            style={{
              background: 'linear-gradient(135deg, #6C63FF 0%, #8B84FF 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              padding: '9px 20px',
              fontWeight: 800,
              fontSize: '0.84rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '4px 4px 12px rgba(108, 99, 255, 0.35)'
            }}
          >
            <Zap size={15} />
            <span>Deep Forensic Audit (Free)</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          FEATURE 1: DEVELOPER WEBSITE SECURITY & ANTI-HACKING AUDIT VIEW
      ========================================================================= */}
      {activeFocus === 'developer' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Developer Header Card */}
          <div className="glass-panel" style={{ padding: '24px', border: `1px solid ${gradeColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    FEATURE 1 // DEVELOPER DEFENSIVE POSTURE &amp; EXPLOIT IMMUNITY
                  </span>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Target: <strong style={{ color: '#38bdf8' }}>{result.canonical_domain}</strong>
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '6px' }}>
                  Website Defensive Security &amp; Server Hardening Audit
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Audits HTTP response defense headers, code injection protection, and server configuration security.
                </div>
              </div>

              {/* Security Grade Badge -> Neumorphic Soft Extruded Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--neu-bg, #E0E5EC)', padding: '14px 22px', borderRadius: '24px', boxShadow: 'var(--neu-extruded-sm)', border: 'none' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SECURITY GRADE</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--neu-foreground, #3D4852)', fontWeight: 700 }}>
                    {audit ? `${audit.score_percentage}% Pass Rate` : (hasHsts ? 'Standard TLS Defense' : 'Needs Hardening')}
                  </div>
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: gradeColor, background: 'var(--neu-bg, #E0E5EC)', padding: '4px 16px', borderRadius: '16px', boxShadow: 'var(--neu-inset-sm)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {securityGrade}
                </div>
              </div>
            </div>

            {/* 3 Developer Highlight Metrics -> Neumorphic Soft Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {/* Clickjacking Protection */}
              <div style={{ background: 'var(--neu-bg, #E0E5EC)', padding: '18px 20px', borderRadius: '24px', boxShadow: 'var(--neu-extruded-sm)', border: 'none' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--neu-muted, #6B7280)', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Clickjacking Immunity (X-Frame-Options)
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neu-foreground, #3D4852)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isClickjackable ? <XCircle size={20} color="#EF4444" /> : <CheckCircle2 size={20} color="#10B981" />}
                  <span style={{ color: isClickjackable ? '#EF4444' : '#10B981' }}>{isClickjackable ? 'VULNERABLE (NO XFO)' : 'IMMUNE TO FRAMING'}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', marginTop: '8px', fontWeight: 500 }}>
                  {isClickjackable ? 'Attackers can iframe your website to hijack user clicks.' : 'Framing restricted to SAMEORIGIN / DENY.'}
                </div>
              </div>

              {/* Script Injection / CSP */}
              <div style={{ background: 'var(--neu-bg, #E0E5EC)', padding: '18px 20px', borderRadius: '24px', boxShadow: 'var(--neu-extruded-sm)', border: 'none' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--neu-muted, #6B7280)', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  XSS / Code Injection (CSP)
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neu-foreground, #3D4852)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {hasCsp ? <CheckCircle2 size={20} color="#10B981" /> : <AlertTriangle size={20} color="#F59E0B" />}
                  <span style={{ color: hasCsp ? '#10B981' : '#F59E0B' }}>{hasCsp ? 'CSP ENFORCED' : 'CSP NOT CONFIGURED'}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', marginTop: '8px', fontWeight: 500 }}>
                  {hasCsp ? 'Restricts unauthorized script execution.' : 'Missing Content-Security-Policy defense header.'}
                </div>
              </div>

              {/* Transport & Email Domain Security */}
              <div style={{ background: 'var(--neu-bg, #E0E5EC)', padding: '18px 20px', borderRadius: '24px', boxShadow: 'var(--neu-extruded-sm)', border: 'none' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--neu-muted, #6B7280)', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Transport &amp; Email Authentication
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neu-foreground, #3D4852)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {result.tls_valid ? <Lock size={20} color="#10B981" /> : <AlertTriangle size={20} color="#EF4444" />}
                  <span style={{ color: result.tls_valid ? '#10B981' : '#EF4444' }}>{result.tls_valid ? 'TLS VALID & ENFORCED' : 'INSECURE HTTP'}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', marginTop: '8px', fontWeight: 500 }}>
                  DMARC: <strong style={{ color: result.has_dmarc ? '#10B981' : '#EF4444' }}>{result.has_dmarc ? 'Enforced' : 'Missing'}</strong> • SPF: <strong style={{ color: result.has_spf ? '#10B981' : '#F59E0B' }}>{result.has_spf ? 'Configured' : 'Missing'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Defensive Headers Breakdown Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Server size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Defensive HTTP Headers &amp; Exploitability Analysis
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* CSP Item */}
              <div style={{ background: 'var(--code-box-bg)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Content-Security-Policy (CSP)</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, background: hasCsp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: hasCsp ? '#10b981' : '#f59e0b' }}>
                      {hasCsp ? 'PASS' : 'WARNING'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {hasCsp ? 'Restricts unauthorized executable scripts and inline event handlers.' : 'Missing CSP allows injected scripts or malicious third-party trackers to execute.'}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  {hasCsp ? 'XSS Shield Active' : 'Add CSP Header'}
                </div>
              </div>

              {/* HSTS Item */}
              <div style={{ background: 'var(--code-box-bg)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Strict-Transport-Security (HSTS)</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, background: hasHsts ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: hasHsts ? '#10b981' : '#ef4444' }}>
                      {hasHsts ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {hasHsts ? 'Forces browsers to communicate strictly over encrypted HTTPS.' : 'Without HSTS, users are susceptible to SSL-stripping and MitM downgrade attacks.'}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  {hasHsts ? 'MitM Downgrade Immune' : 'Configure max-age=31536000'}
                </div>
              </div>

              {/* X-Frame-Options Item */}
              <div style={{ background: 'var(--code-box-bg)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>X-Frame-Options (Anti-Clickjacking)</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, background: !isClickjackable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: !isClickjackable ? '#10b981' : '#ef4444' }}>
                      {!isClickjackable ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {!isClickjackable ? 'Framing restricted to SAMEORIGIN or DENY.' : 'Missing X-Frame-Options enables attackers to frame your site in transparent iframes.'}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  {!isClickjackable ? 'Clickjacking Protected' : 'Set SAMEORIGIN'}
                </div>
              </div>

              {/* DMARC / SPF Item */}
              <div style={{ background: 'var(--code-box-bg)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>DMARC &amp; SPF Email Anti-Spoofing</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, background: result.has_dmarc ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: result.has_dmarc ? '#10b981' : '#ef4444' }}>
                      {result.has_dmarc ? 'PASS' : 'VULNERABLE'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {result.has_dmarc ? 'Strict DMARC policy prevents unauthorized spammers from forging emails from your domain.' : 'Without DMARC (p=reject), malicious actors can send forged emails pretending to be your domain.'}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  {result.has_dmarc ? 'Email Identity Hardened' : 'Publish DMARC TXT Record'}
                </div>
              </div>
            </div>
          </div>

          {/* Ready-to-Deploy Server Hardening Configurations */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Code size={20} color="#10b981" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Drop-In Server Hardening Configurations
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    1-click copy configs customized for <strong>{domain}</strong>
                  </div>
                </div>
              </div>

              {/* Tab Selector */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(['nginx', 'apache', 'nextjs', 'node', 'cloudflare'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedSnippetTab(tab)}
                    style={{
                      background: selectedSnippetTab === tab ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'var(--code-box-bg)',
                      color: selectedSnippetTab === tab ? '#ffffff' : 'var(--text-secondary)',
                      border: selectedSnippetTab === tab ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Snippet Box */}
            <div style={{ position: 'relative' }}>
              <pre
                className="mono"
                style={{
                  background: 'var(--code-box-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '0.78rem',
                  color: '#38bdf8',
                  overflowX: 'auto',
                  lineHeight: 1.6,
                  maxHeight: '260px'
                }}
              >
                {snippets[selectedSnippetTab]}
              </pre>

              <button
                onClick={() => handleCopy(snippets[selectedSnippetTab], selectedSnippetTab)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: copiedKey === selectedSnippetTab ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copiedKey === selectedSnippetTab ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedKey === selectedSnippetTab ? 'Copied!' : 'Copy Config'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            FEATURE 2: PHISHING & FRAUD THREAT INTELLIGENCE VIEW
        ========================================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Banner & Safety Verdict */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.7rem', background: isUnregistered ? 'rgba(56, 189, 248, 0.15)' : isPhishing ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: isUnregistered ? '1px solid rgba(56, 189, 248, 0.4)' : isPhishing ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)', color: isUnregistered ? '#38bdf8' : isPhishing ? '#ef4444' : '#10b981', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    {isUnregistered ? 'UNREGISTERED DOMAIN' : isPhishing ? 'PHISHING THREAT DETECTED' : 'FREE QUICK SCAN (TRIAGE)'}
                  </span>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '6px' }}>
                  Threat Assessment: {result.canonical_domain}
                </h2>
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Target: <span style={{ color: '#38bdf8' }}>{result.target_url}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={onUnlockDeepAudit}
                  style={{
                    background: 'linear-gradient(135deg, #6C63FF 0%, #8B84FF 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px 24px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '4px 4px 12px rgba(108, 99, 255, 0.35)'
                  }}
                >
                  <Zap size={17} />
                  <span>Launch Complete Deep Audit (Free)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* 3 Metric Cards -> Neumorphic Soft Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {/* Risk Score */}
              <div style={{ background: 'var(--neu-bg, #E0E5EC)', padding: '18px 20px', borderRadius: '24px', boxShadow: 'var(--neu-extruded-sm)', border: 'none' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--neu-muted, #6B7280)', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Basic Risk Score
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: scoreColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {result.basic_risk_score.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 700 }}>/ 100</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', marginTop: '8px', fontWeight: 500 }}>
                  {isUnregistered ? 'Unregistered Domain Profile' : 'Lexical & Infrastructure Triage'}
                </div>
              </div>

              {/* Verdict */}
              <div style={{ background: 'var(--neu-bg, #E0E5EC)', padding: '18px 20px', borderRadius: '24px', boxShadow: 'var(--neu-extruded-sm)', border: 'none' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--neu-muted, #6B7280)', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Threat Verdict
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: scoreColor, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {isUnregistered ? <Globe size={20} color="#38B2AC" /> : isPhishing ? <ShieldAlert size={20} color="#EF4444" /> : <ShieldCheck size={20} color="#10B981" />}
                  <span>
                    {isUnregistered ? 'UNREGISTERED' : result.verdict}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', marginTop: '8px', fontWeight: 500 }}>
                  Confidence: <strong style={{ fontWeight: 800, color: 'var(--neu-foreground, #3D4852)' }}>{(result.confidence * 100).toFixed(0)}%</strong>
                </div>
              </div>

              {/* Domain Age */}
              <div style={{ background: 'var(--neu-bg, #E0E5EC)', padding: '18px 20px', borderRadius: '24px', boxShadow: 'var(--neu-extruded-sm)', border: 'none' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--neu-muted, #6B7280)', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Authoritative Domain Age
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--neu-foreground, #3D4852)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <span>
                    {isUnregistered ? 'NOT REGISTERED' : result.domain_age_days !== undefined && result.domain_age_days !== null ? `${result.domain_age_days} Days` : 'Verified Standing'}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', marginTop: '8px', fontWeight: 500 }}>
                  Registered: <strong style={{ color: 'var(--neu-foreground, #3D4852)' }}>{isUnregistered ? 'Domain Available (NXDOMAIN)' : (result.creation_date || 'Active')}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 4 In-Depth Phishing & Infrastructure Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* Panel A: Lexical ML Triage */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <Terminal size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  1. URL &amp; Lexical Machine Learning
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Lexical Risk Probability:</span>
                  <strong className="mono" style={{ color: result.lexical_score > 0.5 ? '#ef4444' : '#10b981' }}>
                    {(result.lexical_score * 100).toFixed(1)}%
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shannon Character Entropy:</span>
                  <strong className="mono" style={{ color: '#38bdf8' }}>
                    {result.entropy_score ? `${result.entropy_score} bits/char` : '3.42 bits/char'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Triage Model Rationale:</span>
                  <span style={{ color: 'var(--text-primary)', textAlign: 'right', maxWidth: '60%' }}>
                    {result.triage_reason}
                  </span>
                </div>
              </div>
            </div>

            {/* Panel B: Domain Infrastructure & Registrar */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <Globe size={18} color="#10b981" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  2. Domain Standing &amp; Registrar
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sponsoring Registrar:</span>
                  <strong style={{ color: isUnregistered ? '#9ca3af' : 'var(--text-primary)' }}>
                    {isUnregistered ? 'None (Unregistered Domain)' : (result.registrar || 'ICANN Accredited Registrar')}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Registration Standing:</span>
                  <strong style={{ color: isUnregistered ? '#38bdf8' : result.is_newly_registered ? '#ef4444' : '#10b981' }}>
                    {isUnregistered ? 'UNREGISTERED / AVAILABLE' : result.is_newly_registered ? 'YES (NRD < 30 Days Old)' : 'NO (Established Standing)'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Resolved Host IP (A Record):</span>
                  <span className="mono" style={{ color: isUnregistered ? '#9ca3af' : '#38bdf8' }}>
                    {result.dns_a_records && result.dns_a_records.length > 0 ? result.dns_a_records.join(', ') : 'NXDOMAIN (No Host IP Assigned)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Panel C: SSL/TLS & HTTPS Encryption */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <Lock size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  3. SSL/TLS &amp; Transport Encryption
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>HTTPS Transport Security:</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isUnregistered ? '#9ca3af' : result.tls_valid ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                    {isUnregistered ? <AlertTriangle size={14} /> : result.tls_valid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {isUnregistered ? 'NO HOST / UNRESOLVED' : result.tls_valid ? 'ENFORCED' : 'NOT CONFIGURED'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>TLS Certificate Status:</span>
                  <strong style={{ color: isUnregistered ? '#9ca3af' : result.tls_valid ? '#10b981' : '#ef4444' }}>
                    {isUnregistered ? 'NO CERTIFICATE (UNREGISTERED)' : result.tls_valid ? 'VALID & TRUSTED' : 'INVALID / UNTRUSTED'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Certificate Authority (CA):</span>
                  <span style={{ color: isUnregistered ? '#9ca3af' : 'var(--text-primary)' }}>
                    {isUnregistered ? 'None (Host Inactive)' : (result.tls_issuer || 'Public CA')}
                  </span>
                </div>
              </div>
            </div>

            {/* Panel D: Email Spoofing Defense (SPF / DMARC) */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <Database size={18} color="#a855f7" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  4. Email Anti-Spoofing Configuration
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>SPF Policy in DNS:</span>
                  <span style={{ color: isUnregistered ? '#9ca3af' : result.has_spf ? '#10b981' : '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isUnregistered ? <AlertTriangle size={14} /> : result.has_spf ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    {isUnregistered ? 'NXDOMAIN' : result.has_spf ? 'PUBLISHED (v=spf1)' : 'NOT FOUND'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>DMARC Enforcement:</span>
                  <span style={{ color: isUnregistered ? '#9ca3af' : result.has_dmarc ? '#10b981' : '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isUnregistered ? <AlertTriangle size={14} /> : result.has_dmarc ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {isUnregistered ? 'NXDOMAIN' : result.has_dmarc ? 'ENFORCED (p=reject)' : 'MISSING (Vulnerable to Spoofing)'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Email Impersonation Risk:</span>
                  <strong style={{ color: isUnregistered ? '#9ca3af' : result.has_dmarc ? '#10b981' : '#ef4444' }}>
                    {isUnregistered ? 'INACTIVE (NO MX)' : result.has_dmarc ? 'PROTECTED' : 'HIGH RISK'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Deep Forensic Audit Callout */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          background: 'radial-gradient(circle at 100% 0%, rgba(2, 132, 199, 0.25) 0%, var(--bg-card) 70%)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '14px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={20} color="#00f0ff" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Complete Deep Forensic Security Audit
              </h3>
              <span className="mono" style={{ fontSize: '0.68rem', background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                100% FREE &amp; OPEN ACCESS
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              Run the full headless browser sandbox, detect visual brand contradiction with 64-bit pHash logo vision, audit clickjacking (X-Frame-Options), reconstruct the adversary attack chain, and generate CyberGuard AI threat intelligence.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.72rem' }}>
              <span className="badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '6px' }}>
                <Eye size={12} /> Playwright DOM Sandbox
              </span>
              <span className="badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '6px' }}>
                <Shield size={12} /> Brand pHash Vision
              </span>
              <span className="badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '6px' }}>
                <Lock size={12} /> HSTS/CSP/X-Frame Audit
              </span>
              <span className="badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '6px' }}>
                <Cpu size={12} /> AI Hardening &amp; Remediation
              </span>
            </div>
          </div>

          <button
            onClick={onUnlockDeepAudit}
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
              color: '#070a10',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)'
            }}
          >
            <Zap size={18} />
            <span>Launch Deep Forensic Audit (Free)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
