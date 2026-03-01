import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AddTaskModal from '../components/AddTaskModal';

const TODAY_DATE = 20;
const DAY_HEADERS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
const MONTH_CELLS = [
  ...Array.from({ length: 28 }, (_, i) => ({ date: i + 1, current: true })),
  ...Array.from({ length: 7 },  (_, i) => ({ date: i + 1, current: false })),
];

const MONTH_PILLS = {
  17: { label: 'ร่างเรียงความประวัติศาสตร์', color: 'bg-[#c678dd]/10 text-[#a855c4]' },
  19: { label: 'สอบคณิตศาสตร์',           color: 'bg-[#e06c75]/10 text-[#e06c75]' },
  20: { label: 'อ่านภาษาอังกฤษ',          color: 'bg-[#98c379]/10 text-[#4d8f40]' },
  22: { label: 'แล็บฟิสิกส์',              color: 'bg-[#e5c07b]/10 text-[#b8860b]' },
  26: { label: 'ส่งโปรเจกต์ CS',           color: 'bg-[#56b6c2]/10 text-[#2c8f9e]' },
};

const WEEK_DAYS = [
  { short: 'อา.', date: 15 }, { short: 'จ.', date: 16 }, { short: 'อ.', date: 17 },
  { short: 'พ.', date: 18 }, { short: 'พฤ.', date: 19 }, { short: 'ศ.', date: 20 },
  { short: 'ส.', date: 21 },
];

const WEEK_TASKS = {
  16: [{ time: '9:00', title: 'แบบฝึกหัดพีชคณิตเชิงเส้น', label: 'คณิต',
    card: 'bg-[#61afef]/8 border-[#61afef]/20', timeC: 'text-[#61afef]', labelC: 'text-[#61afef]/70' }],
  17: [{ time: '11:00', title: 'รายงานแล็บฟิสิกส์', label: 'วิทย์',
    card: 'bg-[#e5c07b]/8 border-[#e5c07b]/20', timeC: 'text-[#b8860b]', labelC: 'text-[#b8860b]/70' }],
  18: [
    { time: '14:00', title: 'ร่างเรียงความประวัติศาสตร์', label: 'ประวัติ',
      card: 'bg-[#c678dd]/8 border-[#c678dd]/20', timeC: 'text-[#a855c4]', labelC: 'text-[#a855c4]/70' },
    { time: '16:30', title: 'ติวกลุ่ม — เศรษฐศาสตร์', label: 'เศรษฐฯ',
      card: 'bg-[#c678dd]/8 border-[#c678dd]/20', timeC: 'text-[#a855c4]', labelC: 'text-[#a855c4]/70' },
  ],
  20: [
    { time: '10:00', title: 'สอบคณิตศาสตร์', label: 'คณิต',
      card: 'bg-[#e06c75]/8 border-[#e06c75]/20', timeC: 'text-[#e06c75]', labelC: 'text-[#e06c75]/70' },
    { time: '15:00', title: 'ทบทวน Data Structures', label: 'CS',
      card: 'bg-[#e06c75]/8 border-[#e06c75]/20', timeC: 'text-[#e06c75]', labelC: 'text-[#e06c75]/70' },
  ],
  21: [{ time: '13:00', title: 'อ่านภาษาอังกฤษ', label: 'อังกฤษ',
    card: 'bg-[#98c379]/8 border-[#98c379]/20', timeC: 'text-[#4d8f40]', labelC: 'text-[#4d8f40]/70' }],
};

function WeekTaskCard({ task }) {
  return (
    <div className={`${task.card} rounded-xl p-3 border flex flex-col gap-1`}>
      <span className={`flex items-center gap-1 text-sm font-medium leading-relaxed ${task.timeC}`}>
        <Clock className="w-3.5 h-3.5" /> {task.time}
      </span>
      <span className="text-base font-bold leading-relaxed" style={{ color: 'var(--text-primary)' }}>{task.title}</span>
      <span className={`text-xs uppercase font-semibold tracking-wider leading-relaxed ${task.labelC}`}>{task.label}</span>
    </div>
  );
}

