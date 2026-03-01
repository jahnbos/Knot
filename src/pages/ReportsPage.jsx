import { useState, useRef } from 'react';
import { TrendingUp, CheckCircle, Flame, Target } from 'lucide-react';

const KPI_CARDS = [
  { title: 'เวลาโฟกัสรวม', badge: '+12%', badgeColor: 'text-white bg-teal-500', value: '32.5h', icon: TrendingUp, iconColor: 'text-teal-600 dark:text-teal-400' },
  { title: 'งานที่ทำเสร็จ', badge: '+5%', badgeColor: 'text-white bg-teal-500', value: '45', icon: CheckCircle, iconColor: 'text-indigo-500 dark:text-indigo-400' },
  { title: 'ทำต่อเนื่อง', badge: 'Best!', badgeColor: 'text-white bg-indigo-500', value: '7 วัน', icon: Flame, iconColor: 'text-amber-500 dark:text-amber-400' },
  { title: 'อัตราความสำเร็จ', badge: '+2%', badgeColor: 'text-white bg-teal-500', value: '88%', icon: Target, iconColor: 'text-emerald-500 dark:text-emerald-400' },
];

const WEEK_LABELS = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
const BAR_CHART_DATA = [
  { planned: 6, completed: 5 },
  { planned: 8, completed: 7 },
  { planned: 7, completed: 4 },
  { planned: 6, completed: 6 },
  { planned: 5, completed: 3 },
  { planned: 4, completed: 4 },
  { planned: 3, completed: 2 },
];

const DONUT_SEGMENTS = [
  { label: 'มุ่งเน้น', pct: 38, color: 'var(--accent)' },
  { label: 'เรียนรู้', pct: 26, color: 'var(--accent-green)' },
  { label: 'จัดการ', pct: 20, color: 'var(--accent-gold)' },
  { label: 'ประเมิน', pct: 10, color: 'var(--accent-purple)' },
  { label: 'อื่น ๆ', pct: 6, color: 'var(--text-muted)' },
];

function DonutChart() {
  const R = 76, CX = 100, CY = 100, SW = 32, C = 2 * Math.PI * R;
  let offset = 0;
  const slices = DONUT_SEGMENTS.map((seg) => {
    const dash = Math.max(0, (seg.pct / 100) * C - 4);
    const el = (
      <circle key={seg.label} cx={CX} cy={CY} r={R} fill="none" stroke={seg.color} strokeWidth={SW}
        strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-offset} />
    );
    offset += (seg.pct / 100) * C;
    return el;
  });
  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 mt-2">
      <div className="relative flex-shrink-0">
        <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
          <circle cx={CX} cy={CY} r={R} fill="none" strokeWidth={SW} style={{ stroke: 'var(--bg-tertiary)' }} />
          {slices}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>32.5</span>
          <span className="text-xs uppercase tracking-widest mt-1 font-semibold" style={{ color: 'var(--text-secondary)' }}>HOURS</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 w-full px-2">
        {DONUT_SEGMENTS.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LINE_POINTS = [[0,155],[96,80],[192,30],[288,55],[384,130],[480,160]];
function smoothPath(pts) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0,y0]=pts[i-1],[x1,y1]=pts[i]; d += ` C ${(x0+x1)/2} ${y0}, ${(x0+x1)/2} ${y1}, ${x1} ${y1}`;
  }
  return d;
}
const LINE_PATH = smoothPath(LINE_POINTS);
const FILL_PATH = `${LINE_PATH} L 480 180 L 0 180 Z`;
const X_LABELS = ['9:00','12:00','15:00','18:00','21:00','0:00'];
const Y_LABELS = ['100','75','50','25','0'];

