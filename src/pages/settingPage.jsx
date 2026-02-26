import { useState } from 'react';
import { Timer, Bell, Save, Volume2, BellRing, BellOff, MessageSquare, Clock } from 'lucide-react';

const menuItems = [
  { key: 'timer', label: 'Timer Preferences', icon: Timer },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
        enabled ? 'bg-neutral-900' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function TimerContent({
  focusDuration, setFocusDuration,
  shortBreak, setShortBreak,
  longBreak, setLongBreak,
  autoStart, setAutoStart,
  sounds, setSounds,
  darkMode, setDarkMode,
}) {
  return (
    <>
      {/* Pomodoro Settings */}
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Pomodoro Settings</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="focus" className="block text-sm font-medium text-gray-600 mb-1.5">
            Focus (min)
          </label>
          <input
            id="focus"
            type="number"
            value={focusDuration}
            onChange={(e) => setFocusDuration(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition"
          />
        </div>
        <div>
          <label htmlFor="shortBreak" className="block text-sm font-medium text-gray-600 mb-1.5">
            Short Break (min)
          </label>
          <input
            id="shortBreak"
            type="number"
            value={shortBreak}
            onChange={(e) => setShortBreak(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition"
          />
        </div>
        <div>
          <label htmlFor="longBreak" className="block text-sm font-medium text-gray-600 mb-1.5">
            Long Break (min)
          </label>
          <input
            id="longBreak"
            type="number"
            value={longBreak}
            onChange={(e) => setLongBreak(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-gray-200" />

      {/* Preferences */}
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900">Auto-start next session</p>
            <p className="text-xs text-gray-400 mt-0.5">Automatically begin the next pomodoro or break</p>
          </div>
          <Toggle enabled={autoStart} onToggle={() => setAutoStart(!autoStart)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900">Sounds</p>
            <p className="text-xs text-gray-400 mt-0.5">Play notification sounds when a session ends</p>
          </div>
          <Toggle enabled={sounds} onToggle={() => setSounds(!sounds)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900">Dark Mode</p>
            <p className="text-xs text-gray-400 mt-0.5">Switch to a darker color scheme</p>
          </div>
          <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        </div>
      </div>

      {/* Save */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => console.log('Settings saved')}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </>
  );
}

function NotificationsContent({
  sessionReminder, setSessionReminder,
  breakReminder, setBreakReminder,
  soundAlerts, setSoundAlerts,
  dailySummary, setDailySummary,
  doNotDisturb, setDoNotDisturb,
  reminderBefore, setReminderBefore,
}) {
  return (
    <>
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notification Settings</h2>

      {/* Alerts Section */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Alerts</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <BellRing className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Session complete</p>
              <p className="text-xs text-gray-400 mt-0.5">Notify when a focus or break session ends</p>
            </div>
          </div>
          <Toggle enabled={sessionReminder} onToggle={() => setSessionReminder(!sessionReminder)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Break reminder</p>
              <p className="text-xs text-gray-400 mt-0.5">Remind you to take a break after focus sessions</p>
            </div>
          </div>
          <Toggle enabled={breakReminder} onToggle={() => setBreakReminder(!breakReminder)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center">
              <Volume2 className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Sound alerts</p>
              <p className="text-xs text-gray-400 mt-0.5">Play audio cues for notifications</p>
            </div>
          </div>
          <Toggle enabled={soundAlerts} onToggle={() => setSoundAlerts(!soundAlerts)} />
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-gray-200" />

      {/* Summary & Schedule */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Summary & Schedule</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Daily summary</p>
              <p className="text-xs text-gray-400 mt-0.5">Receive a recap of your focus stats each day</p>
            </div>
          </div>
          <Toggle enabled={dailySummary} onToggle={() => setDailySummary(!dailySummary)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center">
              <BellOff className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Do not disturb</p>
              <p className="text-xs text-gray-400 mt-0.5">Mute all notifications during focus sessions</p>
            </div>
          </div>
          <Toggle enabled={doNotDisturb} onToggle={() => setDoNotDisturb(!doNotDisturb)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <Bell className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Reminder before session</p>
              <p className="text-xs text-gray-400 mt-0.5">Get notified minutes before a scheduled session</p>
            </div>
          </div>
          <select
            value={reminderBefore}
            onChange={(e) => setReminderBefore(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition cursor-pointer"
          >
            <option value="none">None</option>
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
          </select>
        </div>
      </div>

      {/* Save */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => console.log('Notification settings saved')}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </>
  );
}

export default function SettingPage() {
  const [activeMenu, setActiveMenu] = useState('timer');

  // Timer state
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [autoStart, setAutoStart] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Notification state
  const [sessionReminder, setSessionReminder] = useState(true);
  const [breakReminder, setBreakReminder] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [reminderBefore, setReminderBefore] = useState('5');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* ── Left Sidebar ── */}
        <aside className="w-56 shrink-0">
          <nav className="bg-white rounded-xl border border-gray-200/60 p-2 space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key)}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-gray-100 text-neutral-900'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Right Content ── */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200/60 p-6">
          {activeMenu === 'timer' ? (
            <TimerContent
              focusDuration={focusDuration} setFocusDuration={setFocusDuration}
              shortBreak={shortBreak} setShortBreak={setShortBreak}
              longBreak={longBreak} setLongBreak={setLongBreak}
              autoStart={autoStart} setAutoStart={setAutoStart}
              sounds={sounds} setSounds={setSounds}
              darkMode={darkMode} setDarkMode={setDarkMode}
            />
          ) : (
            <NotificationsContent
              sessionReminder={sessionReminder} setSessionReminder={setSessionReminder}
              breakReminder={breakReminder} setBreakReminder={setBreakReminder}
              soundAlerts={soundAlerts} setSoundAlerts={setSoundAlerts}
              dailySummary={dailySummary} setDailySummary={setDailySummary}
              doNotDisturb={doNotDisturb} setDoNotDisturb={setDoNotDisturb}
              reminderBefore={reminderBefore} setReminderBefore={setReminderBefore}
            />
          )}
        </div>
      </div>
    </div>
  );
}
