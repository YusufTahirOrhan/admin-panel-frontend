"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/lib/auth-service";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Geçersiz veya süresi dolmuş sıfırlama bağlantısı.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Şifreniz en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
    } catch {
      setError("Şifre sıfırlama işlemi başarısız oldu. Bağlantının süresi dolmuş olabilir.");
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClass = cn(
    "w-full h-12 rounded-xl border bg-white/5 px-4 text-sm text-white",
    "placeholder:text-slate-400 outline-none transition-all duration-200",
    "border-white/10 hover:border-teal-500/50",
    "focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Yeni Şifre Belirleyin</h1>
          <p className="text-xs text-slate-400 mt-1">
            Hesabınız için yeni bir şifre giriniz.
          </p>
        </div>

        {success ? (
          <div className="space-y-4 text-center py-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm text-slate-200 font-medium">
              Şifreniz başarıyla güncellendi!
            </p>
            <p className="text-xs text-slate-400">
              Yeni şifrenizle giriş yapabilirsiniz.
            </p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full h-11 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
            >
              Giriş Ekranına Git
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Yeni Şifre
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  placeholder="En az 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={cn(inputBaseClass, "pr-12")}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400 transition-colors"
                >
                  {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Yeni Şifre (Tekrar)
              </label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                required
                placeholder="Şifreyi tekrar girin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputBaseClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white font-semibold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                "Şifreyi Güncelle"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
