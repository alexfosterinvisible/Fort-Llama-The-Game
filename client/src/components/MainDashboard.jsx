import { useState } from 'react';
import { T, FONT, FS, evtStyle } from './theme';
import { Panel, PanelTitle } from './Panel';
import { PixelIcon } from './PixelIcon';
import { Sparkline } from './Sparkline';
import { SegBar } from './SegBar';
import { MiniGauge } from './MiniGauge';
import { MiniAccum } from './MiniAccum';
import { TreasuryRow } from './TreasuryRow';
import { PolicyChip } from './PolicyChip';
import { ResidentChip } from './ResidentChip';

// Two-column scrollable main dashboard: Treasury, Culture, Buildings | Residents, Noticeboard, Systems
export function MainDashboard({
  // Treasury
  treasury, income, expenses, net, incomeBreakdown, expenseBreakdown,
  // Culture / Health metrics
  healthMetrics, metricHistory, researchedCulture,
  // Buildings
  buildings,
  // Residents
  residents, population, capacity,
  // Aggregate stats
  aggregateStats,
  // Policies
  policies,
  // Noticeboard events
  events,
  // Primitives (systems panel)
  primitives,
}) {
  const [buildingsOpen, setBuildingsOpen] = useState(true);

  const ls = healthMetrics?.livingStandards ?? 0;
  const pr = healthMetrics?.productivity ?? 0;
  const pt = healthMetrics?.partytime ?? 0;

  return (
    <div className="fl-scroll" style={{ flex: 1.618, overflowY: 'auto', padding: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '720px', marginLeft: 'auto' }}>
        <div style={{ display: 'flex', gap: '10px' }}>

          {/* LEFT COLUMN */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Treasury */}
            <Panel>
              <PanelTitle>Treasury</PanelTitle>
              <TreasuryRow label="Balance" val={`£${(treasury || 0).toLocaleString()}`} color={(treasury || 0) >= 0 ? T.positive : T.negative} />
              <TreasuryRow label="Income" val={`£${(income || 0).toLocaleString()}`} color={T.positive} breakdown={incomeBreakdown} />
              <TreasuryRow label="Expenses" val={`-£${(expenses || 0).toLocaleString()}`} color={T.negative} breakdown={expenseBreakdown} />
              <div style={{
                display: 'flex', justifyContent: 'space-between', padding: '5px 0 0',
                marginTop: '2px', borderTop: `1px solid ${T.panelBorderLight}`,
              }}>
                <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textSecondary }}>Net</span>
                <span style={{ fontFamily: FONT, fontSize: FS.display, color: (net || 0) >= 0 ? T.positive : T.negative }}>
                  £{net || 0}
                </span>
              </div>
            </Panel>

            {/* Culture */}
            <Panel>
              <PanelTitle>Culture</PanelTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Living Standards', val: ls, color: T.ls, data: metricHistory?.map(d => d.ls) },
                  { label: 'Productivity', val: pr, color: T.pr, data: metricHistory?.map(d => d.pr) },
                  { label: 'Partytime', val: pt, color: T.pt, data: metricHistory?.map(d => d.pt) },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: FONT, fontSize: FS.label, color: T.bg,
                      background: m.color, padding: '2px 6px',
                      textTransform: 'capitalize',
                    }}>{m.label}</span>
                    <div style={{ flex: 1 }} />
                    <div style={{ width: '68px', marginRight: '8px' }}>
                      <Sparkline data={m.data} color={m.color} width={68} height={18} />
                    </div>
                    <span style={{ fontFamily: FONT, fontSize: FS.display, color: m.color, width: '30px', textAlign: 'right' }}>{m.val}</span>
                  </div>
                ))}
              </div>
              {/* Culture trophies */}
              {researchedCulture && researchedCulture.length > 0 && (
                <>
                  <div style={{ borderTop: `1px solid ${T.panelBorder}`, margin: '10px 0 8px' }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {researchedCulture.map(c => {
                      const treeColor = c.tree === 'livingStandards' ? T.ls : c.tree === 'productivity' ? T.pr : T.pt;
                      return (
                        <div key={c.id} style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          background: `${treeColor}12`, border: `1px solid ${treeColor}33`,
                          padding: '3px 7px 3px 5px',
                        }}>
                          <PixelIcon type="trophy" size={10} color={treeColor} />
                          <span style={{ fontFamily: FONT, fontSize: FS.micro, color: treeColor }}>{c.badge}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Panel>

            {/* Buildings */}
            <Panel style={{ flex: buildingsOpen ? 1 : 0 }}>
              <div onClick={() => setBuildingsOpen(!buildingsOpen)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: buildingsOpen ? '10px' : 0, cursor: 'pointer',
              }}>
                <span style={{ fontFamily: FONT, fontSize: FS.heading, color: T.accent, letterSpacing: '1px' }}>Buildings</span>
                <span style={{
                  fontFamily: FONT, fontSize: FS.label, color: T.textSecondary,
                  transition: 'transform 0.2s', transform: buildingsOpen ? 'rotate(0)' : 'rotate(-90deg)',
                }}>▼</span>
              </div>
              {buildingsOpen && buildings && buildings.map((b, i) => (
                <div key={b.name} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0',
                  borderBottom: i < buildings.length - 1 ? '1px solid rgba(70,70,70,0.4)' : 'none',
                }}>
                  <span style={{ fontFamily: FONT, fontSize: FS.label, color: b.status === 'pending' ? T.textMuted : T.textSecondary }}>{b.name}</span>
                  {b.status === 'pending' ? (
                    <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.bg, background: T.accentBright, padding: '1px 4px' }}>Pending</span>
                  ) : (
                    <span style={{ fontFamily: FONT, fontSize: FS.body, color: T.textPrimary }}>{b.count} ({b.cap})</span>
                  )}
                </div>
              ))}
            </Panel>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Residents */}
            <Panel>
              <PanelTitle right={
                <span style={{ fontFamily: FONT, fontSize: FS.heading, color: T.textPrimary }}>{population}/{capacity}</span>
              }>Residents</PanelTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                {residents && residents.map(r => (
                  <ResidentChip key={r.name} resident={r} />
                ))}
              </div>
              {/* Aggregate stats */}
              {aggregateStats && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {Object.entries(aggregateStats).map(([skill, val]) => (
                    <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
                      <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textSecondary, textTransform: 'uppercase' }}>{skill}</span>
                      <span style={{ fontFamily: FONT, fontSize: FS.label, color: val > 0 ? T.positive : val < 0 ? T.negative : T.textSecondary }}>
                        {val > 0 ? `+${val}%` : `${val}%`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* Policies */}
              <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: `1px solid ${T.panelBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textSecondary, letterSpacing: '1px', textTransform: 'uppercase' }}>Policies</span>
                  <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textPrimary }}>
                    {policies ? policies.filter(p => p.active !== false).length : 0}/3
                  </span>
                </div>
                {(!policies || policies.length === 0) ? (
                  <span style={{ fontSize: FS.micro, color: T.textMuted, fontStyle: 'italic', fontFamily: 'sans-serif' }}>None active</span>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {policies.map((p, i) => (
                      <PolicyChip key={i} policy={p} />
                    ))}
                  </div>
                )}
              </div>
            </Panel>

            {/* Noticeboard (placeholder — spec incoming) */}
            <Panel style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <PanelTitle>Noticeboard</PanelTitle>
              <div className="fl-scroll" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                {events && events.length > 0 ? events.map((evt, i) => {
                  const es = evtStyle(evt.type);
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '3px 0',
                      borderBottom: i < events.length - 1 ? '1px solid rgba(70,70,70,0.35)' : 'none',
                    }}>
                      <span style={{ color: es.color, fontFamily: FONT, fontSize: FS.body, width: '12px', textAlign: 'center', flexShrink: 0 }}>{es.icon}</span>
                      <span style={{ fontSize: FS.body, fontFamily: 'monospace', color: '#fff', lineHeight: '1.5', flex: 1 }}>{evt.text}</span>
                      <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textMuted, flexShrink: 0 }}>W{evt.week}</span>
                    </div>
                  );
                }) : (
                  <span style={{ fontSize: FS.micro, color: T.textMuted, fontStyle: 'italic', fontFamily: 'sans-serif' }}>
                    No notices yet.
                  </span>
                )}
              </div>
            </Panel>
          </div>
        </div>

        {/* Systems — full width */}
        <Panel>
          <PanelTitle>Systems</PanelTitle>
          {/* Coverage bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { name: 'Nutrition', key: 'nutrition', icon: 'nutrition' },
              { name: 'Fun', key: 'fun', icon: 'fun' },
              { name: 'Drive', key: 'drive', icon: 'drive' },
            ].map(c => {
              const prim = primitives?.[c.key];
              if (!prim) return null;
              return (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '18px', display: 'flex', justifyContent: 'center' }}>
                    <PixelIcon type={c.icon} size={14} />
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: FS.micro, color: T.textSecondary, width: '80px', flexShrink: 0, textTransform: 'uppercase' }}>{c.name}</span>
                  <SegBar value={prim.value} threshold={prim.threshold} tierLabel={prim.tier} />
                </div>
              );
            })}
          </div>
          {/* Divider */}
          <div style={{ borderTop: `1px solid ${T.panelBorder}`, margin: '10px 0' }} />
          {/* Gauges + Accumulators */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <MiniGauge value={primitives?.crowding?.value ?? 0} label="CROWDING" tierLabel={primitives?.crowding?.tier} />
            <MiniGauge value={primitives?.noise?.value ?? 0} label="NOISE" tierLabel={primitives?.noise?.tier} />
            <div style={{ width: '1px', background: T.panelBorder, alignSelf: 'stretch' }} />
            <MiniAccum value={primitives?.cleanliness?.value ?? 0} label="CLEAN" tierLabel={primitives?.cleanliness?.tier} icon="clean" />
            <MiniAccum value={primitives?.maintenance?.value ?? 0} label="UPKEEP" tierLabel={primitives?.maintenance?.tier} icon="upkeep" />
            <MiniAccum value={primitives?.fatigue?.value ?? 0} label="FATIGUE" tierLabel={primitives?.fatigue?.tier} icon="fatigue" />
          </div>
        </Panel>
      </div>
    </div>
  );
}
