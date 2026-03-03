"use client";

import { useState, useTransition } from "react";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { updateApplicationStatus } from "@/app/actions/applications";
import type { Application } from "@/types/models";

type Status = Application["status"];

interface ApplicationStatusSelectProps {
  applicationId: string;
  currentStatus: Status;
}

export function ApplicationStatusSelect({
  applicationId,
  currentStatus,
}: ApplicationStatusSelectProps) {
  const [status, setStatus] = useState<Status>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    setError(null);
    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, newStatus);
      if (result?.error) {
        setError(result.error);
      } else {
        setStatus(newStatus);
      }
    });
  }

  const statusInfo = APPLICATION_STATUSES[status];

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
        <select
          value={status}
          onChange={handleChange}
          disabled={isPending || status === "withdrawn"}
          className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(Object.entries(APPLICATION_STATUSES) as [Status, typeof APPLICATION_STATUSES[Status]][])
            .filter(([key]) => key !== "withdrawn")
            .map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
        </select>
        {isPending && (
          <span className="text-xs text-gray-400 animate-pulse">更新中...</span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
