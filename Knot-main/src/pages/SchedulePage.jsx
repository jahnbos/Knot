import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Home, Repeat } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';

const DAY_HEADERS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

const getLocalDateInfo = (date = new Date()) => {
  return {
    year: date.getFullYear(),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    date: date.getDate(),
    dayOfWeek: date.getDay(),
    d: date
  };
};

const TODAY = getLocalDateInfo();
const TODAY_FULL_DATEStr = `${TODAY.year}-${TODAY.month}-${String(TODAY.date).padStart(2, '0')}`;

const getDateString = (year, month, day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

// ── Expand recurring tasks ให้ครอบคลุมช่วงวันที่กำหนด ──────────
function expandRecurringTasks(tasks, rangeStart, rangeEnd) {
  const expanded = [];
  const start = new Date(rangeStart);
  const end = new Date(rangeEnd);

  for (const task of tasks) {
    if (!task.recurring || task.recurring === 'none') {
      expanded.push(task);
      continue;
    }

    // งานต้นฉบับ
    expanded.push(task);

    const origin = new Date(task.date);
    const stepDays = task.recurring === 'daily' ? 1 : task.recurring === 'weekly' ? 7 : null;
    const stepMonths = task.recurring === 'monthly' ? 1 : null;

    let cursor = new Date(origin);

    // เดินหน้าจาก origin ไปถึง rangeEnd
    for (let i = 0; i < 366; i++) {
      if (stepDays) cursor.setDate(cursor.getDate() + stepDays);
      else if (stepMonths) cursor.setMonth(cursor.getMonth() + stepMonths);

      if (cursor > end) break;
      if (cursor < start) continue;

      // ไม่ซ้ำกับงานที่ติ๊กเสร็จแล้วในวันนั้น (ดูจาก id ต้นฉบับ)
      const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      const alreadyExists = tasks.some(t => t.title === task.title && t.date === dateStr && t.id !== task.id);
      if (alreadyExists) continue;

      expanded.push({
        ...task,
        id: `${task.id}-recur-${dateStr}`,
        date: dateStr,
        done: false,
        status: 'todo',
        isRecurringInstance: true,
      });
    }
  }

  return expanded;
}

// ── Priority color map ──────────────────────────────────────────
const PRIORITY_STYLES = {
  high:   { color: '#ef4444', bg: 'rgba(239, 68,  68,  0.12)', label: 'สำคัญ'  },
  medium: { color: '#f59e0b', bg: 'rgba(245, 158, 11,  0.12)', label: 'ปกติ'   },
  low:    { color: '#0d9488', bg: 'rgba(20,  184, 166, 0.18)', label: 'ไม่รีบ' },
};
const getPriority = (p) => PRIORITY_STYLES[p] ?? PRIORITY_STYLES.low;

function WeekTaskCard({ task }) {
  const isDone = task.done || task.status === 'completed';
  const { color: priorityColor, bg: priorityBg, label: priorityLabel } = getPriority(task.priority);

  return (
    <div className={`rounded-xl p-3 border-l-4 flex flex-col gap-1 transition-all shadow-sm 
      ${isDone ? 'opacity-40 grayscale' : 'hover:shadow-md'}`}
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', borderLeftColor: priorityColor }}>
      <div className="flex items-center justify-between gap-1">
        <span className="flex items-center gap-1 text-sm font-medium leading-relaxed" style={{ color: priorityColor }}>
          <Clock className="w-3.5 h-3.5" /> {task.time || '--:--'}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: priorityBg, color: priorityColor }}>
          {priorityLabel}
        </span>
      </div>
      <span className={`text-base font-bold leading-relaxed ${isDone ? 'line-through' : ''}`} 
            style={{ color: 'var(--text-primary)' }}>
        {task.title}
      </span>
      {task.task && (
        <span className="text-xs uppercase font-semibold tracking-wider opacity-60" 
              style={{ color: 'var(--text-secondary)' }}>
          {task.task}
        </span>
      )}
    </div>
  );
}

