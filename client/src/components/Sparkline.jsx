// Stepped line chart with gradient fill — pixel art aesthetic (horizontal-then-vertical steps)
export function Sparkline({ data, color, width = 160, height = 50 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data) + 5, min = Math.min(...data) - 5;
  const range = max - min || 1, step = width / (data.length - 1);
  const pts = data.map((v, i) => ({
    x: Math.round(i * step),
    y: Math.round(height - 3 - ((v - min) / range) * (height - 6)),
  }));
  let path = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) path += ` L ${pts[i].x} ${pts[i - 1].y} L ${pts[i].x} ${pts[i].y}`;
  const uid = `sg-${color.replace(/#/g, '')}-${width}-${height}`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path + ` L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`} fill={`url(#${uid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color} />
    </svg>
  );
}
