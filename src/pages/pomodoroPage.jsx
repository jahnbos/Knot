import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause, SkipForward, Maximize2, Minimize2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const CYCLE = ['focus', 'short', 'focus', 'short', 'focus', 'short', 'focus', 'long'];

const MODE_CONFIG = {
  focus:  { label: 'โฟกัส',   seconds: 25 * 60 },
  short:  { label: 'พักสั้น', seconds:  5 * 60 },
  long:   { label: 'พักยาว', seconds: 15 * 60 },
};

const TABS = ['focus', 'short', 'long'];

export default function PomodoroPage() {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [mode, setMode] = useState(CYCLE[0]);
  const [totalSeconds, setTotalSeconds] = useState(MODE_CONFIG[CYCLE[0]].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [completedFocus, setCompletedFocus] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => setTotalSeconds((prev) => prev - 1), 1000);
    } else if (totalSeconds === 0 && isRunning) {
      setIsRunning(false);
      advanceCycle();
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, totalSeconds]);

  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  const getFocusCount = useCallback((idx) => {
    let count = 0;
    for (let i = 0; i < idx; i++) if (CYCLE[i] === 'focus') count++;
    return count;
  }, []);

  const advanceCycle = useCallback(() => {
    const nextIndex = (cycleIndex + 1) % CYCLE.length;
    const nextMode = CYCLE[nextIndex];
    setCycleIndex(nextIndex);
    setMode(nextMode);
    setTotalSeconds(MODE_CONFIG[nextMode].seconds);
    setCompletedFocus(getFocusCount(nextIndex));
  }, [cycleIndex, getFocusCount]);

  const handleTabClick = useCallback((tab) => {
    setIsRunning(false);
    setMode(tab);
    setTotalSeconds(MODE_CONFIG[tab].seconds);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTotalSeconds(MODE_CONFIG[mode].seconds);
  }, [mode]);

  const handleToggle = useCallback(() => setIsRunning((prev) => !prev), []);

  const handleSkip = useCallback(() => {
    setIsRunning(false);
    if (CYCLE[cycleIndex] === 'focus') setCompletedFocus((prev) => Math.min(prev + 1, 4));
    advanceCycle();
  }, [cycleIndex, advanceCycle]);

  const timerContent = (
    <div className="flex flex-col items-center justify-center flex-1">
      {/* Mode Tabs */}
      <div className="rounded-full px-1.5 py-1 flex items-center gap-1 mb-16" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => handleTabClick(tab)}
            className="rounded-full px-5 py-2.5 text-base font-medium transition-all duration-200 cursor-pointer leading-relaxed"
            style={{
              backgroundColor: mode === tab ? 'var(--bg-secondary)' : 'transparent',
              color: mode === tab ? 'var(--accent)' : 'var(--text-secondary)',
              boxShadow: mode === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>
            {MODE_CONFIG[tab].label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="mb-16">
        <span className="text-9xl font-extralight tracking-tight tabular-nums select-none" style={{ color: 'var(--text-primary)' }}>
          {minutes}:{seconds}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-16">
        <button onClick={handleReset}
          className="h-12 w-12 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          title="รีเซ็ต">
          <RotateCcw className="h-5 w-5" />
        </button>
        <button onClick={handleToggle}
          className="h-16 px-10 rounded-full flex items-center justify-center gap-2.5 text-white text-base font-semibold transition active:scale-[0.97] cursor-pointer shadow-lg leading-relaxed"
          style={{ backgroundColor: 'var(--accent)' }}>
          {isRunning ? (<><Pause className="h-5 w-5" /> หยุดชั่วคราว</>) : (<><Play className="h-5 w-5" /> เริ่ม</>)}
        </button>
        <button onClick={handleSkip}
          className="h-12 w-12 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          title="ข้าม">
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      {/* Session Progress */}
      <div className="flex items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 w-3 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: i < completedFocus ? 'var(--accent)' : (i === completedFocus && mode === 'focus' ? 'var(--text-muted)' : 'var(--border)'),
            }} />
        ))}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="absolute top-5 right-5">
          <button onClick={() => setIsFullscreen(false)}
            className="h-10 w-10 rounded-full flex items-center justify-center transition cursor-pointer"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            title="ย่อหน้าจอ">
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
        {timerContent}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col" style={{ minHeight: 'calc(100vh - 73px)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute top-5 right-5">
        <button onClick={() => setIsFullscreen(true)}
          className="h-10 w-10 rounded-full flex items-center justify-center transition cursor-pointer"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          title="เต็มจอ">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
      {timerContent}
    </div>
  );
}
