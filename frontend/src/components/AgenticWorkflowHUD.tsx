import React from 'react';
import { Bot, CheckCircle2, Loader2, Cpu, Coins } from 'lucide-react';

export interface AgenticStep {
  id: string;
  stage: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'paused_for_payment' | 'failed';
  detail?: string;
  timestamp?: string;
}

interface AgenticWorkflowHUDProps {
  currentStage: number; // 0 to 7
  targetUrl: string;
  isPaid: boolean;
  onOpenPaymentModal: () => void;
  txId?: string;
}

export const AgenticWorkflowHUD: React.FC<AgenticWorkflowHUDProps> = ({
  currentStage,
  targetUrl,
  isPaid,
  onOpenPaymentModal,
  txId
}) => {
  const steps: AgenticStep[] = [
    {
      id: 'step-1',
      stage: 'INGRESS & LEXICAL ML',
      action: 'Extracting 24-D Lexical Tensor & Shannon Entropy',
      status: currentStage > 0 ? 'completed' : currentStage === 0 ? 'running' : 'pending',
      detail: 'Evaluates URL structure, brand-in-subdomain, and character entropy in <15ms.'
    },
    {
      id: 'step-2',
      stage: 'AUTHORITATIVE RDAP & DNS',
      action: 'Querying IETF RDAP Registry & Google DoH Servers',
      status: currentStage > 1 ? 'completed' : currentStage === 1 ? 'running' : 'pending',
      detail: 'Resolves exact domain registration date, registrar name, and DNS A/NS/MX records.'
    },
    {
      id: 'step-3',
      stage: 'DECISION BOUNDARY',
      action: 'Initial Risk Calculation & Deep Audit Escalation',
      status: currentStage > 2 ? 'completed' : currentStage === 2 ? 'running' : 'pending',
      detail: 'Determines whether deep sandbox, visual logo pHash, and exploitability audit are needed.'
    },
    {
      id: 'step-4',
      stage: 'DEEP FORENSIC ESCALATION',
      action: 'Executing Zero-Cost Deep Sandbox & Vision Analysis',
      status: currentStage >= 3 ? 'completed' : 'pending',
      detail: 'Free and open-access execution: Playwright headless DOM interception and visual brand matching.'
    },
    {
      id: 'step-5',
      stage: 'ISOLATED SANDBOX & VISION',
      action: 'Executing Playwright Headless Browser & Logo pHash Matching',
      status: currentStage > 4 ? 'completed' : currentStage === 4 ? 'running' : 'pending',
      detail: 'Renders DOM in safe sandbox, intercepts form targets, and matches logos against brand catalog.'
    },
    {
      id: 'step-6',
      stage: 'SECURITY POSTURE AUDIT',
      action: 'Auditing HTTP Headers (HSTS, CSP, X-Frame) & SPF/DMARC Spoofing',
      status: currentStage > 5 ? 'completed' : currentStage === 5 ? 'running' : 'pending',
      detail: 'Calculates developer defensive grade (A+ to F) and checks clickjacking vulnerability.'
    },
    {
      id: 'step-7',
      stage: 'MULTI-SIGNAL FUSION & AI',
      action: 'Synthesizing Calibrated 0-100 Score & Threat Intelligence',
      status: currentStage >= 6 ? 'completed' : currentStage === 6 ? 'running' : 'pending',
      detail: 'Fuses all 6 vectors into calibrated risk score and generates actionable 1-click remediation.'
    }
  ];

  return (
    <div
      style={{
        background: 'var(--bg-card, #FFFFFF)',
        borderRadius: '0px',
        boxShadow: '8px 8px 0px 0px #000000',
        border: '4px solid #000000',
        padding: '24px 26px',
        margin: '0 0 24px 0',
        fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* Header Row -> Neo-Brutalist Sticker Badges & Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #000000', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Square Bot Icon Box */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '0px',
              background: '#FFD93D',
              border: '3px solid #000000',
              boxShadow: '3px 3px 0px 0px #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Bot size={24} color="#000000" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 900,
                  color: '#000000',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.01em'
                }}
              >
                Autonomous Cyber Intelligence Agent
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '3px 10px',
                  borderRadius: '0px',
                  background: '#6BCB77',
                  border: '2px solid #000000',
                  boxShadow: '2px 2px 0px 0px #000000',
                  fontWeight: 900,
                  color: '#000000',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              >
                100% FREE &amp; OPEN
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '4px', fontWeight: 600 }}>
              Target: <span style={{ color: '#000000', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", background: '#FFD93D', padding: '2px 8px', border: '1.5px solid #000000' }}>{targetUrl || 'Ready for URL analysis'}</span>
            </div>
          </div>
        </div>

        {/* Status Indicator -> Neo-Brutalist Sticker Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.76rem',
              color: '#000000',
              background: '#FFFFFF',
              border: '2px solid #000000',
              boxShadow: '3px 3px 0px 0px #000000',
              padding: '6px 14px',
              borderRadius: '0px',
              fontWeight: 800,
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span>AGENT ACTIVE &amp; UNRESTRICTED</span>
          </div>
        </div>
      </div>

      {/* Workflow Stage Grid -> Neo-Brutalist Stage Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';

          let StatusIcon = CheckCircle2;
          let iconColor = '#000000';
          let iconBg = '#6BCB77';

          if (isRunning) {
            StatusIcon = Loader2;
            iconColor = '#FFD93D';
            iconBg = '#000000';
          } else if (step.status === 'paused_for_payment') {
            StatusIcon = Coins;
            iconColor = '#000000';
            iconBg = '#FFD93D';
          } else if (!isCompleted) {
            StatusIcon = Cpu;
            iconColor = '#64748B';
            iconBg = '#F1F5F9';
          }

          return (
            <div
              key={step.id}
              style={{
                background: isRunning ? '#FFFBEB' : (isCompleted ? '#F0FDF4' : '#FFFFFF'),
                boxShadow: isRunning ? '5px 5px 0px 0px #000000' : '4px 4px 0px 0px #000000',
                borderRadius: '0px',
                border: '3px solid #000000',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                {/* Stage Header with Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      color: isRunning ? '#000000' : (isCompleted ? '#000000' : '#FFFFFF'),
                      background: isRunning ? '#FFD93D' : (isCompleted ? '#6BCB77' : '#000000'),
                      border: '1.5px solid #000000',
                      boxShadow: '2px 2px 0px 0px #000000',
                      padding: '2px 8px',
                      borderRadius: '0px',
                      letterSpacing: '0.04em',
                      fontFamily: "'Space Grotesk', sans-serif",
                      textTransform: 'uppercase'
                    }}
                  >
                    STAGE {idx + 1}: {step.stage}
                  </span>

                  {/* Square Status Icon */}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '0px',
                      background: iconBg,
                      border: '2px solid #000000',
                      boxShadow: '2px 2px 0px 0px #000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <StatusIcon
                      size={15}
                      color={iconColor}
                      className={isRunning ? 'animate-spin' : ''}
                    />
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: isRunning ? '#B45309' : '#000000',
                    marginBottom: '6px',
                    lineHeight: 1.35,
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                >
                  {step.action}
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.74rem',
                  color: '#334155',
                  lineHeight: 1.45,
                  marginTop: '10px',
                  fontWeight: 500
                }}
              >
                {step.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
