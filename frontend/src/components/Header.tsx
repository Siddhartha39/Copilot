import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Activity,
  Radar,
  Home,
  Puzzle,
  Sun,
  Moon,
  HelpCircle,
  History,
  LayoutDashboard,
  Mail,
  Link as LinkIcon,
  BarChart2,
  Key,
  Globe,
  Bell,
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
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  caseCount,
  theme,
  toggleTheme,
  onOpenAbout,
  onLaunchScanner,
  hasActiveReport = false,
  onOpenCopilot,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal
}) => {
  const isLight = theme === 'light';

  const TabButton = ({
    tab,
    label,
    icon: Icon,
    onClick
  }: {
    tab: string;
    label: string;
    icon: any;
    onClick?: () => void;
  }) => {
    const isActive = activeTab === tab;
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick || (() => setActiveTab(tab))}
        style={{
          padding: '7px 12px',
          borderRadius: '8px',
          border: isActive ? '1px solid var(--accent-cyan)' : '1px solid transparent',
          background: isActive
            ? isLight
              ? 'linear-gradient(135deg, rgba(0, 169, 214, 0.16) 0%, rgba(23, 111, 229, 0.12) 100%)'
              : 'linear-gradient(135deg, rgba(0, 217, 255, 0.22) 0%, rgba(35, 139, 255, 0.18) 100%)'
            : 'transparent',
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontSize: '0.78rem',
          fontWeight: isActive ? 800 : 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          boxShadow: isActive
            ? isLight
              ? '0 2px 8px rgba(0, 169, 214, 0.18)'
              : '0 0 12px rgba(0, 217, 255, 0.35)'
            : 'none',
          transition: 'all 0.18s ease'
        }}
      >
        <Icon size={14} color={isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
        <span>{label}</span>
      </motion.button>
    );
  };

  return (
    <header
      className="glass-panel"
      style={{
        margin: '16px 24px',
        padding: '12px 20px',
        position: 'relative',
        zIndex: 100,
        borderRadius: '14px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Top Row: Brand on Left, Global Controls pinned to Top-Right Corner */}
        <div
          className="header-top-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {/* Brand & Project Identity */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', minWidth: 0 }}
            onClick={() => setActiveTab('overview')}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isLight
                  ? '0 4px 14px rgba(0, 169, 214, 0.25)'
                  : '0 0 16px rgba(0, 217, 255, 0.4)',
                flexShrink: 0
              }}
            >
              <Shield size={24} color={isLight ? '#ffffff' : '#080D16'} strokeWidth={2.5} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1
                  className="cyber-font neon-cyan-glow"
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    margin: 0
                  }}
                >
                  CYBERGUARD AI
                </h1>
                <span
                  className="badge-safe mono"
                  style={{
                    fontSize: '0.62rem',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap'
                  }}
                >
                  100% FREE &amp; OPEN ACCESS
                </span>
              </div>
              <p
                className="mono"
                style={{
                  fontSize: '0.70rem',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                [AI-POWERED WEBSITE SECURITY &amp; THREAT INTELLIGENCE]
              </p>
            </div>
          </div>

          {/* Top-Right Corner Controls: Copilot AI, Profile/Pro Pass, Feed, Theme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>
            {/* Copilot AI Launcher */}
            {onOpenCopilot && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenCopilot}
                style={{
                  padding: '7px 13px',
                  borderRadius: '10px',
                  border: isLight ? '1px solid rgba(0, 169, 214, 0.35)' : '1px solid rgba(0, 217, 255, 0.4)',
                  background: isLight
                    ? 'linear-gradient(135deg, rgba(0, 169, 214, 0.12) 0%, rgba(23, 111, 229, 0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(0, 217, 255, 0.18) 0%, rgba(152, 85, 255, 0.14) 100%)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isLight
                    ? '0 2px 8px rgba(0, 169, 214, 0.15)'
                    : '0 0 12px rgba(0, 217, 255, 0.25)',
                  whiteSpace: 'nowrap'
                }}
                title="Open CyberGuard AI Copilot"
              >
                <Bot size={15} color="var(--accent-cyan)" />
                <span>Copilot AI</span>
              </motion.button>
            )}

            {/* User Profile & Subscription / Sign In */}
            {(onOpenProfileModal || onOpenAuthModal) && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenProfileModal || onOpenAuthModal}
                style={{
                  padding: '7px 12px',
                  borderRadius: '10px',
                  border: currentUser?.plan === 'premium'
                    ? '1px solid rgba(255, 181, 71, 0.6)'
                    : currentUser
                    ? '1px solid rgba(16, 217, 160, 0.45)'
                    : '1px solid var(--border-color)',
                  background: currentUser?.plan === 'premium'
                    ? 'rgba(255, 181, 71, 0.14)'
                    : currentUser
                    ? 'rgba(16, 217, 160, 0.12)'
                    : 'var(--code-box-bg)',
                  color: currentUser?.plan === 'premium'
                    ? 'var(--threat-medium)'
                    : currentUser
                    ? 'var(--threat-safe)'
                    : 'var(--text-primary)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
                title={
                  currentUser
                    ? `Operator: ${currentUser.username} (${currentUser.plan === 'premium' ? 'Pro Plan' : 'Free Tier'} • ${currentUser.credits ?? 50} Credits)`
                    : 'Profile, Credits & Subscription Plans'
                }
              >
                {currentUser?.plan === 'premium' ? (
                  <Crown size={14} color="var(--threat-medium)" />
                ) : (
                  <User size={14} color={currentUser ? 'var(--threat-safe)' : 'var(--accent-cyan)'} />
                )}
                <span>
                  {currentUser && currentUser.email && currentUser.email !== 'operator@cyberguard.ai'
                    ? currentUser.username
                    : currentUser?.plan === 'premium'
                    ? 'Pro Pass'
                    : 'Profile'}
                </span>
                {currentUser && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '1px 5px',
                      borderRadius: '8px',
                      background: currentUser.plan === 'premium' ? 'rgba(255, 181, 71, 0.25)' : 'rgba(0, 217, 255, 0.15)',
                      color: currentUser.plan === 'premium' ? 'var(--threat-medium)' : 'var(--accent-cyan)',
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
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab('discovery')}
              style={{
                padding: '7px 11px',
                borderRadius: '10px',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                background: activeTab === 'discovery' ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                color: 'var(--threat-high)',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Discovery Feed - Real-time Certificate Transparency stream"
            >
              <Activity size={14} color="var(--threat-high)" />
              <span>Feed</span>
            </motion.button>

            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              style={{
                padding: '7px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--code-box-bg)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '34px',
                minHeight: '34px'
              }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={15} color="#FFB547" /> : <Moon size={15} color="#00A9D6" />}
            </motion.button>
          </div>
        </div>

        {/* Row 2: Full-Width Dedicated Horizontal Navigation Tabs */}
        <div
          className="nav-tabs-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            background: 'var(--nav-bar-bg)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            width: '100%',
            scrollbarWidth: 'none'
          }}
        >
          <TabButton tab="overview" label="Overview" icon={Home} />

          <TabButton
            tab="scanner"
            label="Scanner"
            icon={Radar}
            onClick={() => {
              if (activeTab !== 'scanner' && onLaunchScanner) onLaunchScanner();
              else setActiveTab('scanner');
            }}
          />

          <TabButton tab="email-scanner" label="Email Scan" icon={Mail} />
          <TabButton tab="bulk-scanner" label="Bulk Scan" icon={LinkIcon} />
          <TabButton tab="threat-dashboard" label="Threat Intel" icon={BarChart2} />
          <TabButton tab="password-checker" label="Password" icon={Key} />
          <TabButton tab="ip-reputation" label="IP Lookup" icon={Globe} />
          <TabButton tab="watchlist" label="Watchlist" icon={Bell} />

          <TabButton tab="history" label={`History (${caseCount})`} icon={History} />

          {/* Grouped or secondary tabs */}
          {hasActiveReport && <TabButton tab="results" label="Results" icon={LayoutDashboard} />}
          <TabButton tab="extension" label="Ext" icon={Puzzle} />
          <TabButton tab="about" label="Info" icon={HelpCircle} />
        </div>
      </div>
    </header>
  );
};
