import { useState, useEffect } from 'react';
import { Timer, Bell, Save, Volume2, BellRing, BellOff, MessageSquare, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const menuItems = [
  { key: 'timer', label: 'ตั้งค่าเวลา', icon: Timer },
  { key: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
];

function Toggle({ enabled, onToggle }) {
  return (
    <button type="button" onClick={onToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out cursor-pointer focus:outline-none"
      style={{ backgroundColor: enabled ? 'var(--accent)' : 'var(--border)' }}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function TimerContent({ focusDuration, setFocusDuration, shortBreak, setShortBreak, longBreak, setLongBreak, autoStart, setAutoStart, sounds, setSounds, isDark, toggleTheme, onSave }) {
  const inputCls = "w-full rounded-lg px-3 py-2.5 text-base outline-none transition";
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>ตั้งค่า Pomodoro</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { id: 'focus', label: 'โฟกัส (นาที)', value: focusDuration, setter: setFocusDuration },
          { id: 'shortBreak', label: 'พักสั้น (นาที)', value: shortBreak, setter: setShortBreak },
          { id: 'longBreak', label: 'พักยาว (นาที)', value: longBreak, setter: setLongBreak },
        ].map(({ id, label, value, setter }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-base font-medium mb-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{label}</label>
            <input id={id} type="number" value={value} onChange={(e) => setter(Number(e.target.value))}
              className={inputCls} style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
        ))}
      </div>

      <div className="my-6 h-px" style={{ backgroundColor: 'var(--border)' }} />

      <h2 className="text-xl font-semibold mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>การตั้งค่าทั่วไป</h2>
      <div className="space-y-5">
        {[
          { title: 'เริ่มรอบถัดไปอัตโนมัติ', desc: 'เริ่ม Pomodoro หรือพักรอบถัดไปโดยอัตโนมัติ', enabled: autoStart, onToggle: () => setAutoStart(!autoStart) },
          { title: 'เสียงแจ้งเตือน', desc: 'เล่นเสียงเมื่อรอบเวลาจบ', enabled: sounds, onToggle: () => setSounds(!sounds) },
          { title: 'โหมดมืด', desc: 'เปลี่ยนสีธีมเป็นโทนมืด', enabled: isDark, onToggle: toggleTheme },
        ].map(({ title, desc, enabled, onToggle }) => (
          <div key={title} className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>{title}</p>
              <p className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
            <Toggle enabled={enabled} onToggle={onToggle} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button type="button" onClick={onSave}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-base font-semibold text-white transition active:scale-[0.98] cursor-pointer leading-relaxed shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Save className="h-5 w-5" /> บันทึกการเปลี่ยนแปลง
        </button>
      </div>
    </>
  );
}

function NotificationRow({ icon: Icon, iconBg, iconColor, title, desc, control }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>{title}</p>
          <p className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
        </div>
      </div>
      {control}
    </div>
  );
}

function NotificationsContent({ sessionReminder, setSessionReminder, breakReminder, setBreakReminder, soundAlerts, setSoundAlerts, doNotDisturb, setDoNotDisturb, reminderBefore, setReminderBefore }) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>ตั้งค่าการแจ้งเตือน</h2>
      <h3 className="text-base font-semibold uppercase tracking-wider mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>การแจ้งเตือน</h3>
      <div className="space-y-5">
        <NotificationRow icon={BellRing} iconBg="rgba(152,195,121,0.1)" iconColor="#98c379" title="รอบเสร็จสิ้น" desc="แจ้งเตือนเมื่อรอบโฟกัสหรือพักจบลง"
          control={<Toggle enabled={sessionReminder} onToggle={() => setSessionReminder(!sessionReminder)} />} />
        <NotificationRow icon={Clock} iconBg="rgba(97,175,239,0.1)" iconColor="#61afef" title="เตือนให้พัก" desc="เตือนให้พักหลังจากโฟกัสเสร็จ"
          control={<Toggle enabled={breakReminder} onToggle={() => setBreakReminder(!breakReminder)} />} />
        <NotificationRow icon={Volume2} iconBg="rgba(229,192,123,0.1)" iconColor="#e5c07b" title="เสียงแจ้งเตือน" desc="เล่นเสียงเมื่อมีการแจ้งเตือน"
          control={<Toggle enabled={soundAlerts} onToggle={() => setSoundAlerts(!soundAlerts)} />} />
      </div>

      <div className="my-6 h-px" style={{ backgroundColor: 'var(--border)' }} />

      <h3 className="text-base font-semibold uppercase tracking-wider mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>สรุปผลและกำหนดการ</h3>
      <div className="space-y-5">
        <NotificationRow icon={BellOff} iconBg="rgba(224,108,117,0.1)" iconColor="#e06c75" title="ห้ามรบกวน" desc="ปิดเสียงแจ้งเตือนทั้งหมดขณะโฟกัส"
          control={<Toggle enabled={doNotDisturb} onToggle={() => setDoNotDisturb(!doNotDisturb)} />} />
        <NotificationRow icon={Bell} iconBg="var(--bg-tertiary)" iconColor="var(--text-secondary)" title="เตือนก่อนเวลา" desc="แจ้งเตือนก่อนรอบเวลาที่กำหนด"
          control={
            <select value={reminderBefore} onChange={(e) => setReminderBefore(e.target.value)}
              className="rounded-lg px-3 py-2 text-base outline-none transition cursor-pointer leading-relaxed"
              style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="none">ไม่เตือน</option>
              <option value="5">5 นาที</option>
              <option value="10">10 นาที</option>
              <option value="15">15 นาที</option>
            </select>
          } />
      </div>

      <div className="mt-8 flex justify-end">
        <button type="button" onClick={() => console.log('Notification settings saved')}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-base font-semibold text-white transition active:scale-[0.98] cursor-pointer leading-relaxed shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Save className="h-5 w-5" /> บันทึกการเปลี่ยนแปลง
        </button>
      </div>
    </>
  );
}

export default function SettingPage() {
  const [activeMenu, setActiveMenu] = useState('timer');
  const { isDark, toggleTheme } = useTheme();

  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [autoStart, setAutoStart] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');
      if (savedSettings.focus) setFocusDuration(savedSettings.focus);
      if (savedSettings.short) setShortBreak(savedSettings.short);
      if (savedSettings.long) setLongBreak(savedSettings.long);
      if (savedSettings.autoStart !== undefined) setAutoStart(savedSettings.autoStart);
      if (savedSettings.sounds !== undefined) setSounds(savedSettings.sounds);
    } catch (e) {
      console.error('Failed to load pomodoro settings', e);
    }
  }, []);

  const handleSaveTimerSettings = () => {
    localStorage.setItem('pomodoroSettings', JSON.stringify({
      focus: focusDuration,
      short: shortBreak,
      long: longBreak,
      autoStart,
      sounds
    }));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const [sessionReminder, setSessionReminder] = useState(true);
  const [breakReminder, setBreakReminder] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [reminderBefore, setReminderBefore] = useState('5');

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ minHeight: 'calc(100vh - 73px)' }}>
      <h1 className="text-3xl font-bold mb-6 leading-relaxed" style={{ color: 'var(--text-primary)' }}>ตั้งค่า</h1>

      <div className="flex gap-6">
        <aside className="w-60 shrink-0">
          <nav className="rounded-xl p-2 space-y-0.5" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.key;
              return (
                <button key={item.key} onClick={() => setActiveMenu(item.key)}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium transition cursor-pointer leading-relaxed"
                  style={{
                    backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  }}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}>
          {activeMenu === 'timer' ? (
            <TimerContent
              focusDuration={focusDuration} setFocusDuration={setFocusDuration}
              shortBreak={shortBreak} setShortBreak={setShortBreak}
              longBreak={longBreak} setLongBreak={setLongBreak}
              autoStart={autoStart} setAutoStart={setAutoStart}
              sounds={sounds} setSounds={setSounds}
              isDark={isDark} toggleTheme={toggleTheme}
              onSave={handleSaveTimerSettings}
            />
          ) : (
            <NotificationsContent
              sessionReminder={sessionReminder} setSessionReminder={setSessionReminder}
              breakReminder={breakReminder} setBreakReminder={setBreakReminder}
              soundAlerts={soundAlerts} setSoundAlerts={setSoundAlerts}

              doNotDisturb={doNotDisturb} setDoNotDisturb={setDoNotDisturb}
              reminderBefore={reminderBefore} setReminderBefore={setReminderBefore}
            />
          )}
        </div>
      </div>

      {/* Success Toast Feedback */}
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