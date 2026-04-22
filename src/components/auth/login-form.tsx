'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth-schemas';
import { authService } from '@/lib/auth-service';

// ─── Sub-components ─────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-in slide-in-from-top-1 duration-200"
    >
      <span className="inline-block h-1 w-1 rounded-full bg-red-500 shrink-0" />
      {message}
    </p>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LoginForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const result = await authService.login(data);

      // Role-based redirect
      const role = result?.user?.role;
      if (role === 'STAFF') {
        router.push('/sales');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Bir hata oluştu. Lütfen tekrar deneyin.';

      // Map common backend messages to Turkish
      if (
        message.toLowerCase().includes('invalid') ||
        message.toLowerCase().includes('unauthorized') ||
        message.toLowerCase().includes('bad credentials')
      ) {
        setServerError('E-posta adresi veya şifre hatalı.');
      } else {
        setServerError('Bağlantı hatası. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };

  const inputBaseClass = cn(
    'w-full h-12 rounded-xl border bg-white/5 px-4 text-sm text-white',
    'placeholder:text-slate-400 outline-none transition-all duration-200',
    'border-white/10 hover:border-brand-teal-500/50',
    'focus:border-brand-teal-400 focus:ring-2 focus:ring-brand-teal-400/20',
  );

  return (
    <form
      id="login-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      {/* ── Server-side Error Banner ── */}
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-in slide-in-from-top-2 duration-300"
        >
          <span className="text-base">⚠</span>
          {serverError}
        </div>
      )}

      {/* ── Email Field ── */}
      <div className="space-y-1">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-slate-300"
        >
          E-posta Adresi
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="ornek@optimaxx.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className={cn(inputBaseClass, errors.email && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20')}
          {...register('email')}
        />
        <div id="login-email-error">
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      {/* ── Password Field ── */}
      <div className="space-y-1">
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-slate-300"
        >
          Şifre
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className={cn(
              inputBaseClass,
              'pr-12',
              errors.password && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
            )}
            {...register('password')}
          />
          <button
            type="button"
            id="toggle-password-visibility"
            aria-label={isPasswordVisible ? 'Şifreyi gizle' : 'Şifreyi göster'}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-teal-400 transition-colors duration-150"
          >
            {isPasswordVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <div id="login-password-error">
          <FieldError message={errors.password?.message} />
        </div>
      </div>

      {/* ── Submit Button ── */}
      <button
        id="login-submit-button"
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'relative w-full h-12 rounded-xl font-semibold text-sm tracking-wide overflow-hidden',
          'bg-gradient-to-r from-brand-teal-500 to-brand-navy-500',
          'text-white shadow-lg shadow-brand-teal-500/25',
          'transition-all duration-300',
          'hover:from-brand-teal-400 hover:to-brand-navy-400 hover:shadow-brand-teal-400/40 hover:scale-[1.01]',
          'active:scale-[0.99]',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-900',
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2.5">
            <Loader2 className="h-4 w-4 animate-spin" />
            Giriş yapılıyor…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2.5">
            <LogIn className="h-4 w-4" />
            Giriş Yap
          </span>
        )}
      </button>
    </form>
  );
}
