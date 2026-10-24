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
        background: 'var(--bg-card, #FFFFFF)',
        borderRadius: '0px',
        boxShadow: '8px 8px 0px 0px #000000',
        border: '4px solid #000000',
        padding: '22px 24px',
        margin: '0 0 24px 0',
        fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '0px',
              background: '#38BDF8',
              border: '2.5px solid #000000',
              boxShadow: '2px 2px 0px 0px #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Cpu size={18} color="#000000" />
          </div>
          <h3
            style={{
              fontSize: '0.94rem',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '0.02em',
              fontFamily: "'Space Grotesk', sans-serif",
              margin: 0
            }}
          >
            MULTI-STAGE INTELLIGENCE PIPELINE EXECUTION
          </h3>
        </div>
        <span
          style={{
            fontSize: '0.74rem',
            color: '#000000',
            fontWeight: 800,
            background: '#C4B5FD',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px 0px #000000',
            padding: '4px 12px',
            borderRadius: '0px',
            fontFamily: "'Space Grotesk', sans-serif"
          }}
        >
          {currentStepIndex >= 0 && currentStepIndex < steps.length
            ? `STAGE 0${currentStepIndex + 1} OF 0${steps.length}`
            : currentStepIndex >= steps.length
            ? 'PIPELINE COMPLETE // ALL SIGNALS FUSED'
            : 'STANDBY // READY'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isWarning = step.status === 'warning';
          const isLocked = step.status === 'locked';

          let StatusIcon = CheckCircle2;
          let iconColor = '#000000';
          let iconBg = '#6BCB77';

          if (isRunning) {
            StatusIcon = Loader2;
            iconColor = '#38BDF8';
            iconBg = '#000000';
          } else if (isWarning) {
            StatusIcon = AlertTriangle;
            iconColor = '#000000';
            iconBg = '#38BDF8';
          } else if (isLocked) {
            StatusIcon = Lock;
            iconColor = '#000000';
            iconBg = '#E2E8F0';
          } else if (!isCompleted) {
            StatusIcon = CircleDot;
            iconColor = '#64748B';
            iconBg = '#F8FAFC';
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
                borderRadius: '0px',
                border: '3px solid #000000',
                background: isRunning ? '#FFFBEB' : (isCompleted ? '#F0FDF4' : '#FFFFFF'),
                boxShadow: isRunning ? '5px 5px 0px 0px #000000' : '4px 4px 0px 0px #000000',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: isLocked && onUnlock ? 'pointer' : 'default'
              }}
            >
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
                  flexShrink: 0,
                  marginTop: '1px'
                }}
              >
                <StatusIcon size={14} color={iconColor} className={isRunning ? 'animate-spin' : ''} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    color: isRunning ? '#B45309' : '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                >
                  <span>0{idx + 1}. {step.name}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#334155', marginTop: '3px', lineHeight: 1.35, fontWeight: 500 }}>
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
