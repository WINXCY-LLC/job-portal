"use client";

import { useTransition } from "react";
import { toggleJobPublish } from "@/app/actions/jobs";

export function PublishToggle({
  jobId,
  isPublished,
}: {
  jobId: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleJobPublish(jobId, isPublished);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all disabled:opacity-50 ${
        isPublished
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      title={isPublished ? "クリックで非公開にする" : "クリックで公開する"}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPending ? "bg-yellow-400 animate-pulse" : isPublished ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {isPending ? "更新中..." : isPublished ? "公開中" : "下書き"}
    </button>
  );
}
