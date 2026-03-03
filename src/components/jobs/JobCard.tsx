import Link from "next/link";
import { formatSalary, formatDate } from "@/lib/utils";
import { SALARY_TYPES } from "@/lib/constants";

export type JobCardData = {
  id: string;
  title: string;
  occupation: string;
  employment_status: string;
  prefecture: string;
  city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_type: keyof typeof SALARY_TYPES;
  published_at: string | null;
  created_at: string;
  companies: {
    name: string;
    logo_url: string | null;
  } | null;
};

interface JobCardProps {
  job: JobCardData;
  /** 強調表示する検索キーワード */
  keyword?: string;
}

export function JobCard({ job }: JobCardProps) {
  const salaryLabel = formatSalary(job.salary_min, job.salary_max);
  const salaryUnit =
    job.salary_min || job.salary_max ? SALARY_TYPES[job.salary_type] : null;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group bg-white rounded-xl border border-gray-200 px-5 py-4 hover:border-primary-300 hover:shadow-md transition-all block"
    >
      {/* タグ行 */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
        <span className="inline-flex items-center bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {job.occupation}
        </span>
        <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full">
          {job.employment_status}
        </span>
      </div>

      {/* タイトル */}
      <h2 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
        {job.title}
      </h2>

      {/* 施設名 */}
      <p className="text-sm text-gray-500 mt-1">
        {job.companies?.name ?? "施設名未設定"}
      </p>

      {/* 勤務地・給与 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-sm">
        <span className="flex items-center gap-1 text-gray-600">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.prefecture}{job.city ? `・${job.city}` : ""}
        </span>
        <span className="flex items-center gap-1 font-medium text-primary-700">
          <svg className="w-3.5 h-3.5 text-primary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {salaryLabel}
          {salaryUnit && (
            <span className="text-xs text-gray-400 font-normal">（{salaryUnit}）</span>
          )}
        </span>
      </div>

      {/* 掲載日 */}
      <p className="text-xs text-gray-400 mt-2.5">
        掲載日: {formatDate(job.published_at ?? job.created_at)}
      </p>
    </Link>
  );
}
