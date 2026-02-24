import { useState } from 'react';
import { T, FONT, FONT_BODY, FS } from './theme';
import { ModalOverlay, ModalHeader, ModalBody, ModalChip } from './ModalShell';
import { StatBar } from './StatBar';

// 3-stage recruit flow: select candidate → green commit bar → confirmation popup
export function RecruitModal({
  candidates,       // [{ id, name, age, bio, stats: { sharing, cooking, tidiness, handiness, consideration, sociability, party, work } }]
  population,
  capacity,
  hasRecruitedThisWeek,
  onInvite,         // (candidateId) => void
  onClose,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [committed, setCommitted] = useState(false);

  const noRoom = population >= capacity;
  const already = hasRecruitedThisWeek || committed;
  const selectedCandidate = selectedId ? (candidates || []).find(c => c.id === selectedId) : null;

  const handleConfirm = () => {
    if (selectedCandidate) onInvite(selectedCandidate.id);
    setShowConfirm(false);
    setCommitted(true);
    setSelectedId(null);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <ModalHeader title="Recruit" onClose={onClose} right={
        noRoom ? <ModalChip label="NO ROOM" color={T.negative} /> :
        already ? <ModalChip label="RECRUITED" color={T.positive} /> :
        <ModalChip label={`${capacity - population} BEDS FREE`} color={T.textSecondary} />
      } />
      <ModalBody>
        {noRoom ? (
          <p style={{ fontFamily: FONT, fontSize: FS.label, color: T.negative, textAlign: 'center', padding: '20px 0' }}>
            No room available. Build more bedrooms to recruit.
          </p>
        ) : already && !showConfirm ? (
          <div style={{
            padding: '10px',
            background: 'rgba(90,184,122,0.1)', border: `2px solid ${T.positive}`,
            textAlign: 'center',
          }}>
            <span style={{ fontFamily: FONT, fontSize: FS.label, color: T.positive }}>
              ✓ {committed ? 'Llama invited — arrives next week' : 'Already recruited this week.'}
            </span>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: FONT, fontSize: FS.label, color: T.textSecondary, marginBottom: '8px' }}>
              Choose 1 of these aspiring llamas.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(candidates || []).map(c => {
                const isSel = selectedId === c.id;
                return (
                  <div key={c.id} style={{
                    background: isSel ? T.accentBg : T.panelBg,
                    border: `2px solid ${isSel ? T.accent : T.panelBorder}`,
                    padding: '8px 10px', cursor: 'pointer', transition: 'border-color 0.15s',
                  }} onClick={() => !showConfirm && setSelectedId(c.id)}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                      {/* Avatar placeholder */}
                      <div style={{
                        width: '36px', height: '36px', minWidth: '36px',
                        background: T.bg, border: `2px solid ${isSel ? T.accent : T.panelBorder}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="20" height="24" viewBox="0 0 28 32">
                          <rect x="8" y="0" width="4" height="4" fill={T.textMuted} opacity="0.5"/>
                          <rect x="16" y="0" width="4" height="4" fill={T.textMuted} opacity="0.5"/>
                          <rect x="8" y="4" width="4" height="4" fill={T.textMuted} opacity="0.5"/>
                          <rect x="16" y="4" width="4" height="4" fill={T.textMuted} opacity="0.5"/>
                          <rect x="6" y="8" width="16" height="4" fill={T.textMuted} opacity="0.5"/>
                          <rect x="6" y="12" width="16" height="4" fill={T.textMuted} opacity="0.5"/>
                          <rect x="6" y="16" width="16" height="4" fill={T.textMuted} opacity="0.5"/>
                          <rect x="8" y="20" width="12" height="4" fill={T.textMuted} opacity="0.5"/>
                          <rect x="10" y="24" width="8" height="4" fill={T.textMuted} opacity="0.5"/>
                          <rect x="10" y="28" width="8" height="4" fill={T.textMuted} opacity="0.5"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                          <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>{c.name}</span>
                          <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textMuted }}>{c.age} yrs</span>
                        </div>
                        <p style={{ fontFamily: FONT_BODY, fontSize: '12px', color: T.textSecondary, lineHeight: '1.3' }}>{c.bio}</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                      {c.stats && Object.entries(c.stats).map(([stat, val]) => (
                        <StatBar key={stat} label={stat} value={val} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </ModalBody>

      {/* Pinned bottom: confirmation + invite button (outside scroll area) */}
      {!noRoom && !already && (
        <div style={{ padding: '10px 14px', borderTop: `2px solid ${T.panelBorder}`, flexShrink: 0 }}>
          {showConfirm && selectedCandidate ? (
            <div>
              <p style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary, marginBottom: '4px' }}>
                Confirm recruit
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: '12px', color: T.textSecondary, marginBottom: '8px', lineHeight: '1.4' }}>
                Invite <span style={{ color: T.textPrimary }}>{selectedCandidate.name}</span> to join the commune.
                This uses your recruit action for the week — they'll arrive next week.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div onClick={handleConfirm} style={{
                  flex: 2, padding: '5px', textAlign: 'center', cursor: 'pointer',
                  background: T.positive, border: `2px solid ${T.positive}`,
                  fontFamily: FONT, fontSize: FS.label, color: T.bg,
                }}>Confirm</div>
                <div onClick={() => setShowConfirm(false)} style={{
                  flex: 1, padding: '5px', textAlign: 'center', cursor: 'pointer',
                  background: T.negative, border: `2px solid ${T.negative}`,
                  fontFamily: FONT, fontSize: FS.label, color: T.bg,
                }}>Cancel</div>
              </div>
            </div>
          ) : (
            <div onClick={() => selectedId && setShowConfirm(true)} style={{
              padding: '7px', textAlign: 'center',
              cursor: selectedId ? 'pointer' : 'default',
              background: selectedId ? T.positive : T.buttonBg,
              border: `2px solid ${selectedId ? T.positive : T.panelBorder}`,
              fontFamily: FONT, fontSize: FS.label,
              color: selectedId ? T.bg : T.textMuted,
              opacity: selectedId ? 1 : 0.5,
            }}>Invite {selectedCandidate ? selectedCandidate.name : '...'}</div>
          )}
        </div>
      )}
    </ModalOverlay>
  );
}
