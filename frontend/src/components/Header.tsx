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
          className="lg:hidden"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'var(--neu-bg)',
            boxShadow: 'var(--neu-extruded-sm)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} color="var(--neu-foreground)" />
        </motion.button>

        {/* Section Heading & Breadcrumb */}
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--neu-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
            CYBERGUARD AI // CONSOLE
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--neu-foreground)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            {getTabTitle(activeTab)}
          </h2>
        </div>
      </div>

      {/* Right Area Controls: Copilot AI, Profile/Pro Pass, Feed, Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Copilot AI Launcher */}
        {onOpenCopilot && (
          <motion.button
            whileHover={{ translateY: -1 }}
            whileTap={{ translateY: 0.5 }}
            onClick={onOpenCopilot}
            style={{
              padding: '10px 18px',
              borderRadius: '16px',
              border: 'none',
              background: 'var(--neu-bg)',
              boxShadow: 'var(--neu-extruded-sm)',
              color: '#6C63FF',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
            title="Open CyberGuard AI Copilot"
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                background: 'var(--neu-bg)',
                boxShadow: 'var(--neu-inset-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={15} color="#6C63FF" />
            </div>
            <span>Copilot AI</span>
          </motion.button>
        )}

        {/* User Profile & Subscription / Sign In */}
        {(onOpenProfileModal || onOpenAuthModal) && (
          <motion.button
            whileHover={{ translateY: -1 }}
            whileTap={{ translateY: 0.5 }}
            onClick={onOpenProfileModal || onOpenAuthModal}
            style={{
              padding: '10px 16px',
              borderRadius: '16px',
              border: 'none',
              background: 'var(--neu-bg)',
              boxShadow: 'var(--neu-extruded-sm)',
              color: 'var(--neu-foreground)',
              fontSize: '0.84rem',
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
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                background: 'var(--neu-bg)',
                boxShadow: 'var(--neu-inset-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {currentUser?.plan === 'premium' ? (
                <Crown size={14} color="#D69E2E" />
              ) : (
                <User size={14} color="#6C63FF" />
              )}
            </div>
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
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'var(--neu-bg)',
                  boxShadow: 'var(--neu-inset-sm)',
                  color: currentUser.plan === 'premium' ? '#D69E2E' : '#38B2AC',
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
          style={{
            padding: '10px 16px',
            borderRadius: '16px',
            border: 'none',
            background: 'var(--neu-bg)',
            boxShadow: activeTab === 'discovery' ? 'var(--neu-inset)' : 'var(--neu-extruded-sm)',
            color: activeTab === 'discovery' ? '#DD6B20' : 'var(--neu-foreground)',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          title="Discovery Feed - Real-time Certificate Transparency stream"
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '8px',
              background: 'var(--neu-bg)',
              boxShadow: 'var(--neu-inset-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Activity size={14} color="#DD6B20" />
          </div>
          <span className="hidden sm:inline">Live Feed</span>
        </motion.button>

        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ translateY: -1 }}
          whileTap={{ translateY: 0.5 }}
          onClick={toggleTheme}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            border: 'none',
            background: 'var(--neu-bg)',
            boxShadow: 'var(--neu-extruded-sm)',
            color: 'var(--neu-foreground)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={17} color="#D69E2E" /> : <Moon size={17} color="#6C63FF" />}
        </motion.button>
      </div>
    </header>
  );
};
