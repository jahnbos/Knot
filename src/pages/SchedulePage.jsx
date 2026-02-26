import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  AlarmClock,
} from 'lucide-react';

// ── Week data (Feb 16–22 2026, highlighted day = Friday 20) ──────────────────
const WEEK_DAYS = [
  { short: 'Sun', date: 16 },
  { short: 'Mon', date: 17 },
  { short: 'Tue', date: 18 },
  { short: 'Wed', date: 19 },
  { short: 'Thu', date: 20 }, // ← today (highlighted)
  { short: 'Fri', date: 21 },
  { short: 'Sat', date: 22 },
];

const TODAY_DATE = 20; // Friday Feb 20

// ── Task card definitions per column ─────────────────────────────────────────
const COLUMN_TASKS = {
  16: [], // Sunday → empty / free day
  17: [
    {
      id: 'm1',
      time: '9:00 AM',
      title: 'Linear Algebra Problem Set',
      label: 'MATH',
      color: 'bg-blue-50 border-blue-100',
      timeColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      labelColor: 'text-blue-500',
    },
  ],
  18: [
    {
      id: 't1',
      time: '11:00 AM',
      title: 'Physics Lab Report',
      label: 'SCIENCE',
      color: 'bg-amber-50 border-amber-100',
      timeColor: 'text-amber-600',
      titleColor: 'text-amber-900',
      labelColor: 'text-amber-500',
    },
  ],
  19: [
    {
      id: 'w1',
      time: '2:00 PM',
      title: 'History Essay Draft',
      label: 'HISTORY',
      color: 'bg-purple-50 border-purple-100',
      timeColor: 'text-purple-600',
      titleColor: 'text-purple-900',
      labelColor: 'text-purple-500',
    },
    {
      id: 'w2',
      time: '4:30 PM',
      title: 'Group Study — Econ',
      label: 'ECONOMICS',
      color: 'bg-purple-50 border-purple-100',
      timeColor: 'text-purple-600',
      titleColor: 'text-purple-900',
      labelColor: 'text-purple-500',
    },
  ],
  20: [
    {
      id: 'th1',
      time: '10:00 AM',
      title: 'Calculus Problem Set',
      label: 'MATH',
      color: 'bg-red-50 border-red-100',
      timeColor: 'text-red-600',
      titleColor: 'text-red-900',
      labelColor: 'text-red-500',
    },
    {
      id: 'th2',
      time: '3:00 PM',
      title: 'Data Structures Review',
      label: 'CS',
      color: 'bg-red-50 border-red-100',
      timeColor: 'text-red-600',
      titleColor: 'text-red-900',
      labelColor: 'text-red-500',
    },
  ],
  21: [
    {
      id: 'f1',
      time: '1:00 PM',
      title: 'English Essay Final Draft',
      label: 'ENGLISH',
      color: 'bg-green-50 border-green-100',
      timeColor: 'text-green-600',
      titleColor: 'text-green-900',
      labelColor: 'text-green-500',
    },
  ],
  22: [], // Saturday → empty / free day
};

// ── Task Card ─────────────────────────────────────────────────────────────────
function TaskCard({ task }) {
  return (
    <div className={`${task.color} rounded-xl p-3 border flex flex-col gap-1`}>
      <span className={`flex items-center gap-1 text-xs font-medium ${task.timeColor}`}>
        <Clock className="w-3 h-3" />
        {task.time}
      </span>
      <span className={`text-sm font-bold ${task.titleColor} leading-snug`}>
        {task.title}
      </span>
      <span className={`text-[10px] uppercase font-semibold tracking-wider ${task.labelColor}`}>
        {task.label}
      </span>
    </div>
  );
}

// ── Day Column ─────────────────────────────────────────────────────────────────
function DayColumn({ day }) {
  const tasks = COLUMN_TASKS[day.date] ?? [];
  const isToday = day.date === TODAY_DATE;
  const isEmpty = tasks.length === 0;

  return (
    <div className="flex flex-col">
      {/* Column Header */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {day.short}
        </span>
        {isToday ? (
          <span className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full text-2xl font-bold">
            {day.date}
          </span>
        ) : (
          <span className="text-2xl font-bold text-gray-800">{day.date}</span>
        )}
      </div>

      {/* Column Body */}
      <div className="flex flex-col gap-3 min-h-[600px] bg-transparent rounded-2xl border border-dashed border-gray-200 p-2">
        {isEmpty ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <div className="w-12 h-12 border border-dashed border-gray-300 rounded-full flex items-center justify-center mb-2">
              <AlarmClock className="w-5 h-5 text-gray-300" />
            </div>
            <span className="text-sm text-gray-400">Free</span>
          </div>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {/* Add to column CTA */}
            <button className="mt-auto w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 text-center hover:bg-gray-50 transition cursor-pointer">
              + Add
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const [view, setView] = useState('week'); // 'month' | 'week'

  return (
    <div className="min-h-[calc(100vh-57px)] bg-gray-50 pb-10">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-end">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500 mt-1">February 2026</p>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Month / Week toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-1.5 text-sm rounded-md transition cursor-pointer ${
                view === 'month'
                  ? 'font-medium bg-white shadow-sm text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-1.5 text-sm rounded-md transition cursor-pointer ${
                view === 'week'
                  ? 'font-medium bg-white shadow-sm text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Week
            </button>
          </div>

          {/* Chevron nav */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Add Task */}
          <button className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer text-sm">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* ── Calendar Grid ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-7 gap-4">
        {WEEK_DAYS.map((day) => (
          <DayColumn key={day.date} day={day} />
        ))}
      </div>

    </div>
  );
}
