"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "jobseeker" | "employer";

const ROLE_OPTIONS: { value: Role; label: string; description: string; icon: string }[] = [
  {
    value: "jobseeker",
    label: "求職者",
    description: "医療・介護の仕事を探している方",
    icon: "🔍",
  },
  {
    value: "employer",
    label: "事業者",
    description: "求人を掲載したい医療・介護施設の方",
    icon: "🏥",
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("jobseeker");
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }
    if (!agreed) {
      setError("利用規約への同意が必要です");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          ...(role === "employer" ? { organization_name: organizationName } : {}),
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        setError("このメールアドレスはすでに登録されています");
      } else {
        setError("登録に失敗しました。再度お試しください");
      }
      setLoading(false);
      return;
    }

    router.push("/auth/verify-email");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ロール選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">登録区分</label>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                role === opt.value
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className={`font-semibold text-sm ${role === opt.value ? "text-primary-700" : "text-gray-800"}`}>
                {opt.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{opt.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* お名前 */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          {role === "employer" ? "担当者名" : "お名前"}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          placeholder="山田 太郎"
        />
      </div>

      {/* 事業者のみ：施設名 */}
      {role === "employer" && (
        <div>
          <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
            施設名・法人名
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="organizationName"
            type="text"
            required
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="〇〇病院 / 〇〇介護施設"
          />
        </div>
      )}

      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          placeholder="example@email.com"
        />
      </div>

      {/* パスワード */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          パスワード
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="8文字以上"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {/* パスワード強度インジケーター */}
        {password.length > 0 && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    passwordStrength.score >= level
                      ? passwordStrength.score <= 1
                        ? "bg-red-400"
                        : passwordStrength.score <= 2
                        ? "bg-yellow-400"
                        : passwordStrength.score <= 3
                        ? "bg-blue-400"
                        : "bg-green-400"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs mt-1 ${
              passwordStrength.score <= 1 ? "text-red-500" :
              passwordStrength.score <= 2 ? "text-yellow-600" :
              passwordStrength.score <= 3 ? "text-blue-600" : "text-green-600"
            }`}>
              {passwordStrength.label}
            </p>
          </div>
        )}
      </div>

      {/* パスワード確認 */}
      <div>
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
          パスワード（確認）
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="passwordConfirm"
          type={showPassword ? "text" : "password"}
          required
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            passwordConfirm.length > 0 && password !== passwordConfirm
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
          }`}
          placeholder="もう一度入力してください"
        />
        {passwordConfirm.length > 0 && password !== passwordConfirm && (
          <p className="text-xs text-red-500 mt-1">パスワードが一致しません</p>
        )}
      </div>

      {/* 利用規約同意 */}
      <div className="flex items-start gap-3">
        <input
          id="agreed"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 text-primary-600 border-gray-300 rounded"
        />
        <label htmlFor="agreed" className="text-sm text-gray-600 cursor-pointer">
          <span className="text-primary-600 hover:underline cursor-pointer">利用規約</span>
          および
          <span className="text-primary-600 hover:underline cursor-pointer">プライバシーポリシー</span>
          に同意します
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !agreed}
        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            登録中...
          </span>
        ) : "無料で登録する"}
      </button>
    </form>
  );
}

function getPasswordStrength(password: string): { score: number; label: string } {
  if (password.length === 0) return { score: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["", "弱い", "普通", "強い", "非常に強い"];
  return { score, label: labels[score] };
}
