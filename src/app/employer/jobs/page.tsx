import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatSalary } from "@/lib/utils";
import { SALARY_TYPES } from "@/lib/constants";
import { PublishToggle } from "@/components/employer/PublishToggle";
import { DeleteJobButton } from "@/components/employer/DeleteJobButton";
import type { Metadata } from "next";
import type { Job, CompanySummary } from "@/types/models";

export const metadata: Metadata = { title: "求人管理" };

type QueryResult<T> = { data: T | null };

export default async function EmployerJobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: company } = (await supabase
    .from("companies")
    .select("id, name")
    .eq("owner_id", user.id)
    .single()) as QueryResult<CompanySummary>;

  const { data: jobs } = company
    ? ((await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false })) as QueryResult<Job[]>)
    : { data: [] as Job[] };

  const publishedCount = jobs?.filter((j) => j.is_published).length ?? 0;
  const draftCount = jobs?.filter((j) => !j.is_published).length ?? 0;

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">求人管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            公開中 {publishedCount}件 ／ 下書き {draftCount}件
          </p>
        </div>
        {company && (
          <Link
            href="/employer/jobs/new"
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <span>＋</span> 新規求人を作成
          </Link>
        )}
      </div>

      {/* 求人がない場合 */}
      {!jobs || jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">まだ求人がありません</h2>
          <p className="text-sm text-gray-500 mb-6">
            求人を作成して、求職者に施設の魅力を伝えましょう
          </p>
          {company ? (
            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              最初の求人を作成する
            </Link>
          ) : (
            <Link
              href="/employer/company"
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
            >
              先に施設情報を登録する
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* 左：求人情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <PublishToggle jobId={job.id} isPublished={job.is_published} />
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {job.occupation}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {job.employment_status}
                  </span>
                </div>
                <h2 className="font-semibold text-gray-900 text-sm leading-snug">{job.title}</h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-gray-400">
                  <span>📍 {job.prefecture}{job.city ? `・${job.city}` : ""}</span>
                  <span>
                    💰{" "}
                    {formatSalary(job.salary_min, job.salary_max)}
                    {(job.salary_min || job.salary_max)
                      ? `（${SALARY_TYPES[job.salary_type]}）`
                      : ""}
                  </span>
                  <span>作成: {formatDate(job.created_at)}</span>
                  {job.expires_at && (
                    <span className="text-amber-500">
                      終了: {formatDate(job.expires_at)}
                    </span>
                  )}
                </div>
              </div>

              {/* 右：アクションボタン */}
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/jobs/${job.id}`}
                  target="_blank"
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  プレビュー
                </Link>
                <Link
                  href={`/employer/jobs/${job.id}/edit`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  編集
                </Link>
                <DeleteJobButton jobId={job.id} jobTitle={job.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
