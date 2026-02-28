import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

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
  { short: 'อา.', date: 15 },
  { short: 'จ.', date: 16 },
  { short: 'อ.', date: 17 },
  { short: 'พ.', date: 18 },
  { short: 'พฤ.', date: 19 },
  { short: 'ศ.', date: 20 },
  { short: 'ส.', date: 21 },
];

const WEEK_TASKS = {
  16: [{ time: '9:00', title: 'แบบฝึกหัดพีชคณิตเชิงเส้น', label: 'คณิต',
    card: 'bg-[#61afef]/8 border-[#61afef]/20', timeC: 'text-[#61afef]', titleC: 'text-[#1a1d23]', labelC: 'text-[#61afef]/70' }],
  17: [{ time: '11:00', title: 'รายงานแล็บฟิสิกส์', label: 'วิทย์',
    card: 'bg-[#e5c07b]/8 border-[#e5c07b]/20', timeC: 'text-[#b8860b]', titleC: 'text-[#1a1d23]', labelC: 'text-[#b8860b]/70' }],
  18: [
    { time: '14:00', title: 'ร่างเรียงความประวัติศาสตร์', label: 'ประวัติ',
      card: 'bg-[#c678dd]/8 border-[#c678dd]/20', timeC: 'text-[#a855c4]', titleC: 'text-[#1a1d23]', labelC: 'text-[#a855c4]/70' },
    { time: '16:30', title: 'ติวกลุ่ม — เศรษฐศาสตร์', label: 'เศรษฐฯ',
      card: 'bg-[#c678dd]/8 border-[#c678dd]/20', timeC: 'text-[#a855c4]', titleC: 'text-[#1a1d23]', labelC: 'text-[#a855c4]/70' },
  ],
  20: [
    { time: '10:00', title: 'สอบคณิตศาสตร์', label: 'คณิต',
      card: 'bg-[#e06c75]/8 border-[#e06c75]/20', timeC: 'text-[#e06c75]', titleC: 'text-[#1a1d23]', labelC: 'text-[#e06c75]/70' },
    { time: '15:00', title: 'ทบทวน Data Structures', label: 'CS',
      card: 'bg-[#e06c75]/8 border-[#e06c75]/20', timeC: 'text-[#e06c75]', titleC: 'text-[#1a1d23]', labelC: 'text-[#e06c75]/70' },
  ],
  21: [{ time: '13:00', title: 'อ่านภาษาอังกฤษ', label: 'อังกฤษ',
    card: 'bg-[#98c379]/8 border-[#98c379]/20', timeC: 'text-[#4d8f40]', titleC: 'text-[#1a1d23]', labelC: 'text-[#4d8f40]/70' }],
};

function WeekTaskCard({ task }) {
  return (
    <div className={`${task.card} rounded-xl p-3 border flex flex-col gap-1`}>
      <span className={`flex items-center gap-1 text-sm font-medium leading-relaxed ${task.timeC}`}>
        <Clock className="w-3.5 h-3.5" />
        {task.time}
      </span>
      <span className={`text-base font-bold leading-relaxed ${task.titleC}`}>{task.title}</span>
      <span className={`text-xs uppercase font-semibold tracking-wider leading-relaxed ${task.labelC}`}>{task.label}</span>
    </div>
  );
}

function WeekColumn({ day }) {
  const tasks  = WEEK_TASKS[day.date] ?? [];
  const isToday = day.date === TODAY_DATE;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center mb-6">
        <span className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-2 leading-relaxed">
          {day.short}
        </span>
        {isToday ? (
          <span className="w-10 h-10 bg-[#61afef] text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {day.date}
          </span>
        ) : (
          <span className="text-2xl font-bold text-[#1a1d23]">{day.date}</span>
        )}
      </div>

      <div className="flex flex-col gap-3 min-h-[600px] rounded-2xl border border-dashed border-[#e1e4ec] p-2">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <div className="w-12 h-12 border border-dashed border-[#d1d5db] rounded-full flex items-center justify-center mb-2">
              <Plus className="w-4 h-4 text-[#9ca3af]" />
            </div>
            <span className="text-base text-[#9ca3af] leading-relaxed">ว่าง</span>
          </div>
        ) : (
          <>
            {tasks.map((t, i) => <WeekTaskCard key={i} task={t} />)}
            <button className="mt-auto w-full py-2 border border-dashed border-[#e1e4ec] rounded-lg text-sm text-[#9ca3af] text-center hover:bg-[#f5f6fa] transition cursor-pointer leading-relaxed">
              + เพิ่มงาน
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MonthView() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="bg-white border border-[#e1e4ec] rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-[#e1e4ec] bg-[#f9fafb]">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="py-4 text-center text-sm font-semibold text-[#6b7280] uppercase tracking-wider leading-relaxed">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[minmax(120px,_1fr)]">
          {MONTH_CELLS.map((cell, idx) => {
            const isToday   = cell.current && cell.date === TODAY_DATE;
            const isLastCol = (idx + 1) % 7 === 0;
            const isLastRow = idx >= 28;
            const pill      = MONTH_PILLS[idx];

            return (
              <div
                key={idx}
                className={`p-2 flex flex-col gap-1 border-[#eef0f5]
                  ${isLastCol ? '' : 'border-r'}
                  ${isLastRow ? '' : 'border-b'}
                `}
              >
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-base font-medium mb-1 self-start
                    ${isToday
                      ? 'bg-[#61afef] text-white'
                      : cell.current
                        ? 'text-[#1a1d23]'
                        : 'text-[#d1d5db]'
                    }`}
                >
                  {cell.date}
                </span>

                {pill && (
                  <span className={`${pill.color} text-sm font-medium px-2 py-1 rounded truncate leading-relaxed`}>
                    {pill.label}
                  </span>
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

  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#f5f6fa]">

      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-[#1a1d23] leading-relaxed">ตารางเวลา</h1>
          <p className="text-base text-[#6b7280] mt-1 leading-relaxed">กุมภาพันธ์ 2026</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#eef0f5] p-1 rounded-lg items-center cursor-pointer">
            <button
              onClick={() => setView('Month')}
              className={`px-4 py-1.5 text-base rounded-md transition leading-relaxed
                ${view === 'Month'
                  ? 'font-medium bg-white shadow-sm text-[#61afef]'
                  : 'text-[#6b7280] hover:text-[#1a1d23]'
                }`}
            >
              เดือน
            </button>
            <button
              onClick={() => setView('Week')}
              className={`px-4 py-1.5 text-base rounded-md transition leading-relaxed
                ${view === 'Week'
                  ? 'font-medium bg-white shadow-sm text-[#61afef]'
                  : 'text-[#6b7280] hover:text-[#1a1d23]'
                }`}
            >
              สัปดาห์
            </button>
          </div>

          <div className="flex gap-1">
            <button className="p-2 text-[#6b7280] hover:text-[#1a1d23] hover:bg-[#eef0f5] rounded-md transition cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#6b7280] hover:text-[#1a1d23] hover:bg-[#eef0f5] rounded-md transition cursor-pointer">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button className="flex items-center gap-2 bg-[#61afef] text-white px-5 py-2.5 rounded-lg text-base font-medium hover:bg-[#4d9fd9] transition cursor-pointer shadow-sm leading-relaxed">
            <Plus className="w-5 h-5" />
            เพิ่มงาน
          </button>
        </div>
      </div>

      {view === 'Month' ? <MonthView /> : <WeekView />}

    </div>
  );
}
