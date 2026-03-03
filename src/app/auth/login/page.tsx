import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* ロゴ */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-primary-700">沖縄メディケアワーク</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">ログイン</h2>
        </div>

        {/* フォームカード */}
        <div className="bg-white rounded-2xl shadow-lg px-8 py-8">
          <LoginForm />

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-600">
            アカウントをお持ちでない方は{" "}
            <Link href="/auth/register" className="text-primary-600 hover:underline font-medium">
              新規登録
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