function LineChart() {
  const [hoverIdx, setHoverIdx] = useState(null);
  const svgRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Find closest point based on X coordinate percentage
    const closestIdx = LINE_POINTS.reduce((prevIdx, currPoint, currIdx) => {
      const targetPercent = x / width;
      const currPercent = currPoint[0] / 480;
      const prevPercent = LINE_POINTS[prevIdx][0] / 480;
      
      return Math.abs(currPercent - targetPercent) < Math.abs(prevPercent - targetPercent) ? currIdx : prevIdx;
    }, 0);

    setHoverIdx(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIdx(null);
  };

  return (
    <div className="flex gap-3 mt-4">
      <div className="flex flex-col justify-between h-[180px] text-sm text-right pr-1 flex-shrink-0 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {Y_LABELS.map((l) => <span key={l}>{l}</span>)}
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <svg ref={svgRef} viewBox="0 0 480 180" className="w-full h-[180px] group cursor-default" preserveAspectRatio="none">
          {[0,45,90,135,180].map((y) => (
            <line key={y} x1="0" y1={y} x2="480" y2={y} style={{ stroke: 'var(--border-light)' }} strokeWidth="1" strokeDasharray="4 4" />
          ))}
          
          {hoverIdx !== null && (
             <line 
                x1={LINE_POINTS[hoverIdx][0]} y1="0" 
                x2={LINE_POINTS[hoverIdx][0]} y2="180" 
                style={{ stroke: 'var(--border)', transition: 'all 0.2s ease' }} strokeWidth="1" 
             />
          )}
          
          <path d={LINE_PATH} fill="none" style={{ stroke: 'var(--text-primary)' }} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {LINE_POINTS.map(([x,y],i) => (
            <circle 
              key={i} cx={x} cy={y} 
              r={hoverIdx === i ? "6" : "4.5"} 
              style={{ 
                fill: 'var(--bg-secondary)', 
                stroke: 'var(--text-primary)',
                transition: 'r 0.2s ease'
              }} 
              strokeWidth="2.5" 
            />
          ))}

          {hoverIdx !== null && (
            <g 
              style={{ transition: 'transform 0.2s ease' }}
              transform={`translate(${Math.min(LINE_POINTS[hoverIdx][0] + 8, 400)}, ${Math.max(LINE_POINTS[hoverIdx][1] - 42, 0)})`}
            >
              <rect width="70" height="42" rx="6" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }} />
              <text x="10" y="18" fontSize="12" fontWeight="600" fill="var(--text-primary)">{X_LABELS[hoverIdx]}</text>
              <text x="10" y="34" fontSize="11" fill="var(--text-secondary)">level : {Y_LABELS[hoverIdx]}</text>
            </g>
          )}
        </svg>
        <div className="flex justify-between text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {X_LABELS.map((l) => <span key={l}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="min-h-[calc(100vh-73px)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold leading-relaxed" style={{ color: 'var(--text-primary)' }}>รายงานภาพรวม</h1>
        <p className="text-base mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>ติดตามความก้าวหน้าและวิเคราะห์พฤติกรรมการโฟกัสของคุณ</p>
      </div>

      {/* KPI Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-4 mb-6">
        {KPI_CARDS.map(({ title, badge, badgeColor, value, icon: Icon, iconColor }) => (
          <div key={title} className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center justify-between">
              <span className="text-base font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{title}</span>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
              <Icon className={`w-7 h-7 ${iconColor} opacity-70`} />
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart: Planned vs Completed */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="font-bold text-xl leading-relaxed" style={{ color: 'var(--text-primary)' }}>เปรียบเทียบภารกิจที่วางแผนกับที่ทำเสร็จ</h2>
            <div className="flex gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--border)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>วางแผนไว้</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--text-primary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>ทำเสร็จแล้ว</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 h-[240px]">
            {/* Y-Axis scale */}
            <div className="flex flex-col justify-between py-6 text-sm text-right pr-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
              <span>8</span>
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>
            
            <div className="flex-1 flex flex-col min-w-0 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-b" style={{ borderColor: 'var(--border-light)', borderStyle: 'dashed', borderWidth: '1px' }} />
                ))}
              </div>
              
              {/* Bars container */}
              <div className="flex flex-1 items-end justify-between px-4 pb-0 z-10 pt-6">
                {BAR_CHART_DATA.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="flex items-end gap-1.5 h-[160px]">
                      {/* Planned Bar */}
                      <div 
                        className="w-4 sm:w-6 rounded-t-sm" 
                        style={{ backgroundColor: 'var(--border)', height: `${(day.planned / 8) * 100}%`, transition: 'height 0.3s ease' }} 
                      />
                      {/* Completed Bar */}
                      <div 
                        className="w-4 sm:w-6 rounded-t-sm" 
                        style={{ backgroundColor: 'var(--text-primary)', height: `${(day.completed / 8) * 100}%`, transition: 'height 0.3s ease' }} 
                      />
                    </div>
                    {/* X-Axis label */}
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{WEEK_LABELS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Donut + Line Charts */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-6 pb-12">
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
          <h2 className="font-bold text-xl mb-1 leading-relaxed" style={{ color: 'var(--text-primary)' }}>สัดส่วนเวลา</h2>
          <div className="mt-4"><DonutChart /></div>
        </div>
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl leading-relaxed" style={{ color: 'var(--text-primary)' }}>ช่วงเวลาที่โปรดักทีฟที่สุด</h2>
            <div className="flex items-center gap-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} /> ระดับสมาธิ
            </div>
          </div>
          <LineChart />
        </div>
      </div>
    </div>
  );
}
