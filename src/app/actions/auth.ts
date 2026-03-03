"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "メールアドレスを入力してください" };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) return { error: "メール送信に失敗しました。再度お試しください" };
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  if (!password || password.length < 8) {
    return { error: "パスワードは8文字以上で入力してください" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: "パスワードの更新に失敗しました" };
  redirect("/dashboard");
}
