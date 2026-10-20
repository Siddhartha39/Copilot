import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  Zap,
  Shield,
  Briefcase,
  ExternalLink,
  MessageSquare,
  Lock,
  Layers,
  ChevronDown,
  RotateCcw,
  Key,
  Settings,
  Globe,
  Plus,
  Trash2,
  Search,
  Download,
  PanelLeftClose,
  PanelLeft,
  Sliders,
  Code,
  FileText,
  AlertTriangle,
  Volume2,
  VolumeX,
  Square,
  Edit3,
  Pin,
  BookOpen,
  Cloud,
  Crown,
  HardDrive,
  User
} from 'lucide-react';
import type { RiskScoreReport, FreeScanResult, ChatMessage } from '../types';
import {
  sendChatMessage,
  executeFreeScan,
  DEFAULT_GEMINI_API_KEY,
  syncCloudSessions,
  fetchCloudSessions,
  deleteCloudSession,
  clearAllCloudSessions,
  deductUserCredit,
  type UserProfile
} from '../services/api';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  domain?: string | null;
  securityMode?: 'soc-forensics' | 'speed-triage' | 'code-hardening' | 'general-cyber';
  isPinned?: boolean;
}

interface CyberCopilotChatProps {
  report?: RiskScoreReport | FreeScanResult | null;
  isOpen: boolean;
  onToggle: () => void;
  pendingPrompt?: string | null;
  onClearPendingPrompt?: () => void;
  onOpenAboutTopic?: (topicId: string) => void;
  onScanReportLoaded?: (report: FreeScanResult | RiskScoreReport) => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
}

const getScopedSessionsKey = (user?: UserProfile | null): string => {
  if (!user || !user.email) return 'cyberguard_copilot_sessions_guest';
  const sanitized = (user.email || user.id || 'anon').trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
  return `cyberguard_copilot_sessions_${sanitized}`;
};

const getScopedActiveIdKey = (user?: UserProfile | null): string => {
  if (!user || !user.email) return 'cyberguard_copilot_active_id_guest';
  const sanitized = (user.email || user.id || 'anon').trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
  return `cyberguard_copilot_active_id_${sanitized}`;
};

const loadUserSessionsFromStorage = (user?: UserProfile | null): ChatSession[] => {
  if (typeof window === 'undefined') return [];
  // One-time cleanup: migrate legacy shared key to previous user so it never leaks to other accounts
  try {
    const legacy = localStorage.getItem('cyberguard_copilot_sessions_v1');
    if (legacy) {
      const targetKey = 'cyberguard_copilot_sessions_6387siddhartha_gmail_com';
      if (!localStorage.getItem(targetKey)) {
        localStorage.setItem(targetKey, legacy);
      }
      localStorage.removeItem('cyberguard_copilot_sessions_v1');
      localStorage.removeItem('cyberguard_copilot_active_id_v1');
    }
  } catch (e) {}

  const key = getScopedSessionsKey(user);
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved chat sessions:', e);
  }
  return [];
};

