import { T } from './theme';

// 16×16 grid icons for primitives, action buttons, decorative elements
export function PixelIcon({ type, size = 18, color }) {
  const c = color || T.textPrimary;
  const p = (x, y, w, h) => <rect key={`${x}-${y}-${w||2}-${h||2}`} x={x} y={y} width={w || 2} height={h || 2} fill={c} />;
  switch (type) {
    case 'recruit':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(3,2,10,2)}{p(3,2,2,12)}{p(11,2,2,12)}{p(3,12,10,2)}
        {p(7,5,2,2)}{p(7,8,2,4)}{p(6,9,1,2)}{p(9,9,1,2)}
        {p(6,12,1,2)}{p(9,12,1,2)}
      </svg>);
    case 'build':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(1,10,6,2)}{p(9,10,6,2)}{p(1,12,14,2)}{p(4,8,8,2)}
        {p(1,6,6,2)}{p(9,6,6,2)}{p(1,4,14,2)}{p(4,2,8,2)}
      </svg>);
    case 'policies':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(4,1,8,2)}{p(3,3,2,10)}{p(11,3,2,10)}{p(4,13,8,2)}
        {p(6,5,5,1)}{p(6,7,4,1)}{p(6,9,5,1)}{p(6,11,3,1)}
      </svg>);
    case 'research':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(6,1,4,2)}{p(7,3,2,4)}{p(5,7,6,2)}{p(4,9,8,2)}
        {p(3,11,10,2)}{p(3,13,10,2)}{p(9,4,1,1)}{p(10,5,1,1)}
      </svg>);
    case 'nutrition':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(2,9,12,2)}{p(4,11,8,2)}{p(3,7,10,2)}
        {p(5,3,1,3)}{p(8,2,1,2)}{p(11,3,1,3)}
      </svg>);
    case 'fun':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(6,2,2,9)}{p(8,2,4,2)}{p(12,3,2,2)}
        {p(3,10,4,3)}{p(2,11,2,2)}
      </svg>);
    case 'drive':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(7,2,2,2)}{p(5,4,6,2)}{p(3,6,10,2)}{p(7,6,2,4)}
        {p(4,10,8,2)}{p(3,12,10,2)}
      </svg>);
    case 'clean':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(7,1,2,6)}{p(5,7,6,2)}{p(5,9,2,4)}{p(7,9,2,4)}{p(9,9,2,4)}
        {p(5,13,6,1)}
      </svg>);
    case 'upkeep':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(3,2,3,2)}{p(3,4,2,2)}{p(5,4,2,2)}{p(7,6,2,2)}{p(9,8,2,2)}
        {p(11,10,3,2)}{p(11,12,2,2)}{p(12,10,2,2)}
      </svg>);
    case 'fatigue':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(5,2,4,2)}{p(3,4,2,2)}{p(3,6,2,4)}{p(5,10,4,2)}{p(9,8,2,2)}
        {p(9,4,2,2)}{p(11,2,2,1)}{p(12,3,1,1)}{p(11,6,2,1)}
      </svg>);
    case 'trophy':
      return (<svg width={size} height={size} viewBox="0 0 16 16">
        {p(4,2,8,2)}{p(6,4,4,4)}{p(7,8,2,2)}{p(5,10,6,2)}{p(4,12,8,2)}
        {p(2,2,2,4)}{p(12,2,2,4)}{p(1,3,1,2)}{p(14,3,1,2)}
      </svg>);
    default: return null;
  }
}

