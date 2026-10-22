import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, CircleDot, AlertTriangle, Cpu, Lock } from 'lucide-react';

export interface PipelineStep {
  id: string;
  name: string;
  detail: string;
  status: 'idle' | 'running' | 'completed' | 'warning' | 'locked';
}

interface PipelineStepperProps {
  steps: PipelineStep[];
  currentStepIndex: number;
  onUnlock?: () => void;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({ steps, currentStepIndex, onUnlock }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'var(--neu-bg, #E0E5EC)',
        borderRadius: '24px',
        boxShadow: 'var(--neu-extruded)',
        border: 'none',
        padding: '20px 24px',
        margin: '0 0 20px 0',
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--neu-bg, #E0E5EC)',
              boxShadow: 'var(--neu-inset-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Cpu size={16} color="#6C63FF" />
          </div>
          <h3
            style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: 'var(--neu-foreground, #3D4852)',
              letterSpacing: '0.02em',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: 0
            }}
          >
            MULTI-STAGE INTELLIGENCE PIPELINE EXECUTION
          </h3>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            color: '#6C63FF',
            fontWeight: 800,
            background: 'var(--neu-bg, #E0E5EC)',
            boxShadow: 'var(--neu-inset-sm)',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}
        >
          {currentStepIndex >= 0 && currentStepIndex < steps.length
            ? `Stage 0${currentStepIndex + 1} of 0${steps.length}`
            : currentStepIndex >= steps.length
            ? 'Pipeline Complete // All Signals Fused'
            : 'Standby // Ready'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isWarning = step.status === 'warning';
          const isLocked = step.status === 'locked';

          let stepColor = '#10B981';
          let StatusIcon = CheckCircle2;

          if (isRunning) {
            stepColor = '#6C63FF';
            StatusIcon = Loader2;
          } else if (isWarning) {
            stepColor = '#F59E0B';
            StatusIcon = AlertTriangle;
          } else if (isLocked) {
            stepColor = '#9CA3AF';
            StatusIcon = Lock;
          } else if (!isCompleted) {
            stepColor = '#9CA3AF';
            StatusIcon = CircleDot;
          }

          return (
            <motion.div
              key={step.id}
              onClick={isLocked && onUnlock ? onUnlock : undefined}
              animate={{
                scale: isRunning ? 1.02 : 1
              }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '14px 14px',
                borderRadius: '16px',
                border: isRunning ? '2.5px solid #6C63FF' : '2px solid rgba(0, 0, 0, 0.12)',
                background: 'var(--neu-bg, #E0E5EC)',
                boxShadow: isRunning ? 'var(--neu-inset)' : 'var(--neu-extruded-sm)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: isLocked && onUnlock ? 'pointer' : 'default'
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--neu-bg, #E0E5EC)',
                  boxShadow: isRunning ? 'var(--neu-extruded-xs)' : 'var(--neu-inset-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}
              >
                <StatusIcon size={14} color={stepColor} className={isRunning ? 'animate-spin' : ''} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: isRunning ? '#6C63FF' : 'var(--neu-foreground, #3D4852)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  <span>0{idx + 1}. {step.name}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--neu-muted, #6B7280)', marginTop: '2px', lineHeight: 1.35, fontWeight: 500 }}>
                  {step.detail}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
