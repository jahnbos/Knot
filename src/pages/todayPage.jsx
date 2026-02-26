import { useState } from 'react';
import {
  Zap,
  Clock,
  Play,
  Plus,
  CheckCircle2,
} from 'lucide-react';

const mockTasks = [
  {
    id: 1,
    title: 'Complete Calculus Problem Set',
    subject: 'Math',
    subjectColor: 'bg-blue-50 text-blue-600',
    due: '10:00 AM',
    done: false,
  },
  {
    id: 2,
    title: 'Read Chapter 5 — Organic Chemistry',
    subject: 'Chemistry',
    subjectColor: 'bg-emerald-50 text-emerald-600',
    due: '11:30 AM',
    done: false,
  },
  {
    id: 3,
    title: 'Write Essay Draft on Modernism',
    subject: 'English',
    subjectColor: 'bg-amber-50 text-amber-600',
    due: '1:00 PM',
    done: false,
  },
  {
    id: 4,
    title: 'Review Lecture Notes — Data Structures',
    subject: 'CS',
    subjectColor: 'bg-violet-50 text-violet-600',
    due: '3:00 PM',
    done: true,
  },
];

export default function TodayPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [quickInput, setQuickInput] = useState('');

  const completedCount = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;
    const newTask = {
      id: Date.now(),
      title: quickInput.trim(),
      subject: 'General',
      subjectColor: 'bg-gray-100 text-gray-600',
      due: '—',
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setQuickInput('');
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ── Header Area ── */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500">วันศุกร์ที่ 20 กุมภาพันธ์ 2026</p>
            <h1 className="text-3xl font-bold mt-1">Today's Plan</h1>
            <p className="text-gray-500 mt-1">
              Organize your tasks, track progress, and stay focused.
            </p>
          </div>
          <button className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>

        {/* ── Quick Capture Card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <Zap className="h-4 w-4 text-amber-500" />
            Quick Capture
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
              placeholder="What do you need to do?"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-gray-400"
            />
            <button
              onClick={handleQuickAdd}
              className="absolute right-2 bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* ── Weekly Progress Card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between mb-4">
            <span className="font-semibold text-gray-900">Weekly Progress</span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-gray-400" />
              72% of goal
            </span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-black w-[72%] rounded-full transition-all duration-500" />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>18 / 25 tasks completed</span>
            <span>7 remaining</span>
          </div>
        </div>

        {/* ── Focus Tasks List Card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-900">Today's Focus Tasks</span>
            <span className="text-sm text-gray-500">
              {completedCount} / {totalTasks} done
            </span>
          </div>

          {/* Task Rows */}
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition ${
                task.done ? 'opacity-60' : ''
              }`}
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggle(task.id)}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                />
                <span
                  className={`text-sm font-medium ${
                    task.done ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </span>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${task.subjectColor}`}
                >
                  {task.subject}
                </span>
              </div>

              {/* Right */}
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  {task.due}
                </span>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition cursor-pointer text-gray-700">
                  <Play className="h-3.5 w-3.5" />
                  Focus
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
