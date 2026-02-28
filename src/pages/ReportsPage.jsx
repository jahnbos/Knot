import { TrendingUp, CheckCircle, Flame, Target } from 'lucide-react';

// ─── KPI Cards ────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    title: 'เวลาโฟกัสรวม',
    badge: '+12%',
    badgeColor: 'text-[#98c379] bg-[#98c379]/10',
    value: '32.5h',
    icon: TrendingUp,
    iconColor: 'text-[#98c379]',
  },
  {
    title: 'งานที่ทำเสร็จ',
    badge: '+5%',
    badgeColor: 'text-[#98c379] bg-[#98c379]/10',
    value: '45',
    icon: CheckCircle,
    iconColor: 'text-[#61afef]',
  },
  {
    title: 'ทำต่อเนื่อง',
    badge: 'Best!',
    badgeColor: 'text-[#61afef] bg-[#61afef]/10',
    value: '7 วัน',
    icon: Flame,
    iconColor: 'text-[#e5c07b]',
  },
  {
    title: 'อัตราความสำเร็จ',
    badge: '+2%',
    badgeColor: 'text-[#98c379] bg-[#98c379]/10',
    value: '88%',
    icon: Target,
    iconColor: 'text-[#c678dd]',
  },
];

// ─── Heatmap Data ─────────────────────────────────────────────────────────────

const INTENSITY = ['bg-[#eef0f5]', 'bg-[#98c379]/25', 'bg-[#98c379]/45', 'bg-[#98c379]/70', 'bg-[#98c379]'];

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRand(42);

const HEATMAP_WEEKS = Array.from({ length: 26 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const r = rand();
    if (r < 0.2) return 0;
    if (r < 0.45) return 1;
    if (r < 0.65) return 2;
    if (r < 0.82) return 3;
    return 4;
  })
);

const MONTH_LABELS = [
  { label: 'ก.ย.', week: 0 },
  { label: 'ต.ค.', week: 4 },
  { label: 'พ.ย.', week: 9 },
  { label: 'ธ.ค.', week: 13 },
  { label: 'ม.ค.', week: 18 },
  { label: 'ก.พ.', week: 22 },
];

// ─── Donut Chart (SVG) ────────────────────────────────────────────────────────

const DONUT_SEGMENTS = [
  { label: 'งานลึก',     pct: 38, color: '#61afef' },
  { label: 'ประชุม',      pct: 26, color: '#c678dd' },
  { label: 'อ่านหนังสือ',  pct: 20, color: '#56b6c2' },
  { label: 'งานบริหาร',   pct: 10, color: '#e5c07b' },
  { label: 'อื่น ๆ',      pct: 6,  color: 'transparent' },
];

