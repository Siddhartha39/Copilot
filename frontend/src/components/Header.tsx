import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Database, Radar, Home, Puzzle, Sun, Moon, HelpCircle, Coins, History, LayoutDashboard, Terminal, Wallet, Mail, Link, BarChart2, Key, Globe, Bell, Bot, User, Crown } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { useAlgorandWallet } from '../context/AlgorandWalletContext';
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
  onOpenWalletModal,
  onLaunchScanner,
  hasActiveReport = false,
  onOpenCopilot,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal
}) => {
  const { isConnected, address, balanceAlgo } = useAlgorandWallet();
  
  const TabButton = ({ tab, label, icon: Icon, onClick }: any) => {
    const isActive = activeTab === tab;
    return (
      <motion.button
        whileHover={{ translateY: -2, boxShadow: '4px 4px 0px 0px #000000' }}
        whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '0px 0px 0px 0px #000000' }}
        onClick={onClick || (() => setActiveTab(tab))}
        style={{
          padding: '8px 14px',
          borderRadius: '0px',
          border: isActive ? '3px solid #000000' : '2px solid #000000',
          background: isActive ? '#FFD93D' : '#FFFFFF',
          color: '#000000',
          fontSize: '0.8rem',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: isActive ? 900 : 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          boxShadow: isActive ? '4px 4px 0px 0px #000000' : '2px 2px 0px 0px #000000',
          transition: 'background-color 0.1s ease',
        }}
      >
        <Icon size={15} strokeWidth={2.6} color="#000000" />
        <span>{label}</span>
      </motion.button>
    );
  };

  return (
    <header
      className="glass-panel"
      style={{
        margin: '16px 24px',
        padding: '16px 20px',
        position: 'relative',
        zIndex: 100,
        background: '#FFFFFF',
        border: '4px solid #000000',
        borderRadius: '0px',
        boxShadow: '8px 8px 0px 0px #000000'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Top Row: Brand on Left, Global Controls pinned to Top-Right Corner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '14px', flexWrap: 'wrap' }}>
          {/* Brand & Project Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setActiveTab('overview')}>
            <div style={{
              background: '#FFD93D',
              border: '4px solid #000000',
              padding: '10px',
              borderRadius: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '4px 4px 0px 0px #000000'
            }}>
              <Shield size={26} color="#000000" strokeWidth={3} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: '#000000'
                }}>
                  CYBERGUARD AI
                </h1>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '3px 8px',
                    borderRadius: '0px',
                    background: '#C4B5FD',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0px 0px #000000',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}
                >
                  100% FREE &amp; OPEN ACCESS
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#000000', marginTop: '2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                [AI-POWERED WEBSITE SECURITY &amp; THREAT INTELLIGENCE]
              </p>
            </div>
          </div>

          {/* Top-Right Corner Controls: Copilot AI, Profile/Pro Pass, Feed, Theme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexShrink: 0 }}>
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
                  background: '#FFD93D',
                  color: '#000000',
                  fontSize: '0.8rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  boxShadow: '3px 3px 0px 0px #000000',
                  whiteSpace: 'nowrap'
                }}
                title="Open CyberGuard AI Copilot"
              >
                <Bot size={16} color="#000000" strokeWidth={2.6} />
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
                  padding: '9px 14px',
                  borderRadius: '0px',
                  border: '3px solid #000000',
                  background: currentUser?.plan === 'premium' ? '#FFD93D' : '#FFFFFF',
                  color: '#000000',
                  fontSize: '0.8rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  boxShadow: '3px 3px 0px 0px #000000',
                  whiteSpace: 'nowrap'
                }}
                title={currentUser ? `Operator: ${currentUser.username} (${currentUser.plan === 'premium' ? 'Pro Plan' : 'Free Tier'} • ${currentUser.credits ?? 50} Credits)` : "Profile, Credits & Subscription Plans"}
              >
                {currentUser?.plan === 'premium' ? (
                  <Crown size={15} color="#000000" strokeWidth={2.6} />
                ) : (
                  <User size={15} color="#000000" strokeWidth={2.6} />
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
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '0px',
                      background: currentUser.plan === 'premium' ? '#000000' : '#FFD93D',
                      color: currentUser.plan === 'premium' ? '#FFFFFF' : '#000000',
                      border: '1.5px solid #000000',
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
                padding: '9px 14px',
                borderRadius: '0px',
                border: '3px solid #000000',
                background: activeTab === 'discovery' ? '#FF6B6B' : '#FFFFFF',
                color: '#000000',
                fontSize: '0.8rem',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                boxShadow: '3px 3px 0px 0px #000000'
              }}
              title="Discovery Feed - Real-time Certificate Transparency stream"
            >
              <Activity size={15} color="#000000" strokeWidth={2.6} />
              <span className="hidden md:inline">Feed</span>
            </motion.button>

            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ translateY: -2, boxShadow: '5px 5px 0px 0px #000000' }}
              whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '1px 1px 0px 0px #000000' }}
              onClick={toggleTheme}
              style={{
                padding: '9px 11px',
                borderRadius: '0px',
                border: '3px solid #000000',
                background: '#FFFFFF',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '3px 3px 0px 0px #000000'
              }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={16} color="#000000" strokeWidth={2.6} /> : <Moon size={16} color="#000000" strokeWidth={2.6} />}
            </motion.button>
          </div>
        </div>

        {/* Row 2: Full-Width Dedicated Navigation Tabs */}
        <div
          className="nav-tabs-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFFDF5',
            padding: '6px',
            borderRadius: '0px',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px 0px #000000',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            width: '100%'
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
          <TabButton tab="bulk-scanner" label="Bulk Scan" icon={Link} />
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
