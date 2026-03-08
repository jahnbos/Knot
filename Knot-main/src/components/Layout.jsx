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
  Send,
  Plus,
  Brain
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TaskProvider, useTasks } from '../contexts/TaskContext';
import AddTaskModal from './AddTaskModal';

// Import Pages (ตรวจสอบชื่อตัวเล็ก-ใหญ่ให้ตรงตามไฟล์จริงในเครื่อง)
import SettingPage from '../pages/SettingPage';
import PomodoroPage from '../pages/PomodoroPage';
import TodayPage from '../pages/TodayPage';
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
  const [showToast, setShowToast] = useState(false);
  const [globalModalConfig, setGlobalModalConfig] = useState({ isOpen: false, isDetailed: false });
  
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

  // Listen for global add-task event from any page
  useEffect(() => {
    const handleOpenGlobalModal = (e) => setGlobalModalConfig({ 
      isOpen: true, 
      isDetailed: e.detail?.isDetailed || false 
    });
    window.addEventListener('open-global-add-task', handleOpenGlobalModal);
    return () => window.removeEventListener('open-global-add-task', handleOpenGlobalModal);
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
    <div className="min-h-screen font-sans transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      
      {/* ── Decorative gradient orbs (Same as LoginPage) ── */}
      {activePage !== 'setting' && (
        <>
          {/* Top Left Glow */}
          <div className="fixed -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[var(--accent)]/10 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen z-0" />
          {/* Bottom Right Glow */}
          <div className="fixed -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[var(--accent-purple)]/10 blur-[130px] pointer-events-none mix-blend-multiply dark:mix-blend-screen z-0" />
          {/* Center Background Glow */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--accent-gold)]/10 blur-[150px] pointer-events-none mix-blend-multiply dark:mix-blend-screen z-0" />
        </>
      )}

      {/* ── Top Navigation Bar ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 backdrop-blur-md gap-4 w-full"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          boxShadow: isDark ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 10px rgba(0,0,0,0.05)',
        }}
      >
        {/* Left — Logo */}
        <div className="flex items-center gap-3 w-auto md:min-w-[160px]">
          <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: 'var(--accent)' }}>
            <Link className="h-5 w-5 text-white" />
          </div>
          <span className="hidden sm:inline text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>Knot</span>
        </div>

        {/* Center — Pill Nav */}
        <nav className="relative rounded-full px-1.5 py-1.5 flex items-center gap-1 shadow-inner border overflow-x-auto no-scrollbar max-w-full" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`relative flex items-center justify-center gap-2 rounded-full px-3 md:px-5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer flex-shrink-0`}
                style={{
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right — Theme Toggle + Avatar */}
        <div className="flex items-center gap-2 md:gap-4 md:min-w-[160px] justify-end relative" ref={dropdownRef}>
          <button
            onClick={toggleTheme}
            className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-[var(--bg-hover)] hover:scale-110 active:scale-90"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isDark
              ? <Sun className="h-5 w-5 transition-transform duration-500 rotate-0" />
              : <Moon className="h-5 w-5 transition-transform duration-500 rotate-0" />}
          </button>

          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="h-11 w-11 shrink-0 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-base font-bold cursor-pointer shadow-lg hover:rotate-3 transition-transform"
          >
            AJ
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="px-5 py-4">
                <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>john doe</p>
                <p className="text-sm opacity-60" style={{ color: 'var(--text-secondary)' }}>john.j@ku.th</p>
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
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold transition-colors"
                style={{ color: 'var(--accent-coral)', backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-coral-hover, rgba(239, 68, 68, 0.1))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut className="h-4 w-4" />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="relative z-10 animate-in fade-in duration-500">
        <PageContent activePage={activePage} />
      </main>

      {/* Distraction Dump Scratchpad (ADHD-friendly UX) ── */}
      <div className="fixed bottom-8 right-8 z-[60] flex items-center gap-3">
        <button 
          onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
          className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border group"
          style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border)' }}
          title="จดไว้ก่อน"
        >
          <StickyNote size={28} className="text-white group-hover:rotate-12 transition-transform" />
        </button>

        {isScratchpadOpen && (
          <div className="absolute bottom-18 right-0 w-80 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
            
            <h4 className="font-black mb-3 flex items-center gap-2 text-lg" style={{ color: 'var(--text-primary)' }}>
              <Brain size={22} className="text-[var(--accent)]" /> จดไว้ก่อน
            </h4>
            <textarea 
              autoFocus
              value={scratchText} 
              onChange={(e) => setScratchText(e.target.value)}
              placeholder="นึกอะไรได้ จดทิ้งไว้ที่นี่..."
              className="w-full h-40 bg-transparent border-none outline-none resize-none italic leading-relaxed text-base font-medium relative z-10"
              style={{ color: 'var(--text-primary)', '--tw-placeholder-opacity': '0.4' }}
            />
            <button 
              onClick={handleDumpDistraction}
              className="w-full mt-3 py-3 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg relative z-10"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Send size={18} /> บันทึกแล้วกลับไปทำงาน
            </button>
          </div>
        )}
      </div>

      {/* ── Global Add Task FAB (bottom-left) ── */}
      <div className="fixed bottom-8 left-8 z-[60]">
        <button
          onClick={() => setGlobalModalConfig({ isOpen: true, isDetailed: false })}
          className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border group"
          style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border)' }}
          title="เพิ่มงานใหม่"
        >
          <Plus size={28} className="text-white group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Global AddTaskModal */}
      <AddTaskModal 
        isOpen={globalModalConfig.isOpen} 
        initialDetailed={globalModalConfig.isDetailed}
        onClose={() => setGlobalModalConfig(prev => ({ ...prev, isOpen: false }))} 
      />

      {/* ── Success Toast Feedback ── */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3 z-[100] border"
          style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border)' }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-bold">บันทึกความคิดแล้ว กลับไปลุยงานต่อได้!</span>
        </div>
      )}
    </div>
  );
}

// Layout ไม่ต้องหุ้ม TaskProvider ซ้ำ เพราะ App.jsx หุ้มไว้แล้ว
export default function Layout({ onSignOut }) {
  return <LayoutUI onSignOut={onSignOut} />;
}