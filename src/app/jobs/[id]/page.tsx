import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JobCard, type JobCardData } from "@/components/jobs/JobCard";
import { formatDate, formatSalary } from "@/lib/utils";
import { SALARY_TYPES, JOB_TYPES } from "@/lib/constants";
import type { Job, Company } from "@/types/models";

type JobDetail = Job & {
  companies: Pick<Company, "id" | "name" | "description" | "logo_url" | "website" | "prefecture" | "city" | "address" | "phone" | "employee_count" | "established_year"> | null;
};

type QueryResult<T> = { data: T | null };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job } = (await supabase
    .from("jobs")
    .select("title, occupation, prefecture")
    .eq("id", id)
    .single()) as QueryResult<Pick<Job, "title" | "occupation" | "prefecture">>;

  if (!job) return { title: "求人が見つかりません" };
  return {
    title: job.title,
    description: `${job.occupation}・${job.prefecture}の求人情報です。`,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 求人詳細を取得
  const { data: job } = (await supabase
    .from("jobs")
    .select(`
      *,
      companies (
        id, name, description, logo_url, website,
        prefecture, city, address, phone,
        employee_count, established_year
      )
    `)
    .eq("id", id)
    .eq("is_published", true)
    .single()) as QueryResult<JobDetail>;

  if (!job) notFound();

  // ログインユーザー取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // お気に入り状態
  let isSaved = false;
  if (user) {
    const { data: saved } = (await supabase
      .from("saved_jobs")
      .select("id")
      .eq("job_id", id)
      .eq("user_id", user.id)
      .single()) as QueryResult<{ id: string }>;
    isSaved = !!saved;
  }

  // 関連求人（同職種・同都道府県、最大4件）
  const { data: relatedJobs } = (await supabase
    .from("jobs")
    .select(`id, title, occupation, employment_status, prefecture, city,
             salary_min, salary_max, salary_type, published_at, created_at,
             companies ( name, logo_url )`)
    .eq("is_published", true)
    .eq("occupation", job.occupation)
    .neq("id", id)
    .limit(4)) as QueryResult<JobCardData[]>;

  const salaryText = formatSalary(job.salary_min, job.salary_max);
  const salaryUnit =
    job.salary_min || job.salary_max
      ? `（${SALARY_TYPES[job.salary_type]}）`
      : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600 transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-primary-600 transition-colors">求人一覧</Link>
          <span>/</span>
          <Link href={`/jobs?occupation=${job.occupation}`} className="hover:text-primary-600 transition-colors">
            {job.occupation}
          </Link>
          <span>/</span>
          <span className="text-gray-600 line-clamp-1">{job.title}</span>
        </nav>

        <div className="flex gap-6 items-start">
          {/* ── メインカラム ── */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* 求人ヘッダーカード */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {job.occupation}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {job.employment_status}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {JOB_TYPES[job.job_type]}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {job.title}
              </h1>

              <p className="text-gray-500 mt-2 text-sm">
                {job.companies?.name}
              </p>

              {/* 基本情報グリッド */}
              <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 border-t border-gray-100 pt-5">
                <InfoRow
                  icon="📍"
                  label="勤務地"
                  value={`${job.prefecture}${job.city ? `・${job.city}` : ""}${job.address ? ` ${job.address}` : ""}`}
                />
                <InfoRow
                  icon="💰"
                  label="給与"
                  value={`${salaryText}${salaryUnit}`}
                  highlight
                />
                {job.working_hours && (
                  <InfoRow icon="🕐" label="勤務時間" value={job.working_hours} />
                )}
                {job.holidays && (
                  <InfoRow icon="📅" label="休日・休暇" value={job.holidays} />
                )}
                {job.expires_at && (
                  <InfoRow
                    icon="⏰"
                    label="掲載終了日"
                    value={formatDate(job.expires_at)}
                  />
                )}
                <InfoRow
                  icon="📢"
                  label="掲載日"
                  value={formatDate(job.published_at ?? job.created_at)}
                />
              </dl>
            </div>

            {/* 仕事内容 */}
            <DetailSection title="仕事内容">
              <Prose text={job.description} />
            </DetailSection>

            {/* 応募資格 */}
            {job.requirements && (
              <DetailSection title="応募資格・必要なスキル">
                <Prose text={job.requirements} />
              </DetailSection>
            )}

            {/* 待遇・福利厚生 */}
            {job.benefits && (
              <DetailSection title="待遇・福利厚生">
                <Prose text={job.benefits} />
              </DetailSection>
            )}

            {/* 施設情報 */}
            {job.companies && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">施設情報</h2>
                <div className="flex items-start gap-4">
                  {job.companies.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={job.companies.logo_url}
                      alt={job.companies.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xl shrink-0">
                      {job.companies.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{job.companies.name}</h3>
                    {job.companies.prefecture && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        📍 {job.companies.prefecture}
                        {job.companies.city ? `・${job.companies.city}` : ""}
                      </p>
                    )}
                    {job.companies.description && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-4">
                        {job.companies.description}
                      </p>
                    )}
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {job.companies.employee_count && (
                        <div className="text-gray-500">
                          <span className="font-medium">従業員数</span>: {job.companies.employee_count}人
                        </div>
                      )}
                      {job.companies.established_year && (
                        <div className="text-gray-500">
                          <span className="font-medium">設立</span>: {job.companies.established_year}年
                        </div>
                      )}
                      {job.companies.website && (
                        <div className="text-gray-500 col-span-2">
                          <span className="font-medium">公式サイト</span>:{" "}
                          <a
                            href={job.companies.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:underline"
                          >
                            {job.companies.website}
                          </a>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {/* 関連求人 */}
            {relatedJobs && relatedJobs.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  {job.occupation}の他の求人
                </h2>
                <div className="space-y-3">
                  {relatedJobs.map((related) => (
                    <JobCard key={related.id} job={related} />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href={`/jobs?occupation=${encodeURIComponent(job.occupation)}`}
                    className="text-sm text-primary-600 hover:underline font-medium"
                  >
                    {job.occupation}の求人をもっと見る →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── サイドバー（PC）── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 space-y-4">
              <ApplyCard jobId={id} user={user} isSaved={isSaved} jobTitle={job.title} />
            </div>
          </aside>
        </div>
      </div>

      {/* モバイル：固定応募ボタン */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-30">
        <ApplyButton jobId={id} user={user} />
      </div>
      <div className="lg:hidden h-20" />

      {/* フッター */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-400">
          <p className="font-semibold text-gray-600 mb-1">医療・介護求人ポータル</p>
          <p>© 2026 医療・介護求人ポータル. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ── サブコンポーネント ── */

function InfoRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-base shrink-0 mt-0.5">{icon}</span>
      <div>
        <dt className="text-xs text-gray-400 font-medium">{label}</dt>
        <dd className={`text-sm mt-0.5 ${highlight ? "font-semibold text-primary-700 text-base" : "text-gray-800"}`}>
          {value}
        </dd>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-base font-bold text-gray-900 border-l-4 border-primary-500 pl-3 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Prose({ text }: { text: string }) {
  return (
    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
      {text}
    </div>
  );
}

function ApplyCard({
  jobId,
  user,
  isSaved,
  jobTitle,
}: {
  jobId: string;
  user: { id: string } | null;
  isSaved: boolean;
  jobTitle: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
      <h3 className="font-bold text-gray-900 text-sm">この求人に応募する</h3>
      <ApplyButton jobId={jobId} user={user} />
      {user ? (
        <form action={`/api/jobs/${jobId}/save`} method="POST">
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 border py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isSaved
                ? "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>{isSaved ? "⭐" : "☆"}</span>
            {isSaved ? "お気に入り登録済み" : "お気に入りに追加"}
          </button>
        </form>
      ) : (
        <Link
          href={`/auth/register`}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          ☆ 会員登録してお気に入りに追加
        </Link>
      )}
      <p className="text-xs text-gray-400 text-center pt-1">
        無料で登録・応募できます
      </p>
    </div>
  );
}

function ApplyButton({
  jobId,
  user,
}: {
  jobId: string;
  user: { id: string } | null;
}) {
  if (user) {
    return (
      <Link
        href={`/jobs/${jobId}/apply`}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors text-sm"
      >
        この求人に応募する
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }
  return (
    <Link
      href={`/auth/login?redirectTo=/jobs/${jobId}/apply`}
      className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors text-sm"
    >
      ログインして応募する
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
