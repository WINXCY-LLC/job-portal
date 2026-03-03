"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const LABEL_MAP: Record<string, string> = {
  keyword: "キーワード",
  occupation: "職種",
  prefecture: "都道府県",
  employment: "雇用形態",
};

export function ActiveFilterTags() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeFilters = Array.from(searchParams.entries()).filter(
    ([key]) => key !== "sort" && key !== "page"
  );

  if (activeFilters.length === 0) return null;

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    startTransition(() => {
      router.push(`/jobs${params.size > 0 ? `?${params.toString()}` : ""}`);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">絞り込み中:</span>
      {activeFilters.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full"
        >
          <span className="text-primary-400">{LABEL_MAP[key] ?? key}:</span>
          {value}
          <button
            onClick={() => removeFilter(key)}
            disabled={isPending}
            className="text-primary-400 hover:text-primary-700 transition-colors ml-0.5"
            aria-label={`${LABEL_MAP[key]}フィルターを削除`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  );
}