function DonutChart() {
  const DONUT_R = 62;
  const DONUT_CX = 80;
  const DONUT_CY = 80;
  const STROKE_WIDTH = 22;
  const CIRCUMFERENCE = 2 * Math.PI * DONUT_R;

  let offset = 0;
  const slices = DONUT_SEGMENTS.map((seg) => {
    const dash = (seg.pct / 100) * CIRCUMFERENCE;
    const gap  = CIRCUMFERENCE - dash;
    const el = (
      <circle
        key={seg.label}
        cx={DONUT_CX}
        cy={DONUT_CY}
        r={DONUT_R}
        fill="none"
        stroke={seg.color}
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        style={{ transformOrigin: `${DONUT_CX}px ${DONUT_CY}px`, transform: 'rotate(-90deg)' }}
      />
    );
    offset += dash;
    return el;
  });

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative flex-shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R} fill="none" stroke="#eef0f5" strokeWidth={STROKE_WIDTH} />
          {slices}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#1a1d23]">32.5h</span>
          <span className="text-xs uppercase tracking-widest text-[#6b7280] mt-0.5 leading-relaxed">รวม</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {DONUT_SEGMENTS.map((seg) => (
          <div key={seg.label} className="flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: seg.color === 'transparent' ? '#5c6370' : seg.color }}
            />
            <span className="text-base text-[#6b7280] min-w-[90px] leading-relaxed">{seg.label}</span>
            <span className="text-base font-medium text-[#1a1d23]">{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Line Chart (SVG) ─────────────────────────────────────────────────────────

const LINE_POINTS = [
  [0,   155],
  [96,  80],
  [192, 30],
  [288, 55],
  [384, 130],
  [480, 160],
];

function smoothPath(pts) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cpX = (x0 + x1) / 2;
    d += ` C ${cpX} ${y0}, ${cpX} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

const LINE_PATH  = smoothPath(LINE_POINTS);
const FILL_PATH  = `${LINE_PATH} L 480 180 L 0 180 Z`;
const X_LABELS   = ['9:00', '12:00', '15:00', '18:00', '21:00', '0:00'];
const Y_LABELS   = ['100', '75', '50', '25', '0'];

function LineChart() {
  return (
    <div className="flex gap-3 mt-4">
      <div className="flex flex-col justify-between h-[180px] text-sm text-[#6b7280] text-right pr-1 flex-shrink-0 leading-relaxed">
        {Y_LABELS.map((l) => <span key={l}>{l}</span>)}
      </div>

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <svg viewBox="0 0 480 180" className="w-full h-[180px]" preserveAspectRatio="none">
          {[0, 45, 90, 135, 180].map((y) => (
            <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="#eef0f5" strokeWidth="1" />
          ))}
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#61afef" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#61afef" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={FILL_PATH} fill="url(#lineGrad)" />
          <path d={LINE_PATH} fill="none" stroke="#61afef" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {LINE_POINTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#61afef" stroke="white" strokeWidth="2" />
          ))}
        </svg>

        <div className="flex justify-between text-sm text-[#6b7280] leading-relaxed">
          {X_LABELS.map((l) => <span key={l}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ReportsPage() {
  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#f5f6fa]">

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-[#1a1d23] leading-relaxed">รายงานภาพรวม</h1>
        <p className="text-[#6b7280] text-base mt-1 leading-relaxed">ติดตามความก้าวหน้าและวิเคราะห์พฤติกรรมการโฟกัสของคุณ</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-4 mb-6">
        {KPI_CARDS.map(({ title, badge, badgeColor, value, icon: Icon, iconColor }) => (
          <div key={title} className="bg-white border border-[#e1e4ec] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-[#6b7280] leading-relaxed">{title}</span>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-[#1a1d23]">{value}</span>
              <Icon className={`w-7 h-7 ${iconColor} opacity-70`} />
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="bg-white border border-[#e1e4ec] rounded-2xl p-6 shadow-sm">

          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-[#1a1d23] leading-relaxed">สถิติความสม่ำเสมอ</h2>
            <div className="flex items-center gap-2 text-sm text-[#6b7280] leading-relaxed">
              <span>น้อย</span>
              {['bg-[#eef0f5]', 'bg-[#98c379]/25', 'bg-[#98c379]/45', 'bg-[#98c379]/70', 'bg-[#98c379]'].map((c, i) => (
                <span key={i} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
              ))}
              <span>มาก</span>
            </div>
          </div>

          <div className="flex gap-3 text-sm text-[#6b7280] leading-relaxed">
            <div className="flex flex-col pt-6 text-right pr-1 flex-shrink-0">
              {['จ.', '', 'พ.', '', 'ศ.', '', ''].map((lbl, i) => (
                <div key={i} className="h-3.5 flex items-center justify-end" style={i < 6 ? { marginBottom: '4px' } : {}}>
                  <span>{lbl}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 min-w-0 overflow-hidden flex-1">
              <div className="relative h-5 mb-1">
                {MONTH_LABELS.map((m) => (
                  <span
                    key={m.label}
                    className="absolute text-sm text-[#6b7280] leading-relaxed"
                    style={{ left: `${(m.week / 26) * 100}%` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              <div className="flex gap-1">
                {HEATMAP_WEEKS.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((level, di) => (
                      <span
                        key={di}
                        className={`w-3.5 h-3.5 rounded-sm ${INTENSITY[level]}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-6 pb-12">

        <div className="bg-white border border-[#e1e4ec] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-bold text-xl text-[#1a1d23] leading-relaxed">สัดส่วนเวลา</h2>
          </div>
          <div className="mt-4">
            <DonutChart />
          </div>
        </div>

        <div className="bg-white border border-[#e1e4ec] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl text-[#1a1d23] leading-relaxed">ช่วงเวลาที่โปรดักทีฟที่สุด</h2>
            <div className="flex items-center gap-1.5 text-sm text-[#6b7280] leading-relaxed">
              <span className="w-2.5 h-2.5 rounded-full bg-[#61afef]" />
              ระดับสมาธิ
            </div>
          </div>
          <LineChart />
        </div>

      </div>
    </div>
  );
}
