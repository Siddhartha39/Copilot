import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Radar,
  Home,
  Puzzle,
  HelpCircle,
  History,
  LayoutDashboard,
  Mail,
  Link,
  BarChart2,
  Key,
  Globe,
  Bell,
  X,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  caseCount: number;
  theme?: 'dark' | 'light';
  hasActiveReport?: boolean;
  onLaunchScanner?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  caseCount,
  theme = 'dark',
  hasActiveReport = false,
  onLaunchScanner,
  isMobileOpen = false,
  onCloseMobile
}) => {
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
    { id: 'bulk-scanner', label: 'Bulk Scan', icon: Link },
    { id: 'threat-dashboard', label: 'Threat Intel', icon: BarChart2 },
    { id: 'password-checker', label: 'Password', icon: Key },
    { id: 'ip-reputation', label: 'IP Lookup', icon: Globe },
    { id: 'watchlist', label: 'Watchlist', icon: Bell },
    { id: 'history', label: `History (${caseCount})`, icon: History },
    ...(hasActiveReport ? [{ id: 'results', label: 'Results', icon: LayoutDashboard }] : []),
    { id: 'extension', label: 'Chrome Ext', icon: Puzzle },
    { id: 'about', label: 'About & Docs', icon: HelpCircle }
  ];

  const handleItemClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
    } else {
      setActiveTab(item.id);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {/* Brand Header Card with Cyber Shield */}
      <div
        onClick={() => {
          setActiveTab('overview');
          if (onCloseMobile) onCloseMobile();
        }}
        className="glass-panel"
        style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          position: 'relative',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
          background: isLight ? '#ffffff' : 'rgba(13, 19, 31, 0.85)'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: isLight ? 'rgba(2, 132, 199, 0.1)' : 'rgba(0, 240, 255, 0.12)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Shield size={22} color="var(--accent-cyan)" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1
              className="cyber-font"
              style={{
                fontSize: '1.05rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              CyberGuard <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
            <span
              className="mono"
              style={{
                fontSize: '0.62rem',
                padding: '1px 6px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 800,
                color: '#10b981',
                letterSpacing: '0.04em'
              }}
            >
              FREE SOC SUITE
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseMobile();
            }}
            className="md:hidden"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          overflowY: 'auto',
          paddingRight: '2px',
          paddingBottom: '8px'
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
                background: isActive
                  ? isLight
                    ? 'rgba(2, 132, 199, 0.12)'
                    : 'linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(59, 130, 246, 0.15) 100%)'
                  : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 180ms ease',
                outline: 'none',
                boxShadow: isActive ? '0 0 15px rgba(6, 182, 212, 0.15)' : 'none'
              }}
            >
              {/* Active Neon Indicator Bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: '0px',
                    top: '8px',
                    bottom: '8px',
                    width: '3px',
                    borderRadius: '0 4px 4px 0',
                    background: 'var(--accent-cyan)',
                    boxShadow: '0 0 10px var(--accent-cyan)'
                  }}
                />
              )}

              {/* Icon Container */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isActive
                    ? isLight ? 'rgba(2, 132, 199, 0.18)' : 'rgba(0, 240, 255, 0.16)'
                    : isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 180ms ease'
                }}
              >
                <Icon
                  size={17}
                  color={isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
              </div>

              <span
                style={{
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 800 : 500,
                  letterSpacing: '-0.01em',
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: isActive ? (isLight ? '#0369a1' : '#ffffff') : 'var(--text-secondary)'
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Telemetry Card */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '12px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1px solid var(--border-color)',
          background: isLight ? '#ffffff' : 'rgba(13, 19, 31, 0.8)'
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Activity size={15} color="var(--accent-cyan)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            CYBER SOC CORE
          </div>
          <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
            <span>Zero-Trust Stream Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className="hidden lg:flex"
        style={{
          width: '260px',
          minWidth: '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(7, 10, 16, 0.92)',
          backdropFilter: 'blur(16px)',
          padding: '20px 14px',
          flexDirection: 'column',
          zIndex: 40,
          borderRight: '1px solid var(--border-color)'
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile / Tablet Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(6px)',
                zIndex: 99990
              }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '280px',
                maxWidth: '85vw',
                background: isLight ? '#ffffff' : 'rgba(13, 19, 31, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--border-color)',
                boxShadow: '10px 0 35px rgba(0, 0, 0, 0.6)',
                padding: '20px 14px',
                zIndex: 99991,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
