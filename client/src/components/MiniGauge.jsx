import { useState } from 'react';
import { T, FONT, FS, tierColor } from './theme';

// Semi-circular 10-segment arc gauge for crowding/noise
export function MiniGauge({ value, label, tierLabel }) {
  const [hov, setHov] = useState(false);
  const totalSegs = 10, filled = Math.round((Math.min(value, 100) / 100) * totalSegs);
  const r = 26, cx = 38, cy = 36, sw = 7;
  const segColor = (i) => i < 4 ? '#5ab87a' : i < 7 ? '#e8b84a' : '#d45a5a';
  const gapDeg = 3, totalDeg = 180;
  const segDeg = (totalDeg - gapDeg * (totalSegs - 1)) / totalSegs;
  const toRad = (d) => (d * Math.PI) / 180;

  const segs = Array.from({ length: totalSegs }, (_, i) => {
    const startAngle = 180 + i * (segDeg + gapDeg);
    const endAngle = startAngle + segDeg;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    return { d: `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`, i };
  });

  const needleAngle = 180 + (Math.min(value, 100) / 100) * 180;
  const nx = cx + (r - sw) * Math.cos(toRad(needleAngle));
  const ny = cy + (r - sw) * Math.sin(toRad(needleAngle));

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'default' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <svg width="76" height="44" viewBox="0 0 76 44">
          {segs.map(s => (
            <path key={s.i} d={s.d} fill="none"
              stroke={s.i < filled ? segColor(s.i) : 'rgba(154,150,144,0.12)'}
              strokeWidth={sw} opacity={s.i < filled ? 1 : 0.45} />
          ))}
          <rect x={nx - 2.5} y={ny - 2.5} width="5" height="5" fill={T.textPrimary} />
          <rect x={cx - 2} y={cy - 2} width="4" height="4" fill={T.textMuted} />
        </svg>
      </div>
      <div style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textSecondary, marginTop: '4px' }}>{label}</div>
      {hov && (
        <div style={{
          position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: FONT, fontSize: FS.label, color: tierColor(tierLabel),
          background: T.panelBg, border: `1px solid ${T.panelBorder}`,
          padding: '2px 5px', whiteSpace: 'nowrap', zIndex: 10,
        }}>{tierLabel} ({value})</div>
      )}
    </div>
  );
}
