"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Application } from "@/types/models";

type QueryResult<T> = { data: T | null; error: { message: string } | null };

type ApplicationStatus = Application["status"];

/** 求人に応募する */
export async function createApplication(jobId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?redirectTo=/jobs/${jobId}/apply`);

  // 重複応募チェック
  const { data: existing } = (await supabase
    .from("applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("applicant_id", user.id)
    .single()) as QueryResult<{ id: string }>;

  if (existing) {
    return { error: "この求人にはすでに応募済みです。" };
  }

  const coverLetter = (formData.get("cover_letter") as string).trim();

  const { error } = (await supabase.from("applications").insert({
    job_id: jobId,
    applicant_id: user.id,
    cover_letter: coverLetter || null,
    status: "pending",
  } as any)) as QueryResult<Application>; // eslint-disable-line @typescript-eslint/no-explicit-any

  if (error) {
    return { error: "応募の送信に失敗しました。再度お試しください。" };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard/applications");
  redirect(`/jobs/${jobId}/apply?success=1`);
}

/** 応募を取り消す（求職者） */
export async function withdrawApplication(applicationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { error } = (await (supabase.from("applications") as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .update({ status: "withdrawn" })
    .eq("id", applicationId)
    .eq("applicant_id", user.id)) as QueryResult<Application>;

  if (error) return { error: "取り消しに失敗しました。" };

  revalidatePath("/dashboard/applications");
  return { success: true };
}

/** 応募ステータスを更新する（事業者） */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // 自社の求人への応募かを確認
  const { data: application } = (await supabase
    .from("applications")
    .select("id, job_id")
    .eq("id", applicationId)
    .single()) as QueryResult<{ id: string; job_id: string }>;

  if (!application) return { error: "応募が見つかりません。" };

  const { data: company } = (await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", user.id)
    .single()) as QueryResult<{ id: string }>;

  if (!company) return { error: "施設情報が見つかりません。" };

  const { data: job } = (await supabase
    .from("jobs")
    .select("id")
    .eq("id", application.job_id)
    .eq("company_id", company.id)
    .single()) as QueryResult<{ id: string }>;

  if (!job) return { error: "この応募を更新する権限がありません。" };

  const { error } = (await (supabase.from("applications") as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .update({ status })
    .eq("id", applicationId)) as QueryResult<Application>;

  if (error) return { error: "ステータスの更新に失敗しました。" };

  revalidatePath("/employer/applications");
  revalidatePath(`/employer/applications/${applicationId}`);
  return { success: true };
}
