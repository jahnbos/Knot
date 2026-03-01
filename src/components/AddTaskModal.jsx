import { useState } from 'react';
import { X, Calendar, Clock, Plus, CheckSquare, Square } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const PRESET_TAGS = [
  { label: 'คณิตศาสตร์', bg: 'bg-[#00B4D8]/10', text: 'text-[#00B4D8]', ring: 'ring-[#00B4D8]/30', activeBg: 'bg-[#E0F7FA]', activeText: 'text-[#00B4D8]' },
  { label: 'ภาษาอังกฤษ', bg: 'bg-[#00FF87]/10', text: 'text-[#00FF87]', ring: 'ring-[#00FF87]/30', activeBg: 'bg-[#E8F5E9]', activeText: 'text-[#2E7D32]' },
  { label: 'วิทยาศาสตร์', bg: 'bg-[#FFD166]/10', text: 'text-[#FFD166]', ring: 'ring-[#FFD166]/30', activeBg: 'bg-[#FFF8E1]', activeText: 'text-[#F57F17]' },
  { label: 'ประวัติศาสตร์', bg: 'bg-[#9D4EDD]/10', text: 'text-[#9D4EDD]', ring: 'ring-[#9D4EDD]/30', activeBg: 'bg-[#F3E5F5]', activeText: 'text-[#6A1B9A]' },
];

export default function AddTaskModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [subtasks, setSubtasks] = useState([
    { id: 1, text: 'อ่านทบทวนบทที่ 1', done: false },
    { id: 2, text: 'ทำโจทย์ 10 ข้อ', done: false },
  ]);
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const toggleTag = (label) => setSelectedTags((prev) => prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]);
  const toggleSubtask = (id) => setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  const updateSubtaskText = (id, text) => setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
  const addSubtask = () => setSubtasks((prev) => [...prev, { id: Date.now(), text: '', done: false }]);
  const handleSave = () => { if (onSave) onSave({ title, date, time, tags: selectedTags, subtasks }); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="px-8 py-5 flex justify-between items-center"
          style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
          <h2 className="text-xl font-bold leading-relaxed tracking-tight" style={{ color: 'var(--text-primary)' }}>สร้างงานใหม่</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-all duration-300 cursor-pointer p-1 rounded-full"
            style={{ color: 'var(--text-muted)' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-7">
          {/* Task Title */}
          <div className="relative group">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ชื่องานที่ต้องทำ..."
              className="w-full text-2xl font-bold border-b-2 pb-2 bg-transparent focus:outline-none transition-colors duration-300 leading-relaxed"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9D4EDD] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
          </div>

          {/* Date & Time */}
          <div className="flex gap-5">
            <div className="flex-1 relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors group-focus-within:text-[#9D4EDD]" style={{ color: 'var(--text-muted)' }} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl pl-12 pr-4 py-4 text-base font-medium focus:outline-none focus:ring-2 focus:border-[#9D4EDD] transition-all leading-relaxed"
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div className="w-[40%] relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors group-focus-within:text-[#9D4EDD]" style={{ color: 'var(--text-muted)' }} />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-2xl pl-12 pr-4 py-4 text-base font-medium focus:outline-none focus:ring-2 focus:border-[#9D4EDD] transition-all leading-relaxed"
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-semibold tracking-wide block mb-3 leading-relaxed" style={{ color: 'var(--text-primary)' }}>วิชา / หมวดหมู่</label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_TAGS.map((tag) => {
                const active = selectedTags.includes(tag.label);
                return (
                  <button key={tag.label} onClick={() => toggleTag(tag.label)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm active:scale-95 leading-relaxed ${
                      active ? `${tag.activeBg} ${tag.activeText} shadow-md scale-105` : `${tag.bg} ${tag.text} hover:opacity-80`
                    }`}>
                    {tag.label}
                  </button>
                );
              })}
              <button className="px-4 py-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer leading-relaxed"
                style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
                + เพิ่มหมวดหมู่
              </button>
            </div>
          </div>

          {/* Subtasks */}
          <div className="p-5 rounded-3xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <label className="text-base font-bold tracking-wide block mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>งานย่อย (Step-by-step)</label>
            <div className="space-y-4">
              {subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center gap-4 group px-4 py-4 rounded-2xl shadow-sm"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <button onClick={() => toggleSubtask(sub.id)}
                    className={`flex-shrink-0 transition-all duration-300 cursor-pointer ${sub.done ? 'text-[#9D4EDD] scale-110' : 'hover:text-[#9D4EDD]'}`}
                    style={{ color: sub.done ? undefined : 'var(--text-muted)' }}>
                    {sub.done ? <CheckSquare className="h-6 w-6" fill="currentColor" opacity="0.2" /> : <Square className="h-6 w-6" strokeWidth={1.5} />}
                  </button>
                  <input type="text" value={sub.text} onChange={(e) => updateSubtaskText(sub.id, e.target.value)}
                    placeholder="รายละเอียดงานย่อย..."
                    className={`flex-1 text-base font-medium bg-transparent border-b border-transparent focus:border-[#9D4EDD] focus:outline-none py-1 transition-all leading-relaxed ${sub.done ? 'line-through opacity-60' : ''}`}
                    style={{ color: sub.done ? 'var(--text-muted)' : 'var(--text-primary)' }} />
                  <X className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:text-red-500 cursor-pointer transition-all" style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
            <button onClick={addSubtask}
              className="flex items-center justify-center gap-2 w-full mt-5 py-4 text-base font-bold rounded-2xl transition-all cursor-pointer leading-relaxed hover:bg-[#9D4EDD]/10 focus:ring-2 focus:ring-[#9D4EDD]/20"
              style={{ border: '2px dashed var(--border)', backgroundColor: 'transparent', color: '#9D4EDD' }}>
              <Plus className="h-5 w-5" /> เพิ่มงานย่อย
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex justify-end gap-4"
          style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold rounded-xl hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            ยกเลิก
          </button>
          <button onClick={handleSave}
            className="px-8 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#9D4EDD] to-[#00B4D8] hover:opacity-90 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer leading-relaxed">
            บันทึกงาน
          </button>
        </div>
      </div>
    </div>
  );
}
