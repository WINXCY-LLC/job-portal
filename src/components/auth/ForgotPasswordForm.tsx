"use client";

import { useState } from "react";
import { forgotPassword } from "@/app/actions/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage(null);

    const formData = new FormData();
    formData.set("email", email);
    const result = await forgotPassword(formData);

    setLoading(false);
    if (result?.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl">📧</div>
        <h3 className="font-semibold text-gray-900">メールを送信しました</h3>
        <p className="text-sm text-gray-600">
          <strong>{email}</strong> にパスワードリセット用のリンクを送信しました。
          メールをご確認ください。
        </p>
        <p className="text-xs text-gray-400">
          メールが届かない場合は、迷惑メールフォルダもご確認ください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          登録済みメールアドレス
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          placeholder="example@email.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            送信中...
          </span>
        ) : "リセットメールを送信"}
      </button>
    </form>
  );
}
