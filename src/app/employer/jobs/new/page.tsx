import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createJob } from "@/app/actions/jobs";
import { JobForm } from "@/components/employer/JobForm";
import type { Metadata } from "next";
import type { CompanySummary } from "@/types/models";

export const metadata: Metadata = { title: "新規求人作成" };

type QueryResult<T> = { data: T | null };

export default async function NewJobPage() {
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

  // 施設情報が未登録なら登録ページへ
  if (!company) redirect("/employer/company");

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
          <h1 className="text-xl font-bold text-gray-900">新規求人を作成</h1>
          <p className="text-sm text-gray-500">{company.name}</p>
        </div>
      </div>

      <JobForm action={createJob} />
    </div>
  );
}
