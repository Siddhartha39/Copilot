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
        background: 'var(--neu-bg, #E0E5EC)',
        borderRadius: '28px',
        boxShadow: 'var(--neu-extruded)',
        border: 'none',
        padding: '24px 26px',
        margin: '0 0 24px 0',
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      {/* Header Row -> Molded Icon Well & Soft Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Neumorphic Inset Robot Icon Well */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              background: 'var(--neu-bg, #E0E5EC)',
              boxShadow: 'var(--neu-inset)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Bot size={24} color="#6C63FF" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '1.02rem',
                  fontWeight: 800,
                  color: 'var(--neu-foreground, #3D4852)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: '-0.02em'
                }}
              >
                Autonomous Cyber Intelligence Agent
              </span>
              <span
                style={{
                  fontSize: '0.64rem',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: 'var(--neu-bg, #E0E5EC)',
                  boxShadow: 'var(--neu-inset-sm)',
                  fontWeight: 800,
                  color: '#10B981',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              >
                100% FREE &amp; OPEN
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--neu-muted, #6B7280)', marginTop: '2px', fontWeight: 600 }}>
              Target: <span style={{ color: '#6C63FF', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{targetUrl || 'Ready for URL analysis'}</span>
            </div>
          </div>
        </div>

        {/* Status Indicator -> Soft Raised Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.74rem',
              color: '#10B981',
              background: 'var(--neu-bg, #E0E5EC)',
              boxShadow: 'var(--neu-extruded-sm)',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }} />
            <span>AGENT ACTIVE &amp; UNRESTRICTED</span>
          </div>
        </div>
      </div>

      {/* Workflow Stage Grid -> Soft Molded Neumorphic Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';

          let stageColor = '#10B981';
          let StatusIcon = CheckCircle2;

          if (isRunning) {
            stageColor = '#6C63FF';
            StatusIcon = Loader2;
          } else if (step.status === 'paused_for_payment') {
            stageColor = '#F59E0B';
            StatusIcon = Coins;
          } else if (!isCompleted) {
            stageColor = '#9CA3AF';
            StatusIcon = Cpu;
          }

          return (
            <div
              key={step.id}
              style={{
                background: 'var(--neu-bg, #E0E5EC)',
                boxShadow: isRunning ? 'var(--neu-inset)' : 'var(--neu-extruded-sm)',
                borderRadius: '20px',
                border: 'none',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                {/* Stage Header with Inset Icon Circle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: stageColor,
                      letterSpacing: '0.04em',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      textTransform: 'uppercase'
                    }}
                  >
                    STAGE {idx + 1}: {step.stage}
                  </span>

                  {/* Neumorphic Inset Circle Icon Well */}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--neu-bg, #E0E5EC)',
                      boxShadow: isRunning ? 'var(--neu-extruded-xs)' : 'var(--neu-inset-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <StatusIcon
                      size={15}
                      color={stageColor}
                      className={isRunning ? 'animate-spin' : ''}
                    />
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    color: isRunning ? '#6C63FF' : 'var(--neu-foreground, #3D4852)',
                    marginBottom: '6px',
                    lineHeight: 1.35,
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  {step.action}
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--neu-muted, #6B7280)',
                  lineHeight: 1.5,
                  marginTop: '8px',
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
