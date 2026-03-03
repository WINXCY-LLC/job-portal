import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateJob } from "@/app/actions/jobs";
import { JobForm } from "@/components/employer/JobForm";
import type { Metadata } from "next";
import type { Job, CompanySummary } from "@/types/models";

export const metadata: Metadata = { title: "求人を編集" };

type QueryResult<T> = { data: T | null };

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // 自社の会社情報を取得
  const { data: company } = (await supabase
    .from("companies")
    .select("id, name")
    .eq("owner_id", user.id)
    .single()) as QueryResult<CompanySummary>;

  if (!company) redirect("/employer/company");

  // 自社の求人であることを確認
  const { data: job } = (await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("company_id", company.id)
    .single()) as QueryResult<Job>;

  if (!job) notFound();

  // updateJob を id でバインドしたアクション
  async function updateJobAction(formData: FormData) {
    "use server";
    return updateJob(id, formData);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center gap-3">
        <Link
          href="/employer/jobs"
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="戻る"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">求人を編集</h1>
          <p className="text-sm text-gray-500 truncate max-w-xs">{job.title}</p>
        </div>
      </div>

      {/* 公開中バナー */}
      {job.is_published && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-green-700">
          <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
          この求人は現在公開中です。変更を保存すると即時反映されます。
        </div>
      )}

      <JobForm defaultValues={job} action={updateJobAction} />
    </div>
  );
}
