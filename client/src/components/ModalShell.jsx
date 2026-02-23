import { T, FONT, FS } from './theme';

// Full-screen overlay with click-outside-to-close
export function ModalOverlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(40,40,40,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.panelBg, border: `2px solid ${T.panelBorder}`,
        width: '100%', maxWidth: '540px', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}>
        {children}
      </div>
    </div>
  );
}

// Modal header with title, optional right-side chips, and close button
export function ModalHeader({ title, onClose, right }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px',
      borderBottom: `2px solid ${T.panelBorder}`,
      background: T.actionBg,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: FONT, fontSize: FS.heading, color: T.accent, letterSpacing: '1px' }}>{title}</span>
        {right && <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>{right}</div>}
      </div>
      <div onClick={onClose} style={{
        width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', border: `1px solid ${T.panelBorder}`,
        fontFamily: FONT, fontSize: FS.body, color: T.textMuted,
      }}>✕</div>
    </div>
  );
}

// Scrollable modal body
export function ModalBody({ children }) {
  return <div className="fl-scroll" style={{ padding: '14px', overflowY: 'auto', flex: 1 }}>{children}</div>;
}

// Small label chip used in modal headers
export function ModalChip({ label, color = T.textMuted, bg }) {
  return (
    <span style={{
      fontFamily: FONT, fontSize: FS.micro, color: color,
      background: bg || 'rgba(255,255,255,0.06)', padding: '2px 6px',
      border: `1px solid ${color}33`,
    }}>{label}</span>
  );
}
