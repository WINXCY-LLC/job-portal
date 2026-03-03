import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* ロゴ */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-primary-700">沖縄メディケアワーク</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">無料アカウント登録</h2>
        </div>

        {/* フォームカード */}
        <div className="bg-white rounded-2xl shadow-lg px-8 py-8">
          <RegisterForm />

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/auth/login" className="text-primary-600 hover:underline font-medium">
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
