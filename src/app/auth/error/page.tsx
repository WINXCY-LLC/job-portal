import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "認証エラー",
};

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900">認証エラーが発生しました</h1>
        <p className="text-gray-600">
          リンクの有効期限が切れているか、無効なリンクです。
          再度お試しください。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/login"
            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            ログインページへ
          </Link>
          <Link
            href="/auth/forgot-password"
            className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            パスワードをリセット
          </Link>
        </div>
      </div>
    </div>
  );
}
