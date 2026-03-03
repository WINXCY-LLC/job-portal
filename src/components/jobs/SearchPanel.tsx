"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { OCCUPATIONS, PREFECTURES, EMPLOYMENT_STATUSES } from "@/lib/constants";

export function SearchPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const current = {
    keyword: searchParams.get("keyword") ?? "",
    occupation: searchParams.get("occupation") ?? "",
    prefecture: searchParams.get("prefecture") ?? "",
    employment: searchParams.get("employment") ?? "",
    sort: searchParams.get("sort") ?? "newest",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData(formRef.current!);
    const params = new URLSearchParams();
    const keyword = (data.get("keyword") as string).trim();
    const occupation = data.get("occupation") as string;
    const prefecture = data.get("prefecture") as string;
    const employment = data.get("employment") as string;
    const sort = data.get("sort") as string;

    if (keyword) params.set("keyword", keyword);
    if (occupation) params.set("occupation", occupation);
    if (prefecture) params.set("prefecture", prefecture);
    if (employment) params.set("employment", employment);
    if (sort && sort !== "newest") params.set("sort", sort);

    startTransition(() => {
      router.push(`/jobs${params.size > 0 ? `?${params.toString()}` : ""}`);
    });
  }

  function handleReset() {
    startTransition(() => {
      router.push("/jobs");
    });
  }

  const hasFilters = current.keyword || current.occupation || current.prefecture || current.employment;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4"
    >
      {/* キーワード */}
      <div>
        <label htmlFor="keyword" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          キーワード
        </label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="keyword"
            name="keyword"
            type="text"
            defaultValue={current.keyword}
            placeholder="施設名・仕事内容など"
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* 職種 */}
      <div>
        <label htmlFor="occupation" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          職種
        </label>
        <select
          id="occupation"
          name="occupation"
          defaultValue={current.occupation}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
        >
          <option value="">すべての職種</option>
          {OCCUPATIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* 都道府県 */}
      <div>
        <label htmlFor="prefecture" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          都道府県
        </label>
        <select
          id="prefecture"
          name="prefecture"
          defaultValue={current.prefecture}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
        >
          <option value="">すべての地域</option>
          {PREFECTURES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* 雇用形態 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          雇用形態
        </p>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="employment"
              value=""
              defaultChecked={!current.employment}
              className="accent-primary-600"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">すべて</span>
          </label>
          {EMPLOYMENT_STATUSES.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="employment"
                value={s}
                defaultChecked={current.employment === s}
                className="accent-primary-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 並び順 */}
      <div>
        <label htmlFor="sort" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          並び順
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={current.sort}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
        >
          <option value="newest">新着順</option>
          <option value="salary_desc">給与が高い順</option>
        </select>
      </div>

      {/* ボタン */}
      <div className="space-y-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm disabled:opacity-60"
        >
          {isPending ? "検索中..." : "この条件で検索"}
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors"
          >
            条件をクリア
          </button>
        )}
      </div>
    </form>
  );
}
