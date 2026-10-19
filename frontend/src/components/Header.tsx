import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Crown,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = theme === 'light';

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    {
      id: 'scanner',
      label: 'Scanner',
      icon: Radar,
      onClick: () => {
        if (activeTab !== 'scanner' && onLaunchScanner) onLaunchScanner();
        else setActiveTab('scanner');
      }
    },
    { id: 'email-scanner', label: 'Email Scan', icon: Mail },
    { id: 'bulk-scanner', label: 'Bulk Scan', icon: LinkIcon },
    { id: 'threat-dashboard', label: 'Threat Intel', icon: BarChart2 },
    { id: 'password-checker', label: 'Password', icon: Key },
    { id: 'ip-reputation', label: 'IP Lookup', icon: Globe },
    { id: 'watchlist', label: 'Watchlist', icon: Bell },
    { id: 'history', label: `History (${caseCount})`, icon: History },
    ...(hasActiveReport ? [{ id: 'results', label: 'Results', icon: LayoutDashboard }] : []),
    { id: 'extension', label: 'Ext', icon: Puzzle },
    { id: 'about', label: 'Info', icon: HelpCircle }
  ];

  const handleSelectTab = (tabId: string, customClick?: () => void) => {
    if (customClick) customClick();
    else setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="glass-panel"
      role="banner"
      style={{
        margin: '16px 24px',
        padding: '12px 20px',
        position: 'relative',
        zIndex: 100,
        borderRadius: '14px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Top Row: Brand on Left, Global Controls on Right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px', flexWrap: 'nowrap' }}>
          {/* Brand & Project Identity */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', minWidth: 0 }}
            onClick={() => handleSelectTab('overview')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectTab('overview')}
            aria-label="CyberGuard AI Home"
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
              <Shield size={22} color={isLight ? '#ffffff' : '#080D16'} strokeWidth={2.5} />
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

          {/* Top-Right Corner Controls: Copilot AI, Profile/Pro Pass, Feed, Theme, Mobile Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>
            {/* Copilot AI Launcher */}
            {onOpenCopilot && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenCopilot}
                style={{
                  padding: '7px 13px',
                  borderRadius: '10px',
                  border: isLight ? '1px solid rgba(0, 169, 214, 0.35)' : '1px solid rgba(0, 217, 255, 0.4)',
                  background: isLight
                    ? 'linear-gradient(135deg, rgba(0, 169, 214, 0.12) 0%, rgba(23, 111, 229, 0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(0, 217, 255, 0.16) 0%, rgba(152, 85, 255, 0.14) 100%)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
                title="Open CyberGuard AI Copilot"
                aria-label="Open CyberGuard AI Copilot"
              >
                <Bot size={15} color="var(--accent-cyan)" />
                <span className="hidden sm:inline">Copilot AI</span>
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
                title={currentUser ? `Operator: ${currentUser.username} (${currentUser.plan === 'premium' ? 'Pro Plan' : 'Free Tier'} • ${currentUser.credits ?? 50} Credits)` : 'Profile, Credits & Subscription Plans'}
                aria-label="User Profile and Subscription Plans"
              >
                {currentUser?.plan === 'premium' ? (
                  <Crown size={14} color="var(--threat-medium)" />
                ) : (
                  <User size={14} color={currentUser ? 'var(--threat-safe)' : 'var(--accent-cyan)'} />
                )}
                <span className="hidden md:inline">
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

            {/* Discovery Feed Shortcut */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectTab('discovery')}
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
              aria-label="Discovery Feed"
            >
              <Activity size={14} color="var(--threat-high)" />
              <span className="hidden lg:inline">Feed</span>
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
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={15} color="#FFB547" /> : <Moon size={15} color="#00A9D6" />}
            </motion.button>

            {/* Mobile Navigation Drawer Toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden"
              style={{
                padding: '7px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--code-box-bg)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '34px',
                minHeight: '34px'
              }}
              title="Toggle Menu"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </motion.button>
          </div>
        </div>

        {/* Row 2: Desktop Horizontal Navigation Tabs */}
        <nav
          className="nav-tabs-container hidden md:flex"
          role="navigation"
          aria-label="Main Navigation"
          style={{
            alignItems: 'center',
            gap: '3px',
            background: 'var(--nav-bar-bg)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            overflowX: 'auto',
            width: '100%',
            scrollbarWidth: 'none'
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectTab(item.id, item.onClick)}
                role="tab"
                aria-selected={isActive}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: isActive
                    ? '1px solid var(--accent-cyan)'
                    : '1px solid transparent',
                  background: isActive
                    ? isLight
                      ? 'linear-gradient(135deg, rgba(0, 169, 214, 0.16) 0%, rgba(23, 111, 229, 0.12) 100%)'
                      : 'linear-gradient(135deg, rgba(0, 217, 255, 0.20) 0%, rgba(35, 139, 255, 0.16) 100%)'
                    : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: isActive
                    ? isLight
                      ? '0 2px 8px rgba(0, 169, 214, 0.18)'
                      : '0 0 12px rgba(0, 217, 255, 0.3)'
                    : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <Icon size={14} color={isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Mobile Navigation Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="md:hidden"
              style={{
                overflow: 'hidden',
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                padding: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px'
              }}
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={`mobile-${item.id}`}
                    onClick={() => handleSelectTab(item.id, item.onClick)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      background: isActive
                        ? 'rgba(0, 217, 255, 0.14)'
                        : 'var(--code-box-bg)',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '0.80rem',
                      fontWeight: isActive ? 800 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={15} color={isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
