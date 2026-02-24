import { useState } from 'react';
import { T, FONT_BODY, FS } from './theme';

// Treasury line with optional hover breakdown popup
export function TreasuryRow({ label, val, color, breakdown }) {
  const [hov, setHov] = useState(false);
  const total = breakdown ? breakdown.reduce((s, b) => s + b.amount, 0) : 0;
  const isExpense = label === 'Expenses';
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', justifyContent: 'space-between', padding: '3px 0',
        borderBottom: `1px solid ${T.panelBorder}`, position: 'relative',
        background: hov && breakdown ? 'rgba(212,160,53,0.05)' : 'transparent',
        cursor: 'default',
      }}
    >
      <span style={{ fontFamily: FONT_BODY, fontSize: '13px', color: T.textSecondary }}>{label}</span>
      <span style={{ fontFamily: FONT_BODY, fontSize: '15px', color }}>{val}</span>
      {hov && breakdown && breakdown.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          background: T.panelBg, border: `2px solid ${T.panelBorder}`,
          padding: '8px 10px', zIndex: 20, minWidth: '180px', whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: FS.body, color: T.textPrimary, marginBottom: '6px' }}>
            {label} Breakdown
          </div>
          <div style={{ height: '1px', background: T.panelBorder, marginBottom: '6px' }} />
          {breakdown.map((b, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', padding: '2px 0' }}>
              <span style={{ fontSize: FS.label, color: T.textSecondary }}>{b.label}</span>
              <span style={{ fontSize: FS.label, color }}>{isExpense ? '-' : ''}£{b.amount}</span>
            </div>
          ))}
          <div style={{ height: '1px', background: T.panelBorder, margin: '6px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            <span style={{ fontSize: FS.label, color: T.textPrimary }}>Total</span>
            <span style={{ fontSize: FS.body, color }}>{isExpense ? '-' : ''}£{total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
