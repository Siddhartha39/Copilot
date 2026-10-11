import React from 'react';
import { Bot, CheckCircle2, Loader2, ShieldAlert, Cpu, Terminal, Coins, ArrowRight } from 'lucide-react';

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
      className="glass-panel"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '22px',
        margin: '0 24px 24px 24px',
        boxShadow: 'var(--panel-shadow)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))', border: '1px solid rgba(6, 182, 212, 0.4)', borderRadius: '10px', padding: '8px', display: 'flex' }}>
            <Bot size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Autonomous Cyber Intelligence Agent</span>
              <span className="badge-info" style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px' }}>
                100% FREE & OPEN
              </span>
            </div>
            <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Target: <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{targetUrl || 'Ready for URL analysis'}</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '5px 12px', borderRadius: '20px', fontWeight: 700 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>AGENT ACTIVE &amp; UNRESTRICTED</span>
          </div>
        </div>
      </div>

      {/* Workflow Stage Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {steps.map((step, idx) => {
          let statusBorder = '1px solid var(--border-color)';
          let statusBg = 'var(--code-box-bg)';
          let statusColor = 'var(--text-secondary)';
          let StatusIcon = Cpu;

          if (step.status === 'completed') {
            statusBorder = '1.5px solid #10b981';
            statusBg = 'rgba(16, 185, 129, 0.08)';
            statusColor = '#10b981';
            StatusIcon = CheckCircle2;
          } else if (step.status === 'running') {
            statusBorder = '1.5px solid var(--accent-cyan)';
            statusBg = 'rgba(6, 182, 212, 0.08)';
            statusColor = 'var(--accent-cyan)';
            StatusIcon = Loader2;
          } else if (step.status === 'paused_for_payment') {
            statusBorder = '1.5px solid #f59e0b';
            statusBg = 'rgba(245, 158, 11, 0.08)';
            statusColor = '#f59e0b';
            StatusIcon = Coins;
          }

          return (
            <div
              key={step.id}
              style={{
                background: statusBg,
                border: statusBorder,
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                boxShadow: step.status === 'running' ? '0 0 14px rgba(6, 182, 212, 0.2)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: statusColor, letterSpacing: '0.04em' }}>
                    STAGE {idx + 1}: {step.stage}
                  </span>
                  <StatusIcon size={14} color={statusColor} className={step.status === 'running' ? 'animate-spin' : ''} />
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.35 }}>
                  {step.action}
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginTop: '8px' }}>
                {step.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
