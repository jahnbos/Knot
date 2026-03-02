import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Zap,
  Clock,
  Play,
  Plus,
  CheckCircle2,
  X,
  Pause,
  Inbox,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext'; 
import AddTaskModal from '../components/AddTaskModal';

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
  const TOTAL_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

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
  const progress = (TOTAL_TIME - timeLeft) / TOTAL_TIME;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col animate-in fade-in duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="p-6 flex justify-start z-10">
        <button onClick={onClose} className="hover:bg-[var(--bg-hover)] p-2 rounded-full transition-all cursor-pointer" style={{ color: 'var(--text-muted)' }}>
          <X className="h-8 w-8" />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-10">
        <div className="relative w-full max-w-2xl flex flex-col items-center px-10 pt-16 pb-12 rounded-[3.5rem] shadow-2xl transition-all"
             style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <FocusDesk progress={progress} isRunning={isRunning} />
          <div className="text-[7rem] font-black tabular-nums mb-4 tracking-tighter" style={{ color: 'var(--text-primary)' }}>{mins}:{secs}</div>
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>{task.title}</h2>
          <div className="flex gap-6">
            <button onClick={() => setIsRunning(!isRunning)} 
                    className="min-w-[160px] py-4 rounded-2xl border-2 font-black text-xl transition-all active:scale-95 cursor-pointer"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: isRunning ? 'var(--bg-tertiary)' : 'var(--bg-primary)' }}>
              {isRunning ? 'หยุดชั่วคราว' : 'เริ่มโฟกัส'}
            </button>
            <button onClick={() => onCompleteTask(task.id)} 
                    className="min-w-[160px] py-4 rounded-2xl font-black text-xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 active:scale-95 cursor-pointer">
              ทำเสร็จแล้ว
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main TodayPage ── */
export default function TodayPage() {
  const { tasks, setTasks, addTask } = useTasks();
  const [quickInput, setQuickInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePomodoroTask, setActivePomodoroTask] = useState(null);
  const { isDark } = useTheme();

  // จัดการวันที่ปัจจุบันแบบภาษาไทย
  const displayDate = new Intl.DateTimeFormat('th-TH', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  }).format(new Date());

  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  
  // กรองงานวันนี้และงานที่ไม่มีกำหนดวันที่
  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.date === todayStr || !t.date);
  }, [tasks, todayStr]);

  const completedCount = todayTasks.filter((t) => t.status === 'completed' || t.done).length;

  const handleToggle = (id) => {
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
    addTask({ title: quickInput.trim(), date: todayStr, tags: ['ทั่วไป'], status: 'todo' });
    setQuickInput('');
  };

  return (
    <div className="relative min-h-screen pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="font-medium opacity-60" style={{ color: 'var(--text-secondary)' }}>{displayDate}</p>
            <h1 className="text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>แผนวันนี้</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} 
                  className="bg-[var(--accent)] text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-[var(--accent)]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
            <Plus className="h-6 w-6 inline mr-1" strokeWidth={3} /> เพิ่มงานใหม่
          </button>
        </div>

        {/* Quick Capture Card */}
        <div className="rounded-[2rem] p-8 shadow-xl border transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 font-black text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
            <Zap className="h-6 w-6 text-yellow-500 fill-yellow-500" /> จดด่วน (Quick Note)
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
        <div className="rounded-[2rem] p-8 border shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between mb-4 font-black text-xl" style={{ color: 'var(--text-primary)' }}>
            <span>ความคืบหน้าของวัน</span>
            <span className="text-[var(--accent)]">{todayTasks.length ? Math.round((completedCount/todayTasks.length)*100) : 0}%</span>
          </div>
          <div className="h-4 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[#00B4D8] transition-all duration-1000 ease-out" 
                 style={{ width: `${todayTasks.length ? (completedCount/todayTasks.length)*100 : 0}%` }} />
          </div>
          <p className="mt-4 font-medium opacity-60" style={{ color: 'var(--text-secondary)' }}>
            ทำเสร็จแล้ว {completedCount} จากทั้งหมด {todayTasks.length} งาน
          </p>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black px-2" style={{ color: 'var(--text-primary)' }}>รายการงานที่ต้องทำ</h3>
          {todayTasks.length > 0 ? (
            <div className="rounded-[2rem] overflow-hidden border shadow-sm bg-[var(--bg-secondary)]" style={{ borderColor: 'var(--border)' }}>
              {todayTasks.map((task, idx) => (
                <div key={task.id} 
                     className={`flex items-center justify-between px-8 py-6 transition-all hover:bg-[var(--bg-hover)] ${idx !== todayTasks.length - 1 ? 'border-b' : ''}`}
                     style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-6">
                    <button onClick={() => handleToggle(task.id)} 
                            className={`h-8 w-8 rounded-xl border-3 flex items-center justify-center transition-all active:scale-90 cursor-pointer ${task.done ? 'bg-[var(--accent)] border-transparent rotate-12' : 'border-[var(--border)] hover:border-[var(--accent)]'}`}>
                      {task.done && <CheckCircle2 className="text-white h-5 w-5" strokeWidth={4} />}
                    </button>
                    <div className="space-y-1">
                      <span className={`text-xl font-bold transition-all ${task.done ? 'line-through opacity-40' : ''}`} style={{ color: 'var(--text-primary)' }}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-3 text-sm font-bold opacity-50" style={{ color: 'var(--text-secondary)' }}>
                         <Clock className="h-4 w-4" /> {task.time || 'ไม่ได้ระบุเวลา'}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActivePomodoroTask(task)} 
                          className="px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[var(--bg-tertiary)]" 
                          style={{ color: 'var(--accent)' }}>
                    <Play className="h-5 w-5 fill-current" /> โฟกัส
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center space-y-4">
              <Inbox size={80} strokeWidth={1} />
              <p className="text-2xl font-bold">วันนี้ยังไม่มีงานเลย... พักผ่อนให้เต็มที่นะ!</p>
            </div>
          )}
        </div>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {activePomodoroTask && (
        <PomodoroModal 
          isOpen={!!activePomodoroTask} 
          onClose={() => setActivePomodoroTask(null)} 
          task={activePomodoroTask}
          onCompleteTask={(id) => { 
            handleToggle(id); 
            setActivePomodoroTask(null); 
          }} 
        />
      )}
    </div>
  );
}