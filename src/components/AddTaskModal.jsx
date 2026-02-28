import { useState } from 'react';
import { X, Calendar, Clock, Plus, CheckSquare, Square } from 'lucide-react';

const PRESET_TAGS = [
  { label: 'คณิตศาสตร์', bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
  { label: 'ภาษาอังกฤษ', bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-200' },
  { label: 'วิทยาศาสตร์', bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
  { label: 'ประวัติศาสตร์', bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
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

  if (!isOpen) return null;

  const toggleTag = (label) => {
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const toggleSubtask = (id) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  };

  const updateSubtaskText = (id, text) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text } : s))
    );
  };

  const addSubtask = () => {
    setSubtasks((prev) => [...prev, { id: Date.now(), text: '', done: false }]);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ title, date, time, tags: selectedTags, subtasks });
    }
    onClose();
  };

  return (
    /* ── 1. Overlay ── */
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* ── 2. Modal Card ── */}
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 3. Header ── */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 leading-relaxed">สร้างงานใหม่</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black cursor-pointer transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── 4. Form Body ── */}
        <div className="p-6 space-y-6">

          {/* Task Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ชื่องานที่ต้องทำ..."
            className="w-full text-xl font-medium border-b border-gray-200 pb-2 focus:outline-none focus:border-black placeholder-gray-300 text-gray-900 transition leading-relaxed"
          />

          {/* Date & Time Row */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="วันครบกำหนด"
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-black transition leading-relaxed"
              />
            </div>
            <div className="w-1/3 relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="เวลา"
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-black transition leading-relaxed"
              />
            </div>
          </div>

          {/* Subject / Tags */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2 leading-relaxed">
              วิชา / หมวดหมู่
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map((tag) => {
                const active = selectedTags.includes(tag.label);
                return (
                  <button
                    key={tag.label}
                    onClick={() => toggleTag(tag.label)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer leading-relaxed
                      ${active
                        ? `${tag.bg} ${tag.text} ring-1 ${tag.ring}`
                        : `${tag.bg} ${tag.text} opacity-60 hover:opacity-100`
                      }
                    `}
                  >
                    {tag.label}
                  </button>
                );
              })}
              <button className="px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition cursor-pointer leading-relaxed">
                + เพิ่มแท็ก
              </button>
            </div>
          </div>

          {/* Sub-tasks */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2 leading-relaxed">
              งานย่อย
            </label>
            <div className="space-y-2">
              {subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 group">
                  <button
                    onClick={() => toggleSubtask(sub.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-black transition cursor-pointer"
                  >
                    {sub.done ? (
                      <CheckSquare className="h-5 w-5 text-black" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                  <input
                    type="text"
                    value={sub.text}
                    onChange={(e) => updateSubtaskText(sub.id, e.target.value)}
                    placeholder="รายละเอียดงานย่อย..."
                    className={`flex-1 text-sm border-b border-transparent focus:border-gray-200 focus:outline-none py-1 transition leading-relaxed
                      ${sub.done ? 'line-through text-gray-400' : 'text-gray-700'}
                    `}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={addSubtask}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mt-3 transition cursor-pointer leading-relaxed"
            >
              <Plus className="h-4 w-4" />
              เพิ่มงานย่อย
            </button>
          </div>
        </div>

        {/* ── 5. Footer ── */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer leading-relaxed"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg shadow-sm transition cursor-pointer leading-relaxed"
          >
            บันทึกงาน
          </button>
        </div>
      </div>
    </div>
  );
}
