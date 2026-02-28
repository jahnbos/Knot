import { useState } from 'react';
import { Timer, Bell, Save, Volume2, BellRing, BellOff, MessageSquare, Clock } from 'lucide-react';

const menuItems = [
  { key: 'timer', label: 'ตั้งค่าเวลา', icon: Timer },
  { key: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
];

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
        enabled ? 'bg-[#61afef]' : 'bg-[#d1d5db]'
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
      <h2 className="text-xl font-semibold text-[#1a1d23] mb-4 leading-relaxed">ตั้งค่า Pomodoro</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="focus" className="block text-base font-medium text-[#6b7280] mb-1.5 leading-relaxed">
            โฟกัส (นาที)
          </label>
          <input
            id="focus"
            type="number"
            value={focusDuration}
            onChange={(e) => setFocusDuration(Number(e.target.value))}
            className="w-full rounded-lg border border-[#e1e4ec] bg-[#f5f6fa] px-3 py-2.5 text-base text-[#1a1d23] outline-none focus:border-[#61afef] focus:ring-2 focus:ring-[#61afef]/20 transition"
          />
        </div>
        <div>
          <label htmlFor="shortBreak" className="block text-base font-medium text-[#6b7280] mb-1.5 leading-relaxed">
            พักสั้น (นาที)
          </label>
          <input
            id="shortBreak"
            type="number"
            value={shortBreak}
            onChange={(e) => setShortBreak(Number(e.target.value))}
            className="w-full rounded-lg border border-[#e1e4ec] bg-[#f5f6fa] px-3 py-2.5 text-base text-[#1a1d23] outline-none focus:border-[#61afef] focus:ring-2 focus:ring-[#61afef]/20 transition"
          />
        </div>
        <div>
          <label htmlFor="longBreak" className="block text-base font-medium text-[#6b7280] mb-1.5 leading-relaxed">
            พักยาว (นาที)
          </label>
          <input
            id="longBreak"
            type="number"
            value={longBreak}
            onChange={(e) => setLongBreak(Number(e.target.value))}
            className="w-full rounded-lg border border-[#e1e4ec] bg-[#f5f6fa] px-3 py-2.5 text-base text-[#1a1d23] outline-none focus:border-[#61afef] focus:ring-2 focus:ring-[#61afef]/20 transition"
          />
        </div>
      </div>

      <div className="my-6 h-px bg-[#e1e4ec]" />

      <h2 className="text-xl font-semibold text-[#1a1d23] mb-4 leading-relaxed">การตั้งค่าทั่วไป</h2>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-[#1a1d23] leading-relaxed">เริ่มรอบถัดไปอัตโนมัติ</p>
            <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">เริ่ม Pomodoro หรือพักรอบถัดไปโดยอัตโนมัติ</p>
          </div>
          <Toggle enabled={autoStart} onToggle={() => setAutoStart(!autoStart)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-[#1a1d23] leading-relaxed">เสียงแจ้งเตือน</p>
            <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">เล่นเสียงเมื่อรอบเวลาจบ</p>
          </div>
          <Toggle enabled={sounds} onToggle={() => setSounds(!sounds)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-[#1a1d23] leading-relaxed">โหมดมืด</p>
            <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">เปลี่ยนสีธีมเป็นโทนมืด</p>
          </div>
          <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => console.log('Settings saved')}
          className="inline-flex items-center gap-2 rounded-lg bg-[#61afef] px-5 py-2.5 text-base font-semibold text-white transition hover:bg-[#4d9fd9] active:scale-[0.98] cursor-pointer leading-relaxed"
        >
          <Save className="h-5 w-5" />
          บันทึกการเปลี่ยนแปลง
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
      <h2 className="text-xl font-semibold text-[#1a1d23] mb-4 leading-relaxed">ตั้งค่าการแจ้งเตือน</h2>

      <h3 className="text-base font-semibold text-[#6b7280] uppercase tracking-wider mb-3 leading-relaxed">การแจ้งเตือน</h3>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#98c379]/10 flex items-center justify-center">
              <BellRing className="h-5 w-5 text-[#98c379]" />
            </div>
            <div>
              <p className="text-base font-medium text-[#1a1d23] leading-relaxed">รอบเสร็จสิ้น</p>
              <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">แจ้งเตือนเมื่อรอบโฟกัสหรือพักจบลง</p>
            </div>
          </div>
          <Toggle enabled={sessionReminder} onToggle={() => setSessionReminder(!sessionReminder)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#61afef]/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#61afef]" />
            </div>
            <div>
              <p className="text-base font-medium text-[#1a1d23] leading-relaxed">เตือนให้พัก</p>
              <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">เตือนให้พักหลังจากโฟกัสเสร็จ</p>
            </div>
          </div>
          <Toggle enabled={breakReminder} onToggle={() => setBreakReminder(!breakReminder)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#e5c07b]/10 flex items-center justify-center">
              <Volume2 className="h-5 w-5 text-[#e5c07b]" />
            </div>
            <div>
              <p className="text-base font-medium text-[#1a1d23] leading-relaxed">เสียงแจ้งเตือน</p>
              <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">เล่นเสียงเมื่อมีการแจ้งเตือน</p>
            </div>
          </div>
          <Toggle enabled={soundAlerts} onToggle={() => setSoundAlerts(!soundAlerts)} />
        </div>
      </div>

      <div className="my-6 h-px bg-[#e1e4ec]" />

      <h3 className="text-base font-semibold text-[#6b7280] uppercase tracking-wider mb-3 leading-relaxed">สรุปผลและกำหนดการ</h3>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#c678dd]/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-[#c678dd]" />
            </div>
            <div>
              <p className="text-base font-medium text-[#1a1d23] leading-relaxed">สรุปผลรายวัน</p>
              <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">รับสรุปสถิติการโฟกัสในแต่ละวัน</p>
            </div>
          </div>
          <Toggle enabled={dailySummary} onToggle={() => setDailySummary(!dailySummary)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#e06c75]/10 flex items-center justify-center">
              <BellOff className="h-5 w-5 text-[#e06c75]" />
            </div>
            <div>
              <p className="text-base font-medium text-[#1a1d23] leading-relaxed">ห้ามรบกวน</p>
              <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">ปิดเสียงแจ้งเตือนทั้งหมดขณะโฟกัส</p>
            </div>
          </div>
          <Toggle enabled={doNotDisturb} onToggle={() => setDoNotDisturb(!doNotDisturb)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#eef0f5] flex items-center justify-center">
              <Bell className="h-5 w-5 text-[#6b7280]" />
            </div>
            <div>
              <p className="text-base font-medium text-[#1a1d23] leading-relaxed">เตือนก่อนเวลา</p>
              <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">แจ้งเตือนก่อนรอบเวลาที่กำหนด</p>
            </div>
          </div>
          <select
            value={reminderBefore}
            onChange={(e) => setReminderBefore(e.target.value)}
            className="rounded-lg border border-[#e1e4ec] bg-[#f5f6fa] px-3 py-2 text-base text-[#1a1d23] outline-none focus:border-[#61afef] focus:ring-2 focus:ring-[#61afef]/20 transition cursor-pointer leading-relaxed"
          >
            <option value="none">ไม่เตือน</option>
            <option value="5">5 นาที</option>
            <option value="10">10 นาที</option>
            <option value="15">15 นาที</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => console.log('Notification settings saved')}
          className="inline-flex items-center gap-2 rounded-lg bg-[#61afef] px-5 py-2.5 text-base font-semibold text-white transition hover:bg-[#4d9fd9] active:scale-[0.98] cursor-pointer leading-relaxed"
        >
          <Save className="h-5 w-5" />
          บันทึกการเปลี่ยนแปลง
        </button>
      </div>
    </>
  );
}

export default function SettingPage() {
  const [activeMenu, setActiveMenu] = useState('timer');

  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [autoStart, setAutoStart] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [sessionReminder, setSessionReminder] = useState(true);
  const [breakReminder, setBreakReminder] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [reminderBefore, setReminderBefore] = useState('5');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1a1d23] mb-6 leading-relaxed">ตั้งค่า</h1>

      <div className="flex gap-6">
        {/* ── Left Sidebar ── */}
        <aside className="w-60 shrink-0">
          <nav className="bg-white rounded-xl border border-[#e1e4ec] p-2 space-y-0.5 shadow-sm">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key)}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium transition cursor-pointer leading-relaxed ${
                    isActive
                      ? 'bg-[#eef0f5] text-[#61afef]'
                      : 'text-[#6b7280] hover:bg-[#f5f6fa] hover:text-[#1a1d23]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Right Content ── */}
        <div className="flex-1 bg-white rounded-xl border border-[#e1e4ec] p-6 shadow-sm">
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
