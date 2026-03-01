import { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Clock,
  Play,
  Plus,
  CheckCircle2,
  X,
  Pause,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AddTaskModal from '../components/AddTaskModal';

/* ── Focus Plant / Virtual Desk Component ── */
const FocusDesk = ({ progress, isRunning }) => {
  return (
    <div className="relative w-80 h-72 flex flex-col items-center justify-end mb-10 group">
      {/* Ambient Desk Light - Smooth radial gradient prevents hard boxy edges */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[500px] h-[500px] rounded-full transition-opacity duration-1000 pointer-events-none`} 
           style={{ 
             background: 'radial-gradient(closest-side, var(--accent) 0%, transparent 100%)',
             opacity: isRunning ? 0.08 : 0 
           }} />
       
      {/* Focus Plant */}
      <div className="relative z-10 w-48 h-64 flex flex-col items-center justify-end">
        {/* Stem Container */}
        <div className="relative flex flex-col items-center justify-end w-24 h-full mb-[-10px] z-10">
          <div 
            className="w-3.5 bg-[#8bc34a] rounded-t-full origin-bottom transition-all duration-1000 ease-linear shadow-sm relative"
            style={{ 
              height: `${15 + Math.min(progress, 1) * 160}px`,
            }}
          >
            {/* Leaf 1 (Left) */}
            <div 
              className="absolute w-12 h-12 bg-[#689f38] transition-all duration-1000 origin-bottom-right shadow-sm"
              style={{
                borderRadius: '100% 0% 100% 0%',
                left: '-44px',
                bottom: '20px',
                transform: `scale(${Math.min(1, Math.max(0, (progress - 0.1) * 2.5))}) rotate(-15deg)`,
                opacity: progress > 0.1 ? 1 : 0
              }}
            >
              <div className="w-full h-full border-b-2 border-white/20 transform -rotate-45" />
            </div>

            {/* Leaf 2 (Right) */}
            <div 
              className="absolute w-10 h-10 bg-[#7cb342] transition-all duration-1000 origin-bottom-left shadow-sm"
              style={{
                borderRadius: '0% 100% 0% 100%',
                right: '-36px',
                bottom: '60px',
                transform: `scale(${Math.min(1, Math.max(0, (progress - 0.3) * 2.5))}) rotate(15deg)`,
                opacity: progress > 0.3 ? 1 : 0
              }}
            >
              <div className="w-full h-full border-b-2 border-white/20 transform rotate-45" />
            </div>

            {/* Leaf 3 (Left) */}
            <div 
              className="absolute w-8 h-8 bg-[#558b2f] transition-all duration-1000 origin-bottom-right shadow-sm"
              style={{
                borderRadius: '100% 0% 100% 0%',
                left: '-28px',
                bottom: '100px',
                transform: `scale(${Math.min(1, Math.max(0, (progress - 0.5) * 2.5))}) rotate(-25deg)`,
                opacity: progress > 0.5 ? 1 : 0
              }}
            />

            {/* Top Flower/Fruit (Crown) */}
            <div 
              className="absolute w-14 h-14 bg-gradient-to-tr from-[#FFD166] to-[#FF9F1C] shadow-[0_0_20px_rgba(255,209,102,0.6)] transition-all duration-1000 origin-center"
              style={{
                borderRadius: '100% 0% 100% 0%',
                left: '-22px',
                top: '-25px',
                transform: `scale(${Math.min(1, Math.max(0, (progress - 0.8) * 5))}) rotate(45deg)`,
                opacity: progress > 0.8 ? 1 : 0
              }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md" />
            </div>
          </div>
        </div>
          
        {/* Pot - Changed to organic terracotta color to blend better */}
        <div className="relative w-28 h-24 z-20 hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-2 left-0 right-0 bottom-0 bg-gradient-to-br from-[#D98A5F] to-[#8C5226] rounded-b-3xl shadow-xl overflow-hidden">
            <div className="absolute top-0 left-2 w-4 h-full bg-white/10 skew-x-12" />
          </div>
          <div className="absolute top-0 left-[-4px] right-[-4px] h-6 bg-[#C4754B] rounded-xl shadow-md border-b border-black/10 flex items-center justify-center">
             <div className="w-[85%] h-2 bg-[#6E3A15] rounded-full opacity-50 absolute -top-1" />
          </div>

          <div className="absolute top-10 left-0 right-0 flex flex-col items-center justify-center z-30 pointer-events-none">
            <div className="flex justify-center gap-5">
              <div className={`w-2.5 h-2.5 rounded-full bg-[#5C3012] transition-all duration-300 ${isRunning ? 'scale-100 shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'scale-y-[0.3] opacity-80'}`} />
              <div className={`w-2.5 h-2.5 rounded-full bg-[#5C3012] transition-all duration-300 ${isRunning ? 'scale-100 shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'scale-y-[0.3] opacity-80'}`} />
            </div>
            <div className={`w-4 h-2 border-b-2 border-l-2 border-r-2 rounded-b-full border-[#5C3012] mt-1.5 transition-all ${isRunning ? 'scale-100 opacity-80' : 'scale-50 opacity-40'}`} />
            <div className={`absolute top-1 left-4 w-3 h-1.5 bg-pink-400 rounded-full blur-[2px] transition-opacity duration-500 ${isRunning ? 'opacity-40' : 'opacity-20'}`} />
            <div className={`absolute top-1 right-4 w-3 h-1.5 bg-pink-400 rounded-full blur-[2px] transition-opacity duration-500 ${isRunning ? 'opacity-40' : 'opacity-20'}`} />
          </div>
        </div>
      </div>

      {/* Virtual Desk Surface */}
      <div className="absolute bottom-[-15px] w-[200%] h-24 rounded-[100%] scale-y-50 -z-10 opacity-30 pointer-events-none transition-all duration-1000"
           style={{ background: 'radial-gradient(circle at 50% 50%, var(--border) 0%, transparent 70%)' }} />
    </div>
  );
};

/* ── Pomodoro Fullscreen Modal ── */
function PomodoroModal({ isOpen, onClose, task, onCompleteTask }) {
  const TOTAL_TIME = 25 * 60; // 25 minutes default for pomodoro
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [noiseEnabled, setNoiseEnabled] = useState(false);
  const [noiseVolume, setNoiseVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    let int;
    if (isRunning && timeLeft > 0) {
      int = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(int);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_29fb66ea1e.mp3');
      audio.loop = true;
      audio.volume = noiseVolume;
      audioRef.current = audio;
    }
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = noiseVolume;
  }, [noiseVolume]);

  useEffect(() => {
    if (audioRef.current) {
      if (noiseEnabled) {
        audioRef.current.play().catch((err) => console.log('Audio blocked:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [noiseEnabled]);

  if (!isOpen || !task) return null;

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const progress = (TOTAL_TIME - timeLeft) / TOTAL_TIME;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-sans transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background visual anchor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] -z-10" />

      <div className="p-6 flex justify-start z-10 relative">
        <button onClick={onClose} className="hover:text-[var(--text-primary)] transition cursor-pointer p-2 rounded-full hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-6 -mt-10">
        
        {/* Card Frame for the Focus Timer */}
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center px-10 pt-16 pb-12 rounded-[3.5rem] transition-all duration-500 overflow-hidden"
             style={{ 
                 backgroundColor: 'var(--bg-secondary)', 
                 border: '1px solid var(--border)',
                 boxShadow: 'var(--shadow-lg)'
             }}>
             
          {/* Subtle internal top glow for the card */}
          <div className="absolute top-0 left-0 w-full h-[300px] pointer-events-none opacity-40 -z-0"
               style={{ background: 'radial-gradient(ellipse at 50% -20%, var(--accent) 0%, transparent 70%)' }} />

          {/* The Virtual Desk & Focus Plant Widget */}
          <div className="relative z-10">
            <FocusDesk progress={progress} isRunning={isRunning} />
          </div>

          {/* Timer Typography */}
          <div className="text-[6.5rem] font-bold tracking-tight leading-none mb-4 tabular-nums transition-colors relative z-10" 
               style={{ color: 'var(--text-primary)', textShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            {mins}:{secs}
          </div>
          
          <h2 className="text-2xl font-bold mb-3 transition-colors text-center w-full px-4 truncate relative z-10" style={{ color: 'var(--text-primary)' }}>{task.title}</h2>
          
          <p className="text-sm font-semibold tracking-widest uppercase mb-10 transition-colors relative z-10" style={{ color: 'var(--text-secondary)' }}>
            {task.subject === 'ทั่วไป' ? 'GENERAL' : task.subject}
          </p>
          
          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center justify-center min-w-[140px] gap-2 px-8 py-4 rounded-2xl border font-bold transition-all duration-300 cursor-pointer text-lg hover:-translate-y-1 hover:shadow-md"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: isRunning ? 'var(--bg-tertiary)' : 'var(--bg-primary)' }}
            >
              {isRunning ? (<><Pause className="h-5 w-5" fill="currentColor" /> หยุด</>) : (<><Play className="h-5 w-5" fill="currentColor" /> เริ่ม</>)}
            </button>
            <button
              onClick={() => { onCompleteTask(task.id); onClose(); }}
              className="flex items-center justify-center min-w-[180px] gap-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 cursor-pointer text-lg hover:-translate-y-1 hover:shadow-lg shadow-sm"
              style={{ backgroundColor: 'var(--accent)', color: 'white', border: '1px solid var(--accent-hover)' }}
            >
              <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} /> ทำเสร็จแล้ว
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 flex justify-end z-10 relative">
        <div className="flex items-center px-4 py-2.5 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 ease-in-out bg-[var(--bg-secondary)] border border-[var(--border)]">
          
          <div className="flex items-center gap-3 w-fit">
            <span className="text-[15px] font-bold transition-colors select-none whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>เสียงฝนตก</span>
            <button onClick={() => setNoiseEnabled(!noiseEnabled)}
              className={`w-[46px] h-6 rounded-full transition-colors duration-300 relative cursor-pointer flex-shrink-0 ${noiseEnabled ? 'bg-[var(--accent)]' : 'bg-[#e2e8f0] dark:bg-[#334155]'}`}>
              <span className={`absolute top-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full transition-all duration-300 ease-out bg-white shadow-sm ${noiseEnabled ? 'left-[24px]' : 'left-[2px]'}`} />
            </button>
          </div>
          
          <div 
            className="flex items-center overflow-hidden transition-all duration-500 ease-in-out origin-left"
            style={{ 
              maxWidth: noiseEnabled ? '200px' : '0px',
              opacity: noiseEnabled ? 1 : 0,
            }}
          >
            <div className="w-[1px] h-5 bg-[var(--border)] mx-4" />
            <span className="text-[14px] font-bold select-none whitespace-nowrap mr-3" style={{ color: 'var(--text-muted)' }}>ระดับเสียง</span>
            <input type="range" min="0" max="1" step="0.05" value={noiseVolume}
              onChange={(e) => setNoiseVolume(parseFloat(e.target.value))}
              className="w-[100px] h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" 
              style={{ backgroundColor: 'var(--bg-tertiary)', accentColor: 'var(--accent)' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const mockTasks = [
  { id: 1, title: 'ทำแบบฝึกหัดแคลคูลัส', subject: 'คณิต', subjectColor: 'bg-[#61afef]/10 text-[#61afef]', due: '10:00', done: false },
  { id: 2, title: 'อ่านบทที่ 5 — เคมีอินทรีย์', subject: 'เคมี', subjectColor: 'bg-[#98c379]/10 text-[#4d8f40]', due: '11:30', done: false },
  { id: 3, title: 'เขียนร่างเรียงความเรื่องโมเดิร์นนิซม์', subject: 'อังกฤษ', subjectColor: 'bg-[#e5c07b]/10 text-[#b8860b]', due: '13:00', done: false },
  { id: 4, title: 'ทวนโน้ตบรรยาย — โครงสร้างข้อมูล', subject: 'CS', subjectColor: 'bg-[#c678dd]/10 text-[#c678dd]', due: '15:00', done: true },
];

export default function TodayPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [quickInput, setQuickInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePomodoroTask, setActivePomodoroTask] = useState(null);
  const { isDark } = useTheme();

  const completedCount = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;

  const handleToggle = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;
    setTasks((prev) => [...prev, {
      id: Date.now(), title: quickInput.trim(), subject: 'ทั่วไป',
      subjectColor: 'bg-[#61afef]/10 text-[#61afef]', due: '—', done: false,
    }]);
    setQuickInput('');
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Visual Anchor */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, var(--gradient-top), transparent)` }} />

      <div className="relative max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>วันศุกร์ที่ 20 กุมภาพันธ์ 2026</p>
            <h1 className="text-4xl font-bold mt-1 leading-relaxed" style={{ color: 'var(--text-primary)' }}>แผนวันนี้</h1>
            <p className="text-base mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              จัดระเบียบงาน ติดตามความก้าวหน้า และโฟกัสได้ดียิ่งขึ้น
            </p>
          </div>
          <button onClick={() => setIsModalOpen(true)}
            className="text-white px-5 py-2.5 rounded-xl font-medium transition flex items-center gap-2 cursor-pointer shadow-md text-base leading-relaxed hover:-translate-y-0.5 active:scale-95"
            style={{ backgroundColor: 'var(--accent)' }}>
            <Plus className="h-5 w-5" /> เพิ่มงาน
          </button>
        </div>

        {/* Quick Capture */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-2 text-base font-semibold mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            <Zap className="h-5 w-5" style={{ color: 'var(--accent-gold)' }} /> จดด่วน
          </div>
          <div className="relative flex items-center">
            <input type="text" value={quickInput} onChange={(e) => setQuickInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
              placeholder="คุณต้องทำอะไร?"
              className="w-full rounded-xl py-3 pl-4 pr-24 text-base focus:outline-none focus:ring-2 leading-relaxed transition-all"
              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
            <button onClick={handleQuickAdd}
              className="absolute right-2 text-white px-4 py-1.5 rounded-lg text-base font-medium transition cursor-pointer flex items-center gap-1 leading-relaxed"
              style={{ backgroundColor: 'var(--accent)' }}>
              <Plus className="h-4 w-4" /> เพิ่ม
            </button>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex justify-between mb-4">
            <span className="font-semibold text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>ความคืบหน้ารายสัปดาห์</span>
            <span className="text-base flex items-center gap-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle2 className="h-5 w-5" /> 72% ของเป้าหมาย
            </span>
          </div>
          <div className="h-4 w-full rounded-full overflow-hidden mb-3 shadow-inner" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className={`h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-purple)] w-[72%] rounded-full shadow-sm transition-all duration-1000 ease-out ${completedCount === totalTasks && totalTasks > 0 ? 'animate-pulse' : ''}`} />
          </div>
          <div className="flex justify-between text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <span>ทำเสร็จ 18 / 25 งาน</span>
            <span>เหลืออีก 7 งาน</span>
          </div>
        </div>

        {/* Focus Tasks */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
          <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-light)' }}>
            <span className="font-semibold text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>งานที่ต้องโฟกัสวันนี้</span>
            <span className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>เสร็จ {completedCount} / {totalTasks}</span>
          </div>
          {tasks.map((task) => (
            <div key={task.id}
              className={`group flex items-center justify-between px-6 py-4 hover:-translate-y-0.5 transition-all duration-300 rounded-xl mx-2 mb-1 ${task.done ? 'opacity-60' : ''}`}
              style={{
                borderBottom: '1px solid var(--border-light)',
                backgroundColor: task.done ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)') : 'transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(97,175,239,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = task.done ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)') : 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div className="flex items-center gap-4">
                <button onClick={() => handleToggle(task.id)}
                  className={`relative flex-shrink-0 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    task.done ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] border-transparent scale-110 shadow-sm'
                    : 'hover:scale-110'
                  }`}
                  style={{ borderColor: task.done ? 'transparent' : 'var(--border)' }}>
                  <CheckCircle2 className={`h-4 w-4 ${task.done ? 'text-white scale-100' : 'scale-0'} transition-all duration-500`} />
                  {task.done && <div className="absolute inset-0 animate-ping rounded-full bg-[#00B4D8] opacity-20" />}
                </button>
                <div className="flex relative items-center gap-3 py-1">
                  <div className="relative">
                    <span className={`text-base font-medium leading-relaxed transition-all duration-500 origin-left inline-block ${task.done ? 'scale-[0.98]' : 'scale-100'}`}
                      style={{ color: task.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>{task.title}</span>
                    <div className={`absolute top-1/2 left-0 h-[2px] transition-all duration-500 ease-in-out ${task.done ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
                      style={{ backgroundColor: 'var(--text-muted)' }} />
                  </div>
                  <span className={`px-2 py-1 rounded-md text-sm font-medium leading-relaxed transition-all duration-300 ${task.subjectColor} ${task.done ? 'grayscale opacity-70' : ''}`}>
                    {task.subject}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <Clock className="h-4 w-4" /> {task.due}
                </span>
                <button onClick={() => setActivePomodoroTask(task)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-base font-medium transition cursor-pointer leading-relaxed"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  <Play className="h-4 w-4" /> โฟกัส
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          setTasks((prev) => [...prev, {
            id: Date.now(), title: data.title || 'งานใหม่', subject: data.tags[0] || 'ทั่วไป',
            subjectColor: 'bg-[#61afef]/10 text-[#61afef]', due: data.time || '—', done: false,
          }]);
        }} />
      <PomodoroModal isOpen={!!activePomodoroTask} onClose={() => setActivePomodoroTask(null)} task={activePomodoroTask}
        onCompleteTask={(id) => { handleToggle(id); setActivePomodoroTask(null); }} />
    </div>
  );
}
