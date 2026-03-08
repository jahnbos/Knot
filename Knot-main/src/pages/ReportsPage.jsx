import { useState, useRef, useMemo } from 'react';
import { TrendingUp, CheckCircle, Flame, Target } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';

const WEEK_LABELS = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];

/* ── Donut Chart ── */
function DonutChart({ segments, centerValue, centerLabel }) {
  const R = 76, CX = 100, CY = 100, SW = 32, C = 2 * Math.PI * R;
  let offset = 0;
  const slices = segments.map((seg) => {
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
          <span className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{centerValue}</span>
          <span className="text-xs uppercase tracking-widest mt-1 font-semibold" style={{ color: 'var(--text-secondary)' }}>{centerLabel}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 w-full px-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{seg.label} ({seg.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Bar Chart ── */
function BarChart({ data, maxVal }) {
  return (
    <div className="flex gap-3 h-[240px]">
      <div className="flex flex-col justify-between py-6 text-sm text-right pr-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {[maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0].map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b" style={{ borderColor: 'var(--border-light)', borderStyle: 'dashed', borderWidth: '1px' }} />
          ))}
        </div>
        <div className="flex flex-1 items-end justify-between px-4 pb-0 z-10 pt-6">
          {data.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="flex items-end gap-1.5 h-[160px]">
                <div className="w-4 sm:w-6 rounded-t-sm" 
                  style={{ backgroundColor: 'var(--border)', height: `${maxVal > 0 ? (day.planned / maxVal) * 100 : 0}%`, transition: 'height 0.3s ease' }} />
                <div className="w-4 sm:w-6 rounded-t-sm" 
                  style={{ backgroundColor: 'var(--text-primary)', height: `${maxVal > 0 ? (day.completed / maxVal) * 100 : 0}%`, transition: 'height 0.3s ease' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{WEEK_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  return new Date(d.setDate(diff));
}

function getDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const CATEGORY_COLORS = [
  'var(--accent)',
  'var(--accent-green)',
  'var(--accent-gold)',
  'var(--accent-purple)',
  'var(--accent-coral)',
  'var(--text-muted)',
];

/* ── Main ReportsPage ── */
export default function ReportsPage() {
  const { tasks } = useTasks();

  // ── Compute KPIs ──
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done || t.status === 'completed').length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // สร้าง bar chart data สำหรับสัปดาห์ปัจจุบัน (จันทร์-อาทิตย์)
    const today = new Date();
    const weekStart = getWeekStart(today);
    const barData = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const dayStr = getDateStr(day);
      const dayTasks = tasks.filter(t => t.date === dayStr);
      return {
        planned: dayTasks.length,
        completed: dayTasks.filter(t => t.done || t.status === 'completed').length,
      };
    });
    const maxBar = Math.max(...barData.map(d => Math.max(d.planned, d.completed)), 1);

    // สร้าง donut chart data จากหมวดหมู่ (task property)
    const categoryCounts = {};
    tasks.forEach(t => {
      const cat = t.task || 'ทั่วไป';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1]);
    const donutSegments = sortedCategories.map(([label, count], idx) => ({
      label,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));
    // ปรับให้ครบ 100%
    if (donutSegments.length > 0) {
      const sumPct = donutSegments.reduce((s, seg) => s + seg.pct, 0);
      if (sumPct !== 100 && sumPct > 0) {
        donutSegments[0].pct += (100 - sumPct);
      }
    }

    // นับ priority
    const highCount = tasks.filter(t => t.priority === 'high').length;
    const medCount = tasks.filter(t => t.priority === 'medium').length;
    const lowCount = tasks.filter(t => t.priority === 'low').length;

    return { total, completed, successRate, barData, maxBar, donutSegments, highCount, medCount, lowCount };
  }, [tasks]);

  const kpiCards = [
    { title: 'งานทั้งหมด', value: `${stats.total}`, icon: TrendingUp, iconColor: 'text-teal-600 dark:text-teal-400', badge: `${stats.highCount} สำคัญ`, badgeColor: 'text-white bg-rose-500' },
    { title: 'ทำเสร็จแล้ว', value: `${stats.completed}`, icon: CheckCircle, iconColor: 'text-teal-500 dark:text-teal-400', badge: `+${stats.completed}`, badgeColor: 'text-white bg-teal-500' },
    { title: 'ยังไม่เสร็จ', value: `${stats.total - stats.completed}`, icon: Flame, iconColor: 'text-amber-500 dark:text-amber-400', badge: `${stats.medCount} ปกติ`, badgeColor: 'text-white bg-amber-500' },
    { title: 'อัตราความสำเร็จ', value: `${stats.successRate}%`, icon: Target, iconColor: 'text-emerald-500 dark:text-emerald-400', badge: stats.successRate >= 50 ? 'ดี' : 'เร่งมือ', badgeColor: stats.successRate >= 50 ? 'text-white bg-teal-500' : 'text-white bg-rose-500' },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold leading-relaxed" style={{ color: 'var(--text-primary)' }}>รายงานภาพรวม</h1>
        <p className="text-base mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>ติดตามความก้าวหน้าและวิเคราะห์ข้อมูลงานของคุณ (อัปเดตอัตโนมัติ)</p>
      </div>

      {/* KPI Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpiCards.map(({ title, badge, badgeColor, value, icon: Icon, iconColor }) => (
          <div key={title} className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center justify-between">
              <span className="text-base font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{title}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
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
            <h2 className="font-bold text-xl leading-relaxed" style={{ color: 'var(--text-primary)' }}>ภารกิจสัปดาห์นี้ (วางแผน vs ทำเสร็จ)</h2>
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
          <BarChart data={stats.barData} maxVal={Math.max(stats.maxBar, 1)} />
        </div>
      </div>

      {/* Donut Chart + Priority Breakdown */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {/* Donut: Category Distribution */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
          <h2 className="font-bold text-xl mb-1 leading-relaxed" style={{ color: 'var(--text-primary)' }}>สัดส่วนงานตามหมวดหมู่</h2>
          <div className="mt-4">
            <DonutChart segments={stats.donutSegments} centerValue={stats.total} centerLabel="งานทั้งหมด" />
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-2xl p-6 flex flex-col gap-6" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
          <h2 className="font-bold text-xl leading-relaxed" style={{ color: 'var(--text-primary)' }}>สรุปตามระดับความสำคัญ</h2>
          
          {[
            { label: 'สำคัญ (High)', count: stats.highCount, done: tasks.filter(t => t.priority === 'high' && (t.done || t.status === 'completed')).length, color: 'var(--accent-coral)' },
            { label: 'ปกติ (Medium)', count: stats.medCount, done: tasks.filter(t => t.priority === 'medium' && (t.done || t.status === 'completed')).length, color: 'var(--accent-gold)' },
            { label: 'ไม่รีบ (Low)', count: stats.lowCount, done: tasks.filter(t => t.priority === 'low' && (t.done || t.status === 'completed')).length, color: 'var(--accent)' },
          ].map(({ label, count, done, color }) => (
            <div key={label} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {done}/{count} สำเร็จ
                </span>
              </div>
              <div className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${count > 0 ? (done / count) * 100 : 0}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-auto pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>ทำเสร็จรวม</span>
            <span className="text-2xl font-black" style={{ color: 'var(--accent)' }}>
              {stats.completed}/{stats.total}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}