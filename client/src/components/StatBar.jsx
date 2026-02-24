import { T, FONT, FONT_BODY, FS } from './theme';

// Horizontal stat bar (1–20 range) used in recruit modal candidate cards
export function StatBar({ label, value, max = 20 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const barColor = value >= 14 ? T.positive : value >= 7 ? '#e8b84a' : T.negative;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: '11px', color: T.textMuted, width: '60px', flexShrink: 0, textTransform: 'uppercase' }}>{label}</span>
      <div style={{ flex: 1, height: '5px', background: 'rgba(154,150,144,0.1)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: barColor, opacity: 0.7 }} />
      </div>
      <span style={{ fontFamily: FONT_BODY, fontSize: '11px', color: T.textSecondary, width: '18px', textAlign: 'right' }}>{value}</span>
    </div>
  );
}
