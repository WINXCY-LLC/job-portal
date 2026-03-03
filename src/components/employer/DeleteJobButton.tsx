"use client";

import { useState, useTransition } from "react";
import { deleteJob } from "@/app/actions/jobs";

export function DeleteJobButton({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteJob(jobId);
      if (result?.error) {
        setError(result.error);
        setShowConfirm(false);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
      >
        削除
      </button>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

      {/* 確認ダイアログ */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-2xl text-center">🗑️</div>
            <h3 className="text-lg font-bold text-gray-900 text-center">求人を削除しますか？</h3>
            <p className="text-sm text-gray-600 text-center">
              「<strong>{jobTitle}</strong>」を削除します。
              <br />この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
