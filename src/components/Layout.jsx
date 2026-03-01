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
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SettingPage from '../pages/SettingPage';
import PomodoroPage from '../pages/PomodoroPage';
import TodayPage from '../pages/todayPage';
import SchedulePage from '../pages/SchedulePage';
import ReportsPage from '../pages/ReportsPage';

const navItems = [
  { key: 'today', label: 'วันนี้', icon: LayoutDashboard },
  { key: 'calendar', label: 'ปฏิทิน', icon: CalendarDays },
  { key: 'pomodoro', label: 'จับเวลา', icon: Timer },
  { key: 'reports', label: 'สถิติ', icon: BarChart3 },
];

function PageContent({ activePage }) {
  switch (activePage) {
    case 'today':
      return <TodayPage />;
    case 'calendar':
      return <SchedulePage />;
    case 'setting':
      return <SettingPage />;
    case 'pomodoro':
      return <PomodoroPage />;
    case 'reports':
      return <ReportsPage />;
    default: {
      const page = navItems.find((n) => n.key === activePage);
      return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 73px)' }}>
          <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {page?.label} page
          </h1>
        </div>
      );
    }
  }
}

export default function Layout({ onSignOut }) {
  const [activePage, setActivePage] = useState('today');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--bg-primary)' }}>
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
          {/* Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Avatar */}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="h-11 w-11 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--bg-primary)] text-base font-semibold cursor-pointer shadow-sm transition hover:shadow-md"
            style={{ ring: '2px solid var(--border)' }}
          >
            AJ
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-3 w-64 rounded-xl py-2"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="px-5 py-3">
                <p className="text-base font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>Alex Johnson</p>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>alex.j@ku.th</p>
              </div>
              <div className="mx-3 my-1.5 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <button
                onClick={() => { setDropdownOpen(false); setActivePage('setting'); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-base transition cursor-pointer leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                ตั้งค่า
              </button>
              <div className="mx-3 my-1.5 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <button
                onClick={() => { setDropdownOpen(false); if (onSignOut) onSignOut(); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-base transition cursor-pointer leading-relaxed"
                style={{ color: 'var(--accent-coral)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,123,133,0.1)' : 'rgba(224,108,117,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
    </div>
  );
}
