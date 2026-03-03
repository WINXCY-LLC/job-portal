"use client";

import { useState } from "react";
import { SearchPanel } from "./SearchPanel";

export function MobileSearchDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* トリガーボタン */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        絞り込み
      </button>

      {/* オーバーレイ */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-gray-50 h-full overflow-y-auto p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">絞り込み検索</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SearchPanel />
          </div>
        </div>
      )}
    </>
  );
}