function WeekColumn({ day }) {
  const tasks = WEEK_TASKS[day.date] ?? [];
  const isToday = day.date === TODAY_DATE;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center mb-6">
        <span className="text-sm font-semibold uppercase tracking-wider mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {day.short}
        </span>
        {isToday ? (
          <span className="w-10 h-10 text-white rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: 'var(--accent)' }}>
            {day.date}
          </span>
        ) : (
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{day.date}</span>
        )}
      </div>
      <div className="flex flex-col gap-3 min-h-[600px] rounded-2xl p-2" style={{ border: '1px dashed var(--border)' }}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ border: '1px dashed var(--border)' }}>
              <Plus className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>
            <span className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>ว่าง</span>
          </div>
        ) : (
          <>
            {tasks.map((t, i) => <WeekTaskCard key={i} task={t} />)}
            <button className="mt-auto w-full py-2 rounded-lg text-sm text-center transition cursor-pointer leading-relaxed"
              style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-add-task-modal'))}>
              + เพิ่มงาน
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MonthView() {
  const { isDark } = useTheme();
  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
        <div className="grid grid-cols-7" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)' }}>
          {DAY_HEADERS.map((d) => (
            <div key={d} className="py-4 text-center text-sm font-semibold uppercase tracking-wider leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[minmax(120px,_1fr)]">
          {MONTH_CELLS.map((cell, idx) => {
            const isToday   = cell.current && cell.date === TODAY_DATE;
            const isLastCol = (idx + 1) % 7 === 0;
            const isLastRow = idx >= 28;
            const pill      = MONTH_PILLS[idx];
            return (
              <div key={idx} className="p-2 flex flex-col gap-1"
                style={{
                  borderRight: isLastCol ? 'none' : '1px solid var(--border-light)',
                  borderBottom: isLastRow ? 'none' : '1px solid var(--border-light)',
                }}>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-base font-medium mb-1 self-start`}
                  style={{
                    backgroundColor: isToday ? 'var(--accent)' : 'transparent',
                    color: isToday ? '#fff' : cell.current ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}>{cell.date}</span>
                {pill && (
                  <span className={`${pill.color} text-sm font-medium px-2 py-1 rounded truncate leading-relaxed`}>{pill.label}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeekView() {
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-7 gap-4 pb-12">
      {WEEK_DAYS.map((day) => <WeekColumn key={day.date} day={day} />)}
    </div>
  );
}

export default function SchedulePage() {
  const [view, setView] = useState('Month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className="min-h-[calc(100vh-73px)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Listening to custom event from WeekColumn */}
      {typeof window !== 'undefined' && window.addEventListener('open-add-task-modal', () => setIsModalOpen(true), { once: true })}
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold leading-relaxed" style={{ color: 'var(--text-primary)' }}>ตารางเวลา</h1>
          <p className="text-base mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>กุมภาพันธ์ 2026</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex p-1 rounded-lg items-center cursor-pointer" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            {['Month', 'Week'].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className="px-4 py-1.5 text-base rounded-md transition leading-relaxed"
                style={{
                  fontWeight: view === v ? '500' : '400',
                  backgroundColor: view === v ? 'var(--bg-secondary)' : 'transparent',
                  color: view === v ? 'var(--accent)' : 'var(--text-secondary)',
                  boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}>
                {v === 'Month' ? 'เดือน' : 'สัปดาห์'}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {[ChevronLeft, ChevronRight].map((Icon, i) => (
              <button key={i} className="p-2 rounded-md transition cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-base font-medium transition cursor-pointer shadow-md leading-relaxed hover:-translate-y-0.5 active:scale-95"
            style={{ backgroundColor: 'var(--accent)' }}
            onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" /> เพิ่มงาน
          </button>
        </div>
      </div>
      {view === 'Month' ? <MonthView /> : <WeekView />}

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
