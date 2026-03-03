import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WithdrawButton } from "@/components/dashboard/WithdrawButton";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Application, Profile } from "@/types/models";

export const metadata: Metadata = { title: "応募履歴" };

type ApplicationStatus = Application["status"];

type ApplicationRow = {
  id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  created_at: string;
  jobs: {
    id: string;
    title: string;
    occupation: string;
    employment_status: string;
    prefecture: string | null;
    city: string | null;
    companies: { name: string } | null;
  } | null;
};

export default async function DashboardApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // ロール確認：事業者は employer/applications へリダイレクト
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single() as { data: Pick<Profile, "role" | "full_name"> | null };

  if (profile?.role === "employer") {
    redirect("/employer/applications");
  }

  const userName = profile?.full_name ?? user.email ?? null;

  // 応募履歴を取得
  const { data: applications } = await (supabase
    .from("applications")
    .select(
      `id, status, cover_letter, created_at,
       jobs (
         id, title, occupation, employment_status, prefecture, city,
         companies ( name )
       )`
    )
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false }) as unknown as Promise<{
    data: ApplicationRow[] | null;
  }>);

  const list = applications ?? [];

  const activeCount = list.filter(
    (a) => !["rejected", "withdrawn"].includes(a.status)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={userName} role={profile?.role ?? "jobseeker"} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">応募履歴</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {list.length > 0
                ? `${list.length}件の応募（進行中: ${activeCount}件）`
                : "まだ応募した求人はありません"}
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-sm text-primary-600 hover:underline font-medium"
          >
            求人を探す →
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h2 className="text-base font-semibold text-gray-700 mb-1">
              応募履歴がありません
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              気になる求人に応募してみましょう。
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              求人を探す
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((app) => {
              const statusInfo = APPLICATION_STATUSES[app.status];
              const canWithdraw = !["rejected", "withdrawn", "offered"].includes(
                app.status
              );

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* 施設名 */}
                      <p className="text-xs text-gray-400 mb-0.5">
                        {app.jobs?.companies?.name ?? ""}
                      </p>

                      {/* 求人タイトル */}
                      <Link
                        href={`/jobs/${app.jobs?.id ?? ""}`}
                        className="font-semibold text-gray-900 hover:text-primary-600 transition-colors text-sm leading-snug line-clamp-2"
                      >
                        {app.jobs?.title ?? "（求人情報なし）"}
                      </Link>

                      {/* タグ */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {app.jobs?.occupation && (
                          <span className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                            {app.jobs.occupation}
                          </span>
                        )}
                        {app.jobs?.employment_status && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {app.jobs.employment_status}
                          </span>
                        )}
                        {app.jobs?.prefecture && (
                          <span className="text-xs text-gray-400">
                            📍 {app.jobs.prefecture}
                            {app.jobs.city ? `・${app.jobs.city}` : ""}
                          </span>
                        )}
                      </div>

                      {/* 応募日 */}
                      <p className="text-xs text-gray-400 mt-2">
                        応募日: {formatDate(app.created_at)}
                      </p>

                      {/* 志望動機 */}
                      {app.cover_letter && (
                        <details className="mt-3">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 select-none">
                            志望動機を確認する
                          </summary>
                          <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 leading-relaxed">
                            {app.cover_letter}
                          </p>
                        </details>
                      )}
                    </div>

                    {/* ステータス・操作 */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                      {canWithdraw && (
                        <WithdrawButton applicationId={app.id} />
                      )}
                    </div>
                  </div>

                  {/* 内定メッセージ */}
                  {app.status === "offered" && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <p className="text-sm font-semibold text-green-800">
                        🎉 内定おめでとうございます！
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        施設からの連絡をご確認ください。
                      </p>
                    </div>
                  )}

                  {/* 不採用メッセージ */}
                  {app.status === "rejected" && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                      <p className="text-sm text-gray-600">
                        今回は採用に至りませんでした。引き続き求人を探してみましょう。
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ダッシュボードに戻る */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← ダッシュボードに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
