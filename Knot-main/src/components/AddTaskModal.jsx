import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, Plus, CheckSquare, Square, Link2, ChevronDown, ChevronUp, Zap, Search, Repeat, CalendarDays, AlertCircle, Timer } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';



/* ── Searchable Dependency Dropdown ── */
function DependencyPicker({ tasks, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTask = tasks.find(t => String(t.id) === String(value));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 rounded-xl bg-[var(--bg-input)] text-left border-2 outline-none transition-colors cursor-pointer flex items-center justify-between"
        style={{ borderColor: isOpen ? 'var(--accent)' : 'var(--border)', color: 'var(--text-primary)' }}
      >
        <span className={selectedTask ? '' : 'opacity-50'}>
          {selectedTask ? selectedTask.title : '-- เลือกงาน --'}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
      </button>

      {/* Clear button */}
      {selectedTask && (
        <button
          onClick={() => { onChange(''); }}
          className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={14} />
        </button>
      )}

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 w-full rounded-xl border-2 shadow-xl overflow-hidden"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          {/* Search input */}
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-input)' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหางาน..."
                autoFocus
                className="bg-transparent outline-none flex-1 text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          {/* Results */}
          <div className="max-h-48 overflow-y-auto">
            <button
              onClick={() => { onChange(''); setIsOpen(false); setSearch(''); }}
              className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-[var(--bg-hover)] transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              -- ไม่ระบุ --
            </button>
            {filtered.length > 0 ? (
              filtered.map(t => (
                <button
                  key={t.id}
                  onClick={() => { onChange(String(t.id)); setIsOpen(false); setSearch(''); }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-[var(--bg-hover)] transition-colors ${String(t.id) === String(value) ? 'bg-[var(--accent)]/10' : ''}`}
                  style={{ color: String(t.id) === String(value) ? 'var(--accent)' : 'var(--text-primary)' }}
                >
                  {t.title}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                ไม่พบงานที่ค้นหา
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddTaskModal({ isOpen, onClose, initialDetailed = false }) {
  const { addTask, tasks } = useTasks();
  const { isDark } = useTheme();
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timerDuration, setTimerDuration] = useState('25');
  const [taskCategory, setTaskCategory] = useState('ทั่วไป');
  const [priority, setPriority] = useState('low'); // Default to 'ไม่รีบ'
  const [dependencyId, setDependencyId] = useState('');
  const [subtasks, setSubtasks] = useState([{ id: 1, text: '', done: false }]);
  const [isDetailed, setIsDetailed] = useState(initialDetailed);

  // Sync isDetailed when modal opens with new props
  useEffect(() => {
    if (isOpen) {
      setIsDetailed(initialDetailed);
    }
  }, [isOpen, initialDetailed]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    addTask({
      title,
      date: isDetailed ? date : '',
      time: isDetailed ? time : '',
      task: taskCategory,
      priority: isDetailed ? priority : 'low',
      timerDuration: isDetailed ? parseInt(timerDuration) || 25 : 25,
      dependencyId: isDetailed && dependencyId ? parseInt(dependencyId) : null,
      subtasks: isDetailed ? subtasks.filter(s => s.text.trim() !== '') : []
    });
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTitle(''); setDate(''); setTime(''); setTimerDuration('25'); setTaskCategory('ทั่วไป');
    setPriority('low');
    setDependencyId('');
    setSubtasks([{ id: 1, text: '', done: false }]);
    setIsDetailed(initialDetailed);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/40 p-4 animate-in fade-in duration-300" 
         onClick={handleClose}
         style={{ pointerEvents: 'auto' }}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-[var(--bg-primary)] border border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}>
        
        <div className="px-8 py-6 flex justify-between items-center border-b border-[var(--border)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {!isDetailed && <Zap size={20} className="text-[var(--accent)]" />}
            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
              {isDetailed ? 'สร้างงานใหม่' : 'สร้างงานด่วน'}
            </h2>
          </div>
          <button onClick={handleClose} className="hover:rotate-90 transition-all p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-muted)] cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-7 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Title — always visible */}
          <div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ชื่องาน..."
              autoFocus
              className="w-full text-2xl font-bold bg-transparent border-b-2 pb-3 outline-none transition-colors border-[var(--border)] focus:border-[var(--accent)] text-[var(--text-primary)] placeholder-[var(--text-muted)] p-0" />
          </div>

          {/* Expand toggle button */}
          {!isDetailed && (
            <button
              onClick={() => setIsDetailed(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all font-bold text-sm cursor-pointer"
            >
              <ChevronDown size={18} />
              เพิ่มรายละเอียด (วันที่, เวลา, งานย่อย)
            </button>
          )}

          {/* Detailed fields — shown when expanded */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: isDetailed ? '1200px' : '0px',
              opacity: isDetailed ? 1 : 0,
            }}
          >
            <div className="space-y-7">
              {/* Collapse button */}
              <button
                onClick={() => setIsDetailed(false)}
                className="flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                <ChevronUp size={16} />
                ซ่อนรายละเอียด
              </button>

              {/* Date & Time */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-[var(--accent)]" /> วันที่
                  </label>
                  <div className="relative">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} 
                      className="w-full p-4 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border-2 border-[var(--border)] outline-none focus:border-[var(--accent)] transition-colors"
                      style={{ colorScheme: 'auto' }} />
                  </div>
                </div>
                <div className="w-[30%] space-y-2">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} className="text-[var(--accent)]" /> เวลา
                  </label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} 
                    className="w-full p-4 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border-2 border-[var(--border)] outline-none focus:border-[var(--accent)] transition-colors"
                    style={{ colorScheme: 'auto' }} />
                </div>
                <div className="w-[30%] space-y-2">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5" title="ระยะเวลาโฟกัส (นาที)">
                    <Timer size={14} className="text-[var(--accent)]" /> ตั้งเวลา
                  </label>
                  <input type="number" min="1" value={timerDuration} onChange={(e) => setTimerDuration(e.target.value)} placeholder="25"
                    className="w-full p-4 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border-2 border-[var(--border)] outline-none focus:border-[var(--accent)] transition-colors" />
                </div>
              </div>

              {/* Category (Task) */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-[var(--accent)]" /> หมวดหมู่
                </label>
                <div className="flex flex-wrap gap-2">
                  {['ทั่วไป', 'คณิตศาสตร์', 'ภาษาอังกฤษ', 'วิทยาศาสตร์', 'การศึกษา', 'สุขภาพ', 'อื่นๆ'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTaskCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 cursor-pointer ${
                        taskCategory === cat
                          ? 'bg-[var(--accent)] text-white border-transparent shadow-md'
                          : 'bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-[var(--accent)]" /> ระดับความสำคัญ
                </label>
                <div className="flex gap-3">
                  {[
                    { key: 'high', label: 'สำคัญ', dotColor: 'bg-[var(--accent-coral)]', bg: 'bg-[var(--accent-coral)]/10', activeBg: 'bg-[var(--accent-coral)]', activeText: 'text-white', text: 'text-[var(--accent-coral)]' },
                    { key: 'medium', label: 'ปกติ', dotColor: 'bg-[var(--accent-gold)]', bg: 'bg-[var(--accent-gold)]/10', activeBg: 'bg-[var(--accent-gold)]', activeText: 'text-white', text: 'text-[var(--accent-gold)]' },
                    { key: 'low', label: 'ไม่รีบ', dotColor: 'bg-[var(--accent)]', bg: 'bg-[var(--accent)]/10', activeBg: 'bg-[var(--accent)]', activeText: 'text-white', text: 'text-[var(--accent)]' },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPriority(p.key)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 cursor-pointer ${
                        priority === p.key
                          ? `${p.activeBg} ${p.activeText} border-transparent shadow-md`
                          : `bg-transparent ${p.text} border-[var(--border)] hover:opacity-80`
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${priority === p.key ? 'bg-white' : p.dotColor}`} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>


              {/* Subtasks */}
              <div className="p-6 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-secondary)] space-y-4">
                <label className="font-bold text-[var(--text-primary)] block">งานย่อย</label>
                <div className="space-y-3">
                  {subtasks.map((sub, idx) => (
                    <div key={sub.id} className="flex items-center gap-3 group">
                      <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold text-xs">
                        {idx + 1}
                      </div>
                      <input type="text" value={sub.text} onChange={(e) => {
                        const newSub = [...subtasks]; newSub[idx].text = e.target.value; setSubtasks(newSub);
                      }} placeholder="ระบุรายละเอียดขั้นตอน..." 
                      className="bg-transparent border-b-2 border-transparent focus:border-[var(--accent)] outline-none flex-1 transition-colors pb-1 placeholder-[var(--text-muted)] text-[var(--text-primary)]" />
                    </div>
                  ))}
                </div>
                <button onClick={() => setSubtasks([...subtasks, { id: Date.now(), text: '', done: false }])}
                  className="w-full py-3 mt-2 border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer">
                  <Plus size={18} /> เพิ่มงานย่อย
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 flex justify-end gap-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50">
          <button onClick={handleClose} className="px-6 py-3 font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors cursor-pointer">ยกเลิก</button>
          <button onClick={handleSave} className="px-8 py-3 font-bold text-white bg-[var(--accent)] rounded-xl shadow-lg shadow-[var(--accent)]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">บันทึกงาน</button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}