import { useState } from 'react';
import { T, FONT, FONT_BODY, FS, tierColor } from './theme';
import { PixelIcon } from './PixelIcon';

// Vertical bottom-up fill accumulator for cleanliness/maintenance/fatigue
export function MiniAccum({ value, label, tierLabel, icon, max = 100 }) {
  const [hov, setHov] = useState(false);
  const pct = Math.min(value, max) / max * 100;
  const fillColor = pct < 25 ? '#5ab87a' : pct < 50 ? '#e8b84a' : '#d45a5a';
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'default' }}>
      <div style={{
        border: `1px solid ${T.panelBorder}`, background: 'rgba(34,40,38,0.6)',
        padding: '8px 4px', position: 'relative', overflow: 'hidden', minHeight: '36px', flex: 1,
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: `${pct}%`, background: fillColor, opacity: 0.65,
        }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <PixelIcon type={icon} size={16} />
        </div>
      </div>
      <div style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textPrimary, marginTop: '4px' }}>{label}</div>
      {hov && (
        <div style={{
          position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: FONT_BODY, fontSize: '12px', color: tierColor(tierLabel),
          background: T.panelBg, border: `1px solid ${T.panelBorder}`,
          padding: '2px 6px', whiteSpace: 'nowrap', zIndex: 10,
        }}>{tierLabel} ({value}/{max})</div>
      )}
    </div>
  );
}
