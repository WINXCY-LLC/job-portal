import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(`/auth/login?redirectTo=/jobs/${jobId}`, _request.url));
  }

  // 既存のお気に入りを確認
  const { data: existing } = (await supabase
    .from("saved_jobs")
    .select("id")
    .eq("job_id", jobId)
    .eq("user_id", user.id)
    .single()) as { data: { id: string } | null };

  if (existing) {
    // 既に保存済みなら削除（トグル）
    await supabase
      .from("saved_jobs")
      .delete()
      .eq("id", existing.id);
  } else {
    // 新規保存
    await supabase.from("saved_jobs").insert({
      job_id: jobId,
      user_id: user.id,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  // 求人詳細ページにリダイレクト
  return NextResponse.redirect(new URL(`/jobs/${jobId}`, _request.url));
}
