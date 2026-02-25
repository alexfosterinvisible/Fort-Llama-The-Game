import { useState } from 'react';
import { T, FONT, FONT_BODY, FS } from './theme';

// Name tag with skill hover popup showing all resident stats
export function ResidentChip({ resident }) {
  const [hov, setHov] = useState(false);
  const hasSkills = resident.skills && Object.keys(resident.skills).length > 0;
  return (
    <span
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: FONT_BODY, fontSize: '13px', padding: '4px 8px',
        border: `1px solid ${hov ? T.accent : T.panelBorderLight}`,
        background: hov ? 'rgba(212,160,53,0.1)' : 'rgba(154,150,144,0.04)',
        color: T.textPrimary, cursor: 'default',
        position: 'relative', zIndex: hov ? 30 : 1,
      }}
    >
      {resident.name}
      {hov && hasSkills && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
          background: T.panelBg, border: `2px solid ${T.panelBorder}`,
          padding: '8px 10px', zIndex: 30, minWidth: '150px', whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontFamily: FONT, fontSize: FS.body, color: T.accent, marginBottom: '4px', textAlign: 'center' }}>{resident.name}</div>
          <div style={{ height: '1px', background: T.panelBorder, marginBottom: '4px' }} />
          {Object.entries(resident.skills).map(([skill, val]) => (
            <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '1px 0' }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: '12px', color: T.textSecondary, textTransform: 'uppercase' }}>{skill}</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: '13px', color: val > 0 ? T.positive : val < 0 ? T.negative : T.textSecondary }}>
                {val > 0 ? `+${val}` : val}
              </span>
            </div>
          ))}
        </div>
      )}
    </span>
  );
}
