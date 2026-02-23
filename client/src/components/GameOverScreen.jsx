import { T, FONT, FS } from './theme';

// Placeholder game-over screen in new theme
export function GameOverScreen({ onRestart }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(40,40,40,0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: T.panelBg, border: `2px solid ${T.negative}`,
        padding: '40px', textAlign: 'center', maxWidth: '420px',
      }}>
        <div style={{ fontFamily: FONT, fontSize: FS.brand, color: T.negative, marginBottom: '16px' }}>
          GAME OVER
        </div>
        <p style={{
          fontFamily: 'monospace', fontSize: '11px', color: T.textSecondary,
          lineHeight: '1.6', marginBottom: '24px',
        }}>
          Your commune has gone bankrupt. The llamas have scattered to the winds.
        </p>
        <div onClick={onRestart} style={{
          padding: '10px 20px', cursor: 'pointer',
          background: T.positive, border: `2px solid ${T.positive}`,
          fontFamily: FONT, fontSize: FS.heading, color: T.bg,
          display: 'inline-block',
        }}>
          Try Again
        </div>
      </div>
    </div>
  );
}
