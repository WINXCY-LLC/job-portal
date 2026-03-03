import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "新しいパスワードの設定",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary-700">
            医療・介護求人ポータル
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">新しいパスワードの設定</h2>
          <p className="mt-2 text-sm text-gray-600">
            新しいパスワードを入力してください
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow-md rounded-xl">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
