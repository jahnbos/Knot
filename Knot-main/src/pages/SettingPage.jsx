import { useState, useEffect } from 'react';
import { Timer, Save, Volume2, VolumeX, RefreshCw, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function Toggle({ enabled, onToggle }) {
  return (
    <button type="button" onClick={onToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out cursor-pointer focus:outline-none"
      style={{ backgroundColor: enabled ? 'var(--accent)' : 'var(--border)' }}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function playTestSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn('Web Audio API not supported');
  }
}

export default function SettingPage() {
  const { isDark, toggleTheme } = useTheme();

  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [autoStart, setAutoStart] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');
      if (saved.focus)                   setFocusDuration(saved.focus);
      if (saved.short)                   setShortBreak(saved.short);
      if (saved.long)                    setLongBreak(saved.long);
      if (saved.autoStart !== undefined) setAutoStart(saved.autoStart);
      if (saved.sounds !== undefined)    setSounds(saved.sounds);
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('pomodoroSettings', JSON.stringify({
      focus: focusDuration,
      short: shortBreak,
      long: longBreak,
      autoStart,
      sounds,
    }));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSoundsToggle = () => {
    const next = !sounds;
    setSounds(next);
    if (next) playTestSound();
  };

  const inputCls = "w-full rounded-lg px-3 py-2.5 text-base outline-none transition";

  return (
    <div className="p-6 max-w-3xl mx-auto" style={{ minHeight: 'calc(100vh - 73px)' }}>
      <h1 className="text-3xl font-bold mb-8 leading-relaxed" style={{ color: 'var(--text-primary)' }}>ตั้งค่า</h1>

      <div className="rounded-2xl p-8 space-y-8" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>

        {/* Pomodoro */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Timer size={20} className="text-[var(--accent)]" />
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>ตั้งค่า Pomodoro</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'focus',      label: 'โฟกัส (นาที)',   value: focusDuration, setter: setFocusDuration },
              { id: 'shortBreak', label: 'พักสั้น (นาที)', value: shortBreak,    setter: setShortBreak    },
              { id: 'longBreak',  label: 'พักยาว (นาที)',  value: longBreak,     setter: setLongBreak     },
            ].map(({ id, label, value, setter }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {label}
                </label>
                <input id={id} type="number" min="1" max="120" value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className={inputCls}
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

        {/* การตั้งค่าทั่วไป */}
        <div>
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>การตั้งค่าทั่วไป</h2>
          <div className="space-y-5">

            {[
              {
                icon: <RefreshCw size={18} />,
                title: 'เริ่มรอบถัดไปอัตโนมัติ',
                desc: 'เริ่ม Pomodoro หรือพักรอบถัดไปโดยอัตโนมัติ',
                enabled: autoStart,
                onToggle: () => setAutoStart(!autoStart),
              },
              {
                icon: sounds ? <Volume2 size={18} /> : <VolumeX size={18} />,
                title: 'เสียงแจ้งเตือน',
                desc: 'เล่นเสียงเมื่อรอบเวลาจบ',
                enabled: sounds,
                onToggle: handleSoundsToggle,
              },
              {
                icon: <Moon size={18} />,
                title: 'โหมดมืด',
                desc: 'เปลี่ยนสีธีมเป็นโทนมืด',
                enabled: isDark,
                onToggle: toggleTheme,
              },
            ].map(({ icon, title, desc, enabled, onToggle }) => (
              <div key={title} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: enabled ? 'rgba(13,148,136,0.12)' : 'var(--bg-tertiary)', color: enabled ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>{title}</p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                  </div>
                </div>
                <Toggle enabled={enabled} onToggle={onToggle} />
              </div>
            ))}

          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <button type="button" onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white transition-all active:scale-95 hover:scale-105 cursor-pointer shadow-lg"
            style={{ backgroundColor: 'var(--accent)' }}>
            <Save className="h-5 w-5" /> บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3 z-[100] border"
          style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border)' }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-bold">บันทึกการตั้งค่าแล้ว!</span>
        </div>
      )}
    </div>
  );
}