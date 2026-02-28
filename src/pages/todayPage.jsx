import { useState } from 'react';
import {
  Zap,
  Clock,
  Play,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import AddTaskModal from '../components/AddTaskModal';

const mockTasks = [
  {
    id: 1,
    title: 'ทำแบบฝึกหัดแคลคูลัส',
    subject: 'คณิต',
    subjectColor: 'bg-[#61afef]/10 text-[#61afef]',
    due: '10:00',
    done: false,
  },
  {
    id: 2,
    title: 'อ่านบทที่ 5 — เคมีอินทรีย์',
    subject: 'เคมี',
    subjectColor: 'bg-[#98c379]/10 text-[#4d8f40]',
    due: '11:30',
    done: false,
  },
  {
    id: 3,
    title: 'เขียนร่างเรียงความเรื่องโมเดิร์นนิซม์',
    subject: 'อังกฤษ',
    subjectColor: 'bg-[#e5c07b]/10 text-[#b8860b]',
    due: '13:00',
    done: false,
  },
  {
    id: 4,
    title: 'ทวนโน้ตบรรยาย — โครงสร้างข้อมูล',
    subject: 'CS',
    subjectColor: 'bg-[#c678dd]/10 text-[#c678dd]',
    due: '15:00',
    done: true,
  },
];

export default function TodayPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [quickInput, setQuickInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      subject: 'ทั่วไป',
      subjectColor: 'bg-gray-100 text-gray-500',
      due: '—',
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setQuickInput('');
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#f5f6fa]">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ── Header Area ── */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-base text-[#6b7280] leading-relaxed">วันศุกร์ที่ 20 กุมภาพันธ์ 2026</p>
            <h1 className="text-4xl font-bold mt-1 text-[#1a1d23] leading-relaxed">แผนวันนี้</h1>
            <p className="text-[#6b7280] text-base mt-1 leading-relaxed">
              จัดระเบียบงาน ติดตามความก้าวหน้า และโฟกัสได้ดียิ่งขึ้น
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#61afef] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#4d9fd9] transition flex items-center gap-2 cursor-pointer shadow-sm text-base leading-relaxed"
          >
            <Plus className="h-5 w-5" />
            + เพิ่มงาน
          </button>
        </div>

        {/* ── Quick Capture Card ── */}
        <div className="bg-white border border-[#e1e4ec] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-base font-semibold text-[#1a1d23] mb-4 leading-relaxed">
            <Zap className="h-5 w-5 text-[#e5c07b]" />
            จดด่วน
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
              placeholder="คุณต้องทำอะไร?"
              className="w-full bg-[#f5f6fa] border border-[#e1e4ec] rounded-xl py-3 pl-4 pr-24 text-base text-[#1a1d23] focus:outline-none focus:ring-2 focus:ring-[#61afef]/30 placeholder:text-[#9ca3af] leading-relaxed"
            />
            <button
              onClick={handleQuickAdd}
              className="absolute right-2 bg-[#61afef] text-white px-4 py-1.5 rounded-lg text-base font-medium hover:bg-[#4d9fd9] transition cursor-pointer flex items-center gap-1 leading-relaxed"
            >
              <Plus className="h-4 w-4" />
              เพิ่ม
            </button>
          </div>
        </div>

        {/* ── Weekly Progress Card ── */}
        <div className="bg-white border border-[#e1e4ec] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between mb-4">
            <span className="font-semibold text-[#1a1d23] text-lg leading-relaxed">ความคืบหน้ารายสัปดาห์</span>
            <span className="text-base text-[#6b7280] flex items-center gap-1 leading-relaxed">
              <CheckCircle2 className="h-5 w-5 text-[#6b7280]" />
              72% ของเป้าหมาย
            </span>
          </div>
          <div className="h-3 w-full bg-[#eef0f5] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-[#c678dd] w-[72%] rounded-full transition-all duration-500" />
          </div>
          <div className="flex justify-between text-base text-[#6b7280] leading-relaxed">
            <span>ทำเสร็จ 18 / 25 งาน</span>
            <span>เหลืออีก 7 งาน</span>
          </div>
        </div>

        {/* ── Focus Tasks List Card ── */}
        <div className="bg-white border border-[#e1e4ec] rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#e1e4ec] flex justify-between items-center">
            <span className="font-semibold text-[#1a1d23] text-lg leading-relaxed">งานที่ต้องโฟกัสวันนี้</span>
            <span className="text-base text-[#6b7280] leading-relaxed">
              เสร็จ {completedCount} / {totalTasks}
            </span>
          </div>

          {/* Task Rows */}
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between px-6 py-4 border-b border-[#eef0f5] hover:bg-[#f9fafb] transition ${
                task.done ? 'opacity-50' : ''
              }`}
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggle(task.id)}
                  className="w-5 h-5 rounded border-[#e1e4ec] text-[#61afef] focus:ring-[#61afef] accent-[#61afef] cursor-pointer"
                />
                <span
                  className={`text-base font-medium leading-relaxed ${
                    task.done ? 'line-through text-[#9ca3af]' : 'text-[#1a1d23]'
                  }`}
                >
                  {task.title}
                </span>
                <span
                  className={`px-2 py-1 rounded-md text-sm font-medium leading-relaxed ${task.subjectColor}`}
                >
                  {task.subject}
                </span>
              </div>

              {/* Right */}
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1 text-base text-[#6b7280] leading-relaxed">
                  <Clock className="h-4 w-4" />
                  {task.due}
                </span>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-[#e1e4ec] rounded-lg text-base font-medium hover:bg-[#eef0f5] transition cursor-pointer text-[#6b7280] leading-relaxed">
                  <Play className="h-4 w-4" />
                  โฟกัส
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const newTask = {
            id: Date.now(),
            title: data.title || 'งานใหม่',
            subject: data.tags[0] || 'ทั่วไป',
            subjectColor: 'bg-blue-50 text-blue-600',
            due: data.time || '—',
            done: false,
          };
          setTasks((prev) => [...prev, newTask]);
        }}
      />
    </div>
  );
}
