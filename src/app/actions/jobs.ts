"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { JobType, EmploymentStatus, SalaryType } from "@/lib/constants";
import type { CompanySummary, Job } from "@/types/models";

// Supabase の型推論が機能しない場合のユーティリティ型
type QueryResult<T> = { data: T | null; error: { message: string } | null };

/** ログイン中の事業者と、その会社を取得する共通ヘルパー */
async function getEmployerContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const result = (await supabase
    .from("companies")
    .select("id, name")
    .eq("owner_id", user.id)
    .single()) as QueryResult<CompanySummary>;

  return { supabase, user, company: result.data };
}

function parseJobFormData(formData: FormData) {
  const salaryMin = formData.get("salary_min") as string;
  const salaryMax = formData.get("salary_max") as string;
  const expiresAt = formData.get("expires_at") as string;
  const isPublished = formData.get("action") === "publish";

  return {
    title: formData.get("title") as string,
    occupation: formData.get("occupation") as string,
    employment_status: formData.get("employment_status") as EmploymentStatus,
    job_type: formData.get("job_type") as JobType,
    prefecture: formData.get("prefecture") as string,
    city: (formData.get("city") as string) || null,
    address: (formData.get("address") as string) || null,
    salary_type: formData.get("salary_type") as SalaryType,
    salary_min: salaryMin ? parseInt(salaryMin, 10) : null,
    salary_max: salaryMax ? parseInt(salaryMax, 10) : null,
    description: formData.get("description") as string,
    requirements: (formData.get("requirements") as string) || null,
    working_hours: (formData.get("working_hours") as string) || null,
    holidays: (formData.get("holidays") as string) || null,
    benefits: (formData.get("benefits") as string) || null,
    expires_at: expiresAt || null,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  };
}

/** 求人新規作成 */
export async function createJob(formData: FormData) {
  const { supabase, company } = await getEmployerContext();

  if (!company) {
    return { error: "施設情報が登録されていません。先に施設情報を登録してください。" };
  }

  const fields = parseJobFormData(formData);
  const payload = { company_id: company.id, ...fields };

  const { error } = (await supabase
    .from("jobs")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(payload as any)) as QueryResult<Job>;

  if (error) return { error: "求人の作成に失敗しました。再度お試しください。" };

  revalidatePath("/employer/jobs");
  redirect("/employer/jobs");
}

/** 求人更新 */
export async function updateJob(jobId: string, formData: FormData) {
  const { supabase, company } = await getEmployerContext();

  if (!company) return { error: "施設情報が見つかりません。" };

  // 自社の求人かチェック
  const { data: existingJob } = (await supabase
    .from("jobs")
    .select("id")
    .eq("id", jobId)
    .eq("company_id", company.id)
    .single()) as QueryResult<Pick<Job, "id">>;

  if (!existingJob) return { error: "求人が見つかりません。" };

  const fields = parseJobFormData(formData);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = (await (supabase.from("jobs") as any).update(fields).eq("id", jobId)) as QueryResult<Job>;

  if (error) return { error: "求人の更新に失敗しました。再度お試しください。" };

  revalidatePath("/employer/jobs");
  redirect("/employer/jobs");
}

/** 公開・非公開切替 */
export async function toggleJobPublish(jobId: string, currentPublished: boolean) {
  const { supabase, company } = await getEmployerContext();

  if (!company) return { error: "施設情報が見つかりません。" };

  const newPublished = !currentPublished;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = (await (supabase.from("jobs") as any)
    .update({ is_published: newPublished, published_at: newPublished ? new Date().toISOString() : null })
    .eq("id", jobId)
    .eq("company_id", company.id)) as QueryResult<Job>;

  if (error) return { error: "更新に失敗しました。" };

  revalidatePath("/employer/jobs");
  return { success: true };
}

/** 求人削除 */
export async function deleteJob(jobId: string) {
  const { supabase, company } = await getEmployerContext();

  if (!company) return { error: "施設情報が見つかりません。" };

  const { error } = (await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("company_id", company.id)) as QueryResult<null>;

  if (error) return { error: "削除に失敗しました。再度お試しください。" };

  revalidatePath("/employer/jobs");
  return { success: true };
}
