import { useState } from 'react';
import { T, FONT, FS } from './theme';

// 2×2 action button with glow effect + spent overlay
export function ActionButton({ label, icon, spent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? T.buttonHover : T.buttonBg, border: `2px solid ${T.buttonBorder}`,
      padding: '8px 6px', textAlign: 'center', cursor: 'pointer', position: 'relative', transition: 'background 0.15s, opacity 0.15s',
      opacity: spent ? 0.4 : 1,
    }}>
      <div style={{ fontSize: FS.display, marginBottom: '3px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <div style={{ fontFamily: FONT, fontSize: FS.label, color: T.textPrimary, textShadow: spent ? 'none' : `0 0 6px ${T.accent}88, 0 0 12px ${T.accent}44` }}>{label}</div>
      {spent && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(40,40,40,0.6)',
        }}>
          <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.positive }}>✓</span>
        </div>
      )}
    </div>
  );
}
