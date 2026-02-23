import { useState } from 'react';
import { T, FONT, FS, BUDGET_DISPLAY } from './theme';
import { PixelIcon } from './PixelIcon';
import { ActionButton } from './ActionButton';

// Left sidebar: clock, action buttons, rent slider, budgets accordion, game controls
export function ActionPanel({
  week, day, time,
  hasRecruitedThisWeek, buildsThisWeek, buildsPerWeek,
  policyChangesLeft, researchingTech,
  rent, rentTier, rentMin, rentMax, rentStep,
  budgets,             // { [key]: currentValue }
  budgetConfig,        // { [key]: { floor, ceiling } } for stepper bounds
  isPaused,
  onOpenModal,         // (modalName) => void
  onRentChange,        // (value) => void
  onRentRelease,       // () => void
  onBudgetStep,        // (key, delta) => void
  onStartWeek,         // () => void
  onRestart,           // () => void
}) {
  const [actionOpen, setActionOpen] = useState(true);
  const [budgetsOpen, setBudgetsOpen] = useState(true);

  const budgetEntries = Object.entries(budgets || {});
  const totalBudget = budgetEntries.reduce((s, [, v]) => s + v, 0);

  // Collapsed state — thin stripe with expand arrow
  if (!actionOpen) {
    return (
      <div onClick={() => setActionOpen(true)} style={{
        width: '36px', flexShrink: 0, background: T.actionBg,
        borderRight: `2px solid ${T.panelBorder}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: '10px', cursor: 'pointer', gap: '8px',
      }}>
        <span style={{ fontFamily: FONT, fontSize: FS.brand, color: T.accent }}>►</span>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, minWidth: '180px', maxWidth: '300px', borderRight: `2px solid ${T.panelBorder}`,
      background: T.actionBg, padding: '10px',
      display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto',
    }}>
      {/* Collapse toggle */}
      <div onClick={() => setActionOpen(false)} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', padding: '2px 0 4px', borderBottom: `1px solid ${T.panelBorder}`, marginBottom: '10px',
        }}>
          <span style={{ fontFamily: FONT, fontSize: FS.heading, color: T.accent, letterSpacing: '1px' }}>Actions</span>
          <span style={{ fontFamily: FONT, fontSize: FS.label, color: T.textMuted }}>◄ Hide</span>
        </div>

      {/* Clock */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        padding: '6px 8px',
        background: T.panelBg, border: `2px solid ${T.panelBorder}`,
      }}>
        <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textSecondary }}>Wk {week}</span>
        <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>{day}</span>
        <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary, letterSpacing: '1px' }}>{time}</span>
      </div>

      {/* 2×2 Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <ActionButton label="Recruit" icon={<PixelIcon type="recruit" color={T.accentBright} />}
          spent={hasRecruitedThisWeek} onClick={() => onOpenModal('recruit')} />
        <ActionButton label="Build" icon={<PixelIcon type="build" color={T.accentBright} />}
          spent={buildsThisWeek >= buildsPerWeek} onClick={() => onOpenModal('build')} />
        <ActionButton label="Policies" icon={<PixelIcon type="policies" color={T.accentBright} />}
          spent={policyChangesLeft <= 0} onClick={() => onOpenModal('policies')} />
        <ActionButton label="Research" icon={<PixelIcon type="research" color={T.accentBright} />}
          spent={!!researchingTech} onClick={() => onOpenModal('research')} />
      </div>

      {/* Rent slider */}
      <div style={{ background: T.panelBg, border: `2px solid ${T.panelBorder}`, padding: '8px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          <span style={{ fontFamily: FONT, fontSize: FS.heading, color: '#fff' }}>Rent</span>
          <span style={{ fontFamily: FONT, fontSize: FS.display, color: '#fff' }}>£{rent}</span>
        </div>
        <input className="fl-rent" type="range"
          min={rentMin || 50} max={rentMax || 500} step={rentStep || 10}
          value={rent}
          onChange={e => onRentChange(Number(e.target.value))}
          onMouseUp={onRentRelease}
          onTouchEnd={onRentRelease}
        />
        <div style={{ marginTop: '6px' }}>
          <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.accent }}>{rentTier}</span>
        </div>
      </div>

      {/* Budgets accordion */}
      <div>
        <div onClick={() => setBudgetsOpen(!budgetsOpen)} style={{
          background: T.buttonBg, border: `2px solid ${T.buttonBorder}`,
          padding: '6px 8px', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>Budgets</span>
          <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textSecondary }}>{budgetsOpen ? '▼' : '►'}</span>
        </div>
        {budgetsOpen && (
          <div style={{ background: T.panelBg, border: `2px solid ${T.panelBorder}`, borderTop: 'none', padding: '6px' }}>
            {budgetEntries.map(([key, value], i) => {
              const display = BUDGET_DISPLAY[key] || { name: key, color: T.textSecondary };
              return (
                <div key={key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0',
                  borderBottom: i < budgetEntries.length - 1 ? '1px solid rgba(70,70,70,0.4)' : 'none',
                }}>
                  <span style={{ fontFamily: FONT, fontSize: FS.label, color: T.textSecondary, width: '52px', flexShrink: 0 }}>{display.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {['--', '-'].map(btn => (
                      <div key={btn} onClick={() => onBudgetStep(key, btn === '--' ? -10 : -5)} style={{
                        width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: T.buttonBg, border: `1px solid ${T.buttonBorder}`, cursor: 'pointer',
                        fontFamily: FONT, fontSize: FS.label, color: T.textSecondary,
                      }}>{btn}</div>
                    ))}
                    <div style={{
                      minWidth: '32px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.2)', padding: '0 3px',
                    }}>
                      <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>£{value}</span>
                    </div>
                    {['+', '++'].map(btn => (
                      <div key={btn} onClick={() => onBudgetStep(key, btn === '++' ? 10 : 5)} style={{
                        width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: T.buttonBg, border: `1px solid ${T.buttonBorder}`, cursor: 'pointer',
                        fontFamily: FONT, fontSize: FS.label, color: T.textSecondary,
                      }}>{btn}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Total — always visible */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '6px 8px',
          background: T.panelBg, border: `2px solid ${T.panelBorder}`, borderTop: 'none',
        }}>
          <span style={{ fontFamily: FONT, fontSize: FS.label, color: T.textSecondary }}>Total Budget</span>
          <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.negative }}>
            -£{totalBudget}/wk
          </span>
        </div>
      </div>

      {/* Start Week + Restart */}
      <div onClick={isPaused ? onStartWeek : undefined} style={{
        background: '#3a7a5a', padding: '10px 8px', textAlign: 'center',
        cursor: isPaused ? 'pointer' : 'default',
        border: '2px solid #5aaa7a',
        opacity: isPaused ? 1 : 0.5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: FONT, fontSize: FS.heading, color: '#fff', letterSpacing: '1px' }}>Start Week</span>
      </div>
      <div onClick={onRestart} style={{
        background: 'rgba(160,70,70,0.35)', border: '2px solid rgba(196,126,126,0.5)',
        padding: '10px 8px', textAlign: 'center', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: FONT, fontSize: FS.heading, color: T.negative, letterSpacing: '1px' }}>Restart Game</span>
      </div>
    </div>
  );
}
