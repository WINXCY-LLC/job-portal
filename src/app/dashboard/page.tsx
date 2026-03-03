import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: { full_name: string | null; role: string } | null };

  const role = profile?.role ?? "jobseeker";
  const userName = profile?.full_name ?? user.email ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={userName} role={role} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ウェルカムバナー */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 mb-8 text-white">
          <p className="text-primary-100 text-sm mb-1">
            {role === "employer" ? "事業者アカウント" : "求職者アカウント"}
          </p>
          <h1 className="text-2xl font-bold">
            こんにちは、{profile?.full_name ?? "ユーザー"}さん
          </h1>
          <p className="text-primary-100 text-sm mt-1">
            {role === "employer"
              ? "求人の掲載・応募者の管理ができます"
              : "あなたにぴったりの求人を見つけましょう"}
          </p>
        </div>

        <h2 className="text-lg font-bold text-gray-700 mb-4">メニュー</h2>

        {role === "employer" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <DashboardCard
              title="求人を掲載する"
              description="新しい求人票を作成・公開"
              icon="📝"
              href="/dashboard/jobs/new"
              accent
            />
            <DashboardCard
              title="掲載中の求人"
              description="公開中の求人を管理"
              icon="📋"
              href="/dashboard/jobs"
            />
            <DashboardCard
              title="応募者を確認"
              description="届いた応募の確認・対応"
              icon="👥"
              href="/dashboard/applications"
            />
            <DashboardCard
              title="施設情報を編集"
              description="企業・施設プロフィールの設定"
              icon="🏥"
              href="/dashboard/company"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <DashboardCard
              title="求人を探す"
              description="条件に合った求人を検索"
              icon="🔍"
              href="/jobs"
              accent
            />
            <DashboardCard
              title="応募履歴"
              description="応募した求人の状況確認"
              icon="📄"
              href="/dashboard/applications"
            />
            <DashboardCard
              title="お気に入り"
              description="保存した求人一覧"
              icon="⭐"
              href="/dashboard/saved-jobs"
            />
            <DashboardCard
              title="プロフィール設定"
              description="氏名・経歴・希望条件の更新"
              icon="👤"
              href="/dashboard/profile"
            />
          </div>
        )}
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  href,
  accent = false,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all border block group ${
        accent
          ? "bg-primary-600 border-primary-600 text-white hover:bg-primary-700"
          : "bg-white border-gray-100 hover:border-primary-200"
      }`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className={`font-semibold text-base mb-1 ${accent ? "text-white" : "text-gray-900"}`}>
        {title}
      </h3>
      <p className={`text-sm ${accent ? "text-primary-100" : "text-gray-500"}`}>
        {description}
      </p>
    </Link>
  );
}