// 28×28 building icons for Build modal
export function BuildingIcon({ buildingId, size = 28, color }) {
  const c = color || T.textMuted;
  const o = 0.6;
  const p = (x, y, w, h) => <rect key={`${x}-${y}`} x={x} y={y} width={w || 4} height={h || 4} fill={c} opacity={o} />;
  const icons = {
    bedroom: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(2,16,24,4)}{p(2,20,4,6)}{p(22,20,4,6)}{p(6,12,16,4)}{p(2,10,4,10)}
    </svg>),
    kitchen: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(6,4,4,8)}{p(18,4,4,8)}{p(4,12,20,4)}{p(6,16,16,4)}{p(6,20,16,4)}{p(4,24,20,4)}
    </svg>),
    bathroom: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(10,2,8,4)}{p(8,6,12,4)}{p(6,10,16,4)}{p(6,14,16,4)}{p(8,18,12,4)}{p(10,22,8,4)}
    </svg>),
    living_room: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(2,10,4,10)}{p(22,10,4,10)}{p(6,8,16,4)}{p(6,12,16,4)}{p(6,16,16,4)}{p(2,20,24,4)}
    </svg>),
    utility_closet: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(8,2,4,4)}{p(16,2,4,4)}{p(8,6,12,4)}{p(10,10,8,4)}{p(12,14,4,4)}{p(12,18,4,4)}{p(12,22,4,4)}
    </svg>),
    great_hall: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(6,2,16,4)}{p(4,6,20,2)}{p(6,8,4,14)}{p(18,8,4,14)}{p(12,8,4,14)}{p(2,22,24,4)}
    </svg>),
    heaven: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(10,0,8,4)}{p(8,4,12,2)}{p(12,6,4,4)}{p(4,10,8,4)}{p(16,10,8,4)}{p(2,14,6,4)}{p(20,14,6,4)}{p(10,10,8,8)}{p(10,18,8,4)}{p(12,22,4,4)}
    </svg>),
    hot_tub: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(8,2,2,3)}{p(14,0,2,3)}{p(20,2,2,3)}
      {p(4,8,20,2)}{p(2,10,24,4)}{p(2,14,24,4)}{p(4,18,20,4)}{p(6,22,16,4)}
    </svg>),
    laundry_room: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(4,2,20,4)}{p(4,6,20,4)}{p(4,10,20,4)}{p(4,14,20,4)}{p(4,18,20,4)}{p(4,22,20,4)}
      {p(10,10,8,8)}
    </svg>),
    sauna: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(6,0,2,4)}{p(12,0,2,4)}{p(18,0,2,4)}
      {p(4,6,20,4)}{p(2,10,24,4)}{p(2,14,24,4)}{p(2,18,24,4)}{p(2,22,24,4)}
    </svg>),
  };
  const Icon = icons[buildingId] || icons.bedroom;
  return Icon();
}

// 28×28 tech type icons for Research modal
export function TechIcon({ type, size = 28, color }) {
  const c = color || T.textMuted;
  const o = 0.6;
  const p = (x, y, w, h) => <rect key={`${x}-${y}`} x={x} y={y} width={w || 4} height={h || 4} fill={c} opacity={o} />;
  const icons = {
    policy: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(6,2,16,4)}{p(6,6,4,4)}{p(14,6,8,2)}{p(6,12,4,4)}{p(14,12,8,2)}{p(6,18,4,4)}{p(14,18,8,2)}{p(6,24,16,2)}
    </svg>),
    fixed_expense: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(10,2,8,4)}{p(8,6,12,4)}{p(12,10,4,4)}{p(12,14,4,4)}{p(8,18,12,4)}{p(10,22,8,4)}
    </svg>),
    building: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(10,2,8,4)}{p(6,6,16,4)}{p(8,10,4,12)}{p(16,10,4,12)}{p(6,22,16,4)}{p(12,14,4,8)}
    </svg>),
    upgrade: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(12,2,4,4)}{p(8,6,12,4)}{p(4,10,20,4)}{p(10,14,8,4)}{p(10,18,8,4)}{p(10,22,8,4)}
    </svg>),
    culture: () => (<svg width={size} height={size} viewBox="0 0 28 28">
      {p(12,0,4,4)}{p(6,4,4,6)}{p(18,4,4,6)}{p(8,10,12,4)}{p(10,14,8,4)}{p(12,18,4,4)}{p(8,22,12,4)}
    </svg>),
  };
  const Icon = icons[type] || icons.policy;
  return Icon();
}
