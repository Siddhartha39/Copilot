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
  Cpu
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  caseCount: number;
  hasActiveReport?: boolean;
  onLaunchScanner?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  caseCount,
  hasActiveReport = false,
  onLaunchScanner,
  isMobileOpen = false,
  onCloseMobile
}) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      {/* Brand Header Card with Inset Icon Well */}
      <div
        onClick={() => {
          setActiveTab('overview');
          if (onCloseMobile) onCloseMobile();
        }}
        style={{
          background: 'var(--neu-bg)',
          borderRadius: '24px',
          boxShadow: 'var(--neu-extruded)',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            background: 'var(--neu-bg)',
            boxShadow: 'var(--neu-inset)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Shield size={24} color="#6C63FF" strokeWidth={2.4} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1
              className="font-display"
              style={{
                fontSize: '1.08rem',
                fontWeight: 800,
                color: 'var(--neu-foreground)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              CyberGuard AI
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
            <span
              style={{
                fontSize: '0.62rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'var(--neu-bg)',
                boxShadow: 'var(--neu-inset-sm)',
                fontWeight: 700,
                color: '#38B2AC',
                letterSpacing: '0.04em'
              }}
            >
              100% FREE &amp; OPEN
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
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'var(--neu-bg)',
              boxShadow: 'var(--neu-extruded-sm)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color="var(--neu-foreground)" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflowY: 'auto',
          paddingRight: '4px',
          paddingBottom: '10px'
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '18px',
                border: 'none',
                background: 'var(--neu-bg)',
                boxShadow: isActive ? 'var(--neu-inset)' : 'var(--neu-extruded-sm)',
                color: isActive ? '#6C63FF' : 'var(--neu-foreground)',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 300ms ease-out',
                outline: 'none'
              }}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: '4px',
                    top: '12px',
                    bottom: '12px',
                    width: '4px',
                    borderRadius: '9999px',
                    background: '#6C63FF',
                    boxShadow: '0 0 8px rgba(108, 99, 255, 0.6)'
                  }}
                />
              )}

              {/* Molded Icon Well */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'var(--neu-bg)',
                  boxShadow: isActive ? 'var(--neu-inset-deep)' : 'var(--neu-inset-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 300ms ease-out'
                }}
              >
                <Icon size={18} color={isActive ? '#6C63FF' : 'var(--neu-muted)'} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span
                style={{
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '-0.01em',
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
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
        style={{
          background: 'var(--neu-bg)',
          borderRadius: '20px',
          boxShadow: 'var(--neu-inset-sm)',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '9999px',
            background: 'var(--neu-bg)',
            boxShadow: 'var(--neu-extruded-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Cpu size={15} color="#38B2AC" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--neu-foreground)' }}>
            SOC Engine // 2.0
          </div>
          <div style={{ fontSize: '0.65rem', color: '#38B2AC', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38B2AC', display: 'inline-block' }} />
            <span>Molded Depth Active</span>
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
          width: '270px',
          minWidth: '270px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'var(--neu-bg)',
          padding: '24px 18px',
          flexDirection: 'column',
          zIndex: 40,
          borderRight: 'none'
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
                background: 'rgba(61, 72, 82, 0.35)',
                backdropFilter: 'blur(4px)',
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
                width: '300px',
                maxWidth: '85vw',
                background: 'var(--neu-bg)',
                boxShadow: '16px 0 32px rgba(163, 177, 198, 0.7)',
                padding: '24px 18px',
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
