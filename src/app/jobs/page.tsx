import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SearchPanel } from "@/components/jobs/SearchPanel";
import { MobileSearchDrawer } from "@/components/jobs/MobileSearchDrawer";
import { ActiveFilterTags } from "@/components/jobs/ActiveFilterTags";
import { JobCard, type JobCardData } from "@/components/jobs/JobCard";

export const metadata: Metadata = {
  title: "求人検索",
  description: "医療・介護の求人をキーワード・職種・都道府県・雇用形態で絞り込んで検索できます。",
};

const PER_PAGE = 20;

type SearchParams = {
  keyword?: string;
  occupation?: string;
  /** トップページからの互換 */
  category?: string;
  prefecture?: string;
  employment?: string;
  sort?: string;
  page?: string;
};

type QueryResult<T> = { data: T | null; count: number | null };

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  // category は occupation の別名（トップページからの互換）
  const occupation = params.occupation ?? params.category ?? "";
  const keyword = params.keyword ?? "";
  const prefecture = params.prefecture ?? "";
  const employment = params.employment ?? "";
  const sort = params.sort ?? "newest";

  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select(
      `id, title, occupation, employment_status, prefecture, city,
       salary_min, salary_max, salary_type, published_at, created_at,
       companies ( name, logo_url )`,
      { count: "exact" }
    )
    .eq("is_published", true);

  if (keyword) {
    query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
  }
  if (occupation) {
    query = query.eq("occupation", occupation);
  }
  if (prefecture) {
    query = query.eq("prefecture", prefecture);
  }
  if (employment) {
    query = query.eq("employment_status", employment);
  }

  if (sort === "salary_desc") {
    query = query.order("salary_max", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("published_at", { ascending: false, nullsFirst: false });
  }

  query = query.range(from, to);

  const { data: jobs, count } = (await query) as QueryResult<JobCardData[]>;

  const totalPages = count ? Math.ceil(count / PER_PAGE) : 0;

  // 現在の絞り込み条件を URL パラメータ文字列に変換（ページネーション用）
  function buildPageUrl(p: number) {
    const sp = new URLSearchParams();
    if (keyword) sp.set("keyword", keyword);
    if (occupation) sp.set("occupation", occupation);
    if (prefecture) sp.set("prefecture", prefecture);
    if (employment) sp.set("employment", employment);
    if (sort && sort !== "newest") sp.set("sort", sort);
    if (p > 1) sp.set("page", String(p));
    return `/jobs${sp.size > 0 ? `?${sp.toString()}` : ""}`;
  }

  const hasFilters = keyword || occupation || prefecture || employment;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">
          {/* ── サイドバー（PC：常時表示） ── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
                絞り込み検索
              </h2>
              <Suspense fallback={<SearchPanelSkeleton />}>
                <SearchPanel />
              </Suspense>
            </div>
          </aside>

          {/* ── メインコンテンツ ── */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* 結果ヘッダー */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {hasFilters ? "検索結果" : "求人一覧"}
                </h1>
                {count !== null && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {count.toLocaleString()}件の求人が見つかりました
                    {totalPages > 1 && `（${page} / ${totalPages}ページ）`}
                  </p>
                )}
              </div>

              {/* モバイル：絞り込みボタン */}
              <div className="lg:hidden">
                <Suspense>
                  <MobileSearchDrawer />
                </Suspense>
              </div>
            </div>

            {/* アクティブフィルタータグ */}
            <Suspense>
              <ActiveFilterTags />
            </Suspense>

            {/* 求人リスト */}
            {jobs && jobs.length > 0 ? (
              <>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} keyword={keyword} />
                  ))}
                </div>

                {/* ページネーション */}
                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-1 pt-4">
                    {page > 1 && (
                      <Link
                        href={buildPageUrl(page - 1)}
                        className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-white hover:text-primary-600 border border-transparent hover:border-gray-200 transition-all"
                      >
                        ← 前へ
                      </Link>
                    )}

                    {buildPageRange(page, totalPages).map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400 text-sm">
                          ...
                        </span>
                      ) : (
                        <Link
                          key={p}
                          href={buildPageUrl(p as number)}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                            p === page
                              ? "bg-primary-600 text-white"
                              : "text-gray-600 hover:bg-white hover:text-primary-600 border border-transparent hover:border-gray-200"
                          }`}
                        >
                          {p}
                        </Link>
                      )
                    )}

                    {page < totalPages && (
                      <Link
                        href={buildPageUrl(page + 1)}
                        className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-white hover:text-primary-600 border border-transparent hover:border-gray-200 transition-all"
                      >
                        次へ →
                      </Link>
                    )}
                  </nav>
                )}
              </>
            ) : (
              /* 結果なし */
              <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  条件に一致する求人が見つかりませんでした
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  検索条件を変えてお試しください
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  条件をリセットして全件表示
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-400">
          <p className="font-semibold text-gray-600 mb-1">沖縄メディケアワーク</p>
          <p>© 2026 沖縄メディケアワーク. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/** ページ番号レンジを生成（省略あり） */
function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

function SearchPanelSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-10 bg-gray-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
