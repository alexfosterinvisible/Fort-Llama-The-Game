import { useState } from 'react';
import { T, FONT, FONT_BODY, FS } from './theme';
import { ModalOverlay, ModalHeader, ModalBody, ModalChip } from './ModalShell';

// Checkbox-led policy toggle with batch commit flow
export function PoliciesModal({
  allPolicies,        // [{ id, name, effect, primitive, active, unlocked }]
  policySlots,
  policyChangesLeft,
  onApplyChanges,     // (policyIds[]) => void
  onClose,
}) {
  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [committed, setCommitted] = useState(false);

  const visiblePolicies = (allPolicies || []).filter(p => p.unlocked);
  const activeCount = (allPolicies || []).filter(p => p.active).length;
  const canChange = policyChangesLeft > 0 && !committed;
  const changesRemaining = Math.max(0, policyChangesLeft - pendingChanges.size);

  const handleToggle = (p) => {
    if (!canChange) return;
    const next = new Set(pendingChanges);
    if (next.has(p.id)) {
      next.delete(p.id);
    } else {
      if (changesRemaining <= 0) return;
      next.add(p.id);
    }
    setPendingChanges(next);
    setShowConfirm(false);
  };

  const handleConfirm = () => {
    if (pendingChanges.size > 0) onApplyChanges([...pendingChanges]);
    setShowConfirm(false);
    setCommitted(true);
    setPendingChanges(new Set());
  };

  // Preview what active count would be after pending changes
  const previewActiveCount = (() => {
    let count = activeCount;
    for (const id of pendingChanges) {
      const p = visiblePolicies.find(v => v.id === id);
      if (p) count += p.active ? -1 : 1;
    }
    return count;
  })();

  return (
    <ModalOverlay onClose={onClose}>
      <ModalHeader title="Policies" onClose={onClose} right={<>
        <ModalChip label={`${pendingChanges.size > 0 ? previewActiveCount : activeCount}/${policySlots} ACTIVE`} color={previewActiveCount > policySlots ? T.negative : T.textSecondary} />
        <ModalChip label={committed ? '0 CHANGES LEFT' : `${changesRemaining} CHANGE${changesRemaining !== 1 ? 'S' : ''} LEFT`} color={changesRemaining === 0 || committed ? T.negative : T.textSecondary} />
      </>} />
      <ModalBody>
        {visiblePolicies.length > 0 ? (
          <p style={{ fontFamily: FONT, fontSize: FS.label, color: T.textMuted, marginBottom: '12px' }}>
            Toggle policies to improve your commune. More than 3 active reduces Fun.
          </p>
        ) : (
          <p style={{ fontFamily: FONT, fontSize: FS.label, color: T.textMuted, textAlign: 'center', padding: '20px 0' }}>
            Research Technologies to unlock Policies for the Fort.
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {visiblePolicies.map(p => {
            const isPending = pendingChanges.has(p.id);
            const willBeActive = isPending ? !p.active : p.active;
            const isActive = p.active;
            const atLimit = !isPending && changesRemaining <= 0;
            const checkColor = isPending
              ? (willBeActive ? T.positive : T.negative)
              : (isActive ? T.positive : T.panelBorder);
            return (
              <div key={p.id} onClick={() => canChange && !atLimit && handleToggle(p)} style={{
                background: isPending ? T.accentBg : T.panelBg,
                border: `2px solid ${isPending ? T.accent : 'transparent'}`,
                padding: '10px',
                cursor: canChange && (!atLimit || isPending) ? 'pointer' : 'default',
                opacity: atLimit && !isPending ? 0.5 : 1,
                display: 'flex', gap: '10px', alignItems: 'flex-start',
                transition: 'border-color 0.15s, background 0.15s',
              }}>
                {/* Checkbox */}
                <div style={{
                  width: '18px', height: '18px', minWidth: '18px', marginTop: '1px',
                  border: `2px solid ${checkColor}`,
                  background: (isPending ? willBeActive : isActive) ? checkColor : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {(isPending ? willBeActive : isActive) && (
                    <span style={{ fontFamily: FONT, fontSize: FS.label, color: T.bg, lineHeight: 1 }}>✓</span>
                  )}
                </div>
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>{p.name}</span>
                      <ModalChip label={p.primitive?.toUpperCase() || ''} color={T.textMuted} />
                    </div>
                    {isPending && (
                      <span style={{ fontFamily: FONT, fontSize: FS.body, color: willBeActive ? T.positive : T.negative }}>
                        → {willBeActive ? 'ON' : 'OFF'}
                      </span>
                    )}
                    {!isPending && isActive && (
                      <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.positive }}>ON</span>
                    )}
                  </div>
                  <p style={{ fontFamily: FONT_BODY, fontSize: '12px', color: T.textMuted }}>{p.effect}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation popup */}
        {showConfirm && pendingChanges.size > 0 && (
          <div style={{
            marginTop: '12px', padding: '14px',
            background: T.bg, border: `2px solid ${T.negative}`,
          }}>
            <p style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary, marginBottom: '8px' }}>
              Confirm {pendingChanges.size} policy change{pendingChanges.size !== 1 ? 's' : ''}
            </p>
            <div style={{ marginBottom: '12px' }}>
              {[...pendingChanges].map(id => {
                const p = visiblePolicies.find(v => v.id === id);
                if (!p) return null;
                return (
                  <p key={id} style={{ fontFamily: FONT_BODY, fontSize: '12px', color: T.textSecondary, lineHeight: '1.5' }}>
                    {p.active ? 'Deactivate' : 'Activate'} <span style={{ color: T.textPrimary }}>{p.name}</span>
                  </p>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div onClick={handleConfirm} style={{
                flex: 2, padding: '6px', textAlign: 'center', cursor: 'pointer',
                background: T.positive, border: `2px solid ${T.positive}`,
                fontFamily: FONT, fontSize: FS.label, color: T.bg,
              }}>Confirm</div>
              <div onClick={() => setShowConfirm(false)} style={{
                flex: 1, padding: '6px', textAlign: 'center', cursor: 'pointer',
                background: T.negative, border: `2px solid ${T.negative}`,
                fontFamily: FONT, fontSize: FS.label, color: T.bg,
              }}>Cancel</div>
            </div>
          </div>
        )}

        {/* Post-commit confirmation */}
        {committed && (
          <div style={{
            marginTop: '12px', padding: '10px',
            background: 'rgba(90,184,122,0.1)', border: `2px solid ${T.positive}`,
            textAlign: 'center',
          }}>
            <span style={{ fontFamily: FONT, fontSize: FS.label, color: T.positive }}>
              ✓ Policy changes applied
            </span>
          </div>
        )}

        {/* Commit button */}
        {pendingChanges.size > 0 && !showConfirm && !committed && (
          <div style={{ marginTop: '12px' }}>
            <div onClick={() => setShowConfirm(true)} style={{
              padding: '8px', textAlign: 'center', cursor: 'pointer',
              background: T.positive, border: `2px solid ${T.positive}`,
              fontFamily: FONT, fontSize: FS.label, color: T.bg,
            }}>Apply {pendingChanges.size} change{pendingChanges.size !== 1 ? 's' : ''}</div>
          </div>
        )}
      </ModalBody>
    </ModalOverlay>
  );
}
