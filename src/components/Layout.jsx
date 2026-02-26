import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Timer,
  BarChart3,
  Settings,
  LogOut,
  Link,
} from 'lucide-react';
import SettingPage from '../pages/SettingPage';
import PomodoroPage from '../pages/PomodoroPage';
import TodayPage from '../pages/todayPage';
import SchedulePage from '../pages/SchedulePage';

const navItems = [
  { key: 'today', label: 'Today', icon: LayoutDashboard },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'pomodoro', label: 'Pomodoro Timer', icon: Timer },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'setting', label: 'Setting', icon: Settings },
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
    default: {
      const page = navItems.find((n) => n.key === activePage);
      return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 57px)' }}>
          <h1 className="text-3xl font-semibold text-neutral-800">
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

  // Close dropdown on outside click
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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-2.5">
        {/* Left — Logo */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <div className="h-8 w-8 rounded-lg bg-neutral-900 flex items-center justify-center">
            <Link className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-neutral-900 tracking-tight">Knot</span>
        </div>

        {/* Center — Pill Nav */}
        <nav className="bg-gray-100 rounded-full px-2 py-1.5 flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`
                  flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right — Avatar */}
        <div className="flex items-center justify-end min-w-[140px] relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer ring-2 ring-white shadow-sm transition hover:shadow-md"
          >
            AJ
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200/60 py-2">
              {/* User Info */}
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-neutral-900">John Dee</p>
                <p className="text-xs text-gray-400 mt-1">John.Dj@ku.th</p>
              </div>
              <div className="mx-3 my-1.5 h-px bg-gray-100" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  if (onSignOut) onSignOut();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-red-400" />
                Sign out
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

