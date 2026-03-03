import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { createApplication } from "@/app/actions/applications";
import { formatSalary } from "@/lib/utils";
import { SALARY_TYPES } from "@/lib/constants";
import type { Job, Profile } from "@/types/models";

type QueryResult<T> = { data: T | null };

type JobSummary = Pick<
  Job,
  "id" | "title" | "occupation" | "employment_status" | "prefecture" | "city" | "salary_min" | "salary_max" | "salary_type"
> & {
  companies: { name: string } | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job } = (await supabase
    .from("jobs")
    .select("title")
    .eq("id", id)
    .single()) as QueryResult<Pick<Job, "title">>;
  return { title: job ? `${job.title}に応募する` : "応募フォーム" };
}

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?redirectTo=/jobs/${id}/apply`);

  // 求人情報を取得
  const { data: job } = (await supabase
    .from("jobs")
    .select("id, title, occupation, employment_status, prefecture, city, salary_min, salary_max, salary_type, companies ( name )")
    .eq("id", id)
    .eq("is_published", true)
    .single()) as QueryResult<JobSummary>;

  if (!job) notFound();

  // プロフィールを取得
  const { data: profile } = (await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", user.id)
    .single()) as QueryResult<Pick<Profile, "full_name" | "email" | "phone">>;

  // 応募済みチェック
  const { data: existingApplication } = (await supabase
    .from("applications")
    .select("id, status, created_at")
    .eq("job_id", id)
    .eq("applicant_id", user.id)
    .single()) as QueryResult<{ id: string; status: string; created_at: string }>;

  const salaryText = formatSalary(job.salary_min, job.salary_max);
  const salaryUnit =
    job.salary_min || job.salary_max
      ? `（${SALARY_TYPES[job.salary_type]}）`
      : "";

  async function applyAction(formData: FormData) {
    "use server";
    await createApplication(id, formData);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-600 transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-primary-600 transition-colors">求人一覧</Link>
          <span>/</span>
          <Link href={`/jobs/${id}`} className="hover:text-primary-600 transition-colors line-clamp-1">
            {job.title}
          </Link>
          <span>/</span>
          <span className="text-gray-600">応募フォーム</span>
        </nav>

        {/* 応募先求人カード */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <p className="text-xs text-gray-500 mb-1">{job.companies?.name}</p>
          <h1 className="font-bold text-gray-900 text-base leading-snug">{job.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {job.occupation}
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full">
              {job.employment_status}
            </span>
            <span className="text-xs text-gray-500">
              📍 {job.prefecture}{job.city ? `・${job.city}` : ""}
            </span>
            {(job.salary_min || job.salary_max) && (
              <span className="text-xs text-gray-500">
                💰 {salaryText}{salaryUnit}
              </span>
            )}
          </div>
        </div>

        {/* 応募完了状態 */}
        {success === "1" ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">応募を受け付けました</h2>
            <p className="text-sm text-gray-500 mb-6">
              {job.companies?.name}からの連絡をお待ちください。<br />
              応募状況は「応募履歴」から確認できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/applications"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                応募履歴を確認する
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                求人一覧に戻る
              </Link>
            </div>
          </div>
        ) : existingApplication ? (
          /* 応募済み */
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">この求人には応募済みです</h2>
            <p className="text-sm text-gray-500 mb-6">
              応募状況は「応募履歴」から確認できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/applications"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                応募履歴を確認する
              </Link>
              <Link
                href={`/jobs/${id}`}
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                求人詳細に戻る
              </Link>
            </div>
          </div>
        ) : (
          /* 応募フォーム */
          <div className="space-y-5">
            {/* 応募者情報（確認） */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-900 border-l-4 border-primary-500 pl-3 mb-4">
                応募者情報
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex gap-4">
                  <dt className="w-24 shrink-0 text-xs text-gray-400 font-medium pt-0.5">お名前</dt>
                  <dd className="text-gray-800">{profile?.full_name ?? "（未設定）"}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-24 shrink-0 text-xs text-gray-400 font-medium pt-0.5">メール</dt>
                  <dd className="text-gray-800">{user.email}</dd>
                </div>
                {profile?.phone && (
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-xs text-gray-400 font-medium pt-0.5">電話番号</dt>
                    <dd className="text-gray-800">{profile.phone}</dd>
                  </div>
                )}
              </dl>
              <p className="text-xs text-gray-400 mt-3">
                ※ 情報を変更する場合は
                <Link href="/dashboard/profile" className="text-primary-600 hover:underline ml-1">
                  プロフィール設定
                </Link>
                から更新してください
              </p>
            </div>

            {/* 志望動機・メッセージ */}
            <form action={applyAction}>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-bold text-gray-900 border-l-4 border-primary-500 pl-3 mb-4">
                  志望動機・メッセージ
                  <span className="text-gray-400 font-normal text-xs ml-2">（任意）</span>
                </h2>
                <textarea
                  name="cover_letter"
                  rows={8}
                  placeholder={`この施設を志望した理由や、自己PRを記入してください。\n\n例：\n・貴施設のリハビリに特化した環境に魅力を感じました。\n・○年の介護経験を活かして貢献したいと考えています。`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                />
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-xs text-gray-500 text-center">
                  応募すると、あなたのプロフィール情報が施設に共有されます
                </p>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-colors text-sm"
                >
                  この求人に応募する
                </button>
                <Link
                  href={`/jobs/${id}`}
                  className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                >
                  求人詳細に戻る
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-400">
          <p className="font-semibold text-gray-600 mb-1">沖縄メディケアワーク</p>
          <p>© 2026 沖縄メディケアワーク. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
