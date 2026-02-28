import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause, SkipForward, Maximize2, Minimize2 } from 'lucide-react';

const CYCLE = ['focus', 'short', 'focus', 'short', 'focus', 'short', 'focus', 'long'];

const MODE_CONFIG = {
  focus:  { label: 'โฟกัส',       seconds: 25 * 60 },
  short:  { label: 'พักสั้น',     seconds:  5 * 60 },
  long:   { label: 'พักยาว',      seconds: 15 * 60 },
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

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => prev - 1);
      }, 1000);
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
    for (let i = 0; i < idx; i++) {
      if (CYCLE[i] === 'focus') count++;
    }
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

  const handleToggle = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const handleSkip = useCallback(() => {
    setIsRunning(false);
    if (CYCLE[cycleIndex] === 'focus') {
      setCompletedFocus((prev) => Math.min(prev + 1, 4));
    }
    advanceCycle();
  }, [cycleIndex, advanceCycle]);

  const timerContent = (
    <div className="flex flex-col items-center justify-center flex-1">
      {/* Mode Tabs */}
      <div className="bg-[#eef0f5] rounded-full px-1.5 py-1 flex items-center gap-1 mb-16">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`rounded-full px-5 py-2.5 text-base font-medium transition-all duration-200 cursor-pointer leading-relaxed ${
              mode === tab
                ? 'bg-white text-[#61afef] shadow-sm'
                : 'text-[#6b7280] hover:text-[#1a1d23]'
            }`}
          >
            {MODE_CONFIG[tab].label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="mb-16">
        <span className="text-9xl font-extralight text-[#1a1d23] tracking-tight tabular-nums select-none">
          {minutes}:{seconds}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-16">
        <button
          onClick={handleReset}
          className="h-12 w-12 rounded-full border border-[#e1e4ec] bg-white flex items-center justify-center text-[#6b7280] transition hover:bg-[#eef0f5] hover:text-[#1a1d23] active:scale-95 cursor-pointer shadow-sm"
          title="รีเซ็ต"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          onClick={handleToggle}
          className="h-16 px-10 rounded-full bg-[#61afef] flex items-center justify-center gap-2.5 text-white text-base font-semibold transition hover:bg-[#4d9fd9] active:scale-[0.97] cursor-pointer shadow-lg leading-relaxed"
        >
          {isRunning ? (
            <><Pause className="h-5 w-5" /> หยุดชั่วคราว</>
          ) : (
            <><Play className="h-5 w-5" /> เริ่ม</>
          )}
        </button>

        <button
          onClick={handleSkip}
          className="h-12 w-12 rounded-full border border-[#e1e4ec] bg-white flex items-center justify-center text-[#6b7280] transition hover:bg-[#eef0f5] hover:text-[#1a1d23] active:scale-95 cursor-pointer shadow-sm"
          title="ข้าม"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      {/* Session Progress */}
      <div className="flex items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              i < completedFocus
                ? 'bg-[#61afef]'
                : i === completedFocus && mode === 'focus'
                  ? 'bg-[#d1d5db]'
                  : 'bg-[#e1e4ec]'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#f5f6fa] flex flex-col">
        <div className="absolute top-5 right-5">
          <button
            onClick={() => setIsFullscreen(false)}
            className="h-10 w-10 rounded-full border border-[#e1e4ec] bg-white flex items-center justify-center text-[#6b7280] transition hover:bg-[#eef0f5] hover:text-[#1a1d23] cursor-pointer shadow-sm"
            title="ย่อหน้าจอ"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
        {timerContent}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col bg-[#f5f6fa]" style={{ minHeight: 'calc(100vh - 57px)' }}>
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setIsFullscreen(true)}
          className="h-10 w-10 rounded-full border border-[#e1e4ec] bg-white flex items-center justify-center text-[#6b7280] transition hover:bg-[#eef0f5] hover:text-[#1a1d23] cursor-pointer shadow-sm"
          title="เต็มจอ"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
      {timerContent}
    </div>
  );
}
