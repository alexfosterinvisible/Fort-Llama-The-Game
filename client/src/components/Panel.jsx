import { T, FONT, FS } from './theme';

export function Panel({ children, style = {} }) {
  return (
    <div style={{ background: T.panelBg, border: `2px solid ${T.panelBorder}`, padding: '10px', ...style }}>
      {children}
    </div>
  );
}

export function PanelTitle({ children, color, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <span style={{ fontFamily: FONT, fontSize: FS.heading, color: color || T.accent, letterSpacing: '1px' }}>{children}</span>
      {right}
    </div>
  );
}
