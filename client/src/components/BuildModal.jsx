import { useState } from 'react';
import { T, FONT, FS } from './theme';
import { ModalOverlay, ModalHeader, ModalBody, ModalChip } from './ModalShell';
import { BuildingIcon } from './PixelIcon';

// 3-stage build flow: select building → green commit bar → confirmation popup
export function BuildModal({
  buildableBuildings,  // [{ id, name, cost, capacity, groundRent (number), utilities (number) }]
  buildsThisWeek,
  buildsPerWeek,
  treasury,
  debtLimit,           // game over limit (e.g. -5000)
  onBuild,             // (buildingId) => void
  onClose,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [built, setBuilt] = useState(false);

  const remaining = buildsPerWeek - buildsThisWeek;
  const canBuild = remaining > 0 && !built;
  const limit = debtLimit ?? -5000;
  const selectedBuilding = selectedId ? (buildableBuildings || []).find(b => b.id === selectedId) : null;
  const canAfford = selectedBuilding ? treasury - selectedBuilding.cost >= limit : false;

  const handleConfirm = () => {
    if (selectedBuilding) onBuild(selectedBuilding.id);
    setShowConfirm(false);
    setBuilt(true);
    setSelectedId(null);
  };

  const Stat = ({ label, value, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textMuted }}>{label}</span>
      <span style={{ fontFamily: FONT, fontSize: FS.micro, color: color || T.textSecondary }}>{value}</span>
    </div>
  );

  return (
    <ModalOverlay onClose={onClose}>
      <ModalHeader title="Build" onClose={onClose} right={
        <ModalChip label={built ? '0 REMAINING' : `${remaining} REMAINING`} color={canBuild ? T.textSecondary : T.negative} />
      } />
      <ModalBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {(buildableBuildings || []).map(b => {
            const isSel = selectedId === b.id;
            const affordable = treasury - b.cost >= limit;
            return (
              <div key={b.id} style={{
                background: isSel ? T.accentBg : T.panelBg,
                border: `2px solid ${isSel ? T.accent : T.panelBorder}`,
                padding: '8px 10px', cursor: canBuild && affordable ? 'pointer' : 'default',
                opacity: !canBuild ? 0.6 : (!affordable ? 0.5 : 1),
                transition: 'border-color 0.15s, background 0.15s',
              }} onClick={() => canBuild && affordable && setSelectedId(b.id)}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '36px', height: '36px', minWidth: '36px',
                    background: T.bg, border: `2px solid ${isSel ? T.accent : T.panelBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BuildingIcon buildingId={b.id} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>{b.name}</span>
                      <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>£{b.cost}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px 12px', marginTop: '6px', paddingTop: '6px', borderTop: `1px solid ${isSel ? T.accent + '44' : T.panelBorder}` }}>
                  <Stat label="Capacity" value={`+${b.capacity} beds`} />
                  <Stat label="Ground Rent" value={b.groundRent ? `+£${b.groundRent}/wk` : '—'} color={b.groundRent ? T.negative : T.textMuted} />
                  <Stat label="Utilities" value={b.utilities ? `+£${b.utilities}/wk` : '—'} color={b.utilities ? T.negative : T.textMuted} />
                </div>
                {!affordable && (
                  <div style={{ fontFamily: FONT, fontSize: FS.micro, color: T.negative, textAlign: 'right', marginTop: '4px' }}>Exceeds debt limit</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Confirmation popup */}
        {showConfirm && selectedBuilding && (
          <div style={{
            marginTop: '10px', padding: '10px 14px',
            background: T.bg, border: `2px solid ${T.negative}`,
          }}>
            <p style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary, marginBottom: '4px' }}>
              Confirm build
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: T.textSecondary, marginBottom: '8px', lineHeight: '1.4' }}>
              Build <span style={{ color: T.textPrimary }}>{selectedBuilding.name}</span> for <span style={{ color: T.textPrimary }}>£{selectedBuilding.cost}</span>.
              This uses your build action for the week and permanently increases ground rent and utilities.
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
        )}

        {/* Post-build success */}
        {built && (
          <div style={{
            marginTop: '10px', padding: '10px',
            background: 'rgba(90,184,122,0.1)', border: `2px solid ${T.positive}`,
            textAlign: 'center',
          }}>
            <span style={{ fontFamily: FONT, fontSize: FS.label, color: T.positive }}>
              ✓ Building under construction — ready next week
            </span>
          </div>
        )}

        {/* Build button */}
        {!showConfirm && !built && (
          <div style={{ marginTop: '10px' }}>
            <div onClick={() => selectedId && canAfford && setShowConfirm(true)} style={{
              padding: '7px', textAlign: 'center',
              cursor: selectedId && canAfford ? 'pointer' : 'default',
              background: selectedId && canAfford ? T.positive : T.buttonBg,
              border: `2px solid ${selectedId && canAfford ? T.positive : T.panelBorder}`,
              fontFamily: FONT, fontSize: FS.label,
              color: selectedId && canAfford ? T.bg : T.textMuted,
              opacity: selectedId && canAfford ? 1 : 0.5,
            }}>Build {selectedBuilding ? `${selectedBuilding.name} · £${selectedBuilding.cost}` : '...'}</div>
          </div>
        )}
      </ModalBody>
    </ModalOverlay>
  );
}
