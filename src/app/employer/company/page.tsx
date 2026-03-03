import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CompanyForm } from "@/components/employer/CompanyForm";
import type { Company } from "@/types/models";

export const metadata: Metadata = { title: "施設情報" };

type QueryResult<T> = { data: T | null };

export default async function CompanyPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: company } = (await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .single()) as QueryResult<Company>;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">施設情報</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {company ? "施設情報を編集できます" : "求人を掲載するには先に施設情報を登録してください"}
        </p>
      </div>

      {/* 保存完了メッセージ */}
      {saved === "1" && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <span>✓</span>
          施設情報を保存しました
        </div>
      )}

      <CompanyForm company={company} />
    </div>
  );
}
