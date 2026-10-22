import React from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  Sun,
  Moon,
  Activity,
  Bot,
  User,
  Crown
} from 'lucide-react';
import type { UserProfile } from '../services/api';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  caseCount: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenAbout: () => void;
  onOpenWalletModal?: () => void;
  onLaunchScanner?: () => void;
  hasActiveReport?: boolean;
  onOpenCopilot?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  caseCount,
  theme,
  toggleTheme,
  onOpenAbout,
  onOpenWalletModal,
  onLaunchScanner,
  hasActiveReport = false,
  onOpenCopilot,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  onToggleMobileMenu
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Autonomous SOC Overview';
      case 'scanner':
        return 'Zero-Trust Domain & Website Auditor';
      case 'email-scanner':
        return 'Email Phishing & Link Extraction';
      case 'bulk-scanner':
        return 'High-Throughput Bulk URL Scanner';
      case 'threat-dashboard':
        return 'Live Threat Intelligence Center';
      case 'password-checker':
        return 'K-Anonymity Credential & Password Guard';
      case 'ip-reputation':
        return 'ASN, BGP & Geolocation Threat Lookup';
      case 'watchlist':
        return 'Domain Watchlist & Automated Surveillance';
      case 'history':
        return `Forensic Audit Archive (${caseCount})`;
      case 'results':
        return 'Deep Forensic Report Dossier';
      case 'extension':
        return 'Chrome Extension Autonomous Sensor';
      case 'about':
        return 'Technical Architecture & Documentation';
      case 'discovery':
        return 'CertStream Real-Time Discovery Feed';
      default:
        return 'Security Command Console';
    }
  };

  return (
    <header
      style={{
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        position: 'relative',
        zIndex: 30,
        background: 'transparent'
      }}
    >
      {/* Left Area: Mobile Menu Button & Desktop Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Mobile Hamburger Toggle Button */}
        <motion.button
          whileHover={{ translateY: -1 }}
          whileTap={{ translateY: 0.5 }}
          onClick={onToggleMobileMenu}
          className="lg:hidden glass-panel"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </motion.button>

        {/* Section Heading & Breadcrumb */}
        <div>
          <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800, letterSpacing: '0.06em' }}>
            CYBERGUARD AI // CONSOLE
          </div>
          <h2
            className="cyber-font"
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginTop: '2px'
            }}
          >
            {getTabTitle(activeTab)}
          </h2>
        </div>
      </div>

      {/* Right Area Controls: Copilot AI, Profile/Pro Pass, Feed, Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Copilot AI Launcher */}
        {onOpenCopilot && (
          <motion.button
            whileHover={{ translateY: -1 }}
            whileTap={{ translateY: 0.5 }}
            onClick={onOpenCopilot}
            className="glass-panel"
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 240, 255, 0.35)',
              background: 'rgba(0, 240, 255, 0.08)',
              color: 'var(--accent-cyan)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
            title="Open CyberGuard AI Copilot"
          >
            <Bot size={16} color="var(--accent-cyan)" />
            <span>Copilot AI</span>
          </motion.button>
        )}

        {/* User Profile & Subscription / Sign In */}
        {(onOpenProfileModal || onOpenAuthModal) && (
          <motion.button
            whileHover={{ translateY: -1 }}
            whileTap={{ translateY: 0.5 }}
            onClick={onOpenProfileModal || onOpenAuthModal}
            className="glass-panel"
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
            title={
              currentUser
                ? `Operator: ${currentUser.username} (${currentUser.plan === 'premium' ? 'Pro Plan' : 'Free Tier'} • ${currentUser.credits ?? 50} Credits)`
                : 'Profile, Credits & Subscription Plans'
            }
          >
            {currentUser?.plan === 'premium' ? (
              <Crown size={15} color="#eab308" />
            ) : (
              <User size={15} color="var(--accent-cyan)" />
            )}
            <span>
              {currentUser && currentUser.email && currentUser.email !== 'operator@cyberguard.ai'
                ? currentUser.username
                : currentUser?.plan === 'premium'
                ? 'Pro Pass'
                : 'Profile & Plans'}
            </span>
            {currentUser && (
              <span
                style={{
                  fontSize: '0.64rem',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: currentUser.plan === 'premium' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(0, 240, 255, 0.15)',
                  border: currentUser.plan === 'premium' ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid rgba(0, 240, 255, 0.3)',
                  color: currentUser.plan === 'premium' ? '#eab308' : 'var(--accent-cyan)',
                  fontWeight: 800
                }}
              >
                {currentUser.plan === 'premium' ? 'PRO' : `${currentUser.credits ?? 50} CR`}
              </span>
            )}
          </motion.button>
        )}

        {/* Discovery Feed Button */}
        <motion.button
          whileHover={{ translateY: -1 }}
          whileTap={{ translateY: 0.5 }}
          onClick={() => setActiveTab('discovery')}
          className="glass-panel"
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            border: activeTab === 'discovery' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
            background: activeTab === 'discovery' ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
            color: activeTab === 'discovery' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          title="Discovery Feed - Real-time Certificate Transparency stream"
        >
          <Activity size={15} color={activeTab === 'discovery' ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
          <span className="hidden sm:inline">Live Feed</span>
        </motion.button>

        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ translateY: -1 }}
          whileTap={{ translateY: 0.5 }}
          onClick={toggleTheme}
          className="glass-panel"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} color="#eab308" /> : <Moon size={16} color="#0284c7" />}
        </motion.button>
      </div>
    </header>
  );
};
