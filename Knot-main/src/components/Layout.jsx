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

// Import Pages ตามโครงสร้างไฟล์จริงของคุณ (Case-sensitive)
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

// แก้ไข ReferenceError โดยนิยาม PageContent ให้ครอบคลุมทุกหน้า
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

// แยกส่วน UI หลักออกมาเพื่อให้เรียกใช้ useTasks ภายใน TaskProvider ได้
function LayoutUI({ onSignOut }) {
  const [activePage, setActivePage] = useState('today');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [scratchText, setScratchText] = useState('');
  
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
    addDistraction(scratchText);
    setScratchText('');
    setIsScratchpadOpen(false);
  };

  return (
    <div className="min-h-screen font-sans relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* ── Top Navigation Bar ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {/* Left — Logo */}
        <div className="flex items-center gap-3 min-w-[160px]">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
            <Link className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Knot</span>
        </div>

        {/* Center — Pill Nav */}
        <nav className="rounded-full px-2.5 py-2 flex items-center gap-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className="flex items-center gap-2 rounded-full px-5 py-2 text-base font-medium leading-relaxed transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right — Theme Toggle + Avatar */}
        <div className="flex items-center justify-end min-w-[160px] gap-3 relative" ref={dropdownRef}>
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="h-11 w-11 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--bg-primary)] text-base font-semibold cursor-pointer shadow-sm transition hover:shadow-md"
          >
            AJ
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 rounded-xl py-2"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="px-5 py-3">
                <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Alex Johnson</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>alex.j@ku.th</p>
              </div>
              <div className="mx-3 my-1.5 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <button
                onClick={() => { setDropdownOpen(false); setActivePage('setting'); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-base transition hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-primary)' }}
              >
                <Settings className="h-5 w-5 text-[var(--text-secondary)]" />
                ตั้งค่า
              </button>
              <div className="mx-3 my-1.5 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <button
                onClick={() => { setDropdownOpen(false); if (onSignOut) onSignOut(); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-base transition"
                style={{ color: 'var(--accent-coral)' }}
              >
                <LogOut className="h-5 w-5" />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main>
        <PageContent activePage={activePage} />
      </main>

      {/* ── Distraction Dump Scratchpad (ADHD-friendly UX) ── */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <button 
          onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
          className="h-14 w-14 rounded-full bg-[#D2B48C] text-[#5D4037] shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-4 border-white"
          title="ทิ้งความคิดรบกวน"
        >
          <StickyNote size={28} />
        </button>

        {isScratchpadOpen && (
          <div className="absolute bottom-16 right-0 w-72 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
            style={{ backgroundColor: '#F5E6D3', border: '2px solid #D2B48C' }}>
            <h4 className="text-[#5D4037] font-bold mb-2 flex items-center gap-2">🧠 ทิ้งความฟุ้งซ่านตรงนี้</h4>
            <textarea 
              autoFocus
              value={scratchText} 
              onChange={(e) => setScratchText(e.target.value)}
              placeholder="จดสิ่งที่แวบเข้ามาในหัว..."
              className="w-full h-32 bg-transparent border-none outline-none text-[#5D4037] placeholder-[#5D4037]/50 resize-none italic leading-relaxed" 
            />
            <button 
              onClick={handleDumpDistraction}
              className="w-full mt-2 py-2.5 bg-[#5D4037] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#3E2723] transition-colors"
            >
              <Send size={16} /> บันทึกแล้วไปโฟกัสต่อ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Component หลักที่ทำหน้าที่หุ้มด้วย Context Provider
export default function Layout({ onSignOut }) {
  return (
    <TaskProvider>
      <LayoutUI onSignOut={onSignOut} />
    </TaskProvider>
  );
}