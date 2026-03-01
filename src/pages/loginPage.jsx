import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Link, User } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-500">

      {/* ── Decorative gradient orbs ── */}
      {/* Top Left Glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[var(--accent)]/10 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      {/* Bottom Right Glow */}
      <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[var(--accent-purple)]/10 blur-[130px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      {/* Center Behind Card Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--accent-gold)]/10 blur-[150px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      {/* ── Card ── */}
      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-12 w-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 10px 15px -3px rgba(184, 91, 62, 0.25)' }}>
            <Link className="h-6 w-6 text-white" />
          </div>
          <span className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">Knot</span>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-3xl p-8 shadow-2xl">

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] leading-relaxed">
              {isLogin ? 'ยินดีต้อนรับกลับ' : 'สร้างบัญชีใหม่'}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
              {isLogin ? 'เข้าสู่ระบบเพื่อจัดการงานของคุณ' : 'เริ่มต้นจัดการเวลาและงานของคุณวันนี้'}
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => onLogin && onLogin()}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] px-4 py-3.5 text-sm font-medium text-[var(--text-primary)] transition-all duration-300 hover:bg-[var(--bg-hover)] hover:border-[var(--border-light)] hover:shadow-card active:scale-[0.98] cursor-pointer group"
          >
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {isLogin ? 'เข้าสู่ระบบด้วย Google' : 'สมัครสมาชิกด้วย Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium">หรือ</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (Only for Register) */}
            {!isLogin && (
              <div className="flex gap-4 animate-in slide-in-from-top-2 duration-300">
                {/* First Name */}
                <div className="relative group w-1/2">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent)]" />
                  <input
                    id="firstName"
                    type="text"
                    placeholder="ชื่อ"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl bg-[var(--bg-input)] border border-[var(--border)] py-3.5 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 leading-relaxed"
                  />
                </div>
                {/* Last Name */}
                <div className="relative group w-1/2">
                  <input
                    id="lastName"
                    type="text"
                    placeholder="นามสกุล"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl bg-[var(--bg-input)] border border-[var(--border)] py-3.5 px-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent)]" />
              <input
                id="email"
                type="email"
                placeholder="อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-[var(--bg-input)] border border-[var(--border)] py-3.5 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 leading-relaxed"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent)]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-[var(--bg-input)] border border-[var(--border)] py-3.5 pl-11 pr-12 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 leading-relaxed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Forgot Password (Only for Login) */}
            {isLogin && (
              <div className="text-right pb-2">
                <a href="#" className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition leading-relaxed">
                  ลืมรหัสผ่าน?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] py-3.5 text-sm font-semibold text-[var(--bg-secondary)] transition-all duration-300 hover:shadow-lg hover:brightness-110 active:scale-[0.98] cursor-pointer mt-2"
            >
              {isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'}
            </button>
          </form>
        </div>

        {/* Bottom Text Toggle */}
        <p className="text-center text-sm text-[var(--text-secondary)] mt-8 leading-relaxed">
          {isLogin ? 'ยังไม่มีบัญชี?' : 'มีบัญชีอยู่แล้ว?'}
          {' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition hover:underline cursor-pointer"
          >
            {isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </p>
      </div>
    </div>
  );
}
