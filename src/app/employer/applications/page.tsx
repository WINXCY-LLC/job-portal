import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationStatusSelect } from "@/components/employer/ApplicationStatusSelect";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/types/models";

export const metadata: Metadata = { title: "応募管理" };

type QueryResult<T> = { data: T | null };

type ApplicationStatus = Application["status"];

type ApplicationRow = {
  id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  created_at: string;
  jobs: { id: string; title: string } | null;
  profiles: { full_name: string | null; email: string; phone: string | null } | null;
};

export default async function EmployerApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // layout.tsx で認証・ロールチェック済みのため、ここでは会社取得のみ
  const { data: company } = (await supabase
    .from("companies")
    .select("id, name")
    .eq("owner_id", user.id)
    .single()) as QueryResult<{ id: string; name: string }>;

  if (!company) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🏥</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">施設情報が未登録です</h2>
        <p className="text-sm text-gray-500 mb-6">
          応募を受け取るには先に施設情報を登録してください。
        </p>
        <Link
          href="/employer/company"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          施設情報を登録する
        </Link>
      </div>
    );
  }

  // 自社の求人IDを取得
  const { data: jobs } = (await supabase
    .from("jobs")
    .select("id")
    .eq("company_id", company.id)) as QueryResult<{ id: string }[]>;

  const jobIds = jobs?.map((j) => j.id) ?? [];

  // 応募一覧を取得
  const { data: applications } = await (supabase
    .from("applications")
    .select(
      `id, status, cover_letter, created_at,
       jobs ( id, title ),
       profiles ( full_name, email, phone )`
    )
    .in("job_id", jobIds.length > 0 ? jobIds : [""])
    .order("created_at", { ascending: false }) as unknown as Promise<{
    data: ApplicationRow[] | null;
  }>);

  const list = applications ?? [];

  // ステータス別集計
  const counts = {
    total: list.length,
    pending: list.filter((a) => a.status === "pending").length,
    reviewing: list.filter((a) => a.status === "reviewing").length,
    interview: list.filter((a) => a.status === "interview").length,
  };

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">応募管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            求人への応募を確認・管理できます
          </p>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="応募総数" value={counts.total} color="gray" />
        <SummaryCard label="未確認" value={counts.pending} color="gray" />
        <SummaryCard label="選考中" value={counts.reviewing} color="blue" />
        <SummaryCard label="面接調整中" value={counts.interview} color="yellow" />
      </div>

      {/* 応募一覧 */}
      {list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-base font-semibold text-gray-700 mb-1">
            まだ応募がありません
          </h2>
          <p className="text-sm text-gray-400">
            求人を公開すると、応募者からのエントリーがここに表示されます。
          </p>
          <Link
            href="/employer/jobs"
            className="inline-flex items-center gap-1.5 mt-5 text-sm text-primary-600 hover:underline font-medium"
          >
            求人を管理する →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((app) => {
            const statusInfo = APPLICATION_STATUSES[app.status];
            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-200 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  {/* 左：応募者情報 */}
                  <div className="flex-1 min-w-0">
                    {/* 求人名 */}
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={`/employer/jobs/${app.jobs?.id ?? ""}/edit`}
                        className="text-xs text-primary-600 hover:underline font-medium truncate"
                      >
                        📋 {app.jobs?.title ?? "（求人不明）"}
                      </Link>
                    </div>

                    {/* 応募者 */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-semibold text-gray-900 text-sm">
                        {app.profiles?.full_name ?? "（氏名未設定）"}
                      </span>
                      <a
                        href={`mailto:${app.profiles?.email}`}
                        className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        ✉ {app.profiles?.email}
                      </a>
                      {app.profiles?.phone && (
                        <a
                          href={`tel:${app.profiles.phone}`}
                          className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
                        >
                          📞 {app.profiles.phone}
                        </a>
                      )}
                    </div>

                    {/* 応募日 */}
                    <p className="text-xs text-gray-400 mt-1.5">
                      応募日: {formatDate(app.created_at)}
                    </p>

                    {/* 志望動機 */}
                    {app.cover_letter && (
                      <details className="mt-3">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 select-none">
                          志望動機を表示する
                        </summary>
                        <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 leading-relaxed">
                          {app.cover_letter}
                        </p>
                      </details>
                    )}
                    {!app.cover_letter && (
                      <p className="text-xs text-gray-400 mt-2">志望動機: （記入なし）</p>
                    )}
                  </div>

                  {/* 右：ステータス */}
                  <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                    {app.status !== "withdrawn" && (
                      <ApplicationStatusSelect
                        applicationId={app.id}
                        currentStatus={app.status}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "gray" | "blue" | "yellow" | "green";
}) {
  const colorMap = {
    gray: "bg-gray-50 border-gray-200 text-gray-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    green: "bg-green-50 border-green-200 text-green-700",
  };
  return (
    <div
      className={`rounded-xl border p-4 text-center ${colorMap[color]}`}
    >
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-0.5 opacity-75">{label}</p>
    </div>
  );
}
