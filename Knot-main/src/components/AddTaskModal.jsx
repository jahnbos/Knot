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
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md bg-black/40" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}>
        
        <div className="px-8 py-5 flex justify-between items-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>สร้างงานใหม่</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-all p-1" style={{ color: 'var(--text-muted)' }}><X /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ชื่องาน..."
            className="w-full text-2xl font-bold bg-transparent border-b-2 focus:outline-none focus:border-[#9D4EDD] transition-colors"
            style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }} />

          {/* Date & Time */}
          <div className="flex gap-4">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 p-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border)]" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-[40%] p-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border)]" />
          </div>

          {/* Task Dependency Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Link2 size={16} /> ต้องทำงานนี้ให้เสร็จก่อน:
            </label>
            <select value={dependencyId} onChange={(e) => setDependencyId(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border)] outline-none focus:ring-2 focus:ring-[#9D4EDD]/30">
              <option value="">-- ไม่ระบุ --</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>

          {/* Subtasks */}
          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] space-y-3">
            <label className="font-bold block" style={{ color: 'var(--text-primary)' }}>งานย่อย</label>
            {subtasks.map((sub, idx) => (
              <div key={sub.id} className="flex items-center gap-3">
                <Square size={20} className="text-[var(--text-muted)]" />
                <input type="text" value={sub.text} onChange={(e) => {
                  const newSub = [...subtasks]; newSub[idx].text = e.target.value; setSubtasks(newSub);
                }} placeholder="ระบุงานย่อย..." className="bg-transparent border-b border-transparent focus:border-[#9D4EDD] outline-none flex-1 text-[var(--text-primary)]" />
              </div>
            ))}
            <button onClick={() => setSubtasks([...subtasks, { id: Date.now(), text: '', done: false }])}
              className="w-full py-2 border-2 border-dashed border-[var(--border)] rounded-xl text-[#9D4EDD] font-bold">+ เพิ่มงานย่อย</button>
          </div>
        </div>

        <div className="px-8 py-5 flex justify-end gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="px-6 py-2 font-bold" style={{ color: 'var(--text-secondary)' }}>ยกเลิก</button>
          <button onClick={handleSave} className="px-8 py-2 font-bold text-white bg-gradient-to-r from-[#9D4EDD] to-[#00B4D8] rounded-xl shadow-lg hover:scale-105 transition-transform">บันทึกงาน</button>
        </div>
      </div>
    </div>
  );
}