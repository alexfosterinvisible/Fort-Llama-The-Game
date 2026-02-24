import { useState } from 'react';
import { T, FONT, FONT_BODY, FS, TREE_COLORS, TREE_LABELS, TYPE_LABELS } from './theme';
import { ModalOverlay, ModalHeader, ModalBody, ModalChip } from './ModalShell';
import { TechIcon } from './PixelIcon';

// Tech tree research modal with frontier filtering and commit flow
export function ResearchModal({
  techTree,             // [{ id, name, desc, cost, type, tree, researched, available, parent }]
  researchingTech,      // currently researching tech id or null
  treasury,
  debtLimit,            // game over limit (e.g. -5000)
  onResearch,           // (techId) => void
  onCancelResearch,     // () => void
  onClose,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [committed, setCommitted] = useState(false);

  const trees = ['livingStandards', 'productivity', 'fun'];
  const alreadyResearching = !!researchingTech || committed;
  const limit = debtLimit ?? -5000;
  const selectedTech = selectedId ? (techTree || []).find(t => t.id === selectedId) : null;
  const canAffordSelected = selectedTech ? treasury - selectedTech.cost >= limit : false;

  const handleConfirm = () => {
    if (selectedTech) onResearch(selectedTech.id);
    setShowConfirm(false);
    setCommitted(true);
    setSelectedId(null);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <ModalHeader title="Research" onClose={onClose} right={
        alreadyResearching
          ? <ModalChip label="RESEARCHING..." color="#e8b84a" />
          : <ModalChip label="CHOOSE 1" color={T.textSecondary} />
      } />
      <ModalBody>
        {/* Active research banner */}
        {researchingTech && !committed && (() => {
          const rt = (techTree || []).find(t => t.id === researchingTech);
          if (!rt) return null;
          const tc = TREE_COLORS[rt.tree];
          return (
            <div style={{
              background: T.panelBg, borderLeft: `3px solid ${tc}`, padding: '10px', marginBottom: '12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>{rt.name}</span>
                <span style={{ fontFamily: FONT, fontSize: FS.micro, color: tc, marginLeft: '6px' }}>Completes next week</span>
              </div>
              <div onClick={onCancelResearch} style={{
                padding: '3px 8px', cursor: 'pointer',
                border: `1px solid ${T.panelBorder}`,
                fontFamily: FONT, fontSize: FS.micro, color: T.negative,
              }}>Cancel</div>
            </div>
          );
        })()}

        {/* Tech trees */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {trees.map(treeName => {
            const tc = TREE_COLORS[treeName];
            const allTechs = (techTree || []).filter(t => t.tree === treeName);
            const techs = allTechs.filter(tech => {
              const parentResearched = !tech.parent || (techTree || []).find(t => t.id === tech.parent)?.researched;
              return !tech.researched && tech.available && parentResearched;
            });
            if (techs.length === 0) return null;
            return (
              <div key={treeName}>
                <div style={{
                  fontFamily: FONT, fontSize: FS.micro, color: tc, textTransform: 'uppercase',
                  letterSpacing: '1px', marginBottom: '6px', paddingBottom: '3px',
                  borderBottom: `1px solid ${tc}33`,
                }}>{TREE_LABELS[treeName]}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {techs.map(tech => {
                    const canSelect = !alreadyResearching;
                    const canAfford = treasury - tech.cost >= limit;
                    const isSel = selectedId === tech.id;
                    return (
                      <div key={tech.id} style={{
                        background: isSel ? T.accentBg : T.panelBg,
                        border: `2px solid ${isSel ? T.accent : 'transparent'}`,
                        borderLeft: `3px solid ${tc}`,
                        padding: '8px 10px',
                        opacity: !canAfford ? 0.5 : 1,
                        cursor: canSelect && canAfford ? 'pointer' : 'default',
                        transition: 'border-color 0.15s, background 0.15s',
                      }} onClick={() => canSelect && canAfford && setSelectedId(tech.id)}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', minWidth: '36px',
                            background: T.bg, border: `2px solid ${isSel ? T.accent : T.panelBorder}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <TechIcon type={tech.type} size={22} color={tc} />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>{tech.name}</span>
                                <ModalChip label={TYPE_LABELS[tech.type] || tech.type} color={tc} />
                              </div>
                              <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>£{tech.cost}</span>
                            </div>
                            <p style={{ fontFamily: FONT_BODY, fontSize: '12px', color: T.textMuted, lineHeight: '1.3' }}>{tech.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation popup */}
        {showConfirm && selectedTech && (
          <div style={{
            marginTop: '12px', padding: '14px',
            background: T.bg, border: `2px solid ${T.negative}`,
          }}>
            <p style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary, marginBottom: '8px' }}>
              Confirm research
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: '12px', color: T.textSecondary, marginBottom: '12px', lineHeight: '1.5' }}>
              Research <span style={{ color: T.textPrimary }}>{selectedTech.name}</span> for <span style={{ color: T.textPrimary }}>£{selectedTech.cost}</span>.
              This takes 1 week to complete and uses your research slot.
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

        {/* Post-commit success */}
        {committed && (
          <div style={{
            marginTop: '12px', padding: '10px',
            background: 'rgba(90,184,122,0.1)', border: `2px solid ${T.positive}`,
            textAlign: 'center',
          }}>
            <span style={{ fontFamily: FONT, fontSize: FS.label, color: T.positive }}>
              ✓ Research started — completes next week
            </span>
          </div>
        )}

        {/* Research button */}
        {!showConfirm && !committed && !researchingTech && (
          <div style={{ marginTop: '12px' }}>
            <div onClick={() => selectedId && canAffordSelected && setShowConfirm(true)} style={{
              padding: '8px', textAlign: 'center',
              cursor: selectedId && canAffordSelected ? 'pointer' : 'default',
              background: selectedId && canAffordSelected ? T.positive : T.buttonBg,
              border: `2px solid ${selectedId && canAffordSelected ? T.positive : T.panelBorder}`,
              fontFamily: FONT, fontSize: FS.label,
              color: selectedId && canAffordSelected ? T.bg : T.textMuted,
              opacity: selectedId && canAffordSelected ? 1 : 0.5,
            }}>Research {selectedTech ? `${selectedTech.name} · £${selectedTech.cost}` : '...'}</div>
          </div>
        )}
      </ModalBody>
    </ModalOverlay>
  );
}
