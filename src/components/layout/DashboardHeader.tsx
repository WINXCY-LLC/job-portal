import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Logo } from "./Logo";

interface DashboardHeaderProps {
  userName: string | null;
  role: string;
}

export function DashboardHeader({ userName, role }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/">
          <Logo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {role === "employer" ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                ダッシュボード
              </Link>
              <Link href="/dashboard/jobs" className="text-gray-600 hover:text-primary-600 transition-colors">
                求人管理
              </Link>
              <Link href="/dashboard/applications" className="text-gray-600 hover:text-primary-600 transition-colors">
                応募管理
              </Link>
              <Link href="/dashboard/company" className="text-gray-600 hover:text-primary-600 transition-colors">
                施設情報
              </Link>
            </>
          ) : (
            <>
              <Link href="/jobs" className="text-gray-600 hover:text-primary-600 transition-colors">
                求人を探す
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                ダッシュボード
              </Link>
              <Link href="/dashboard/applications" className="text-gray-600 hover:text-primary-600 transition-colors">
                応募履歴
              </Link>
              <Link href="/dashboard/saved-jobs" className="text-gray-600 hover:text-primary-600 transition-colors">
                お気に入り
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {userName ? userName.charAt(0) : "?"}
            </div>
            <span className="hidden sm:block text-sm text-gray-700 font-medium">
              {userName ?? "ユーザー"}
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
