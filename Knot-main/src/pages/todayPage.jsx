import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Zap,
  Clock,
  Play,
  Plus,
  CheckCircle2,
  X,
  Pause,
  Inbox,
  ListTodo,
  CalendarDays,
  Target,
  CheckSquare,
  Square,
  ChevronRight,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Trash2,
  StickyNote,
  Brain,
  Send,
  Repeat
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';

/* ── Focus Plant / Virtual Desk Component ── */
const FocusDesk = ({ progress, isRunning }) => {
  return (
    <div className="relative w-80 h-72 flex flex-col items-center justify-end mb-10 group">
      {/* Ambient Desk Light */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[500px] h-[500px] rounded-full transition-opacity duration-1000 pointer-events-none`} 
           style={{ 
             background: 'radial-gradient(closest-side, var(--accent) 0%, transparent 100%)',
             opacity: isRunning ? 0.12 : 0 
           }} />
       
      <div className="relative z-10 w-48 h-64 flex flex-col items-center justify-end">
        <div className="relative flex flex-col items-center justify-end w-24 h-full mb-[-10px] z-10">
          <div 
            className="w-3.5 bg-[#8bc34a] rounded-t-full origin-bottom transition-all duration-1000 shadow-sm relative"
            style={{ height: `${20 + Math.min(progress, 1) * 160}px` }}
          >
            {/* ใบไม้จะค่อยๆ โผล่ตาม Progress */}
            <div className="absolute w-12 h-12 bg-[#689f38] transition-all duration-700 origin-bottom-right shadow-sm"
                 style={{ borderRadius: '100% 0% 100% 0%', left: '-44px', bottom: '25%', transform: `scale(${Math.min(1, Math.max(0, (progress - 0.1) * 3))}) rotate(-15deg)`, opacity: progress > 0.1 ? 1 : 0 }} />
            <div className="absolute w-10 h-10 bg-[#7cb342] transition-all duration-700 origin-bottom-left shadow-sm"
                 style={{ borderRadius: '0% 100% 0% 100%', right: '-36px', bottom: '45%', transform: `scale(${Math.min(1, Math.max(0, (progress - 0.4) * 3))}) rotate(15deg)`, opacity: progress > 0.4 ? 1 : 0 }} />
            
            {/* ดอกไม้/ผลไม้ที่จะบานตอนใกล้เสร็จ (Crown) */}
            <div className="absolute w-14 h-14 bg-gradient-to-tr from-[#FFD166] to-[#FF9F1C] shadow-lg transition-all duration-1000"
                 style={{ borderRadius: '100% 0% 100% 0%', left: '-22px', top: '-25px', transform: `scale(${Math.min(1, Math.max(0, (progress - 0.8) * 5))}) rotate(45deg)`, opacity: progress > 0.8 ? 1 : 0 }} />
          </div>
        </div>
        
        {/* Pot */}
        <div className="relative w-28 h-24 z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D98A5F] to-[#8C5226] rounded-b-3xl shadow-xl" />
          <div className="absolute top-0 left-[-4px] right-[-4px] h-6 bg-[#C4754B] rounded-xl shadow-md border-b border-black/10" />
        </div>
      </div>
    </div>
  );
};

/* ── Pomodoro Fullscreen Modal ── */
function PomodoroModal({ isOpen, onClose, task, onCompleteTask }) {
  const TOTAL_TIME = task?.timerDuration ? task.timerDuration * 60 : 25 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [scratchText, setScratchText] = useState('');
  const { addDistraction } = useTasks();
  const audioRef = useRef(null);

  useEffect(() => {
    if (isOpen && task) {
      setTimeLeft(task.timerDuration ? task.timerDuration * 60 : 25 * 60);
      setIsRunning(false);
      setShowConfirmClose(false);
    }
  }, [isOpen, task]);

  useEffect(() => {
    let int;
    if (isRunning && timeLeft > 0) {
      int = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      onCompleteTask(task.id);
    }
    return () => clearInterval(int);
  }, [isRunning, timeLeft, task, onCompleteTask]);

  if (!isOpen || !task) return null;

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const handleCloseClick = () => {
    setIsRunning(false);
    setShowConfirmClose(true);
  };

  const confirmClose = () => {
    onClose();
  };

  const cancelClose = () => {
    setShowConfirmClose(false);
  };

  const handleDumpDistraction = () => {
    if (!scratchText.trim()) return;
    addDistraction(scratchText);
    setScratchText('');
    setIsScratchpadOpen(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex flex-col animate-in fade-in duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* Top Left Close Button */}
      <div className="absolute top-6 left-6 z-20 flex gap-4">
        <button 
          onClick={handleCloseClick} 
          className="p-3 rounded-full transition-colors cursor-pointer hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--text-primary)' }}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Right Scratchpad Button */}
      <div className="absolute bottom-10 right-10 z-20 flex flex-col items-end gap-4">
        {isScratchpadOpen && (
          <div className="w-80 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
            
            <h4 className="font-black mb-3 flex items-center gap-2 text-lg" style={{ color: 'var(--text-primary)' }}>
              <Brain size={22} className="text-[var(--accent)]" /> จดไว้ก่อน
            </h4>
            <textarea 
              autoFocus
              value={scratchText} 
              onChange={(e) => setScratchText(e.target.value)}
              placeholder="นึกอะไรได้ จดทิ้งไว้ที่นี่..."
              className="w-full h-40 bg-transparent border-none outline-none resize-none italic leading-relaxed text-base font-medium"
              style={{ color: 'var(--text-primary)' }}
            />
            <button 
              onClick={handleDumpDistraction}
              className="w-full mt-3 py-3 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Send size={18} /> บันทึกแล้วโฟกัสต่อ
            </button>
          </div>
        )}

        <button 
          onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
          className="h-14 w-14 rounded-full transition-all cursor-pointer shadow-2xl flex items-center justify-center group hover:scale-110 active:scale-95"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          <StickyNote size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute right-full mr-4 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl" style={{ color: 'var(--text-primary)' }}>
            จดไว้ก่อน
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className={`transition-opacity duration-300 flex flex-col items-center justify-center ${showConfirmClose ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
          
          {/* Timer Display */}
          <div className="text-[10rem] md:text-[14rem] font-medium tabular-nums tracking-tighter leading-none mb-4 -mt-16 font-sans" style={{ color: 'var(--text-primary)' }}>
            {mins}:{secs}
          </div>
          
          {/* Task Info */}
          <h2 className="text-2xl md:text-3xl font-medium mb-3 text-center" style={{ color: 'var(--text-secondary)' }}>
            {task.title}
          </h2>
          
          {/* Task Tags/Context */}
          <div className="text-sm font-bold tracking-widest uppercase mb-12 opacity-50" style={{ color: 'var(--text-secondary)' }}>
            {task.task || 'ทั่วไป'}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsRunning(!isRunning)} 
              className="px-8 py-3.5 rounded-full border border-[var(--border)] font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-2 hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-primary)', backgroundColor: 'transparent' }}
            >
              {isRunning ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              {isRunning ? 'หยุดชั่วคราว' : 'เริ่มจับเวลา'}
            </button>
            <button 
              onClick={() => onCompleteTask(task.id)} 
              className="px-8 py-3.5 rounded-full font-bold shadow-lg shadow-[var(--accent)]/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              <CheckSquare className="h-4 w-4" />
              ทำงานเสร็จแล้ว
            </button>
          </div>
        </div>

        {/* Custom Confirm Dialog Overlay */}
        {showConfirmClose && (
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <div className="border rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
                 style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <h3 className="font-bold text-xl text-center mb-2" style={{ color: 'var(--text-primary)' }}>แน่ใจหรือไม่ที่จะออก?</h3>
              <p className="text-center text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>การจับเวลาปัจจุบันจะถูกยกเลิก</p>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={cancelClose}
                  className="px-6 py-2.5 rounded-xl font-medium transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={confirmClose}
                  className="px-6 py-2.5 rounded-xl font-bold border transition-colors hover:scale-105 active:scale-95"
                  style={{ backgroundColor: 'var(--accent-coral-light, rgba(239, 68, 68, 0.1))', color: 'var(--accent-coral)', borderColor: 'var(--accent-coral)' }}
                >
                  ยืนยันการออก
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

/* ── Subtasks Modal ── */
function SubtasksModal({ isOpen, onClose, task, onUpdateTask }) {
  if (!isOpen || !task) return null;

  const subtasksTotal = task.subtasks?.length ?? 0;

  const PRIORITY_MAP = {
    high:   { label: 'สำคัญ',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
    medium: { label: 'ปกติ',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
    low:    { label: 'ไม่รีบ', color: '#0d9488', bg: 'rgba(13,148,136,0.1)'  },
  };
  const p = PRIORITY_MAP[task.priority] ?? PRIORITY_MAP.low;

  const formatDate = (d) => {
    if (!d) return null;
    return new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/50 p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
           style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', borderTop: `3px solid ${p.color}` }}
           onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="px-7 pt-6 pb-5 flex justify-between items-start">
          <div className="flex-1 pr-4">
            {/* Category badge */}
            {task.task && (
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                    style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                {task.task}
              </span>
            )}
            <h2 className="text-2xl font-black leading-snug" style={{ color: 'var(--text-primary)' }}>
              {task.title}
            </h2>
          </div>
          <button onClick={onClose}
                  className="shrink-0 p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors cursor-pointer mt-1"
                  style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* ── Info chips ── */}
        <div className="px-7 flex flex-wrap gap-2 mb-6">
          {/* Priority */}
          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: p.bg, color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.label}
          </span>
          {/* Time */}
          {task.time && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              <Clock size={12} /> {task.time} น.
            </span>
          )}
          {/* Date */}
          {task.date && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              <CalendarDays size={12} /> {formatDate(task.date)}
            </span>
          )}
          {/* Done status */}
          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: task.done ? 'rgba(20,184,166,0.1)' : 'var(--bg-tertiary)',
                         color: task.done ? '#0d9488' : 'var(--text-muted)' }}>
            {task.done ? <CheckCircle2 size={12} /> : <Square size={12} />}
            {task.done ? 'เสร็จแล้ว' : 'ยังไม่เสร็จ'}
          </span>
        </div>

        {/* ── Subtasks ── */}
        <div className="px-7 pb-7">
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            {/* Subtask header + progress */}
            <div className="px-5 py-4 flex items-center justify-between border-b"
                 style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <ListTodo size={16} className="text-[var(--accent)]" />
                <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>งานย่อย</span>
              </div>
            </div>

            {/* Subtask list */}
            {subtasksTotal > 0 ? (
              <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
                {task.subtasks.map((sub) => (
                  <div key={sub.id}
                       className="flex items-center gap-3 px-5 py-4"
                       style={{ borderColor: 'var(--border)' }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                    <span className="flex-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {sub.text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="text-sm font-medium opacity-40" style={{ color: 'var(--text-secondary)' }}>
                  ไม่มีงานย่อย
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-7 pb-6">
          <button onClick={onClose}
                  className="w-full py-3.5 rounded-2xl font-black text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--accent)' }}>
            ปิด
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

/* ── Main TodayPage ── */
export default function TodayPage() {
  const { tasks, setTasks, addTask, updateTask, distractions, setDistractions } = useTasks();
  const [quickInput, setQuickInput] = useState('');
  const [activePomodoroTask, setActivePomodoroTask] = useState(null);
  const [activeSubtasksTaskId, setActiveSubtasksTaskId] = useState(null);
  const [distractionsOpen, setDistractionsOpen] = useState(true);
  const [toggledId, setToggledId] = useState(null);
  const activeSubtasksTask = tasks.find(t => t.id === activeSubtasksTaskId) ?? null;
  const { isDark } = useTheme();

  // จัดการวันที่ปัจจุบันแบบภาษาไทย
  const displayDate = new Intl.DateTimeFormat('th-TH', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  }).format(new Date());

  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  
  // กรองงานวันนี้และงานที่ไม่มีกำหนดวันที่ พร้อมเรียงลำดับความสำคัญ
  const todayTasks = useMemo(() => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const filtered = tasks.filter(t => t.date === todayStr || !t.date);
    
    return filtered.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const weightA = priorityWeight[a.priority] || 0;
      const weightB = priorityWeight[b.priority] || 0;
      return weightB - weightA;
    });
  }, [tasks, todayStr]);

  const completedCount = todayTasks.filter((t) => t.status === 'completed' || t.done).length;
  const targetPct = todayTasks.length ? Math.round((completedCount / todayTasks.length) * 100) : 0;

  // ให้เส้น Progress Bar เริ่มจาก 0 แล้วค่อยๆ ขยาย
  const [barReady, setBarReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBarReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Animated percentage counter
  const [animatedPct, setAnimatedPct] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  useEffect(() => {
    const duration = 800;
    const startPct = animatedPct;
    const startCompleted = animatedCompleted;
    const diffPct = targetPct - startPct;
    const diffCompleted = completedCount - startCompleted;
    if (diffPct === 0 && diffCompleted === 0) return;
    const startTime = performance.now();
    let raf;
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(Math.round(startPct + diffPct * ease));
      setAnimatedCompleted(Math.round(startCompleted + diffCompleted * ease));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [targetPct, completedCount]);

  const handleToggle = (id) => {
    setToggledId(id);
    setTimeout(() => setToggledId(null), 600);
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isNowDone = !t.done;
        return { ...t, done: isNowDone, status: isNowDone ? 'completed' : 'todo' };
      }
      return t;
    }));
  };

  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;
    addTask({ 
      title: quickInput.trim(), 
      date: todayStr, 
      task: 'ทั่วไป', 
      status: 'todo',
      priority: 'low' 
    });
    setQuickInput('');
  };

  return (
    <div className="relative min-h-screen pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Toggle Animation Styles */}
      <style>{`
        @keyframes toggleBounce {
          0% { transform: scale(1); }
          20% { transform: scale(0.7); }
          50% { transform: scale(1.3) rotate(10deg); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes toggleRing {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .toggle-bounce { animation: toggleBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .toggle-ring::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 12px;
          border: 3px solid var(--accent);
          animation: toggleRing 0.6s ease-out forwards;
          pointer-events: none;
        }
      `}</style>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="font-medium opacity-60 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <CalendarDays size={18} /> {displayDate}
            </p>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>แผนวันนี้</h1>
          </div>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-global-add-task', { detail: { isDetailed: true } }))} 
                  className="bg-[var(--accent)] text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-[var(--accent)]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
            <Plus className="h-6 w-6 inline mr-1" strokeWidth={3} /> เพิ่มงานใหม่
          </button>
        </div>

        {/* Quick Capture Card */}
        <div className="rounded-2xl p-8 shadow-xl border transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 font-black text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
            <Zap className="h-6 w-6 text-[var(--accent)]" /> จดด่วน (Quick Note)
          </div>
          <div className="relative flex items-center group">
            <input type="text" value={quickInput} onChange={(e) => setQuickInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                   placeholder="นึกอะไรออกพิมพ์ทิ้งไว้ที่นี่..." 
                   className="w-full rounded-2xl py-4 pl-6 pr-28 outline-none border-2 transition-all focus:ring-4 focus:ring-[var(--accent)]/10" 
                   style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border)' }} />
            <button onClick={handleQuickAdd} className="absolute right-3 bg-[var(--accent)] text-white px-6 py-2 rounded-xl font-bold shadow-md hover:opacity-90 cursor-pointer">
              เพิ่มงาน
            </button>
          </div>
        </div>

        {/* Weekly Progress Card */}
        <div className="rounded-2xl p-8 border shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center mb-4 font-black text-xl" style={{ color: 'var(--text-primary)' }}>
            <span className="flex items-center gap-2">
              <Target size={24} className="text-[var(--accent)]" /> ความคืบหน้าของวัน
            </span>
            <span className="text-[var(--accent)] tabular-nums">{animatedPct}%</span>
          </div>
          <div className="h-4 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[#00B4D8] rounded-full transition-none" 
                 style={{ width: barReady ? `${animatedPct}%` : '0%' }} />
          </div>
          <p className="mt-4 font-medium opacity-60" style={{ color: 'var(--text-secondary)' }}>
            ทำเสร็จแล้ว <span className="tabular-nums">{animatedCompleted}</span> จากทั้งหมด {todayTasks.length} งาน
          </p>
        </div>

        {/* Task List */}
        <div className="rounded-2xl overflow-hidden border shadow-sm bg-[var(--bg-secondary)]" style={{ borderColor: 'var(--border)' }}>
          <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-2xl font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <ListTodo size={24} className="text-[var(--accent)]" />
              รายการงานที่ต้องทำ
            </h3>
          </div>
          {todayTasks.length > 0 ? (
            <>
              {todayTasks.map((task, idx) => (
                <div key={task.id} 
                     onClick={() => setActiveSubtasksTaskId(task.id)}
                     className={`flex items-center justify-between px-8 py-6 transition-all hover:bg-[var(--bg-hover)] cursor-pointer ${idx !== todayTasks.length - 1 ? 'border-b' : ''}`}
                     style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-6">
                    <button onClick={(e) => { e.stopPropagation(); handleToggle(task.id); }} 
                            className={`relative h-8 w-8 rounded-xl border-3 flex items-center justify-center transition-all cursor-pointer ${task.done ? 'bg-[var(--accent)] border-transparent' : 'border-[var(--border)] hover:border-[var(--accent)]'} ${toggledId === task.id ? 'toggle-bounce' : ''} ${toggledId === task.id && task.done ? 'toggle-ring' : ''}`}>
                      {task.done && <CheckCircle2 className="text-white h-5 w-5" strokeWidth={4} />}
                    </button>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-xl font-bold transition-all ${task.done ? 'line-through opacity-40' : 'hover:text-[var(--accent)]'}`} style={{ color: 'var(--text-primary)' }}>
                          {task.title}
                        </span>
                        {task.priority && (
                          <div className={`p-1.5 rounded-full ${
                            task.priority === 'high' ? 'bg-[var(--accent-coral)]/10' :
                            task.priority === 'medium' ? 'bg-[var(--accent-gold)]/10' :
                            'bg-[var(--accent)]/10'
                          }`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${
                               task.priority === 'high' ? 'bg-[var(--accent-coral)]' :
                               task.priority === 'medium' ? 'bg-[var(--accent-gold)]' :
                               'bg-[var(--accent)]'
                            }`} />
                          </div>
                        )}
                        {task.recurring && task.recurring !== 'none' && (
                          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--accent)/10', color: 'var(--accent)', background: 'rgba(20,184,166,0.12)' }}>
                            <Repeat size={10} /> {{ daily: 'ทุกวัน', weekly: 'ทุกสัปดาห์', monthly: 'ทุกเดือน' }[task.recurring]}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold opacity-50" style={{ color: 'var(--text-secondary)' }}>
                         <Clock className="h-4 w-4" /> {task.time || 'ไม่ได้ระบุเวลา'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); !task.done && setActivePomodoroTask(task); }}
                    disabled={task.done}
                    className={`px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all ${task.done ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'} bg-[var(--bg-tertiary)]`}
                    style={{ color: task.done ? 'var(--text-muted)' : 'var(--accent)' }}>
                    <Play className="h-5 w-5 fill-current" /> โฟกัส
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <Inbox size={80} strokeWidth={1} style={{ color: 'var(--text-muted)' }} />
              <p className="text-2xl font-bold" style={{ color: 'var(--text-secondary)' }}>วันนี้ยังไม่มีงานเลย... พักผ่อนให้เต็มที่นะ!</p>
            </div>
          )}
        </div>

        {/* Distraction Dump Section */}
        <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          {/* Header — clickable to toggle */}
          <button
            onClick={() => setDistractionsOpen(o => !o)}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={22} className="text-[var(--accent)]" />
              <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                ความคิดที่จดไว้
              </h3>
              {distractions.length > 0 && (
                <span className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                  {distractions.length}
                </span>
              )}
            </div>
            {distractionsOpen
              ? <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} />
              : <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />}
          </button>

          {/* Content */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: distractionsOpen ? '2000px' : '0px', opacity: distractionsOpen ? 1 : 0 }}
          >
            <div className="border-t" style={{ borderColor: 'var(--border)' }}>
              {distractions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 opacity-40 space-y-3">
                  <MessageSquare size={48} strokeWidth={1} style={{ color: 'var(--text-muted)' }} />
                  <p className="font-bold" style={{ color: 'var(--text-secondary)' }}>ยังไม่มีความคิดที่จดไว้วันนี้</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>กดปุ่ม "จดไว้ก่อน" มุมขวาล่างเพื่อบันทึก</p>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {distractions.map((note) => (
                    <div key={note.id}
                      className="group relative p-5 rounded-2xl border transition-all hover:shadow-md"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <p className="font-medium leading-relaxed pr-6" style={{ color: 'var(--text-primary)' }}>
                        {note.text}
                      </p>
                      <p className="text-xs font-semibold mt-3 opacity-40" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(note.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {/* Delete button */}
                      <button
                        onClick={() => setDistractions(prev => prev.filter(d => d.id !== note.id))}
                        className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Clear all */}
              {distractions.length > 0 && (
                <div className="px-6 pb-5 flex justify-end">
                  <button
                    onClick={() => setDistractions([])}
                    className="text-sm font-bold px-4 py-2 rounded-xl transition-colors hover:bg-red-500/10"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    ลบทั้งหมด
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
        <PomodoroModal 
          isOpen={!!activePomodoroTask} 
          onClose={() => setActivePomodoroTask(null)} 
          task={activePomodoroTask}
          onCompleteTask={(id) => { 
            handleToggle(id); 
            setActivePomodoroTask(null); 
          }} 
        />


      {activeSubtasksTask && (
        <SubtasksModal
          isOpen={!!activeSubtasksTask}
          onClose={() => setActiveSubtasksTaskId(null)}
          task={activeSubtasksTask}
          onUpdateTask={updateTask}
        />
      )}
    </div>
  );
}