function WeekColumn({ day, tasks }) {
  const dateStr = day.fullDateStr;
  const isToday = dateStr === TODAY_FULL_DATEStr;
  const dayTasks = tasks.filter(t => t.date === dateStr);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center mb-6">
        <span className="text-sm font-semibold uppercase tracking-wider mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {day.short}
        </span>
        <span className={`w-10 h-10 flex items-center justify-center rounded-full text-2xl font-bold transition-colors
          ${isToday ? 'text-white' : ''}`} 
          style={{ 
            backgroundColor: isToday ? 'var(--accent)' : 'transparent', 
            color: isToday ? '#fff' : 'var(--text-primary)' 
          }}>
          {day.date}
        </span>
      </div>
      <div className="flex flex-col gap-3 min-h-[600px] rounded-2xl p-2 border-2 border-dashed transition-colors" 
           style={{ borderColor: 'var(--border)' }}>
        {dayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ border: '1px dashed var(--border)' }}>
              <Plus className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>ว่าง</span>
          </div>
        ) : (
          <>
            {dayTasks.map((t) => <WeekTaskCard key={t.id} task={t} />)}
            <button className="mt-auto w-full py-2 rounded-xl text-xs font-bold transition-all border border-dashed opacity-50 hover:opacity-100 cursor-pointer"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-add-task', { detail: { isDetailed: true } }))}>
              + เพิ่มงาน
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MonthView({ tasks, currentDate }) {
  const { year: currentYear, month: currentMonth } = getLocalDateInfo(currentDate);

  const monthCells = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDay = new Date(currentYear, parseInt(currentMonth) - 1, 1).getDay();
    const padding = Array.from({ length: firstDay }, () => ({ date: null, current: false }));
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({ date: i + 1, current: true }));
    return [...padding, ...currentDays];
  }, [currentYear, currentMonth]);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="rounded-3xl overflow-hidden border shadow-xl" 
           style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-7 border-b bg-[var(--bg-tertiary)]" style={{ borderColor: 'var(--border)' }}>
          {DAY_HEADERS.map((d) => (
            <div key={d} className="py-4 text-center text-sm font-bold uppercase opacity-60" style={{ color: 'var(--text-secondary)' }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[minmax(140px,_1fr)]">
          {monthCells.map((cell, idx) => {
            const isLastCol = (idx + 1) % 7 === 0;
            const isLastRow = idx >= monthCells.length - 7;

            if (!cell.current) {
              return (
                <div key={`pad-${idx}`} className="p-3 transition-colors"
                  style={{
                    borderRight: isLastCol ? 'none' : '1px solid var(--border-light)',
                    borderBottom: isLastRow ? 'none' : '1px solid var(--border-light)',
                  }}>
                </div>
              );
            }

            const dateStr = getDateString(currentYear, currentMonth, cell.date);
            const isToday = dateStr === TODAY_FULL_DATEStr;
            const dayTasks = tasks.filter(t => t.date === dateStr);

            return (
              <div key={`day-${cell.date}`} className="p-3 flex flex-col gap-1 transition-colors hover:bg-[var(--bg-hover)]"
                style={{
                  borderRight: isLastCol ? 'none' : '1px solid var(--border-light)',
                  borderBottom: isLastRow ? 'none' : '1px solid var(--border-light)',
                }}>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mb-2`}
                  style={{
                    backgroundColor: isToday ? 'var(--accent)' : 'transparent',
                    color: isToday ? '#fff' : 'var(--text-primary)',
                  }}>{cell.date}</span>
                
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] no-scrollbar">
                  {dayTasks.map(t => {
                    const { color, bg } = getPriority(t.priority);
                    return (
                      <div key={t.id} className="text-[10px] sm:text-xs font-bold px-2 py-1.5 rounded-lg truncate transition-all flex items-center gap-1"
                           style={{ backgroundColor: bg, color }}>
                        {t.done ? '✓ ' : ''}{t.isRecurringInstance && <Repeat size={9} />}{t.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const [view, setView] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks } = useTasks();

  // คำนวณ range ของเดือน/สัปดาห์ที่กำลังดูอยู่ แล้ว expand recurring tasks
  const expandedTasks = useMemo(() => {
    const { year, month } = getLocalDateInfo(currentDate);
    if (view === 'Month') {
      const rangeStart = getDateString(year, parseInt(month), 1);
      const daysInMonth = new Date(year, parseInt(month), 0).getDate();
      const rangeEnd = getDateString(year, parseInt(month), daysInMonth);
      return expandRecurringTasks(tasks, rangeStart, rangeEnd);
    } else {
      // Week view
      const { d, dayOfWeek } = getLocalDateInfo(currentDate);
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const rangeStart = getDateString(startOfWeek.getFullYear(), startOfWeek.getMonth() + 1, startOfWeek.getDate());
      const rangeEnd = getDateString(endOfWeek.getFullYear(), endOfWeek.getMonth() + 1, endOfWeek.getDate());
      return expandRecurringTasks(tasks, rangeStart, rangeEnd);
    }
  }, [tasks, currentDate, view]);

  const weekDays = useMemo(() => {
    const { d, dayOfWeek } = getLocalDateInfo(currentDate);
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const shorts = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
      const fullDateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
      return { short: shorts[i], date: dayDate.getDate(), fullDateStr };
    });
  }, [currentDate]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'Month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'Month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      
      <div className="max-w-7xl mx-auto px-6 py-4 md:py-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4 md:mb-0">
        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col justify-between items-start sm:items-center md:items-start gap-4 sm:gap-0 md:gap-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>ตารางเวลา</h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full sm:w-auto">
            <p className="text-lg md:text-xl font-bold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
              {new Intl.DateTimeFormat('th-TH', { month: 'long', year: 'numeric' }).format(currentDate)}
            </p>
            <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl border shrink-0" style={{ borderColor: 'var(--border)' }}>
              <button onClick={handlePrev} className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"><ChevronLeft size={20} /></button>
              <button onClick={handleNext} className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"><ChevronRight size={20} /></button>
            </div>
            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-[var(--border)]" />
            <button onClick={handleToday} className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 text-sm font-bold rounded-xl border transition-all hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap"
              style={{ color: 'var(--accent)', borderColor: 'var(--accent)', backgroundColor: 'transparent' }}>
              <Home size={14} />
              กลับวันนี้
            </button>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3 md:gap-4">
          <div className="flex p-1 rounded-2xl bg-[var(--bg-tertiary)] shadow-inner border shrink-0 max-w-[fit-content]" style={{ borderColor: 'var(--border)' }}>
            {['Month', 'Week'].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 md:px-6 py-2 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer ${view === v ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-md scale-105' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] scale-100'}`}>
                {v === 'Month' ? 'เดือน' : 'สัปดาห์'}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center gap-2 text-white px-4 md:px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            style={{ backgroundColor: 'var(--accent)' }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-global-add-task', { detail: { isDetailed: true } }))}>
            <Plus className="w-5 h-5 shrink-0" strokeWidth={3} /> <span className="hidden sm:inline">เพิ่มงานใหม่</span><span className="sm:hidden">เพิ่มงาน</span>
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {view === 'Month' ? <MonthView tasks={expandedTasks} currentDate={currentDate} /> : (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-7 gap-4 pb-12">
            {weekDays.map((day) => <WeekColumn key={day.fullDateStr} day={day} tasks={expandedTasks} />)}
          </div>
        )}
      </div>

    </div>
  );
}