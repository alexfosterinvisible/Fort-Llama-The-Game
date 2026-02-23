import { useState } from 'react';
import { T, FONT, FS } from './theme';

// Policy pill with hover tooltip showing name, status, and effect
export function PolicyChip({ policy }) {
  const [hov, setHov] = useState(false);
  const isActive = policy.active !== false;
  const accent = isActive ? T.positive : T.negative;
  const bgBase = isActive ? 'rgba(90,184,122,0.12)' : 'rgba(212,90,90,0.12)';
  const bgHov = isActive ? 'rgba(90,184,122,0.25)' : 'rgba(212,90,90,0.25)';
  const statusLabel = isActive ? 'Active' : 'Inactive';
  return (
    <span
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontSize: FS.micro, padding: '2px 6px',
        background: hov ? bgHov : bgBase,
        borderLeft: `2px solid ${accent}`,
        color: hov ? '#fff' : accent, cursor: 'default',
        position: 'relative', zIndex: hov ? 30 : 1,
        letterSpacing: '0.5px',
      }}
    >
      {policy.name}
      {hov && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
          background: T.panelBg, border: `2px solid ${T.panelBorder}`,
          padding: '8px 10px', zIndex: 30, minWidth: '160px', whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: FS.body, color: accent }}>{policy.name}</span>
            <span style={{ fontSize: FS.micro, color: T.bg, background: accent, padding: '1px 4px', marginLeft: '8px' }}>{statusLabel}</span>
          </div>
          <div style={{ height: '1px', background: T.panelBorder, marginBottom: '4px' }} />
          <div style={{ fontSize: FS.micro, color: T.textSecondary }}>{policy.effect}</div>
        </div>
      )}
    </span>
  );
}