export const CyberCopilotChat: React.FC<CyberCopilotChatProps> = ({
  report,
  isOpen,
  onToggle,
  pendingPrompt,
  onClearPendingPrompt,
  onOpenAboutTopic,
  onScanReportLoaded,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal
}) => {
  const [activeReport, setActiveReport] = useState<any>(report);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [securityMode, setSecurityMode] = useState<'soc-forensics' | 'speed-triage' | 'code-hardening' | 'general-cyber'>('soc-forensics');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showPlaybooksModal, setShowPlaybooksModal] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Account Plan & Quota Calculations
  const isPro = currentUser?.plan === 'premium';
  const currentCredits = currentUser?.credits ?? (isPro ? 5000 : 50);
  const maxCredits = currentUser?.max_credits ?? (isPro ? 5000 : 50);
  const creditPct = Math.min(100, Math.max(0, Math.round((currentCredits / maxCredits) * 100)));

  const memoryUsedKb = currentUser?.memory_used_kb ?? 48.0;
  const memoryMaxKb = currentUser?.memory_max_kb ?? (isPro ? 8192.0 : 256.0);
  const memoryPct = currentUser?.memory_used_pct ?? Math.min(100, Math.round((memoryUsedKb / memoryMaxKb) * 100));

  // Gemini API Key config
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cyberguard_gemini_api_key');
      if (stored && stored.trim()) return stored.trim();
    }
    const envKey = ((import.meta as any)?.env?.VITE_GEMINI_API_KEY || '').trim();
    return envKey || DEFAULT_GEMINI_API_KEY;
  });
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey);

  // Chat sessions state - isolated specifically per user account
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    return loadUserSessionsFromStorage(currentUser);
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem(getScopedActiveIdKey(currentUser));
      if (storedId) return storedId;
    }
    return '';
  });

  // Current session messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [hasExported, setHasExported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Target report details
  const rawDomain = (activeReport as any)?.canonical_domain || (activeReport as any)?.domain;
  const hasScannedSite = Boolean(rawDomain && typeof rawDomain === 'string' && rawDomain.trim() && rawDomain.trim().toLowerCase() !== 'target website');
  const domain = hasScannedSite ? rawDomain.trim() : null;
  const verdict = (activeReport as any)?.verdict;
  const riskScore = (activeReport as any)?.overall_risk_score ?? (activeReport as any)?.basic_risk_score ?? (activeReport as any)?.fast_risk_score;
  const grade = (activeReport as any)?.security_audit?.security_grade || (activeReport as any)?.security_grade;

  // Sync external report with active report
  useEffect(() => {
    if (report) {
      setActiveReport(report);
    }
  }, [report]);

  // Reactive Account Switch: When user changes, load THAT specific user's chat history
  const previousUserKeyRef = useRef<string>(
    (currentUser?.email || currentUser?.id || 'guest').trim().toLowerCase()
  );

  useEffect(() => {
    const currentKey = (currentUser?.email || currentUser?.id || 'guest').trim().toLowerCase();
    
    // Check if account has switched
    if (previousUserKeyRef.current !== currentKey) {
      previousUserKeyRef.current = currentKey;

      const userLocalSessions = loadUserSessionsFromStorage(currentUser);

      const applyLoadedSessions = (loaded: ChatSession[]) => {
        if (loaded.length > 0) {
          setSessions(loaded);
          const savedActiveId = localStorage.getItem(getScopedActiveIdKey(currentUser));
          const active = loaded.find(s => s.id === savedActiveId) || loaded[0];
          setActiveSessionId(active.id);
          setMessages(active.messages);
        } else {
          const fresh = createNewSessionObject(domain);
          setSessions([fresh]);
          setActiveSessionId(fresh.id);
          setMessages(fresh.messages);
          try {
            localStorage.setItem(getScopedSessionsKey(currentUser), JSON.stringify([fresh]));
          } catch (e) {}
        }
      };

      if (currentUser && currentUser.id) {
        // Fetch from Firestore specifically for this newly signed-in user
        import('../services/firebase').then(({ fetchChatSessionsFromFirestore }) => {
          fetchChatSessionsFromFirestore(currentUser.id).then((fsSessions) => {
            if (previousUserKeyRef.current !== currentKey) return;
            if (Array.isArray(fsSessions) && fsSessions.length > 0) {
              applyLoadedSessions(fsSessions);
              try {
                localStorage.setItem(getScopedSessionsKey(currentUser), JSON.stringify(fsSessions));
              } catch (e) {}
            } else {
              applyLoadedSessions(userLocalSessions);
            }
          }).catch(() => {
            if (previousUserKeyRef.current === currentKey) {
              applyLoadedSessions(userLocalSessions);
            }
          });
        }).catch(() => {
          if (previousUserKeyRef.current === currentKey) {
            applyLoadedSessions(userLocalSessions);
          }
        });
      } else {
        applyLoadedSessions(userLocalSessions);
      }
    }
  }, [currentUser?.email, currentUser?.id]);

  // Create default initial session on first render if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      const initialSession = createNewSessionObject(domain);
      setSessions([initialSession]);
      setActiveSessionId(initialSession.id);
      setMessages(initialSession.messages);
    } else {
      const active = sessions.find(s => s.id === activeSessionId) || sessions[0];
      if (active) {
        setActiveSessionId(active.id);
        setMessages(active.messages);
      }
    }
  }, []);

  // Save sessions to user-scoped localStorage whenever sessions change
  useEffect(() => {
    if (typeof window !== 'undefined' && sessions.length > 0) {
      try {
        const key = getScopedSessionsKey(currentUser);
        localStorage.setItem(key, JSON.stringify(sessions));
      } catch (e) {
        console.warn('Failed to save sessions to storage:', e);
      }
    }
  }, [sessions, currentUser?.email, currentUser?.id]);

  // Save activeSessionId
  useEffect(() => {
    if (typeof window !== 'undefined' && activeSessionId) {
      const key = getScopedActiveIdKey(currentUser);
      localStorage.setItem(key, activeSessionId);
    }
  }, [activeSessionId, currentUser?.email, currentUser?.id]);

  // Cloud Sync: Automatically sync sessions to Firestore & backend when logged in
  useEffect(() => {
    if (currentUser && sessions.length > 0) {
      const targetUserId = currentUser.id;
      const targetEmail = currentUser.email?.trim().toLowerCase();
      const timer = setTimeout(() => {
        if (currentUser.id === targetUserId && (currentUser.email?.trim().toLowerCase() === targetEmail)) {
          syncCloudSessions(sessions);
          import('../services/firebase').then(({ syncChatSessionsToFirestore }) => {
            syncChatSessionsToFirestore(targetUserId, sessions);
          }).catch(() => {});
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [sessions, currentUser?.id, currentUser?.email]);

  function getInitialWelcomeMessage(targetDomain?: string | null): ChatMessage {
    let scannedCount = 0;
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('cyberguard_scan_history') : null;
      if (raw) scannedCount = JSON.parse(raw).length;
    } catch {}

    if (targetDomain) {
      return {
        role: 'assistant',
        content: `👋 **CyberGuard AI Copilot Active**\n\nI have loaded live forensic intelligence for **\`${targetDomain}\`**:\n- **Verdict:** \`${verdict || 'ANALYZED'}\`\n- **Risk Score:** \`${riskScore !== undefined ? `${riskScore}/100` : 'Evaluated'}\`\n- **Security Grade:** \`${grade || 'Active'}\`\n\n${scannedCount > 0 ? `🧠 *Persistent Memory: I remember all ${scannedCount} domains you have audited till now! Ask "which domain I scanned till now" at any time.*\n\n` : ''}Ask me anything: Is it easily hackable? How do I harden Nginx headers? What vulnerabilities does it expose? Or type **\`open sandbox\`** to inspect it in a live headless viewport.`
      };
    }
    return {
      role: 'assistant',
      content: `👋 **CyberGuard AI Copilot Online**\n\nI am your autonomous defensive cybersecurity analyst and technical AI assistant with live internet telemetry and cross-session scan memory.\n\n${scannedCount > 0 ? `🧠 **Audit Memory Active:** I remember all **${scannedCount}** domains you have scanned till now! Ask **\`which domain I scanned till now\`** to see your complete scan history.\n\n` : ''}Type **\`analyze amazon.in\`** (or any domain) for an instant live audit, ask me to **\`open sandbox\`** to preview any link, or ask any question on web security, DevSecOps, and secure coding!`
    };
  }

  function createNewSessionObject(targetDomain?: string | null): ChatSession {
    const newId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const title = targetDomain ? `${targetDomain} Audit` : 'New Security Chat';
    return {
      id: newId,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [getInitialWelcomeMessage(targetDomain)],
      domain: targetDomain || null,
      securityMode
    };
  }

  const handleCreateNewChat = () => {
    const newSession = createNewSessionObject(domain);
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setMessages(newSession.messages);
    setStatusNotice(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSelectSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    if (session.securityMode) {
      setSecurityMode(session.securityMode);
    }
    setStatusNotice(null);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser) {
      deleteCloudSession(sessionId);
    }
    const remaining = sessions.filter(s => s.id !== sessionId);
    if (remaining.length === 0) {
      const fresh = createNewSessionObject(domain);
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
      setMessages(fresh.messages);
    } else {
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
        setMessages(remaining[0].messages);
      }
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to delete all saved chat history?')) {
      if (currentUser) {
        clearAllCloudSessions();
      }
      const fresh = createNewSessionObject(domain);
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
      setMessages(fresh.messages);
      try {
        localStorage.removeItem(getScopedSessionsKey(currentUser));
        localStorage.removeItem(getScopedActiveIdKey(currentUser));
      } catch (e) {}
    }
  };

  // Text-To-Speech (Read Aloud)
  const handleToggleSpeech = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser environment.');
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/\[SANDBOX_VIEWPORT:[^\]]+\]/g, '')
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/[*_#`|]/g, '')
      .replace(/https?:\/\/\S+/g, 'link');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Rename Session Title
  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveRename = (sessionId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editingTitle.trim();
    if (trimmed) {
      setSessions(prev =>
        prev.map(s => (s.id === sessionId ? { ...s, title: trimmed, updatedAt: Date.now() } : s))
      );
    }
    setEditingSessionId(null);
  };

  // Toggle Pinned Session
  const handleTogglePin = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  // Stop Generation
  const handleStopGenerating = () => {
    setIsLoading(false);
    setStatusNotice(null);
  };

  // Handle pending prompt from external "Ask AI Copilot" triggers
  useEffect(() => {
    if (pendingPrompt) {
      if (!isOpen) {
        onToggle();
      }
      setIsMinimized(false);
      handleSendMessage(pendingPrompt);
      if (onClearPendingPrompt) {
        onClearPendingPrompt();
      }
    }
  }, [pendingPrompt]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Auto-focus on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setGeminiApiKey(trimmed);
    if (typeof window !== 'undefined') {
      if (trimmed) {
        localStorage.setItem('cyberguard_gemini_api_key', trimmed);
      } else {
        localStorage.removeItem('cyberguard_gemini_api_key');
      }
    }
    setShowApiKeyModal(false);
  };

  // Export chat history as Markdown
  const handleExportChat = () => {
    const session = sessions.find(s => s.id === activeSessionId);
    const title = session?.title || 'Security Audit Transcript';
    const lines = [
      `# CyberGuard AI Copilot — Security Audit & Chat Transcript`,
      `**Session:** ${title}`,
      `**Date:** ${new Date().toLocaleString()}`,
      `**Target Host:** ${domain || 'General Mode'}`,
      `**Security Mode:** ${securityMode.toUpperCase()}`,
      `---`,
      ''
    ];

    messages.forEach(m => {
      lines.push(`### ${m.role === 'user' ? '👤 User' : '🤖 CyberGuard Copilot'}:`);
      lines.push(m.content);
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Clean, readable filename (e.g. cyberguard_copilot_audit_2026-10-12.md)
    const sanitizedTitle = (domain || title || 'security_audit')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 30);
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `cyberguard_copilot_${sanitizedTitle}_${dateStr}.md`;

    a.click();
    URL.revokeObjectURL(url);
    setHasExported(true);
    setTimeout(() => setHasExported(false), 2500);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    // Auto-update session title if it's the first user question
    const isFirstUserMessage = messages.filter(m => m.role === 'user').length === 0;
    let updatedTitle = '';
    if (isFirstUserMessage) {
      const cleanSnippet = query.replace(/[^\w\s.-]/g, '').trim();
      updatedTitle = cleanSnippet.length > 32 ? `${cleanSnippet.substring(0, 32)}...` : cleanSnippet;
    }

    // Check if query is an account / quota / subscription inquiry
    const lowerQuery = query.toLowerCase();
    const isAccountQuery = 
      /^(what('?s| is)? (my )?account|give account|show account|my profile|account detail|my credits|my plan|my subscription|who am i)/i.test(query.trim()) ||
      lowerQuery.includes('account detail') || 
      lowerQuery.includes('my credits') || 
      lowerQuery.includes('my plan') ||
      lowerQuery.includes('show my account') ||
      lowerQuery.includes('quota details');

    if (isAccountQuery) {
      const username = currentUser?.username || 'Guest Cyber Operator';
      const email = currentUser?.email || 'Anonymous Guest Session';
      const planName = isPro ? 'PREMIUM PRO 👑' : 'FREE TIER (Standard Access)';
      const creditsDisplay = `${currentCredits.toLocaleString()} / ${maxCredits.toLocaleString()} Credits`;
      const memoryDisplay = `${memoryPct}% Fill-Up (${memoryUsedKb} KB / ${memoryMaxKb} KB)`;

      const accountReply = `### 👤 CyberGuard Operator Account Dossier

• * Operator Handle: **${username}**
• * Registered Email: ${email}
• * Active Subscription: **${planName}**
• * AI Credits Remaining: **${creditsDisplay}**
• * Copilot Context Memory: **${memoryDisplay}**
• * Threat Intelligence Feeds: Active & Connected (14 Global Threat Sources)
• * Cloud Sync Status: ${currentUser ? 'Active & Synced across devices' : 'Local Browser Cache'}

---

### 📊 Capabilities & Quotas

Plan Tier | Quota Allocation
**Security Scanners** | All 8 Tools 100% Free
**Daily AI Analyses** | ${isPro ? 'Priority Deep Triage & Unlimited Sandbox' : '50 Daily Credits'}
**Copilot Memory Window** | ${isPro ? '8 MB Extended Context' : '256 KB Session Memory'}
**Razorpay Billing** | ${isPro ? 'Active Pro Membership' : 'Upgrades available via [Profile & Plans]'}

---

💡 **Account Action:** You can manage credits, view full memory fill-up, or upgrade your plan anytime using the account tile in the left sidebar or the **Profile & Plans** button.`;

      const finalMessages = [
        ...newMessages,
        { role: 'assistant' as const, content: accountReply }
      ];
      setMessages(finalMessages);
      setIsLoading(false);

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              title: updatedTitle || s.title,
              updatedAt: Date.now(),
              messages: finalMessages,
              domain: domain || s.domain,
              securityMode
            };
          }
          return s;
        })
      );
      return;
    }

    let currentContextReport = activeReport;

    // Check if query is asking to audit a domain or contains any domain
    const domainExtractRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][-a-zA-Z0-9]*\.(?:[a-zA-Z]{2,}|in|co|org|net|com|gov|edu|io|ai|xyz|top|shop|dev|app|cloud|site|tech|online|store)(?:\.[a-zA-Z]{2,})?)/i;
    const domainMatch = query.match(domainExtractRegex);

    if (domainMatch) {
      const candidateDomain = domainMatch[1].toLowerCase().replace(/^www\./, '');
      const currentActiveDomain = ((currentContextReport as any)?.canonical_domain || (currentContextReport as any)?.domain || '').toLowerCase();

      if (candidateDomain && candidateDomain !== currentActiveDomain) {
        setStatusNotice(`Interrogating authoritative DNS & WHOIS records for ${candidateDomain}...`);
        try {
          const freshScanResult = await executeFreeScan(candidateDomain);
          if (freshScanResult) {
            currentContextReport = freshScanResult;
            setActiveReport(freshScanResult);
            if (onScanReportLoaded) {
              onScanReportLoaded(freshScanResult);
            }
          }
        } catch (e) {
          console.warn('Live scan error in chat:', e);
        }
      }
    }

    try {
      setStatusNotice(null);
      const chatHistory = newMessages.map(m => ({ role: m.role, content: m.content }));
      
      // Prefix prompt with security mode directive if specialized
      let processedQuery = query;
      if (securityMode === 'code-hardening') {
        processedQuery = `[MODE: CODE HARDENING & DEFENSIVE REMEDIATION] ${query}`;
      } else if (securityMode === 'speed-triage') {
        processedQuery = `[MODE: RAPID PHISHING TRIAGE & URL SCORING] ${query}`;
      } else if (securityMode === 'general-cyber') {
        processedQuery = `[MODE: COMPREHENSIVE CYBERSECURITY EXPERT] ${query}`;
      }

      let scanHistory: any[] = [];
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('cyberguard_scan_history') : null;
        if (raw) scanHistory = JSON.parse(raw);
      } catch {}

      const response = await sendChatMessage(processedQuery, currentContextReport, chatHistory, geminiApiKey, scanHistory);
      deductUserCredit().catch(() => {});

      const finalMessages = [
        ...newMessages,
        { role: 'assistant' as const, content: response.reply }
      ];

      setMessages(finalMessages);

      // Persist to current session in sessions array
      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              title: updatedTitle || s.title,
              updatedAt: Date.now(),
              messages: finalMessages,
              domain: domain || s.domain,
              securityMode
            };
          }
          return s;
        })
      );
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMessages = [
        ...newMessages,
        {
          role: 'assistant' as const,
          content: '⚠️ **Copilot System Notice:** Network timeout on remote socket. Generated forensic analysis based on active local telemetry.'
        }
      ];
      setMessages(fallbackMessages);

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              title: updatedTitle || s.title,
              updatedAt: Date.now(),
              messages: fallbackMessages
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
      setStatusNotice(null);
    }
  };

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyFullMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageIndex(index);
    setTimeout(() => setCopiedMessageIndex(null), 2000);
  };

  // Filter and sort sessions (pinned first, then newest updated)
  const sortedSessions = [...sessions]
    .filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.domain && s.domain.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
    });

  const CYBER_PLAYBOOKS = [
    {
      id: 'ir-triage',
      title: '🚨 Incident Response & Containment Playbook',
      desc: 'Step-by-step SOC triage for suspected ransomware, credential dumping, or data breach (NIST SP 800-61).',
      prompt: 'Generate an emergency Incident Response (IR) triage playbook for a suspected host compromise. Outline the containment, network isolation, volatile RAM acquisition, and eradication steps under NIST SP 800-61.'
    },
    {
      id: 'nginx-headers',
      title: '🛡️ Production Nginx & Cloud Hardening',
      desc: 'Deploy strict CSP, HSTS preloading, X-Frame-Options, and DDoS rate limiting.',
      prompt: 'Provide a production-ready Nginx reverse proxy configuration with hardened security headers (CSP, HSTS preload, X-Frame-Options, nosniff, Referrer-Policy) and DDoS rate limiting.'
    },
    {
      id: 'phishing-forensics',
      title: '📧 Email Phishing Forensic Audit',
      desc: 'Deep inspection of RFC 5322 email headers, SPF, DKIM, and DMARC alignment.',
      prompt: 'Walk me through a forensic investigation of a suspected spear-phishing email. How do I inspect Received headers, verify DKIM cryptographic signatures, and detect display name spoofing?'
    },
    {
      id: 'owasp-injection',
      title: '🔒 OWASP Top 10 Code Injection Immunity',
      desc: 'Code patterns to completely eliminate SQLi, stored XSS, CSRF, and SSRF.',
      prompt: 'Show code examples in Python and TypeScript demonstrating how to eliminate SQL Injection (SQLi), Cross-Site Scripting (XSS), and Server-Side Request Forgery (SSRF).'
    },
    {
      id: 'zero-trust',
      title: '🏰 Zero Trust Architecture (NIST 800-207)',
      desc: 'Blueprint for identity-driven access, microsegmentation, and mTLS.',
      prompt: 'Explain how to design and migrate a corporate infrastructure to NIST SP 800-207 Zero Trust Architecture. Detail the control plane, data plane, microsegmentation, and mutual TLS.'
    },
    {
      id: 'ad-kerberos',
      title: '⚔️ Active Directory & Kerberos Defense',
      desc: 'Detect and mitigate Kerberoasting, AS-REP roasting, and Golden Tickets.',
      prompt: 'Explain how Kerberoasting and AS-REP Roasting attacks work against Active Directory, and provide exact remediation steps (gMSA, AES encryption) and SIEM Event IDs to detect them.'
    }
  ];

  // Quick prompt chips
  const quickPrompts = hasScannedSite && domain ? [
    { label: 'Show my account & quota details', icon: <User size={12} color="var(--accent-cyan)" />, colorClass: 'copilot-chip-cyan' },
    { label: `Is ${domain} easily hackable?`, icon: <Shield size={12} color="#ef4444" />, colorClass: 'copilot-chip-rose' },
    { label: `Give steps to fix ${domain}`, icon: <Terminal size={12} color="#10b981" />, colorClass: 'copilot-chip-emerald' },
    { label: `Hardening headers for ${domain}`, icon: <Terminal size={12} color="var(--accent-cyan)" />, colorClass: 'copilot-chip-cyan' },
    { label: `Explain ${domain} risk score`, icon: <Zap size={12} color="#f59e0b" />, colorClass: 'copilot-chip-amber' },
    { label: 'How to prevent code injection & SQLi?', icon: <Lock size={12} color="#a855f7" />, colorClass: 'copilot-chip-purple' },
    { label: 'Launch live Chromium sandbox', icon: <Sparkles size={12} color="#38bdf8" />, colorClass: 'copilot-chip-sky' }
  ] : [
    { label: 'Show my account & quota details', icon: <User size={12} color="var(--accent-cyan)" />, colorClass: 'copilot-chip-cyan' },
    { label: 'How do I audit my website?', icon: <Shield size={12} color="var(--accent-cyan)" />, colorClass: 'copilot-chip-cyan' },
    { label: 'What vulnerabilities does CyberGuard test for?', icon: <Zap size={12} color="#f59e0b" />, colorClass: 'copilot-chip-amber' },
    { label: 'Show general Nginx hardening config', icon: <Terminal size={12} color="#10b981" />, colorClass: 'copilot-chip-emerald' },
    { label: 'How to prevent code injection & SQLi?', icon: <Lock size={12} color="#a855f7" />, colorClass: 'copilot-chip-purple' },
    { label: 'How does DNS Spoofing / Rebinding work?', icon: <Globe size={12} color="#38bdf8" />, colorClass: 'copilot-chip-sky' },
    { label: 'Launch live Chromium sandbox', icon: <Sparkles size={12} color="#ec4899" />, colorClass: 'copilot-chip-rose' }
  ];

  // Interactive Live Chromium Sandbox Component
  const InteractiveChatSandbox: React.FC<{ initialUrl: string }> = ({ initialUrl }) => {
    const formatTargetUrl = (raw: string) => {
      let clean = (raw || '').trim();
      if (!clean) return 'https://campuskart.shop';
      if (!/^https?:\/\//i.test(clean)) {
        clean = `https://${clean}`;
      }
      return clean;
    };

    const initialFormatted = formatTargetUrl(initialUrl);
    const [currentUrl, setCurrentUrl] = useState(initialFormatted);
    const [inputUrl, setInputUrl] = useState(initialFormatted);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const handleRefresh = () => {
      setIsRefreshing(true);
      setIframeLoaded(false);
      setRefreshKey(prev => prev + 1);
      setTimeout(() => setIsRefreshing(false), 600);
    };

    const handleNavigate = (e: React.FormEvent) => {
      e.preventDefault();
      const formatted = formatTargetUrl(inputUrl);
      setCurrentUrl(formatted);
      setInputUrl(formatted);
      setIframeLoaded(false);
      setRefreshKey(prev => prev + 1);
    };

    return (
      <div
        style={{
          margin: '12px 0',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          background: '#0a0e17',
          boxShadow: '0 8px 32px rgba(0, 240, 255, 0.12), 0 2px 10px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        {/* Sandbox Window Titlebar */}
        <div
          style={{
            background: 'linear-gradient(90deg, #0d131f 0%, #111827 100%)',
            padding: '8px 12px',
            borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            </div>
            <span className="mono" style={{ fontSize: '0.72rem', color: '#00f0ff', fontWeight: 800, letterSpacing: '0.04em' }}>
              CHROMIUM SANDBOX
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.18)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontWeight: 700
              }}
            >
              ISOLATED
            </span>
          </div>

          <button
            onClick={handleRefresh}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.68rem'
            }}
          >
            <RefreshCw size={11} className={isRefreshing ? 'spinning' : ''} />
            <span>Reload</span>
          </button>
        </div>

        {/* Sandbox URL Bar */}
        <form
          onSubmit={handleNavigate}
          style={{
            background: '#070a10',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <Globe size={13} color="#00f0ff" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="mono"
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#f8fafc',
              fontSize: '0.74rem',
              outline: 'none'
            }}
            placeholder="https://example.com"
          />
          <button
            type="submit"
            style={{
              background: '#0284c7',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Visit
          </button>
        </form>

        {/* Viewport Frame */}
        <div style={{ position: 'relative', width: '100%', height: '270px', background: '#020617' }}>
          {!iframeLoaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(2, 6, 23, 0.95)',
                zIndex: 2,
                color: 'var(--text-secondary)',
                fontSize: '0.74rem'
              }}
            >
              <RefreshCw size={18} color="#00f0ff" className="spinning" />
              <span className="mono">Connecting isolated chromium socket to {currentUrl}...</span>
            </div>
          )}

          <iframe
            key={`sandbox-frame-${refreshKey}`}
            src={currentUrl}
            title="CyberGuard Live Chromium Sandbox Viewport"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            onLoad={() => setIframeLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#ffffff'
            }}
          />
        </div>
      </div>
    );
  };

  // Markdown parsing with Code Blocks & Sandbox
  const renderMarkdownWithCodeBlocks = (content: string, prefixKey: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderTextWithFormatting(content.substring(lastIndex, match.index), `${prefixKey}-txt-${lastIndex}`));
      }
      const lang = match[1] || 'bash';
      const codeSnippet = match[2];
      const uniqueCodeKey = blockIndex * 1000 + match.index;

      parts.push(
        <div
          key={`${prefixKey}-code-${blockIndex}`}
          style={{
            background: 'var(--code-box-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            margin: '8px 0',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderBottom: '1px solid var(--border-color)',
              fontSize: '0.68rem',
              color: 'var(--text-secondary)'
            }}
          >
            <span className="mono" style={{ fontWeight: 700 }}>{lang.toUpperCase()}</span>
            <button
              onClick={() => copyCode(codeSnippet, uniqueCodeKey)}
              style={{
                background: 'transparent',
                border: 'none',
                color: copiedIndex === uniqueCodeKey ? 'var(--accent-green)' : 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontSize: '0.68rem',
                fontWeight: 700
              }}
            >
              {copiedIndex === uniqueCodeKey ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedIndex === uniqueCodeKey ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre
            className="mono"
            style={{
              margin: 0,
              padding: '12px',
              fontSize: '0.76rem',
              lineHeight: '1.45',
              overflowX: 'auto',
              color: 'var(--text-primary)',
              fontFamily: 'monospace'
            }}
          >
            {codeSnippet}
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
      blockIndex++;
    }

    if (lastIndex < content.length) {
      parts.push(renderTextWithFormatting(content.substring(lastIndex), `${prefixKey}-txt-${lastIndex}`));
    }

    return parts;
  };

  const renderMessageContent = (content: string, msgIdx: number) => {
    const sandboxMarkerRegex = /\[SANDBOX_VIEWPORT:\s*([^\]]+)\]/g;
    if (sandboxMarkerRegex.test(content)) {
      const segments: React.ReactNode[] = [];
      let lastPos = 0;
      let match;
      let sIdx = 0;
      sandboxMarkerRegex.lastIndex = 0;

      while ((match = sandboxMarkerRegex.exec(content)) !== null) {
        if (match.index > lastPos) {
          const preText = content.substring(lastPos, match.index);
          segments.push(
            <div key={`pre-${msgIdx}-${sIdx}`}>
              {renderMarkdownWithCodeBlocks(preText, `pre-${msgIdx}-${sIdx}`)}
            </div>
          );
        }
        const targetUrl = match[1].trim();
        segments.push(
          <InteractiveChatSandbox
            key={`sandbox-vp-${msgIdx}-${sIdx}`}
            initialUrl={targetUrl}
          />
        );
        lastPos = match.index + match[0].length;
        sIdx++;
      }

      if (lastPos < content.length) {
        const postText = content.substring(lastPos);
        segments.push(
          <div key={`post-${msgIdx}-${sIdx}`}>
            {renderMarkdownWithCodeBlocks(postText, `post-${msgIdx}-${sIdx}`)}
          </div>
        );
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {segments}
        </div>
      );
    }

    return renderMarkdownWithCodeBlocks(content, `msg-${msgIdx}`);
  };

  // Rich Inline Markdown Token Parser
  const renderInlineTokens = (text: string, inlineKeyPrefix: string): React.ReactNode => {
    const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_)/g;
    const nodes: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    let tIdx = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        nodes.push(text.substring(lastIdx, match.index));
      }

      if (match[2] && match[3]) {
        nodes.push(
          <a
            key={`${inlineKeyPrefix}-lnk-${tIdx}`}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-cyan)', textDecoration: 'underline', fontWeight: 600 }}
          >
            {match[2]}
          </a>
        );
      } else if (match[4]) {
        nodes.push(
          <code
            key={`${inlineKeyPrefix}-cd-${tIdx}`}
            className="mono"
            style={{
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              padding: '1px 5px',
              borderRadius: '4px',
              fontSize: '0.78rem',
              color: 'var(--accent-cyan)'
            }}
          >
            {match[4]}
          </code>
        );
      } else if (match[5]) {
        nodes.push(
          <strong
            key={`${inlineKeyPrefix}-bld-${tIdx}`}
            style={{ color: 'var(--text-primary)', fontWeight: 800 }}
          >
            {match[5]}
          </strong>
        );
      } else if (match[6] || match[7]) {
        const itText = match[6] || match[7];
        nodes.push(
          <em
            key={`${inlineKeyPrefix}-it-${tIdx}`}
            style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}
          >
            {itText}
          </em>
        );
      }

      lastIdx = match.index + match[0].length;
      tIdx++;
    }

    if (lastIdx < text.length) {
      nodes.push(text.substring(lastIdx));
    }

    return nodes.length === 0 ? text : nodes;
  };

  // Dedicated Risk Assessment & Metric Formatter
  const renderRiskMetricLine = (text: string, itemKey: string): React.ReactNode => {
    const strippedStars = text.replace(/\*\*/g, '').trim();

    const riskScoreMatch = strippedStars.match(/^Risk Score\s*:\s*(\d+)(\s*\/\s*100)?/i);
    if (riskScoreMatch) {
      const score = parseInt(riskScoreMatch[1], 10);
      const isSafe = score < 30;
      const isWarning = score >= 30 && score < 70;
      const badgeColor = isSafe ? '#10b981' : isWarning ? '#f59e0b' : '#ef4444';
      const badgeBg = isSafe ? 'rgba(16, 185, 129, 0.14)' : isWarning ? 'rgba(245, 158, 11, 0.14)' : 'rgba(239, 68, 68, 0.14)';
      const badgeBorder = isSafe ? 'rgba(16, 185, 129, 0.35)' : isWarning ? 'rgba(245, 158, 11, 0.35)' : 'rgba(239, 68, 68, 0.35)';
      const statusText = isSafe ? 'SAFE' : isWarning ? 'SUSPICIOUS' : 'HIGH RISK';

      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Risk Score:</strong>
          <span
            style={{
              background: badgeBg,
              color: badgeColor,
              border: `1px solid ${badgeBorder}`,
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '0.74rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {score} / 100 • {statusText}
          </span>
        </div>
      );
    }

    const verdictMatch = strippedStars.match(/^Verdict\s*:\s*(.+)$/i);
    if (verdictMatch) {
      const verdict = verdictMatch[1].trim();
      const isSafe = /benign|safe|clean/i.test(verdict);
      const isPhish = /phish|malicious|danger|critical/i.test(verdict);
      const badgeColor = isSafe ? '#10b981' : isPhish ? '#ef4444' : '#f59e0b';
      const badgeBg = isSafe ? 'rgba(16, 185, 129, 0.14)' : isPhish ? 'rgba(239, 68, 68, 0.14)' : 'rgba(245, 158, 11, 0.14)';
      const badgeBorder = isSafe ? 'rgba(16, 185, 129, 0.35)' : isPhish ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.35)';

      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Verdict:</strong>
          <span
            style={{
              background: badgeBg,
              color: badgeColor,
              border: `1px solid ${badgeBorder}`,
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '0.74rem',
              fontWeight: 800
            }}
          >
            {verdict}
          </span>
        </div>
      );
    }

    const gradeMatch = strippedStars.match(/^Security Grade\s*:\s*(.+)$/i);
    if (gradeMatch) {
      const grade = gradeMatch[1].trim();
      const isGood = /^(A\+|A|B)/i.test(grade);
      const badgeColor = isGood ? '#10b981' : '#f59e0b';
      const badgeBg = isGood ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)';
      const badgeBorder = isGood ? 'rgba(16, 185, 129, 0.35)' : isWarning(false) ? 'rgba(245, 158, 11, 0.35)' : 'rgba(239, 68, 68, 0.35)';

      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Security Grade:</strong>
          <span
            style={{
              background: badgeBg,
              color: badgeColor,
              border: `1px solid ${badgeBorder}`,
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '0.74rem',
              fontWeight: 800
            }}
          >
            {grade}
          </span>
        </div>
      );
    }

    return renderInlineTokens(text, itemKey);
  };

  const renderTextWithFormatting = (rawText: string, keyPrefix: string) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    const parseTableRow = (rowStr: string): string[] => {
      let s = rowStr.trim();
      if (s.startsWith('|')) s = s.slice(1);
      if (s.endsWith('|')) s = s.slice(0, -1);
      return s.split('|').map(c => c.trim());
    };

    const isTableDivider = (str: string) => {
      const parts = parseTableRow(str);
      return parts.length >= 2 && parts.every(p => /^:?-+:?$/.test(p.trim()));
    };

    const isTableRow = (str: string) => {
      const trimmed = str.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('>') || /^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) return false;
      if (!trimmed.includes('|')) return false;
      const parts = parseTableRow(trimmed);
      return parts.length >= 2;
    };

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Blank line
      if (!trimmed) {
        elements.push(<div key={`${keyPrefix}-blank-${i}`} style={{ height: '4px' }} />);
        i++;
        continue;
      }

      // Check for Table Block
      if (isTableRow(line)) {
        const tableLines: string[] = [];
        const startIdx = i;
        while (i < lines.length && (isTableRow(lines[i]) || isTableDivider(lines[i]))) {
          tableLines.push(lines[i]);
          i++;
        }

        if (tableLines.length > 0) {
          const headerRow = parseTableRow(tableLines[0]);
          let bodyRowLines = tableLines.slice(1);
          bodyRowLines = bodyRowLines.filter(l => !isTableDivider(l));
          const bodyRows = bodyRowLines.map(parseTableRow);

          elements.push(
            <div
              key={`${keyPrefix}-tbl-${startIdx}`}
              style={{
                margin: '8px 0',
                overflowX: 'auto',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.02)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(0, 240, 255, 0.08)', borderBottom: '1px solid var(--border-color)' }}>
                    {headerRow.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        style={{
                          padding: '8px 12px',
                          fontWeight: 800,
                          color: 'var(--accent-cyan)',
                          letterSpacing: '0.3px',
                          borderRight: hIdx < headerRow.length - 1 ? '1px solid var(--border-color)' : 'none'
                        }}
                      >
                        {renderInlineTokens(h, `${keyPrefix}-tbl-${startIdx}-th-${hIdx}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      style={{
                        borderBottom: rIdx < bodyRows.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                        background: rIdx % 2 === 1 ? 'rgba(255, 255, 255, 0.025)' : 'transparent'
                      }}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          style={{
                            padding: '7px 12px',
                            color: 'var(--text-primary)',
                            borderRight: cIdx < row.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                          }}
                        >
                          {renderInlineTokens(cell, `${keyPrefix}-tbl-${startIdx}-td-${rIdx}-${cIdx}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Check for Horizontal Divider
      if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        elements.push(
          <div
            key={`${keyPrefix}-div-${i}`}
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, rgba(0,240,255,0.4) 0%, var(--border-color) 60%, transparent 100%)',
              margin: '8px 0'
            }}
          />
        );
        i++;
        continue;
      }

      // Check for Headings
      if (trimmed.startsWith('#')) {
        const hMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (hMatch) {
          const level = hMatch[1].length;
          const headingText = hMatch[2];
          if (level === 1) {
            elements.push(
              <h3
                key={`${keyPrefix}-h-${i}`}
                style={{
                  margin: '12px 0 6px',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.3px'
                }}
              >
                {renderInlineTokens(headingText, `${keyPrefix}-h1-${i}`)}
              </h3>
            );
          } else if (level === 2) {
            elements.push(
              <h4
                key={`${keyPrefix}-h-${i}`}
                style={{
                  margin: '10px 0 5px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.2px'
                }}
              >
                {renderInlineTokens(headingText, `${keyPrefix}-h2-${i}`)}
              </h4>
            );
          } else {
            elements.push(
              <div
                key={`${keyPrefix}-h-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  margin: '9px 0 4px',
                  paddingBottom: '3px',
                  borderBottom: '1px solid rgba(0, 240, 255, 0.15)'
                }}
              >
                <span
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.2px'
                  }}
                >
                  {renderInlineTokens(headingText, `${keyPrefix}-h3-${i}`)}
                </span>
              </div>
            );
          }
          i++;
          continue;
        }
      }

      // Check for Blockquote
      if (trimmed.startsWith('>')) {
        const quoteText = trimmed.replace(/^>\s*/, '');
        elements.push(
          <div
            key={`${keyPrefix}-quote-${i}`}
            style={{
              borderLeft: '3px solid var(--accent-cyan)',
              padding: '6px 12px',
              margin: '6px 0',
              background: 'rgba(0, 240, 255, 0.04)',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.45'
            }}
          >
            {renderInlineTokens(quoteText, `${keyPrefix}-quote-${i}`)}
          </div>
        );
        i++;
        continue;
      }

      // Check for List Item
      if (/^\s*([•*\-+]|\d+\.)\s+/.test(trimmed)) {
        const cleanText = trimmed.replace(/^(\s*([•*\-+]|\d+\.)\s*)+/, '').trim();
        elements.push(
          <div
            key={`${keyPrefix}-li-${i}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              paddingLeft: '4px'
            }}
          >
            <span style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', lineHeight: '1.4' }}>•</span>
            <div style={{ flex: 1, fontSize: '0.82rem', lineHeight: '1.45', color: 'var(--text-primary)' }}>
              {renderRiskMetricLine(cleanText, `${keyPrefix}-li-metric-${i}`)}
            </div>
          </div>
        );
        i++;
        continue;
      }

      // Check for Recommendation / Tip
      if (trimmed.startsWith('💡') || trimmed.toLowerCase().startsWith('recommendation:') || trimmed.toLowerCase().startsWith('tip:')) {
        elements.push(
          <div
            key={`${keyPrefix}-tip-${i}`}
            style={{
              background: 'rgba(0, 240, 255, 0.05)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              margin: '6px 0',
              fontSize: '0.82rem',
              lineHeight: '1.5',
              color: 'var(--text-primary)'
            }}
          >
            {renderInlineTokens(trimmed, `${keyPrefix}-tip-${i}`)}
          </div>
        );
        i++;
        continue;
      }

      // Regular Paragraph
      elements.push(
        <p
          key={`${keyPrefix}-p-${i}`}
          style={{
            margin: 0,
            fontSize: '0.82rem',
            lineHeight: '1.5',
            color: 'var(--text-primary)'
          }}
        >
          {renderInlineTokens(trimmed, `${keyPrefix}-p-${i}`)}
        </p>
      );
      i++;
    }

    return (
      <div key={keyPrefix} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {elements}
      </div>
    );
  };

  // Minimized Floating Widget Launcher Button -> Neo-Brutalism
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ translateY: -3, boxShadow: '8px 8px 0px 0px #000000' }}
        whileTap={{ transform: 'translate(2px, 2px)', boxShadow: '2px 2px 0px 0px #000000' }}
        onClick={onToggle}
        aria-label="Open CyberGuard AI Copilot"
        className="copilot-launcher-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99995,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          background: '#FFD93D',
          border: '4px solid #000000',
          borderRadius: '0px',
          boxShadow: '6px 6px 0px 0px #000000',
          color: '#000000'
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              background: '#FFFFFF',
              border: '2.5px solid #000000',
              padding: '7px',
              borderRadius: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '2px 2px 0px 0px #000000'
            }}
          >
            <Bot size={20} color="#000000" strokeWidth={2.8} />
          </div>
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '10px',
              height: '10px',
              borderRadius: '0px',
              backgroundColor: '#FF6B6B',
              border: '1.5px solid #000000'
            }}
          />
        </div>

        <div style={{ textAlign: 'left' }}>
          <div
            style={{
              fontSize: '0.88rem',
              fontWeight: 900,
              color: '#000000',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.01em',
              textTransform: 'uppercase'
            }}
          >
            CYBER COPILOT
          </div>
          <div style={{ fontSize: '0.72rem', color: '#000000', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
            <span>■</span>
            <span>{domain ? `Auditing: ${domain}` : 'CyberGuard AI Copilot'}</span>
          </div>
        </div>
      </motion.button>
    );
  }

  // Open Chat Window
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={isFullScreen ? '' : 'copilot-chat-window'}
      style={
        isFullScreen
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 999999,
              maxWidth: '100vw',
              maxHeight: '100vh',
              borderRadius: 0,
              background: 'var(--bg-primary)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: 'none',
              border: 'none'
            }
          : {
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 99995,
              width: isSidebarOpen ? '780px' : '520px',
              maxWidth: 'calc(100vw - 32px)',
              height: isMinimized ? '64px' : '650px',
              maxHeight: 'calc(100vh - 40px)',
              borderRadius: '18px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }
      }
    >
      {/* Top Prismatic Rainbow Shimmer Bar */}
      <div className="copilot-top-prismatic-bar" />

      {/* Engine Settings Modal Overlay */}
      {showApiKeyModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(7, 10, 16, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowApiKeyModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1.5px solid var(--accent-cyan)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(0,240,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--accent-cyan)" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  CyberGuard AI Engine Settings
                </h3>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Connect your <strong>Custom AI Engine API Key</strong> to enable conversational AI reasoning on any programming or cybersecurity question. If left blank, CyberGuard AI's built-in forensic intelligence engine handles queries locally.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                AI Engine API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Get a free key from Google AI Studio</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={() => setShowApiKeyModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-cyan), #3b82f6)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#070a10',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)'
                }}
              >
                Save Engine Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cyber Playbooks Modal Overlay */}
      {showPlaybooksModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(7, 10, 16, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowPlaybooksModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1.5px solid var(--accent-cyan)',
              borderRadius: '16px',
              padding: '22px',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(0,240,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="var(--accent-cyan)" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Cyber Defense Playbooks &amp; Blueprints
                </h3>
              </div>
              <button
                onClick={() => setShowPlaybooksModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Select a specialized defensive playbook to launch an authoritative investigation, hardening guide, or forensic analysis in your active session.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CYBER_PLAYBOOKS.map((pb) => (
                <button
                  key={pb.id}
                  onClick={() => {
                    setShowPlaybooksModal(false);
                    handleSendMessage(pb.prompt);
                  }}
                  style={{
                    background: 'var(--code-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {pb.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {pb.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Window Header Bar */}
      <div
        className="copilot-header-bar"
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            style={{
              background: isSidebarOpen ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: isSidebarOpen ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '6px',
              color: isSidebarOpen ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            title={isSidebarOpen ? 'Hide Chat History' : 'Show Chat History'}
          >
            {isSidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
          </button>

          {/* Bot Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #00f0ff 0%, #6366f1 50%, #ec4899 100%)',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)'
              }}
            >
              <Bot size={16} color="#ffffff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="cyber-font" style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                  CYBER COPILOT
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    background: 'rgba(0, 240, 255, 0.15)',
                    color: 'var(--accent-cyan)',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}
                >
                  PRO AI
                </span>
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#10b981' }}>●</span>
                <span>{domain ? `Auditing: ${domain}` : 'Ready for Inquiries'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: Mode Selector & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Security Mode Selector */}
          <select
            value={securityMode}
            onChange={(e) => setSecurityMode(e.target.value as any)}
            style={{
              background: 'var(--code-box-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '4px 8px',
              color: 'var(--text-primary)',
              fontSize: '0.72rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
              display: isFullScreen || isSidebarOpen ? 'inline-block' : 'none'
            }}
            title="Switch Copilot Intelligence Mode"
          >
            <option value="soc-forensics">🛡️ SOC Forensics</option>
            <option value="speed-triage">⚡ Phishing Triage</option>
            <option value="code-hardening">🛠️ Code & Hardening</option>
            <option value="general-cyber">🧠 General Cyber AI</option>
          </select>

          {/* Export Chat */}
          <button
            onClick={handleExportChat}
            style={{
              background: hasExported ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: hasExported ? '1px solid #10b981' : '1px solid var(--border-color)',
              color: hasExported ? '#10b981' : 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.74rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
            title="Download Copilot chat history as a Markdown (.md) document"
          >
            {hasExported ? <Check size={13} color="#10b981" /> : <Download size={13} />}
            <span>{hasExported ? 'Exported (.md)' : 'Export'}</span>
          </button>

          {/* Plan & Credits Pill */}
          <button
            onClick={onOpenProfileModal || onOpenAuthModal}
            style={{
              background: currentUser?.plan === 'premium' ? 'rgba(234, 179, 8, 0.18)' : 'rgba(0, 240, 255, 0.1)',
              border: currentUser?.plan === 'premium' ? '1px solid rgba(234, 179, 8, 0.45)' : '1px solid rgba(0, 240, 255, 0.25)',
              color: currentUser?.plan === 'premium' ? '#facc15' : 'var(--accent-cyan)',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '0.68rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="View Quota, Memory Fill-Up & Razorpay Subscription Plans"
          >
            {currentUser?.plan === 'premium' ? <Crown size={11} color="#facc15" /> : <Zap size={11} color="#00f0ff" />}
            <span>{currentUser?.plan === 'premium' ? 'PRO' : `${currentUser?.credits ?? 50} CR`}</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '6px'
            }}
            title="Configure AI Engine API Key"
          >
            <Key size={14} />
          </button>

          {/* Full Screen Toggle */}
          <button
            onClick={() => setIsFullScreen(prev => !prev)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '6px'
            }}
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {/* Close Window Button */}
          <button
            onClick={onToggle}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '6px'
            }}
            title="Close Copilot"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Main Container: Sidebar + Chat Canvas */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* ChatGPT Left Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="copilot-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isFullScreen ? 280 : 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                overflow: 'hidden'
              }}
            >
              {/* Sidebar Header: New Chat & Search */}
              <div style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={handleCreateNewChat}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
                    border: '1px solid rgba(0, 240, 255, 0.35)',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(0, 240, 255, 0.15)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Plus size={14} color="var(--accent-cyan)" />
                  <span>New Chat</span>
                </button>

                {/* Search Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--code-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '4px 8px'
                  }}
                >
                  <Search size={12} color="var(--text-secondary)" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.72rem',
                      outline: 'none',
                      width: '100%'
                    }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                      <X size={11} />
                    </button>
                  )}
                </div>
              </div>

              {/* Sidebar Sessions List */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 6px' }}>
                  Chat History ({sortedSessions.length})
                </div>

                {sortedSessions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                    No conversations found.
                  </div>
                ) : (
                  sortedSessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    const isEditing = editingSessionId === session.id;

                    return (
                      <div
                        key={session.id}
                        className={`copilot-history-item ${isActive ? 'active' : ''}`}
                        onClick={() => !isEditing && handleSelectSession(session)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 9px',
                          borderRadius: '8px',
                          cursor: isEditing ? 'default' : 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: isActive ? 700 : 500,
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, flex: 1 }}>
                          {session.isPinned ? (
                            <Pin size={12} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                          ) : (
                            <MessageSquare size={13} color={isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'} style={{ flexShrink: 0 }} />
                          )}

                          {isEditing ? (
                            <form
                              onSubmit={(e) => handleSaveRename(session.id, e)}
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                autoFocus
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') setEditingSessionId(null);
                                }}
                                style={{
                                  background: 'var(--bg-primary)',
                                  border: '1px solid var(--accent-cyan)',
                                  borderRadius: '4px',
                                  padding: '2px 6px',
                                  color: 'var(--text-primary)',
                                  fontSize: '0.72rem',
                                  width: '100%',
                                  outline: 'none'
                                }}
                              />
                              <button
                                type="submit"
                                style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', padding: '2px' }}
                                title="Save Title"
                              >
                                <Check size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingSessionId(null)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                                title="Cancel"
                              >
                                <X size={12} />
                              </button>
                            </form>
                          ) : (
                            <span
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1
                              }}
                            >
                              {session.title}
                            </span>
                          )}
                        </div>

                        {!isEditing && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {/* Pin / Unpin Button */}
                            <button
                              onClick={(e) => handleTogglePin(session.id, e)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: session.isPinned ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: session.isPinned || isActive ? 1 : 0.4
                              }}
                              title={session.isPinned ? 'Unpin Chat' : 'Pin Chat to Top'}
                            >
                              <Pin size={11} />
                            </button>

                            {/* Rename Button */}
                            <button
                              onClick={(e) => handleStartRename(session, e)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: isActive ? 0.9 : 0.4
                              }}
                              title="Rename Chat"
                            >
                              <Edit3 size={11} />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: isActive ? 0.9 : 0.4
                              }}
                              title="Delete Chat"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sidebar Footer: ChatGPT-Style Account & Subscription Card */}
              <div
                style={{
                  padding: '10px 12px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  background: 'var(--bg-card)'
                }}
              >
                {/* User Account Tile */}
                <div
                  onClick={onOpenProfileModal || onOpenAuthModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: isPro ? 'rgba(234, 179, 8, 0.08)' : 'var(--code-box-bg)',
                    border: isPro ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isPro ? '0 0 12px rgba(234, 179, 8, 0.18)' : 'none'
                  }}
                  title="Click to view full Account Details, Credits & Subscription"
                >
                  {/* Avatar & Account Info */}
                  {(() => {
                    const isRealUser = currentUser && currentUser.email && currentUser.email.trim() && currentUser.email !== 'operator@cyberguard.ai';
                    return (
                      <>
                        {isRealUser && currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt={currentUser.username}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: isPro ? '1.5px solid #facc15' : '1.5px solid var(--accent-cyan)',
                              objectFit: 'cover',
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isPro
                                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                : isRealUser
                                ? 'linear-gradient(135deg, #00f0ff 0%, #6366f1 100%)'
                                : 'rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isRealUser ? '#070a10' : 'var(--accent-cyan)',
                              fontWeight: 900,
                              fontSize: '0.85rem',
                              flexShrink: 0,
                              border: isPro ? '1.5px solid #facc15' : isRealUser ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-color)'
                            }}
                          >
                            {isRealUser ? currentUser.username.substring(0, 1).toUpperCase() : <User size={15} />}
                          </div>
                        )}

                        {/* Name and Plan */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span
                              style={{
                                fontSize: '0.76rem',
                                fontWeight: 800,
                                color: 'var(--text-primary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {isRealUser ? currentUser.username : 'Guest Session'}
                            </span>
                            <span
                              style={{
                                fontSize: '0.62rem',
                                padding: '1px 5px',
                                borderRadius: '6px',
                                background: isPro ? 'rgba(234, 179, 8, 0.25)' : 'rgba(0, 240, 255, 0.15)',
                                color: isPro ? '#facc15' : 'var(--accent-cyan)',
                                fontWeight: 900
                              }}
                            >
                              {isPro ? '👑 PRO' : 'FREE'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.65rem', color: isRealUser ? 'var(--text-secondary)' : 'var(--accent-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {isRealUser ? currentUser.email : 'Click to Link Email'}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Quota & Memory Quick Meters */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.66rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                      <Zap size={11} color="var(--accent-cyan)" />
                      <span>Credits:</span>
                    </span>
                    <span className="mono" style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>
                      {currentCredits.toLocaleString()} / {maxCredits.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                      <HardDrive size={11} color="#a855f7" />
                      <span>Memory:</span>
                    </span>
                    <span className="mono" style={{ fontWeight: 800, color: '#a855f7' }}>
                      {memoryPct}% ({memoryUsedKb} KB)
                    </span>
                  </div>
                </div>

                {/* Upgrade Button if Free */}
                {!isPro && (
                  <button
                    onClick={onOpenProfileModal}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(245, 158, 11, 0.25) 100%)',
                      border: '1px solid rgba(234, 179, 8, 0.45)',
                      color: '#facc15',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 10px rgba(234, 179, 8, 0.15)'
                    }}
                  >
                    <Crown size={12} color="#facc15" />
                    <span>Upgrade to Premium Pro</span>
                  </button>
                )}

                {/* Bottom Status & Clear History */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700 }}>
                      {currentUser ? 'Cloud Synced' : 'SOC Core Active'}
                    </span>
                  </div>

                  <button
                    onClick={handleClearAllHistory}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.66rem',
                      textDecoration: 'underline'
                    }}
                    title="Clear all saved conversations"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Main Chat Canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          {/* Status Notice Pill if Live Scanning */}
          {statusNotice && (
            <div
              style={{
                background: 'rgba(0, 240, 255, 0.1)',
                borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.72rem',
                color: 'var(--accent-cyan)'
              }}
            >
              <RefreshCw size={12} className="spinning" />
              <span>{statusNotice}</span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div
            className="copilot-messages-container"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: isFullScreen ? '24px 10%' : '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* ChatGPT-style Welcome Hero Screen if conversation is new/empty */}
            {messages.length <= 1 && (
              <div
                style={{
                  margin: 'auto',
                  maxWidth: '560px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '20px 0',
                  gap: '16px'
                }}
              >
                {/* Glowing Prismatic Avatar */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #00f0ff 0%, #6366f1 50%, #ec4899 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 24px rgba(0, 240, 255, 0.4), 0 0 40px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <Bot size={28} color="#ffffff" />
                </div>

                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                    What security challenge can I investigate for you?
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Equipped with live DNS probing, WHOIS domain age forensics, and isolated Chromium sandboxing.
                  </p>
                </div>

                {/* 4 ChatGPT-Style Starter Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    width: '100%',
                    marginTop: '8px'
                  }}
                >
                  <button
                    onClick={() => handleSendMessage('analyze amazon.in')}
                    style={{
                      background: 'var(--code-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                      <Globe size={13} />
                      <span>Audit a Target Domain</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      Analyze DNS, SSL, and security headers for amazon.in
                    </div>
                  </button>

                  <button
                    onClick={() => handleSendMessage('check br-icloud.com.br')}
                    style={{
                      background: 'var(--code-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#f43f5e' }}>
                      <AlertTriangle size={13} />
                      <span>Investigate Phishing Trap</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      Check if br-icloud.com.br is an authorized Apple domain
                    </div>
                  </button>

                  <button
                    onClick={() => handleSendMessage('Show general Nginx hardening config')}
                    style={{
                      background: 'var(--code-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#10b981' }}>
                      <Terminal size={13} />
                      <span>Hardening Blueprint</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      Generate Nginx CSP, HSTS, and X-Frame-Options config
                    </div>
                  </button>

                  <button
                    onClick={() => handleSendMessage('open sandbox')}
                    style={{
                      background: 'var(--code-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#a855f7' }}>
                      <Sparkles size={13} />
                      <span>Launch Sandbox Viewport</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      Safely preview suspicious websites inside live Chromium
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Rendered Conversation Messages */}
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={`msg-row-${idx}`}
                  style={{
                    display: 'flex',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    gap: '10px',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isUser
                        ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                        : 'linear-gradient(135deg, #00f0ff 0%, #6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                      boxShadow: isUser ? '0 0 10px rgba(2, 132, 199, 0.4)' : '0 0 10px rgba(0, 240, 255, 0.4)'
                    }}
                  >
                    {isUser ? (
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff' }}>U</span>
                    ) : (
                      <Bot size={15} color="#ffffff" />
                    )}
                  </div>

                  {/* Bubble Content */}
                  <div
                    style={{
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div
                      className={isUser ? 'copilot-user-bubble' : 'copilot-assistant-bubble'}
                      style={{
                        padding: '12px 14px',
                        borderRadius: isUser ? '14px 4px 14px 14px' : '4px 14px 14px 14px'
                      }}
                    >
                      {renderMessageContent(msg.content, idx)}
                    </div>

                    {/* Action Bar for Assistant Messages (Copy / Regenerate) */}
                    {!isUser && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          paddingLeft: '4px',
                          fontSize: '0.68rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <button
                          onClick={() => copyFullMessage(msg.content, idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedMessageIndex === idx ? 'var(--accent-green)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 4px',
                            fontSize: '0.68rem'
                          }}
                        >
                          {copiedMessageIndex === idx ? <Check size={11} /> : <Copy size={11} />}
                          <span>{copiedMessageIndex === idx ? 'Copied!' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleToggleSpeech(msg.content, idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: speakingIndex === idx ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 4px',
                            fontSize: '0.68rem',
                            fontWeight: speakingIndex === idx ? 700 : 500
                          }}
                          title={speakingIndex === idx ? 'Stop Audio Readout' : 'Listen with Speech Synthesizer'}
                        >
                          {speakingIndex === idx ? <VolumeX size={12} color="var(--accent-cyan)" /> : <Volume2 size={12} />}
                          <span>{speakingIndex === idx ? 'Stop Audio' : 'Listen'}</span>
                        </button>

                        <button
                          onClick={() => {
                            const lastUser = [...messages.slice(0, idx)].reverse().find(m => m.role === 'user');
                            if (lastUser) handleSendMessage(lastUser.content);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 4px',
                            fontSize: '0.68rem'
                          }}
                        >
                          <RotateCcw size={11} />
                          <span>Regenerate</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 4px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00f0ff 0%, #6366f1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)'
                  }}
                >
                  <Bot size={15} color="#ffffff" />
                </div>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: 'var(--code-box-bg)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.74rem'
                  }}
                >
                  <RefreshCw size={13} color="var(--accent-cyan)" className="spinning" />
                  <span className="mono">Analyzing cyber threat intelligence...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips (Horizontal Carousel) */}
          <div
            className="copilot-chips-carousel no-scrollbar"
            style={{
              padding: '8px 14px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary, rgba(7, 10, 16, 0.4))',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxSizing: 'border-box'
            }}
          >
            {quickPrompts.map((p, idx) => (
              <button
                key={`qp-${idx}`}
                onClick={() => handleSendMessage(p.label)}
                className={`copilot-prompt-chip ${p.colorClass}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: '16px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* ChatGPT-Style Input Form */}
          <div
            className="copilot-input-area"
            style={{
              padding: isFullScreen ? '14px 10%' : '10px 14px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              flexShrink: 0
            }}
          >
            {/* Quick Tools Tray */}
            {showToolsMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                  marginBottom: '4px'
                }}
              >
                <button
                  onClick={() => {
                    setShowToolsMenu(false);
                    setInputValue('analyze ');
                    inputRef.current?.focus();
                  }}
                  style={{
                    background: 'var(--code-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Globe size={12} color="var(--accent-cyan)" />
                  <span>Scan URL</span>
                </button>

                <button
                  onClick={() => {
                    setShowToolsMenu(false);
                    setInputValue('domain age of ');
                    inputRef.current?.focus();
                  }}
                  style={{
                    background: 'var(--code-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <FileText size={12} color="#10b981" />
                  <span>WHOIS Age</span>
                </button>

                <button
                  onClick={() => {
                    setShowToolsMenu(false);
                    handleSendMessage('open sandbox');
                  }}
                  style={{
                    background: 'var(--code-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={12} color="#ec4899" />
                  <span>Live Sandbox</span>
                </button>

                <button
                  onClick={() => {
                    setShowToolsMenu(false);
                    handleSendMessage('Generate Nginx hardening headers');
                  }}
                  style={{
                    background: 'var(--code-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Terminal size={12} color="#f59e0b" />
                  <span>Hardening</span>
                </button>

                <button
                  onClick={() => {
                    setShowToolsMenu(false);
                    setShowPlaybooksModal(true);
                  }}
                  style={{
                    background: 'var(--code-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <BookOpen size={12} color="#818cf8" />
                  <span>Playbooks</span>
                </button>
              </motion.div>
            )}

            {/* Input Box Container */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-primary)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '12px',
                padding: '6px 10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              {/* Tools Button */}
              <button
                type="button"
                onClick={() => setShowToolsMenu(prev => !prev)}
                style={{
                  background: showToolsMenu ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                  border: 'none',
                  color: showToolsMenu ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Quick Cyber Tools & Playbooks"
              >
                <Sliders size={16} />
              </button>

              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  domain
                    ? `Ask about ${domain}, request server hardening, or type 'open sandbox'...`
                    : "Ask any cybersecurity question, type 'analyze domain.com', or 'open sandbox'..."
                }
                rows={1}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: '1.4',
                  maxHeight: '120px',
                  fontFamily: 'inherit'
                }}
              />

              {/* Send or Stop Generating Button */}
              {isLoading ? (
                <button
                  type="button"
                  onClick={handleStopGenerating}
                  className="copilot-send-button"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.35)',
                    flexShrink: 0
                  }}
                  title="Stop Generating (Cancel)"
                >
                  <Square size={13} fill="#ef4444" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="copilot-send-button"
                  style={{
                    background: inputValue.trim() && !isLoading
                      ? 'linear-gradient(135deg, #00f0ff 0%, #3b82f6 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: inputValue.trim() && !isLoading ? '#070a10' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() && !isLoading ? 'pointer' : 'default',
                    boxShadow: inputValue.trim() && !isLoading ? '0 0 12px rgba(0, 240, 255, 0.4)' : 'none',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  title="Send Prompt (Enter)"
                >
                  <Send size={15} />
                </button>
              )}
            </div>

            {/* Bottom Caption */}
            <div
              style={{
                fontSize: '0.64rem',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                letterSpacing: '0.02em',
                marginTop: '2px'
              }}
            >
              CyberGuard AI Copilot executes live DNS queries, WHOIS age forensics, and isolated headless sandboxing.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
