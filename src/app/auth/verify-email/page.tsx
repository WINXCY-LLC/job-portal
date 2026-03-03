import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "メール確認",
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-10 text-center space-y-5">
          <div className="text-6xl">📧</div>
          <h1 className="text-2xl font-bold text-gray-900">確認メールを送信しました</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            ご登録のメールアドレスに確認メールをお送りしました。
            <br />
            メール内のリンクをクリックして登録を完了してください。
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700 text-left">
            <p className="font-medium mb-1">メールが届かない場合</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>迷惑メールフォルダをご確認ください</li>
              <li>メールアドレスが正しいかご確認ください</li>
            </ul>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <Link
              href="/auth/login"
              className="text-primary-600 hover:underline text-sm font-medium"
            >
              ← ログインページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
