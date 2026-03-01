import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Timer,
  BarChart3,
  Settings,
  LogOut,
  Link,
  Moon,
  Sun,
  StickyNote,
  Send
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TaskProvider, useTasks } from '../contexts/TaskContext';

// Import Pages (ตรวจสอบชื่อตัวเล็ก-ใหญ่ให้ตรงตามไฟล์จริงในเครื่อง)
import SettingPage from '../pages/settingPage';
import PomodoroPage from '../pages/pomodoroPage';
import TodayPage from '../pages/todayPage';
import SchedulePage from '../pages/SchedulePage';
import ReportsPage from '../pages/ReportsPage';

const navItems = [
  { key: 'today', label: 'วันนี้', icon: LayoutDashboard },
  { key: 'calendar', label: 'ปฏิทิน', icon: CalendarDays },
  { key: 'pomodoro', label: 'จับเวลา', icon: Timer },
  { key: 'reports', label: 'สถิติ', icon: BarChart3 },
];

// แก้ไข ReferenceError: นิยามส่วนจัดการหน้าแสดงผลไว้ที่นี่
function PageContent({ activePage }) {
  switch (activePage) {
    case 'today': return <TodayPage />;
    case 'calendar': return <SchedulePage />;
    case 'setting': return <SettingPage />;
    case 'pomodoro': return <PomodoroPage />;
    case 'reports': return <ReportsPage />;
    default: return <TodayPage />;
  }
}

function LayoutUI({ onSignOut }) {
  const [activePage, setActivePage] = useState('today');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [scratchText, setScratchText] = useState('');
  const [showToast, setShowToast] = useState(false); // สำหรับ Feedback หลังบันทึก
  
  const dropdownRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();
  const { addDistraction } = useTasks();

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleDumpDistraction = () => {
    if (!scratchText.trim()) return;
    addDistraction(scratchText); // ส่งไปยัง TaskContext เพื่อซิงค์กับหน้า Reports
    setScratchText('');
    setIsScratchpadOpen(false);
    
    // แสดง Toast แจ้งเตือน (UX Feedback)
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen font-sans relative transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      
      {/* ── Top Navigation Bar ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          boxShadow: isDark ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 10px rgba(0,0,0,0.05)',
        }}
      >
        {/* Left — Logo */}
        <div className="flex items-center gap-3 min-w-[160px]">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: 'var(--accent)' }}>
            <Link className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>Knot</span>
        </div>

        {/* Center — Pill Nav */}
        <nav className="rounded-full px-2 py-1.5 flex items-center gap-1 shadow-inner border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 cursor-pointer ${isActive ? 'scale-105' : 'hover:scale-105'}`}
                style={{
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'animate-pulse' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right — Theme Toggle + Avatar */}
        <div className="flex items-center justify-end min-w-[160px] gap-3 relative" ref={dropdownRef}>
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="h-11 w-11 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-base font-bold cursor-pointer shadow-lg hover:rotate-3 transition-transform"
          >
            AJ
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="px-5 py-4">
                <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Alex Johnson</p>
                <p className="text-sm opacity-60" style={{ color: 'var(--text-secondary)' }}>alex.j@ku.th</p>
              </div>
              <div className="h-px w-full" style={{ backgroundColor: 'var(--border)' }} />
              <button
                onClick={() => { setDropdownOpen(false); setActivePage('setting'); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-primary)' }}
              >
                <Settings className="h-4 w-4 text-[var(--text-secondary)]" />
                ตั้งค่า
              </button>
              <button
                onClick={() => { setDropdownOpen(false); if (onSignOut) onSignOut(); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                style={{ color: 'var(--accent-coral)' }}
              >
                <LogOut className="h-4 w-4" />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="animate-in fade-in duration-500">
        <PageContent activePage={activePage} />
      </main>

      {/* ── Distraction Dump Scratchpad (ADHD-friendly UX) ── */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <button 
          onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
          className="h-16 w-16 rounded-full bg-[#D2B48C] text-[#5D4037] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-4 border-white group"
          title="ทิ้งความคิดรบกวน"
        >
          <StickyNote size={32} className="group-hover:rotate-12 transition-transform" />
        </button>

        {isScratchpadOpen && (
          <div className="absolute bottom-20 right-0 w-80 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden"
            style={{ backgroundColor: '#F5E6D3', border: '2px solid #D2B48C' }}>
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#5D4037 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
            
            <h4 className="text-[#5D4037] font-black mb-3 flex items-center gap-2 text-lg">🧠 ทิ้งความฟุ้งซ่าน</h4>
            <textarea 
              autoFocus
              value={scratchText} 
              onChange={(e) => setScratchText(e.target.value)}
              placeholder="จดสิ่งที่นึกได้ตอนโฟกัสงานหลัก..."
              className="w-full h-40 bg-transparent border-none outline-none text-[#5D4037] placeholder-[#5D4037]/40 resize-none italic leading-relaxed text-base font-medium relative z-10" 
            />
            <button 
              onClick={handleDumpDistraction}
              className="w-full mt-3 py-3 bg-[#5D4037] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#3E2723] active:scale-95 transition-all shadow-lg relative z-10"
            >
              <Send size={18} /> เก็บไว้แล้วโฟกัสต่อ
            </button>
          </div>
        )}
      </div>

      {/* ── Success Toast Feedback ── */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#5D4037] text-white px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3 z-[100] border-2 border-[#D2B48C]">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-bold">บันทึกความคิดแล้ว กลับไปลุยงานต่อได้!</span>
        </div>
      )}
    </div>
  );
}

// Component หลักที่หุ้มด้วย Context Provider เพื่อให้ข้อมูลซิงค์กัน
export default function Layout({ onSignOut }) {
  return (
    <TaskProvider>
      <LayoutUI onSignOut={onSignOut} />
    </TaskProvider>
  );
}