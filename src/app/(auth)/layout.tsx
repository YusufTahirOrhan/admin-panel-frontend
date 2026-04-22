import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giriş | OptiMaxx',
  description: 'OptiMaxx Yönetim Sistemine giriş yapın.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ── Keyframes (injected once via style tag) ──────────────────── */}
      <style>{`
        @keyframes mesh-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-24px) scale(1.04); }
        }
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .auth-mesh {
          background: linear-gradient(
            135deg,
            var(--brand-navy-900) 0%,
            var(--brand-navy-700) 30%,
            #0f2d5e 55%,
            var(--brand-navy-800) 75%,
            #07153a 100%
          );
          background-size: 300% 300%;
          animation: mesh-shift 14s ease infinite;
        }
        .auth-orb-1 {
          background: radial-gradient(circle, var(--brand-teal-500) 0%, transparent 70%);
          animation: float-orb 7s ease-in-out infinite;
          animation-delay: 0s;
        }
        .auth-orb-2 {
          background: radial-gradient(circle, var(--brand-gold-500) 0%, transparent 70%);
          animation: float-orb 9s ease-in-out infinite;
          animation-delay: -3s;
        }
        .auth-card-enter {
          animation: slide-up-fade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <div className="flex min-h-screen w-full">
        {/* ══ LEFT — Branding Panel ════════════════════════════════════ */}
        <div className="auth-mesh relative hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col items-center justify-center overflow-hidden p-12">
          {/* Soft orb glows */}
          <div className="auth-orb-1 absolute -top-24 -left-16 h-80 w-80 opacity-30 blur-3xl pointer-events-none" />
          <div className="auth-orb-2 absolute bottom-0 right-0 h-96 w-96 opacity-20 blur-3xl pointer-events-none" />

          {/* Spectacles icon (geometric SVG) */}
          <div className="relative z-10 flex flex-col items-center gap-8 text-center select-none">
            <div className="flex items-center justify-center h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/15 shadow-2xl shadow-brand-navy-900/60">
              <svg
                viewBox="0 0 80 40"
                className="h-10 w-20 fill-none stroke-white stroke-[2.5] drop-shadow-lg"
                aria-hidden="true"
              >
                {/* Left lens */}
                <circle cx="20" cy="20" r="16" strokeLinecap="round" />
                {/* Right lens */}
                <circle cx="60" cy="20" r="16" strokeLinecap="round" />
                {/* Bridge */}
                <path d="M36 20 C38 18 42 18 44 20" />
                {/* Left temple */}
                <path d="M4 20 L0 20" strokeLinecap="round" />
                {/* Right temple */}
                <path d="M76 20 L80 20" strokeLinecap="round" />
                {/* Gold accent highlight on right lens */}
                <circle
                  cx="60"
                  cy="20"
                  r="16"
                  stroke="url(#gold-grad)"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <defs>
                  <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f0c842" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-tight">
                Opti<span className="text-brand-teal-400">Maxx</span>
              </h1>
              <p className="mt-2 text-base text-slate-300 font-medium tracking-wide">
                Yönetim Sistemi
              </p>
            </div>

            <p className="max-w-xs text-sm text-slate-400 leading-relaxed">
              Stok, satış ve personel yönetimini tek panelden kontrol edin.
              Verileriniz güvende, işlemleriniz hızlı.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['Envanter', 'Satış & Tamir', 'Analitik', 'CRM'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom badge */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-teal-400 animate-pulse" />
            <span className="text-xs text-slate-500 font-medium tracking-widest uppercase">
              OptiMaxx © 2026
            </span>
          </div>
        </div>

        {/* ══ RIGHT — Form Panel ══════════════════════════════════════ */}
        <div className="flex flex-1 items-center justify-center bg-[#060e2f] px-6 py-12 sm:px-12 relative overflow-hidden">
          {/* Subtle radial bg glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(20,184,166,0.07) 0%, transparent 70%)',
            }}
          />

          <div className="auth-card-enter relative z-10 w-full max-w-md">
            {/* Glass card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-brand-navy-900/80">
              {/* Mobile-only header */}
              <div className="mb-8 lg:mb-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 mb-4 lg:hidden">
                  <span className="text-2xl font-bold text-white">
                    Opti<span className="text-brand-teal-400">Maxx</span>
                  </span>
                </span>
                <h2 className="text-2xl font-bold text-white">Hoş Geldiniz</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Devam etmek için hesabınıza giriş yapın.
                </p>
              </div>

              {/* Form child injected here */}
              {children}
            </div>

            {/* Fine print */}
            <p className="mt-5 text-center text-xs text-slate-600">
              OptiMaxx Management System &mdash; Yetkisiz erişim yasaktır.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

