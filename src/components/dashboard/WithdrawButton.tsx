"use client";

import { useState, useTransition } from "react";
import { withdrawApplication } from "@/app/actions/applications";

interface WithdrawButtonProps {
  applicationId: string;
}

export function WithdrawButton({ applicationId }: WithdrawButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [withdrawn, setWithdrawn] = useState(false);

  function handleClick() {
    if (!confirm("この求人への応募を取り消しますか？")) return;
    setError(null);
    startTransition(async () => {
      const result = await withdrawApplication(applicationId);
      if (result?.error) {
        setError(result.error);
      } else {
        setWithdrawn(true);
      }
    });
  }

  if (withdrawn) {
    return (
      <span className="text-xs text-gray-400">辞退済み</span>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "処理中..." : "応募を取り消す"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
