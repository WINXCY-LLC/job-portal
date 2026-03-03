import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/layout/Logo";

const NAV_ITEMS = [
  { href: "/employer/jobs", label: "求人管理", icon: "📋" },
  { href: "/employer/applications", label: "応募管理", icon: "👥" },
  { href: "/employer/company", label: "施設情報", icon: "🏥" },
] as const;

interface EmployerNavProps {
  companyName: string | null;
  currentPath?: string;
}

export function EmployerNav({ companyName, currentPath }: EmployerNavProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* ロゴ・施設名 */}
          <div className="flex items-center gap-3">
            <Link href="/employer/jobs" className="shrink-0">
              <Logo size="sm" />
            </Link>
            {companyName && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-600 truncate max-w-[160px]">{companyName}</span>
              </>
            )}
          </div>

          {/* ナビゲーション */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ログアウト */}
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ログアウト
            </button>
          </form>
        </div>

        {/* モバイルナビ */}
        <div className="sm:hidden flex border-t border-gray-100">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                  isActive ? "text-primary-700" : "text-gray-500"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
