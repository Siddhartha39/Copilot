import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  Terminal,
  AlertTriangle,
  GitCommit,
  Layers,
  Lock,
  Activity,
  Puzzle,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Cpu,
  Search,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export interface LandingPageProps {
  theme?: 'dark' | 'light';
  onLaunchScanner: () => void;
  onOpenExtension: () => void;
  onOpenDiscovery: () => void;
  onScanUrl?: (url: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  theme = 'light',
  onLaunchScanner,
  onOpenExtension,
  onOpenDiscovery,
  onScanUrl
}) => {
  const [quickUrl, setQuickUrl] = useState('');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [cardViewMode, setCardViewMode] = useState<'stack' | 'grid'>('stack');

  const sampleTargets = [
    {
      url: 'campuskart.shop',
      label: 'Benign Store',
      score: '12.4',
      badge: 'SAFE',
      badgeClass: 'badge-safe',
      type: 'benign'
    },
    {
      url: 'login-paypal-security-verification.xyz',
      label: 'Phish Lookalike',
      score: '94.8',
      badge: 'MALICIOUS',
      badgeClass: 'badge-critical',
      type: 'phish'
    },
    {
      url: 'github.com',
      label: 'Hardened Tech',
      score: '2.1',
      badge: 'GRADE A+',
      badgeClass: 'badge-safe',
      type: 'hardened'
    }
  ];

  const pipelineStages = [
    {
      step: 1,
      name: 'Lexical Triage',
      badge: '< 10ms',
      color: '#6C63FF',
      summary: 'Entropy calculation, Punycode / IDN detection, hyphen clustering, and suspicious TLD classification.',
      detail: 'Instantly tokenizes the input URL across 45 lexical dimensions. Flags excessive subdomain depth, known phishing keywords ("login", "verify", "secure", "billing"), and high Shannon entropy.'
    },
    {
      step: 2,
      name: 'Google DoH & RDAP',
      badge: 'DNS / IP',
      color: '#38B2AC',
      summary: 'Direct DNS-over-HTTPS resolution, autonomous system (ASN) mapping, and registrar creation age lookup.',
      detail: 'Queries Google Cloud DoH resolvers and IANA RDAP feeds. Flags Newly Registered Domains (< 30 days) and high-risk bulletproof hosting infrastructure.'
    },
    {
      step: 3,
      name: 'SSL/TLS & Posture',
      badge: 'HARDENING',
      color: '#10B981',
      summary: 'Certificate Transparency log validation, HSTS, CSP, X-Frame-Options, and SPF/DMARC spoofing resistance.',
      detail: 'Audits defensive header policies to compute an exploitability grade (A+ through F). Checks if the domain is vulnerable to Clickjacking or email impersonation.'
    },
    {
      step: 4,
      name: 'Playwright Sandbox',
      badge: 'DOM CRAWL',
      color: '#F59E0B',
      summary: 'Headless browser execution capturing DOM elements, password submission hooks, and redirect hops.',
      detail: 'Renders the target in an isolated sandbox. Detects credential harvesting input fields (<input type="password">), external exfiltration action URLs, and anti-analysis cloaking.'
    },
    {
      step: 5,
      name: 'pHash Brand Vision',
      badge: 'LOGO AI',
      color: '#EF4444',
      summary: 'Perceptual hashing (pHash) and visual logo matching comparing rendered page to verified brand catalog.',
      detail: 'Identifies brand visual assets (PayPal, Apple, Microsoft, Chase, Steam). Flags critical Brand-Domain Contradiction when trusted logos are hosted on unauthorized domains.'
    },
    {
      step: 6,
      name: 'Multi-Signal Fusion & AI Reasoning',
      badge: '0-100 VECTOR',
      color: '#8B5CF6',
      summary: 'Platt-scaled calibrated probability scoring fused with autonomous AI threat intelligence.',
      detail: 'Aggregates all 5 forensic vectors into a unified calibrated threat score with full attack-chain evidence, zero-trust telemetry, and instant 1-click remediation blueprints.'
    }
  ];

  const capabilityCards = [
    {
      id: 'brand-contradiction',
      step: '01',
      title: 'Brand-Domain Contradiction Engine',
      subtitle: 'Visual & Identity Verification',
      badge: 'PROPRIETARY',
      description: 'Detects when a page imitates the logos and visual identity of trusted brands (e.g. PayPal, Apple, Microsoft, Chase) while operating on an unauthorized, deceptive domain.',
      icon: <AlertTriangle size={24} color="#EF4444" />,
      accentColor: '#EF4444',
      quote: '"Imitates Bank of America, but domain is unauthorized .xyz"',
      tags: ['pHash 64-bit DCT', 'Visual Logo Catalog', 'Domain Impersonation', 'Brand Spoof Guard'],
      tooltip: {
        title: 'Brand-Domain Contradiction',
        description: 'Uses perceptual hashing (pHash) and visual logo matching to compare page visuals against a verified brand catalog. Detects deceptive impersonation.',
        securityImpact: 'Stops credential harvesting pages masquerading as banks, payment processors, or cloud portals.',
        goodVsBad: 'Authorized domains match officially registered parent brands; unauthorized domains flag brand contradiction.'
      }
    },
    {
      id: 'attack-chain',
      step: '02',
      title: 'Explainable Attack-Chain Reconstruction',
      subtitle: '7-Stage Forensic Path',
      badge: 'FORENSICS',
      description: 'Reconstructs a step-by-step forensic graph linking Ingress → DNS Infrastructure → Redirects → Landing DOM → Credential Forms → Exfiltration channels.',
      icon: <GitCommit size={24} color="#3B82F6" />,
      accentColor: '#3B82F6',
      quote: 'Step 1 (Ingress) → Step 5 (Credential Hook) → Step 7 (Verdict)',
      tags: ['Ingress Link', 'Google DoH DNS', 'HTTP Redirect Bounces', 'Credential Form Traps'],
      tooltip: {
        title: '7-Stage Attack Chain Reconstruction',
        description: 'Maps the entire adversary lifecycle: Ingress Link, DNS Hosting, HTTP Redirect Bounces, Deceptive Landing DOM, Password Form Injection, and Data Exfiltration.',
        securityImpact: 'Gives SOC analysts explainable, actionable evidence for rapid incident response and threat takedowns.',
        goodVsBad: 'Clean sites have straightforward 2-step resolution; phishing campaigns exhibit multi-hop redirects and credential hooks.'
      }
    },
    {
      id: 'risk-fusion',
      step: '03',
      title: 'Multi-Signal Calibrated Risk Fusion',
      subtitle: '0-100 Probability Vector',
      badge: 'ML CALIBRATION',
      description: 'Fuses 5 independent vectors: Lexical ML features, Domain Age & DNS, DOM password forms, Visual Brand confidence, and Threat Intel into a unified 0–100 risk score.',
      icon: <Layers size={24} color="#6C63FF" />,
      accentColor: '#6C63FF',
      quote: 'Weighted contribution breakdown (+/- pts) for every signal',
      tags: ['24-D Lexical Tensor', 'Platt Scaling Calibration', 'Shannon Entropy', 'Point Scoring Breakdown'],
      tooltip: {
        title: 'Calibrated Risk Scoring (0–100)',
        description: 'Combines ML lexical probabilities with forensic evidence points. Employs Platt scaling to prevent false positives and provide calibrated probability.',
        securityImpact: 'Ensures security teams prioritize high-confidence threats without being overwhelmed by alert fatigue.',
        goodVsBad: '0–29: Benign / Safe, 30–69: Suspicious / Under Review, 70–100: Malicious Phishing Campaign.'
      }
    },
    {
      id: 'security-audit',
      step: '04',
      title: 'Website Exploitability & Security Audit',
      subtitle: 'Defensive Posture Rating',
      badge: 'WEBSITE DEFENSE',
      description: 'Website owners can check their own domain defense posture: Clickjacking immunity (X-Frame-Options), Email spoofing resistance (SPF/DMARC), CSP, and HSTS.',
      icon: <Lock size={24} color="#10B981" />,
      accentColor: '#10B981',
      quote: 'Security Grades (A+ to F) + Actionable Developer Fixes',
      actionText: 'Audit Your Own Domain',
      onAction: onLaunchScanner,
      tags: ['HSTS & CSP Headers', 'Clickjacking Immune', 'SPF/DMARC Spoof Defense', 'Executive Security Grade'],
      tooltip: {
        title: 'Website Exploitability Audit',
        description: 'Inspects HTTP security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options) and DNS records (SPF, DMARC) to calculate an executive security grade.',
        securityImpact: 'Prevents Clickjacking, MIME type sniffing, XSS injection, and email spoofing impersonation.',
        goodVsBad: 'Grade A+/A: Hardened security headers; Grade D/F: Highly vulnerable to injection and spoofing.'
      }
    },
    {
      id: 'nrd-stream',
      step: '05',
      title: 'Newly Registered Domain (NRD) Stream',
      subtitle: 'High-Throughput Early-Warning',
      badge: 'STREAM FEED',
      description: 'High-throughput early-warning stream prioritizing unknown candidates hitting DNS logs and Certificate Transparency feeds before phishing campaigns go viral.',
      icon: <Activity size={24} color="#F59E0B" />,
      accentColor: '#F59E0B',
      quote: '< 10ms lexical triage + one-click escalation sandbox',
      actionText: 'Explore NRD Stream',
      onAction: onOpenDiscovery,
      tags: ['CertStream Feed', '< 30d Quarantine', 'Sub-10ms Triage', 'Playwright Sandbox Escalation'],
      tooltip: {
        title: 'Newly Registered Domain (NRD) Pipeline',
        description: 'Ingests real-time domain creation feeds. Over 70% of zero-day attacks occur on domains under 30 days old. Filters malicious targets via sub-10ms lexical heuristics.',
        securityImpact: 'Enables SOC teams to block malicious infrastructure before phishing emails reach inboxes.',
        goodVsBad: 'Candidate domains with high lexical threat scores are escalated for instant Playwright sandbox inspection.'
      }
    },
    {
      id: 'chrome-ext',
      step: '06',
      title: 'Real-Time Chrome Browser Extension',
      subtitle: 'Endpoint Client Protection',
      badge: 'ENDPOINT AGENT',
      description: 'Manifest V3 sidecar auditing active tabs in real-time. Displays threat warning banners, visual trust gauges, and seamless 1-click inspection routing.',
      icon: <Puzzle size={24} color="#8B5CF6" />,
      accentColor: '#8B5CF6',
      quote: 'Active browser background monitoring & instant badge telemetry',
      actionText: 'Download Extension',
      onAction: onOpenExtension,
      tags: ['Manifest V3 Sidecar', 'Silent Tab Audit', 'Visual Trust Gauge', 'Instant Deep-Dive Routing'],
      tooltip: {
        title: 'Real-Time Chrome Browser Extension',
        description: 'Browser sidecar that audits active tabs in real-time. Features badge alerts, threat warnings, and direct 1-click launch to the CyberGuard AI command center.',
        securityImpact: 'Endpoints receive instantaneous zero-hour protection against deceptive links.',
        goodVsBad: 'Green shield = verified safe; Red shield = malicious credential harvester intercepted.'
      }
    }
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickUrl.trim()) {
      onLaunchScanner();
      setTimeout(() => {
        if (onScanUrl) {
          onScanUrl(quickUrl.trim());
        }
      }, 2900);
    }
  };

  const handleSampleClick = (url: string) => {
    setQuickUrl(url);
    onLaunchScanner();
    setTimeout(() => {
      if (onScanUrl) {
        onScanUrl(url);
      }
    }, 2900);
  };

  return (
    <div style={{ padding: '0 28px 48px 28px', maxWidth: '1360px', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      {/* 1. Live Threat Intelligence Marquee Ticker -> Neumorphic Soft Inset Track */}
      <div
        style={{
          marginBottom: '28px',
          padding: '12px 20px',
          overflow: 'hidden',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'var(--neu-bg, #E0E5EC)',
          boxShadow: 'var(--neu-inset)',
          border: 'none'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            background: 'var(--neu-bg, #E0E5EC)',
            color: 'var(--neu-foreground, #3D4852)',
            padding: '6px 14px',
            borderRadius: '9999px',
            boxShadow: 'var(--neu-extruded-sm)'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
            }}
          />
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--neu-foreground, #3D4852)'
            }}
          >
            LIVE TELEMETRY
          </span>
        </div>

        <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
          <div className="ticker-track">
            {[1, 2].map((loopIdx) => (
              <div key={loopIdx} style={{ display: 'flex', alignItems: 'center', gap: '32px', paddingRight: '32px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--neu-foreground, #3D4852)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={15} color="#EF4444" />
                  <span>INTERCEPTED: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>login-paypal-security-verification.xyz</span> (Risk: 94.8 | Phish)</span>
                </span>
                <span style={{ color: 'var(--neu-muted, #6B7280)', opacity: 0.5 }}>•</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--neu-foreground, #3D4852)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={15} color="#10B981" />
                  <span>VERIFIED HARDENED: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>github.com</span> (Score: 2.1 | A+ Posture)</span>
                </span>
                <span style={{ color: 'var(--neu-muted, #6B7280)', opacity: 0.5 }}>•</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--neu-foreground, #3D4852)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={15} color="#6C63FF" />
                  <span>ZERO-TRUST SOC: Multi-Signal Deep Forensics &amp; Brand Vision Active</span>
                </span>
                <span style={{ color: 'var(--neu-muted, #6B7280)', opacity: 0.5 }}>•</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--neu-foreground, #3D4852)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={15} color="#38B2AC" />
                  <span>CERTSTREAM INGEST: 4,820 NRD candidates triaged in &lt;10ms</span>
                </span>
                <span style={{ color: 'var(--neu-muted, #6B7280)', opacity: 0.5 }}>•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Section -> Soft Raised Neumorphic Island */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          padding: '56px 36px 44px 36px',
          marginBottom: '40px',
          background: 'var(--neu-bg, #E0E5EC)',
          borderRadius: '32px',
          boxShadow: 'var(--neu-extruded)',
          border: 'none',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Soft Inset Badge */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--neu-bg, #E0E5EC)',
            borderRadius: '9999px',
            boxShadow: 'var(--neu-inset-sm)',
            padding: '7px 20px',
            fontSize: '0.78rem',
            color: 'var(--neu-accent, #6C63FF)',
            fontWeight: 800,
            letterSpacing: '0.05em',
            marginBottom: '26px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--neu-accent, #6C63FF)', display: 'inline-block', boxShadow: '0 0 8px rgba(108, 99, 255, 0.5)' }} />
          <span>CYBER COMMAND TERMINAL // CORE V2.0</span>
          <InfoTooltip
            title="Cyber Command Core V2.0"
            description="Antigravity-engineered zero-trust cybersecurity operating environment running real-time ML pipelines, live WHOIS RDAP resolvers, and multi-modal brand vision."
            position="bottom"
          />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            maxWidth: '1020px',
            margin: '0 auto 20px auto',
            lineHeight: 1.15,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            letterSpacing: '-0.03em'
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
              color: 'var(--neu-foreground, #3D4852)'
            }}
          >
            NEXT EVOLUTION OF
          </span>
          <span
            style={{
              display: 'inline-block',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
              background: 'linear-gradient(135deg, #6C63FF 0%, #38B2AC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginTop: '4px'
            }}
          >
            AUTONOMOUS CYBER DEFENSE
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.22rem)',
            color: 'var(--neu-muted, #6B7280)',
            maxWidth: '760px',
            margin: '0 auto 36px auto',
            lineHeight: 1.6,
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          Where human cybersecurity intelligence meets sub-second machine speed. Discover next-generation zero-trust defense, real-time phishing forensics, and autonomous threat mitigation.
        </motion.p>

        {/* Hero Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '40px' }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLaunchScanner}
            style={{
              borderRadius: '16px',
              padding: '14px 34px',
              fontSize: '0.96rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6C63FF 0%, #8B84FF 100%)',
              color: '#ffffff',
              boxShadow: '6px 6px 16px rgba(108, 99, 255, 0.4), -6px -6px 16px rgba(255, 255, 255, 0.8)'
            }}
          >
            <Zap size={18} />
            <span>Launch Live Scanner</span>
            <ArrowRight size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenExtension}
            style={{
              borderRadius: '16px',
              padding: '14px 32px',
              fontSize: '0.96rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: 'none',
              background: 'var(--neu-bg, #E0E5EC)',
              color: 'var(--neu-foreground, #3D4852)',
              boxShadow: 'var(--neu-extruded)'
            }}
          >
            <Sparkles size={18} color="#6C63FF" />
            <span>Get Chrome Extension</span>
          </motion.button>
        </motion.div>

        {/* Interactive Quick-Audit Search Bar -> Deep Inset Well */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          style={{
            maxWidth: '780px',
            margin: '0 auto 30px auto'
          }}
        >
          <form
            onSubmit={handleQuickSubmit}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              boxShadow: 'var(--neu-inset-deep)',
              borderRadius: '24px',
              padding: '8px 10px 8px 20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              border: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--neu-accent, #6C63FF)' }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Enter domain or link (e.g. login-paypal-security-verification.xyz)"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--neu-foreground, #3D4852)',
                fontSize: '0.95rem',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                outline: 'none',
                padding: '8px 4px'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #6C63FF 0%, #8B84FF 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 26px',
                fontWeight: 800,
                fontSize: '0.88rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '4px 4px 12px rgba(108, 99, 255, 0.35)',
                flexShrink: 0
              }}
            >
              <Radar size={18} />
              <span>Audit Target</span>
            </motion.button>
          </form>

          {/* Quick-test Sample Chips -> Soft Raised Neumorphic Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px', padding: '0 6px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              QUICK SAMPLES:
            </span>
            {sampleTargets.map((s) => (
              <motion.button
                key={s.url}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSampleClick(s.url)}
                type="button"
                style={{
                  background: 'var(--neu-bg, #E0E5EC)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--neu-foreground, #3D4852)',
                  boxShadow: 'var(--neu-extruded-sm)'
                }}
              >
                <span style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{s.url}</span>
                <span
                  style={{
                    fontSize: '0.66rem',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    boxShadow: 'var(--neu-inset-sm)',
                    background: 'var(--neu-bg, #E0E5EC)',
                    color: s.type === 'phish' ? '#EF4444' : s.type === 'hardened' ? '#10B981' : '#6C63FF',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  {s.badge}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Scan Protocol Notice */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '18px' }}>
            <Zap size={15} color="#6C63FF" />
            <span style={{ fontSize: '0.8rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 600 }}>
              100% Free &amp; Open Access • Full Headless Sandbox, Brand pHash Vision &amp; CyberAI Unlocked
            </span>
          </div>
        </motion.div>

        {/* Telemetry Status Bar -> 4 Soft Raised Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', maxWidth: '1020px', margin: '36px auto 0 auto', paddingTop: '28px' }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              border: 'none',
              padding: '18px 20px',
              borderRadius: '24px',
              boxShadow: 'var(--neu-extruded-sm)'
            }}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--neu-foreground, #3D4852)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>0.0 – 100</span>
              <InfoTooltip
                title="Calibrated Risk Index"
                description="Consolidated 0–100 threat probability index fusing lexical, hosting, brand, and DOM signals."
                position="top"
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              CALIBRATED RISK INDEX
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              border: 'none',
              padding: '18px 20px',
              borderRadius: '24px',
              boxShadow: 'var(--neu-extruded-sm)'
            }}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--neu-foreground, #3D4852)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>7-STAGE</span>
              <InfoTooltip
                title="7-Stage Attack Graph"
                description="Chronological forensic graph linking domain ingress to credential submission forms."
                position="top"
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ATTACK-CHAIN GRAPH
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              border: 'none',
              padding: '18px 20px',
              borderRadius: '24px',
              boxShadow: 'var(--neu-extruded-sm)'
            }}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--neu-foreground, #3D4852)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>&lt; 30 DAYS</span>
              <InfoTooltip
                title="Newly Registered Domains (NRD)"
                description="Domains registered in the last 30 days are automatically placed on heightened surveillance."
                position="top"
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              NRD EARLY WARNING
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              border: 'none',
              padding: '18px 20px',
              borderRadius: '24px',
              boxShadow: 'var(--neu-extruded-sm)'
            }}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--neu-foreground, #3D4852)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>100% FREE</span>
              <InfoTooltip
                title="100% Free & Open Access"
                description="Community cybersecurity intelligence platform. All deep forensic audits and AI features are 100% free with zero fees."
                position="top"
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              COMMUNITY ACCESS
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 3. Interactive 6-Stage Defense Pipeline Visualizer */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4 }}
        style={{
          padding: '36px',
          marginBottom: '40px',
          background: 'var(--neu-bg, #E0E5EC)',
          borderRadius: '32px',
          boxShadow: 'var(--neu-extruded)',
          border: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '26px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'var(--neu-bg, #E0E5EC)',
              boxShadow: 'var(--neu-inset)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={22} color="#6C63FF" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--neu-foreground, #3D4852)', letterSpacing: '-0.02em', margin: 0 }}>
                Autonomous 6-Stage Inspection Pipeline
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--neu-muted, #6B7280)', marginTop: '2px' }}>
                Multi-vector zero-trust validation executing in parallel
              </div>
            </div>
            <InfoTooltip
              title="6-Stage Autonomous Engine"
              description="Click any stage below to explore how CyberGuard AI analyzes domains from raw input string to deep cryptographic verification."
              position="bottom"
            />
          </div>
          <span
            style={{
              fontSize: '0.74rem',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'var(--neu-bg, #E0E5EC)',
              boxShadow: 'var(--neu-inset-sm)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--neu-accent, #6C63FF)',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            CLICK STAGE TO INSPECT
          </span>
        </div>

        {/* Pipeline Stage Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '26px' }}>
          {pipelineStages.map((stage, idx) => {
            const isSelected = activePipelineStep === idx;
            return (
              <motion.button
                key={stage.step}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePipelineStep(idx)}
                style={{
                  background: 'var(--neu-bg, #E0E5EC)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '16px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isSelected ? 'var(--neu-inset)' : 'var(--neu-extruded-sm)',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: isSelected ? '#6C63FF' : 'var(--neu-muted, #6B7280)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    STAGE 0{stage.step}
                  </span>
                  <span
                    style={{
                      fontSize: '0.64rem',
                      color: isSelected ? '#6C63FF' : 'var(--neu-muted, #6B7280)',
                      background: 'var(--neu-bg, #E0E5EC)',
                      boxShadow: 'var(--neu-inset-sm)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}
                  >
                    {stage.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isSelected ? 'var(--neu-accent, #6C63FF)' : 'var(--neu-foreground, #3D4852)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {stage.name}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Stage Detail Drawer -> Neumorphic Inset Well */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePipelineStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              borderRadius: '24px',
              boxShadow: 'var(--neu-inset)',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: pipelineStages[activePipelineStep].color }} />
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neu-foreground, #3D4852)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Stage 0{pipelineStages[activePipelineStep].step}: {pipelineStages[activePipelineStep].name}
              </span>
            </div>
            <p style={{ fontSize: '0.94rem', color: 'var(--neu-foreground, #3D4852)', lineHeight: 1.6, fontWeight: 600 }}>
              {pipelineStages[activePipelineStep].summary}
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--neu-muted, #6B7280)', lineHeight: 1.6, fontWeight: 500 }}>
              {pipelineStages[activePipelineStep].detail}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 4. Brand Contradiction Live Simulation Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4 }}
        style={{
          padding: '36px',
          marginBottom: '40px',
          background: 'var(--neu-bg, #E0E5EC)',
          borderRadius: '32px',
          boxShadow: 'var(--neu-extruded)',
          border: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'var(--neu-bg, #E0E5EC)',
            boxShadow: 'var(--neu-inset)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={22} color="#EF4444" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--neu-foreground, #3D4852)', letterSpacing: '-0.02em', margin: 0 }}>
              Why Traditional Security Fails: Brand Contradiction
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--neu-muted, #6B7280)', marginTop: '2px' }}>
              Detecting logo impersonation on deceptive infrastructure
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          {/* Legitimate Brand Card */}
          <div style={{
            background: 'var(--neu-bg, #E0E5EC)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: 'var(--neu-extruded-sm)',
            border: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase' }}>
                AUTHORIZED OFFICIAL SITE
              </span>
              <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '9999px', background: 'var(--neu-bg, #E0E5EC)', boxShadow: 'var(--neu-inset-sm)', fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                100% MATCH
              </span>
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--neu-foreground, #3D4852)', fontWeight: 800, marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
              https://www.paypal.com/signin
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--neu-muted, #6B7280)', lineHeight: 1.7, fontWeight: 500 }}>
              • Rendered Visual: <strong style={{ color: 'var(--neu-foreground, #3D4852)' }}>PayPal</strong> logo verified<br />
              • Domain Match: <strong style={{ color: 'var(--neu-foreground, #3D4852)' }}>paypal.com</strong> (Officially Authorized)<br />
              • Verdict: <strong style={{ color: '#10B981' }}>SAFE (Risk: 2.4/100)</strong>
            </div>
          </div>

          {/* Adversary Impersonator Card */}
          <div style={{
            background: 'var(--neu-bg, #E0E5EC)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: 'var(--neu-extruded-sm)',
            border: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase' }}>
                ADVERSARY PHISHING HARVESTER
              </span>
              <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '9999px', background: 'var(--neu-bg, #E0E5EC)', boxShadow: 'var(--neu-inset-sm)', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase' }}>
                CRITICAL CONTRADICTION
              </span>
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--neu-foreground, #3D4852)', fontWeight: 800, marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
              https://login-paypal-security-verify.xyz
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--neu-muted, #6B7280)', lineHeight: 1.7, fontWeight: 500 }}>
              • Rendered Visual: <strong style={{ color: 'var(--neu-foreground, #3D4852)' }}>PayPal</strong> logo matched via pHash (99.4%)<br />
              • Domain Match: <strong style={{ color: 'var(--neu-foreground, #3D4852)' }}>login-paypal-security-verify.xyz</strong> (UNAUTHORIZED)<br />
              • Verdict: <strong style={{ color: '#EF4444' }}>BLOCKED (Risk: 96.2/100 | Phish)</strong>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. Cyber Defense Capabilities Header with Card View Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '26px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={22} color="#6C63FF" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--neu-foreground, #3D4852)', letterSpacing: '-0.02em', margin: 0 }}>
              Cyber Defense Capability Stack
            </h2>
            <InfoTooltip
              title="Cyber Defense Capability Stack"
              description="Scroll down to peel through each modular defense layer in the zero-trust pipeline, or toggle to the expanded grid view."
              position="right"
            />
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--neu-muted, #6B7280)', marginTop: '4px', fontWeight: 500 }}>
            Scroll through the 6 defensive modules or select any layer to inspect technical forensics
          </p>
        </div>

        {/* View Mode Toggle Switcher -> Inset Track with Soft Raised Active Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--neu-bg, #E0E5EC)',
          boxShadow: 'var(--neu-inset)',
          padding: '5px',
          borderRadius: '9999px',
          border: 'none'
        }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setCardViewMode('stack')}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              color: cardViewMode === 'stack' ? 'var(--neu-accent, #6C63FF)' : 'var(--neu-muted, #6B7280)',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 18px',
              fontSize: '0.8rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: cardViewMode === 'stack' ? 'var(--neu-extruded-sm)' : 'none',
              transition: 'box-shadow 0.2s ease'
            }}
          >
            <Layers size={16} />
            <span>Stacked Scroll Deck</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setCardViewMode('grid')}
            style={{
              background: 'var(--neu-bg, #E0E5EC)',
              color: cardViewMode === 'grid' ? 'var(--neu-accent, #6C63FF)' : 'var(--neu-muted, #6B7280)',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 18px',
              fontSize: '0.8rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: cardViewMode === 'grid' ? 'var(--neu-extruded-sm)' : 'none',
              transition: 'box-shadow 0.2s ease'
            }}
          >
            <LayoutGrid size={16} />
            <span>Expanded Grid</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Jump Navigator Pills */}
      {cardViewMode === 'stack' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', paddingBottom: '14px', marginBottom: '26px', flexWrap: 'nowrap' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, textTransform: 'uppercase', flexShrink: 0, letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            QUICK JUMP:
          </span>
          {capabilityCards.map((c, idx) => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const el = document.getElementById(`stack-card-${c.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              style={{
                background: 'var(--neu-bg, #E0E5EC)',
                border: 'none',
                color: 'var(--neu-foreground, #3D4852)',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: '0.78rem',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: 'var(--neu-extruded-sm)'
              }}
            >
              <span>0{idx + 1} {c.title.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* 6. Card Scroll Animation Stacking Deck or Grid -> Soft Raised Neumorphic Cards */}
      {cardViewMode === 'stack' ? (
        <div className="card-stack-container" style={{ position: 'relative', marginTop: '10px' }}>
          {capabilityCards.map((card, index) => {
            return (
              <motion.div
                id={`stack-card-${card.id}`}
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="card-stack-item"
                style={{
                  top: `${90 + index * 24}px`,
                  zIndex: 10 + index,
                  background: 'var(--neu-bg, #E0E5EC)',
                  border: 'none',
                  borderRadius: '32px',
                  padding: '36px 32px',
                  marginBottom: index === capabilityCards.length - 1 ? '70px' : '45px',
                  boxShadow: 'var(--neu-extruded)'
                }}
              >
                {/* Card Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'var(--neu-bg, #E0E5EC)',
                      boxShadow: 'var(--neu-inset)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {card.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          MODULE // 0{index + 1} OF 06
                        </span>
                        <span style={{ fontSize: '0.68rem', padding: '2px 10px', borderRadius: '9999px', fontWeight: 800, background: 'var(--neu-bg, #E0E5EC)', boxShadow: 'var(--neu-inset-sm)', color: card.accentColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {card.badge}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--neu-foreground, #3D4852)', marginTop: '4px', letterSpacing: '-0.02em' }}>
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <InfoTooltip
                    title={card.tooltip.title}
                    description={card.tooltip.description}
                    securityImpact={card.tooltip.securityImpact}
                    goodVsBad={card.tooltip.goodVsBad}
                    position="bottom"
                  />
                </div>

                {/* Card Body - 2 Columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '26px', alignItems: 'start' }}>
                  {/* Left Side: Subtitle, Description & Tags */}
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      // {card.subtitle.toUpperCase()}
                    </div>
                    <p style={{ fontSize: '0.96rem', color: 'var(--neu-foreground, #3D4852)', lineHeight: 1.65, marginBottom: '20px', fontWeight: 500 }}>
                      {card.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                      {card.tags?.map((tag, tIdx) => (
                        <span key={tIdx} style={{
                          background: 'var(--neu-bg, #E0E5EC)',
                          boxShadow: 'var(--neu-inset-sm)',
                          borderRadius: '9999px',
                          padding: '5px 14px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: 'var(--neu-muted, #6B7280)',
                          border: 'none'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 700 }}>
                      • Status: <span style={{ color: '#10B981', fontWeight: 800 }}>ACTIVE FORENSIC LAYER</span> // Latency: <span style={{ color: '#6C63FF', fontWeight: 800 }}>Sub-second</span>
                    </div>
                  </div>

                  {/* Right Side: Threat Interception Criteria Well */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--neu-bg, #E0E5EC)', padding: '22px', borderRadius: '24px', boxShadow: 'var(--neu-inset)', border: 'none' }}>
                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        THREAT INTERCEPTION CRITERIA:
                      </div>
                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--neu-foreground, #3D4852)',
                        padding: '12px 16px',
                        background: 'var(--neu-bg, #E0E5EC)',
                        borderRadius: '16px',
                        boxShadow: 'var(--neu-extruded-sm)',
                        lineHeight: 1.55
                      }}>
                        {card.quote}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 800, marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        SECURITY IMPACT:
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--neu-muted, #6B7280)', lineHeight: 1.6, fontWeight: 500 }}>
                        {card.tooltip.securityImpact}
                      </div>
                    </div>

                    {card.actionText && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => card.onAction && card.onAction()}
                        style={{
                          background: 'linear-gradient(135deg, #6C63FF 0%, #8B84FF 100%)',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '16px',
                          padding: '12px 20px',
                          fontSize: '0.88rem',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '6px',
                          boxShadow: '4px 4px 12px rgba(108, 99, 255, 0.35)'
                        }}
                      >
                        <span>{card.actionText}</span>
                        <ArrowRight size={17} />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Expanded Grid View -> Soft Raised Neumorphic Grid */
        <div className="feature-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {capabilityCards.map((card, index) => {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'var(--neu-bg, #E0E5EC)',
                  boxShadow: 'var(--neu-extruded)',
                  padding: '28px',
                  borderRadius: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  border: 'none'
                }}
              >
                <div>
                  {/* Card Top Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'var(--neu-bg, #E0E5EC)',
                        boxShadow: 'var(--neu-inset)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {card.icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--neu-foreground, #3D4852)', lineHeight: 1.25, margin: 0 }}>
                            {card.title}
                          </h3>
                          <InfoTooltip
                            title={card.tooltip.title}
                            description={card.tooltip.description}
                            securityImpact={card.tooltip.securityImpact}
                            goodVsBad={card.tooltip.goodVsBad}
                            position="bottom"
                          />
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--neu-muted, #6B7280)', fontWeight: 700, marginTop: '2px', textTransform: 'uppercase' }}>
                          {card.subtitle}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      background: 'var(--neu-bg, #E0E5EC)',
                      boxShadow: 'var(--neu-inset-sm)',
                      color: card.accentColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.9rem', color: 'var(--neu-foreground, #3D4852)', lineHeight: 1.6, marginBottom: '18px', fontWeight: 500 }}>
                    {card.description}
                  </p>
                </div>

                <div>
                  {/* Inset Quote Well */}
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--neu-foreground, #3D4852)',
                      background: 'var(--neu-bg, #E0E5EC)',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      boxShadow: 'var(--neu-inset)',
                      marginBottom: card.actionText ? '14px' : '0'
                    }}
                  >
                    {card.quote}
                  </div>

                  {/* Action Button */}
                  {card.actionText && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => card.onAction && card.onAction()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800,
                        cursor: 'pointer',
                        marginTop: '12px',
                        background: 'linear-gradient(135deg, #6C63FF 0%, #8B84FF 100%)',
                        padding: '10px 18px',
                        borderRadius: '16px',
                        boxShadow: '4px 4px 12px rgba(108, 99, 255, 0.35)',
                        border: 'none'
                      }}
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight size={15} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
