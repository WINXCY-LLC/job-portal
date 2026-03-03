import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "./Logo";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* ロゴ */}
          <Link href="/" className="shrink-0">
            <Logo size="sm" />
          </Link>

          {/* ナビ */}
          <nav className="flex items-center gap-2">
            <Link
              href="/jobs"
              className="hidden sm:block text-sm text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              求人を探す
            </Link>

            {user ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-primary-600 border border-primary-300 px-4 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
              >
                マイページ
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium bg-primary-600 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  無料登録
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
