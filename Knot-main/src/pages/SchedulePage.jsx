import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext'; 
import AddTaskModal from '../components/AddTaskModal';

// ปรับให้ตรงกับวันที่ปัจจุบัน (1 มีนาคม 2026)
const TODAY_DATE = 1; 
const CURRENT_MONTH_YEAR = "2026-03"; 
const DAY_HEADERS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

const getDateString = (day) => `${CURRENT_MONTH_YEAR}-${String(day).padStart(2, '0')}`;

function WeekTaskCard({ task }) {
  const isDone = task.done || task.status === 'completed';
  return (
    <div className={`rounded-xl p-3 border flex flex-col gap-1 transition-all shadow-sm 
      ${isDone ? 'opacity-40 grayscale' : 'hover:shadow-md'}`}
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <span className="flex items-center gap-1 text-sm font-medium leading-relaxed" style={{ color: 'var(--accent)' }}>
        <Clock className="w-3.5 h-3.5" /> {task.time || '--:--'}
      </span>
      <span className={`text-base font-bold leading-relaxed ${isDone ? 'line-through' : ''}`} 
            style={{ color: 'var(--text-primary)' }}>
        {task.title}
      </span>
      {task.tags?.length > 0 && (
        <span className="text-xs uppercase font-semibold tracking-wider opacity-60" 
              style={{ color: 'var(--text-secondary)' }}>
          {task.tags[0]}
        </span>
      )}
    </div>
  );
}

function WeekColumn({ day, tasks }) {
  const isToday = day.date === TODAY_DATE;
  const dateStr = getDateString(day.date);
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
              onClick={() => window.dispatchEvent(new CustomEvent('open-add-task-modal'))}>
              + เพิ่มงาน
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MonthView({ tasks }) {
  // ปรับเป็น 31 วันสำหรับเดือนมีนาคม
  const monthCells = useMemo(() => [
    ...Array.from({ length: 31 }, (_, i) => ({ date: i + 1, current: true })),
  ], []);

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
            const dateStr = getDateString(cell.date);
            const isToday = cell.current && cell.date === TODAY_DATE;
            const isLastCol = (idx + 1) % 7 === 0;
            const isLastRow = idx >= 28;
            const dayTasks = cell.current ? tasks.filter(t => t.date === dateStr) : [];

            return (
              <div key={idx} className="p-3 flex flex-col gap-1 transition-colors hover:bg-[var(--bg-hover)]"
                style={{
                  borderRight: isLastCol ? 'none' : '1px solid var(--border-light)',
                  borderBottom: isLastRow ? 'none' : '1px solid var(--border-light)',
                }}>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mb-2`}
                  style={{
                    backgroundColor: isToday ? 'var(--accent)' : 'transparent',
                    color: isToday ? '#fff' : 'var(--text-primary)',
                  }}>{cell.date}</span>
                
                <div className="flex flex-col gap-1">
                  {dayTasks.map(t => (
                    <div key={t.id} className="text-[10px] font-bold px-2 py-1.5 rounded-lg truncate border transition-all"
                         style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)', borderColor: 'var(--accent-border)', backgroundOpacity: 0.1 }}>
                      {t.done ? '✓ ' : ''}{t.title}
                    </div>
                  ))}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks } = useTasks(); 

  // ปรับวันที่ในสัปดาห์ปัจจุบัน (มีนาคม)
  const weekDays = [
    { short: 'อา.', date: 1 }, { short: 'จ.', date: 2 }, { short: 'อ.', date: 3 },
    { short: 'พ.', date: 4 }, { short: 'พฤ.', date: 5 }, { short: 'ศ.', date: 6 },
    { short: 'ส.', date: 7 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {typeof window !== 'undefined' && window.addEventListener('open-add-task-modal', () => setIsModalOpen(true), { once: true })}
      
      <div className="max-w-7xl mx-auto px-6 py-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight leading-none mb-2" style={{ color: 'var(--text-primary)' }}>ตารางเวลา</h1>
          <p className="text-lg font-medium opacity-60" style={{ color: 'var(--text-secondary)' }}>มีนาคม 2026</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-1 rounded-2xl bg-[var(--bg-tertiary)] shadow-inner border" style={{ borderColor: 'var(--border)' }}>
            {['Month', 'Week'].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${view === v ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-md' : 'text-[var(--text-secondary)]'}`}>
                {v === 'Month' ? 'เดือน' : 'สัปดาห์'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--accent)' }}
            onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" strokeWidth={3} /> เพิ่มงานใหม่
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {view === 'Month' ? <MonthView tasks={tasks} /> : (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-7 gap-4 pb-12">
            {weekDays.map((day) => <WeekColumn key={day.date} day={day} tasks={tasks} />)}
          </div>
        )}
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}