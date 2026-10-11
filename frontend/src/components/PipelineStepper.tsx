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
      className="glass-panel"
      style={{ padding: '20px 24px', margin: '0 24px 20px 24px', borderRadius: '14px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={16} color="var(--accent-cyan)" />
          <h3 className="cyber-font" style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
            MULTI-STAGE INTELLIGENCE PIPELINE EXECUTION
          </h3>
        </div>
        <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
          {currentStepIndex >= 0 && currentStepIndex < steps.length
            ? `Executing Stage 0${currentStepIndex + 1} of 0${steps.length}`
            : currentStepIndex >= steps.length
            ? 'Pipeline Complete // All Signals Fused'
            : 'Standby // Ready'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isWarning = step.status === 'warning';
          const isLocked = step.status === 'locked';

          let borderColor = '1px solid var(--border-color)';
          let bgColor = 'var(--code-box-bg)';
          let icon = <CircleDot size={17} color="var(--text-secondary)" />;

          if (isCompleted) {
            borderColor = '1.5px solid #10b981';
            bgColor = 'rgba(16, 185, 129, 0.08)';
            icon = <CheckCircle2 size={17} color="#10b981" />;
          } else if (isRunning) {
            borderColor = '1.5px solid var(--accent-cyan)';
            bgColor = 'rgba(6, 182, 212, 0.08)';
            icon = <Loader2 size={17} color="var(--accent-cyan)" className="radar-spinner" />;
          } else if (isWarning) {
            borderColor = '1.5px solid #f97316';
            bgColor = 'rgba(249, 115, 22, 0.08)';
            icon = <AlertTriangle size={17} color="#f97316" />;
          } else if (isLocked) {
            borderColor = '1px solid var(--border-color)';
            bgColor = 'var(--code-box-bg)';
            icon = <Lock size={17} color="var(--text-secondary)" />;
          }

          return (
            <motion.div
              key={step.id}
              onClick={isLocked && onUnlock ? onUnlock : undefined}
              whileHover={isLocked && onUnlock ? { scale: 1.03, borderColor: 'var(--accent-cyan)' } : undefined}
              animate={{
                scale: isRunning ? 1.02 : 1,
                borderColor: isRunning ? 'var(--accent-cyan)' : undefined
              }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: borderColor,
                background: bgColor,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: isLocked && onUnlock ? 'pointer' : 'default',
                boxShadow: isRunning ? '0 0 15px rgba(0, 240, 255, 0.25)' : isLocked ? '0 0 10px rgba(56, 189, 248, 0.15)' : 'none'
              }}
            >
              <div style={{ marginTop: '2px' }}>{icon}</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isCompleted || isRunning ? 'var(--text-primary)' : isLocked ? '#38bdf8' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>0{idx + 1}. {step.name}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: isRunning ? 'var(--accent-cyan)' : isLocked ? '#94a3b8' : 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
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
