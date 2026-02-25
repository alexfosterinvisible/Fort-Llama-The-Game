import { useState } from 'react';
import { T, FONT_BODY, FS, tierColor } from './theme';

// Traffic-light gradient: red → amber → green based on segment position
function segGradient(i, total) {
  const t = i / (total - 1);
  let r, g, b;
  if (t < 0.5) {
    const p = t / 0.5;
    r = 212 + (232 - 212) * p; g = 90 + (184 - 90) * p; b = 90 + (74 - 90) * p;
  } else {
    const p = (t - 0.5) / 0.5;
    r = 232 + (90 - 232) * p; g = 184; b = 74 + (122 - 74) * p;
  }
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

// 25-segment horizontal coverage bar
export function SegBar({ value, max = 100, threshold, tierLabel }) {
  const segs = 25;
  const filled = Math.round((Math.min(value, max) / max) * segs);
  const threshSeg = threshold ? Math.round((threshold / max) * segs) : null;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ display: 'flex', gap: '1.5px', flex: 1, position: 'relative', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {Array.from({ length: segs }, (_, i) => {
        const isFilled = i < filled;
        return (
          <div key={i} style={{
            flex: 1, height: '7px',
            background: isFilled ? segGradient(i, segs) : 'rgba(154,150,144,0.08)',
            opacity: isFilled ? 0.85 + (i / segs) * 0.15 : 0.35,
          }} />
        );
      })}
      {threshSeg !== null && (
        <div style={{
          position: 'absolute', left: `${(threshSeg / segs) * 100}%`,
          top: '-2px', bottom: '-2px', width: '2px', background: T.textPrimary, opacity: 0.7,
        }} />
      )}
      {hovered && (
        <div style={{
          position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: FONT_BODY, fontSize: '12px', color: tierLabel ? tierColor(tierLabel) : T.textPrimary,
          background: T.panelBg, border: `1px solid ${T.panelBorder}`,
          padding: '2px 6px', whiteSpace: 'nowrap', zIndex: 10,
        }}>{tierLabel ? `${tierLabel} (${value})` : `${value} / ${max}`}</div>
      )}
    </div>
  );
}
