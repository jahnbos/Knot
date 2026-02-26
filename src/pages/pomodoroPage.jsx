import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause, SkipForward, Maximize2, Minimize2 } from 'lucide-react';

// The full pomodoro cycle: F S F S F S F L (8 steps)
// F = focus, S = short break, L = long break
const CYCLE = ['focus', 'short', 'focus', 'short', 'focus', 'short', 'focus', 'long'];

const MODE_CONFIG = {
  focus:  { label: 'Focus',       seconds: 25 * 60 },
  short:  { label: 'Short Break', seconds:  5 * 60 },
  long:   { label: 'Long Break',  seconds: 15 * 60 },
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

  // Timer tick
  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => prev - 1);
      }, 1000);
    } else if (totalSeconds === 0 && isRunning) {
      // Auto-advance when timer hits zero
      setIsRunning(false);
      advanceCycle();
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, totalSeconds]);

  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  // Count completed focus sessions from cycle index
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
    // If current step is focus, count it as completed
    if (CYCLE[cycleIndex] === 'focus') {
      setCompletedFocus((prev) => Math.min(prev + 1, 4));
    }
    advanceCycle();
  }, [cycleIndex, advanceCycle]);

  const timerContent = (
    <div className="flex flex-col items-center justify-center flex-1">
      {/* Mode Tabs */}
      <div className="bg-gray-100 rounded-full px-1.5 py-1 flex items-center gap-1 mb-16">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
              mode === tab
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {MODE_CONFIG[tab].label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="mb-16">
        <span className="text-9xl font-extralight text-neutral-900 tracking-tight tabular-nums select-none">
          {minutes}:{seconds}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-16">
        <button
          onClick={handleReset}
          className="h-12 w-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 active:scale-95 cursor-pointer shadow-sm"
          title="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          onClick={handleToggle}
          className="h-16 px-10 rounded-full bg-neutral-900 flex items-center justify-center gap-2.5 text-white text-sm font-semibold transition hover:bg-neutral-800 active:scale-[0.97] cursor-pointer shadow-lg"
        >
          {isRunning ? (
            <><Pause className="h-5 w-5" /> Pause</>
          ) : (
            <><Play className="h-5 w-5" /> Start</>
          )}
        </button>

        <button
          onClick={handleSkip}
          className="h-12 w-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 active:scale-95 cursor-pointer shadow-sm"
          title="Skip"
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
                ? 'bg-neutral-900'
                : i === completedFocus && mode === 'focus'
                  ? 'bg-neutral-400'
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );

  // Fullscreen overlay
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col">
        {/* Minimize button */}
        <div className="absolute top-5 right-5">
          <button
            onClick={() => setIsFullscreen(false)}
            className="h-10 w-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 cursor-pointer shadow-sm"
            title="Exit fullscreen"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
        {timerContent}
      </div>
    );
  }

  // Normal (embedded in layout)
  return (
    <div className="relative flex flex-col" style={{ minHeight: 'calc(100vh - 57px)' }}>
      {/* Fullscreen button */}
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setIsFullscreen(true)}
          className="h-10 w-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 cursor-pointer shadow-sm"
          title="Focus mode"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
      {timerContent}
    </div>
  );
}
