import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { EmployerNav } from "@/components/employer/EmployerNav";
import type { Profile, CompanySummary } from "@/types/models";

type QueryResult<T> = { data: T | null };

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // employer ロールチェック
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()) as QueryResult<Pick<Profile, "role" | "full_name">>;

  if (!profile || profile.role !== "employer") {
    redirect("/dashboard");
  }

  // 施設情報を取得
  const { data: company } = (await supabase
    .from("companies")
    .select("id, name")
    .eq("owner_id", user.id)
    .single()) as QueryResult<CompanySummary>;

  // 現在のパスを取得
  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployerNav
        companyName={company?.name ?? null}
        currentPath={currentPath}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!company && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm">施設情報が未登録です</p>
              <p className="text-amber-700 text-xs mt-0.5">
                求人を掲載するには先に施設情報を登録してください。
                <a href="/employer/company" className="underline font-medium ml-1">
                  施設情報を登録する →
                </a>
              </p>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
