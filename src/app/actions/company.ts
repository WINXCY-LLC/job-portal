"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/types/models";

type QueryResult<T> = { data: T | null; error: { message: string } | null };

/** 施設情報を登録または更新する */
export async function upsertCompany(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const employeeCountStr = (formData.get("employee_count") as string).trim();
  const establishedYearStr = (formData.get("established_year") as string).trim();

  const fields = {
    owner_id: user.id,
    name: (formData.get("name") as string).trim(),
    description: (formData.get("description") as string).trim() || null,
    logo_url: (formData.get("logo_url") as string).trim() || null,
    website: (formData.get("website") as string).trim() || null,
    prefecture: (formData.get("prefecture") as string) || null,
    city: (formData.get("city") as string).trim() || null,
    address: (formData.get("address") as string).trim() || null,
    phone: (formData.get("phone") as string).trim() || null,
    employee_count: employeeCountStr ? parseInt(employeeCountStr, 10) : null,
    established_year: establishedYearStr ? parseInt(establishedYearStr, 10) : null,
  };

  // 既存の施設情報を確認
  const { data: existing } = (await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", user.id)
    .single()) as QueryResult<{ id: string }>;

  let saveError: { message: string } | null = null;

  if (existing) {
    // 更新
    const { error } = (await (supabase.from("companies") as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .update(fields)
      .eq("id", existing.id)) as QueryResult<Company>;
    saveError = error;
  } else {
    // 新規登録
    const { error } = (await supabase
      .from("companies")
      .insert(fields as any)) as QueryResult<Company>; // eslint-disable-line @typescript-eslint/no-explicit-any
    saveError = error;
  }

  if (saveError) {
    return { error: "施設情報の保存に失敗しました。再度お試しください。" };
  }

  revalidatePath("/employer/company");
  revalidatePath("/employer/jobs");
  redirect("/employer/company?saved=1");
}
