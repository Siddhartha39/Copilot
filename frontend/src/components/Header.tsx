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
        return 'Live Security Scanner';
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
        background: '#FFFDF5',
        borderBottom: '4px solid #000000',
        marginBottom: '20px'
      }}
    >
      {/* Left Area: Mobile Menu Button & Desktop Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Hamburger Toggle Button (Always visible on all screens) */}
        <motion.button
          whileHover={{ translateY: -2, boxShadow: '4px 4px 0px 0px #000000' }}
          whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '0px 0px 0px 0px #000000' }}
          onClick={onToggleMobileMenu}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '0px',
            border: '3px solid #000000',
            background: '#FFD93D',
            boxShadow: '3px 3px 0px 0px #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#000000',
            flexShrink: 0
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} strokeWidth={2.8} />
        </motion.button>

        {/* Section Heading & Breadcrumb */}
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              color: '#000000',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            CYBERGUARD AI // CONSOLE
          </div>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginTop: '2px',
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase'
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
            whileHover={{ translateY: -2, boxShadow: '5px 5px 0px 0px #000000' }}
            whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '1px 1px 0px 0px #000000' }}
            onClick={onOpenCopilot}
            style={{
              padding: '9px 16px',
              borderRadius: '0px',
              border: '3px solid #000000',
              background: '#FF6B6B',
              boxShadow: '3px 3px 0px 0px #000000',
              color: '#000000',
              fontSize: '0.82rem',
              fontWeight: 900,
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
            title="Open CyberGuard AI Copilot"
          >
            <Bot size={17} color="#000000" strokeWidth={2.6} />
            <span>Copilot AI</span>
          </motion.button>
        )}

        {/* User Profile & Subscription / Sign In */}
        {(onOpenProfileModal || onOpenAuthModal) && (
          <motion.button
            whileHover={{ translateY: -2, boxShadow: '5px 5px 0px 0px #000000' }}
            whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '1px 1px 0px 0px #000000' }}
            onClick={onOpenProfileModal || onOpenAuthModal}
            style={{
              padding: '9px 16px',
              borderRadius: '0px',
              border: '3px solid #000000',
              background: '#C4B5FD',
              boxShadow: '3px 3px 0px 0px #000000',
              color: '#000000',
              fontSize: '0.82rem',
              fontWeight: 900,
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
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
              <Crown size={16} color="#000000" strokeWidth={2.6} />
            ) : (
              <User size={16} color="#000000" strokeWidth={2.6} />
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
                  borderRadius: '0px',
                  background: '#FFD93D',
                  border: '1.5px solid #000000',
                  color: '#000000',
                  fontWeight: 900
                }}
              >
                {currentUser.plan === 'premium' ? 'PRO' : `${currentUser.credits ?? 50} CR`}
              </span>
            )}
          </motion.button>
        )}

        {/* Discovery Feed Button */}
        <motion.button
          whileHover={{ translateY: -2, boxShadow: '5px 5px 0px 0px #000000' }}
          whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '1px 1px 0px 0px #000000' }}
          onClick={() => setActiveTab('discovery')}
          style={{
            padding: '9px 16px',
            borderRadius: '0px',
            border: '3px solid #000000',
            background: activeTab === 'discovery' ? '#FFD93D' : '#FFFFFF',
            boxShadow: '3px 3px 0px 0px #000000',
            color: '#000000',
            fontSize: '0.82rem',
            fontWeight: 900,
            fontFamily: "'Space Grotesk', sans-serif",
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          title="Discovery Feed - Real-time Certificate Transparency stream"
        >
          <Activity size={16} color="#000000" strokeWidth={2.6} />
          <span className="hidden sm:inline">Live Feed</span>
        </motion.button>

        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ translateY: -2, boxShadow: '5px 5px 0px 0px #000000' }}
          whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '1px 1px 0px 0px #000000' }}
          onClick={toggleTheme}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '0px',
            border: '3px solid #000000',
            background: '#FFFFFF',
            boxShadow: '3px 3px 0px 0px #000000',
            color: '#000000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#000000" strokeWidth={2.6} /> : <Moon size={18} color="#000000" strokeWidth={2.6} />}
        </motion.button>
      </div>
    </header>
  );
};
