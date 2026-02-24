import { T, FONT, FS } from './theme';
import logoSvg from '../assets/fort-llama-icon.svg';

// Fixed top bar: brand, dashboard/dev-tools tabs, vibes + score status strip
export function TopBar({ mode, view, vibes, reputation, level, score, onSwitchView }) {
  const tabs = mode === 'dev' ? ['dashboard', 'devtools'] : ['dashboard'];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', flexWrap: 'wrap',
      padding: '6px 14px', minHeight: '42px',
      background: T.actionBg, borderBottom: `2px solid ${T.panelBorder}`, gap: '8px',
      position: 'relative', zIndex: 1,
    }}>
      {/* Brand + Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <img src={logoSvg} alt="Fort Llama" style={{ width: '36px', height: '36px', imageRendering: 'pixelated' }} />
        <span style={{ fontSize: FS.brand, color: T.accentBright, letterSpacing: '2px', fontFamily: FONT }}>Fort Llama</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map(tab => {
            const active = view === tab;
            const label = tab === 'dashboard' ? 'Dashboard' : 'Dev Tools';
            return (
              <span key={tab} onClick={() => onSwitchView(tab)} style={{
                fontFamily: FONT, fontSize: FS.body, padding: '4px 10px',
                background: active ? T.accent : 'transparent',
                color: active ? '#fff' : T.textSecondary,
                border: `1px solid ${active ? T.accent : T.panelBorder}`, cursor: 'pointer',
              }}>{label}</span>
            );
          })}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Vibes + Score strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '5px 16px', flexShrink: 1, minWidth: 0, overflow: 'hidden',
        background: 'transparent', border: `1px solid ${T.accent}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
          <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textMuted, letterSpacing: '1px' }}>VIBE</span>
          <span style={{ fontFamily: FONT, fontSize: FS.brand, color: '#fff' }}>{vibes}</span>
        </div>
        <div style={{ width: '1px', height: '16px', background: T.accent }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
          <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textMuted, letterSpacing: '1px' }}>REP</span>
          <span style={{ fontFamily: FONT, fontSize: FS.brand, color: '#fff' }}>{reputation}</span>
        </div>
        <div style={{ width: '1px', height: '16px', background: T.accent }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textMuted }}>LVL</span>
          <span style={{ fontFamily: FONT, fontSize: FS.brand, color: '#fff' }}>{level}</span>
        </div>
        <div style={{ width: '1px', height: '16px', background: T.accent }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
          <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textMuted, letterSpacing: '1px' }}>SCORE</span>
          <span style={{ fontFamily: FONT, fontSize: FS.brand, color: '#fff', minWidth: '72px', textAlign: 'right' }}>{(score || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
