import { useState } from 'react';
import { X, Calendar, Clock, Plus, CheckSquare, Square, Link2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';

const PRESET_TAGS = [
  { label: 'คณิตศาสตร์', bg: 'bg-[#00B4D8]/10', text: 'text-[#00B4D8]', activeBg: 'bg-[#E0F7FA]', activeText: 'text-[#00B4D8]' },
  { label: 'ภาษาอังกฤษ', bg: 'bg-[#00FF87]/10', text: 'text-[#00FF87]', activeBg: 'bg-[#E8F5E9]', activeText: 'text-[#2E7D32]' },
  { label: 'วิทยาศาสตร์', bg: 'bg-[#FFD166]/10', text: 'text-[#FFD166]', activeBg: 'bg-[#FFF8E1]', activeText: 'text-[#F57F17]' },
];

export default function AddTaskModal({ isOpen, onClose }) {
  const { addTask, tasks } = useTasks();
  const { isDark } = useTheme();
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dependencyId, setDependencyId] = useState(''); // Task Dependency
  const [subtasks, setSubtasks] = useState([{ id: 1, text: '', done: false }]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    addTask({
      title,
      date,
      time,
      tags: selectedTags,
      dependencyId: dependencyId ? parseInt(dependencyId) : null,
      subtasks: subtasks.filter(s => s.text.trim() !== '')
    });
    onClose();
    // Reset State
    setTitle(''); setDate(''); setTime(''); setSelectedTags([]); setSubtasks([{ id: 1, text: '', done: false }]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 bg-[var(--bg-primary)] border border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}>
        
        <div className="px-8 py-6 flex justify-between items-center border-b border-[var(--border)]">
          <h2 className="text-2xl font-black text-[var(--text-primary)]">สร้างงานใหม่</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-all p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-muted)]">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-7 max-h-[65vh] overflow-y-auto">
          {/* Title */}
          <div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ชื่องาน..."
              className="w-full text-2xl font-bold bg-transparent border-b-2 pb-3 outline-none transition-colors border-[var(--border)] focus:border-[var(--accent)] text-[var(--text-primary)] placeholder-[var(--text-muted)]" />
          </div>

          {/* Date & Time */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">วันที่</label>
              <div className="relative">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} 
                  className="w-full p-4 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border-2 border-[var(--border)] outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
            </div>
            <div className="w-[45%] space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">เวลา</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} 
                className="w-full p-4 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border-2 border-[var(--border)] outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
          </div>

          {/* Task Dependency Selector */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 text-[var(--text-primary)]">
              <Link2 size={18} className="opacity-70" /> ต้องทำงานนี้ให้เสร็จก่อน
            </label>
            <select value={dependencyId} onChange={(e) => setDependencyId(e.target.value)}
              className="w-full p-4 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border-2 border-[var(--border)] outline-none focus:border-[var(--accent)] transition-colors cursor-pointer">
              <option value="">-- ไม่ระบุ --</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>

          {/* Subtasks */}
          <div className="p-6 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-secondary)] space-y-4">
            <label className="font-bold text-[var(--text-primary)] block">งานย่อย</label>
            <div className="space-y-3">
              {subtasks.map((sub, idx) => (
                <div key={sub.id} className="flex items-center gap-3 group">
                  <Square size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                  <input type="text" value={sub.text} onChange={(e) => {
                    const newSub = [...subtasks]; newSub[idx].text = e.target.value; setSubtasks(newSub);
                  }} placeholder="ระบุงานย่อย..." 
                  className="bg-transparent border-b-2 border-transparent focus:border-[var(--accent)] outline-none flex-1 text-[var(--text-primary)] transition-colors pb-1 placeholder-[var(--text-muted)]" />
                </div>
              ))}
            </div>
            <button onClick={() => setSubtasks([...subtasks, { id: Date.now(), text: '', done: false }])}
              className="w-full py-3 mt-2 border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all rounded-xl font-bold flex items-center justify-center gap-2">
              <Plus size={18} /> เพิ่มงานย่อย
            </button>
          </div>
        </div>

        <div className="px-8 py-6 flex justify-end gap-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50">
          <button onClick={onClose} className="px-6 py-3 font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors">ยกเลิก</button>
          <button onClick={handleSave} className="px-8 py-3 font-bold text-white bg-[var(--accent)] rounded-xl shadow-lg shadow-[var(--accent)]/20 hover:scale-105 active:scale-95 transition-all">บันทึกงาน</button>
        </div>
      </div>
    </div>
  );
}