import { useState } from 'react';
import { T, FONT, FONT_BODY, FS } from './theme';
import { ModalOverlay, ModalHeader, ModalBody, ModalChip } from './ModalShell';

// Checkbox-led policy toggle with commit flow
export function PoliciesModal({
  allPolicies,        // [{ id, name, effect, primitive, active, unlocked }]
  policySlots,
  policyChangesLeft,
  onTogglePolicy,     // (policyId) => void
  onClose,
}) {
  const [pendingId, setPendingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [committed, setCommitted] = useState(false);

  const visiblePolicies = (allPolicies || []).filter(p => p.unlocked);
  const activeCount = (allPolicies || []).filter(p => p.active).length;
  const pendingPolicy = pendingId ? visiblePolicies.find(p => p.id === pendingId) : null;
  const pendingAction = pendingPolicy ? (pendingPolicy.active ? 'Deactivate' : 'Activate') : '';
  const canChange = policyChangesLeft > 0 && !committed;

  const handleToggle = (p) => {
    if (!canChange) return;
    setPendingId(pendingId === p.id ? null : p.id);
    setShowConfirm(false);
  };

  const handleConfirm = () => {
    if (pendingPolicy) onTogglePolicy(pendingPolicy.id);
    setShowConfirm(false);
    setCommitted(true);
    setPendingId(null);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <ModalHeader title="Policies" onClose={onClose} right={<>
        <ModalChip label={`${activeCount}/${policySlots} ACTIVE`} color={activeCount > policySlots ? T.negative : T.textSecondary} />
        <ModalChip label={committed ? '0 CHANGES LEFT' : `${policyChangesLeft} CHANGE LEFT`} color={!canChange ? T.negative : T.textSecondary} />
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
            const isPending = pendingId === p.id;
            const willBeActive = isPending ? !p.active : p.active;
            const isActive = p.active;
            const checkColor = isPending
              ? (willBeActive ? T.positive : T.negative)
              : (isActive ? T.positive : T.panelBorder);
            return (
              <div key={p.id} onClick={() => canChange && handleToggle(p)} style={{
                background: isPending ? T.accentBg : T.panelBg,
                border: `2px solid ${isPending ? T.accent : 'transparent'}`,
                padding: '10px',
                cursor: canChange ? 'pointer' : 'default',
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
        {showConfirm && pendingPolicy && (
          <div style={{
            marginTop: '12px', padding: '14px',
            background: T.bg, border: `2px solid ${T.negative}`,
          }}>
            <p style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary, marginBottom: '8px' }}>
              Confirm policy change
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: '12px', color: T.textSecondary, marginBottom: '12px', lineHeight: '1.5' }}>
              {pendingAction} <span style={{ color: T.textPrimary }}>{pendingPolicy.name}</span>.
              This uses your policy change for the week — you won't be able to make another until next week.
            </p>
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
              ✓ Policy change applied
            </span>
          </div>
        )}

        {/* Commit button */}
        {pendingId && !showConfirm && !committed && (
          <div style={{ marginTop: '12px' }}>
            <div onClick={() => setShowConfirm(true)} style={{
              padding: '8px', textAlign: 'center', cursor: 'pointer',
              background: T.positive, border: `2px solid ${T.positive}`,
              fontFamily: FONT, fontSize: FS.label, color: T.bg,
            }}>{pendingAction} {pendingPolicy.name}</div>
          </div>
        )}
      </ModalBody>
    </ModalOverlay>
  );
}
