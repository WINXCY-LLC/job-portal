"use client";

import { useRef, useState, useTransition } from "react";
import { PREFECTURES } from "@/lib/constants";
import { upsertCompany } from "@/app/actions/company";
import type { Company } from "@/types/models";

interface CompanyFormProps {
  company: Company | null;
}

export function CompanyForm({ company }: CompanyFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const formData = new FormData(formRef.current!);
    startTransition(async () => {
      const result = await upsertCompany(formData);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {serverError}
        </div>
      )}

      {/* 基本情報 */}
      <FormSection title="基本情報">
        <FormField label="施設名" required>
          <input
            name="name"
            type="text"
            required
            defaultValue={company?.name ?? ""}
            placeholder="例：医療法人〇〇会 〇〇病院"
            className={inputClass}
          />
        </FormField>

        <FormField label="施設の説明">
          <textarea
            name="description"
            rows={5}
            defaultValue={company?.description ?? ""}
            placeholder="施設の特徴、理念、職場環境などを記入してください"
            className={`${inputClass} resize-none`}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="電話番号">
            <input
              name="phone"
              type="tel"
              defaultValue={company?.phone ?? ""}
              placeholder="例：03-1234-5678"
              className={inputClass}
            />
          </FormField>
          <FormField label="公式サイトURL">
            <input
              name="website"
              type="url"
              defaultValue={company?.website ?? ""}
              placeholder="例：https://example.com"
              className={inputClass}
            />
          </FormField>
        </div>
      </FormSection>

      {/* 所在地 */}
      <FormSection title="所在地">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="都道府県">
            <select
              name="prefecture"
              defaultValue={company?.prefecture ?? ""}
              className={`${inputClass} bg-white`}
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </FormField>
          <FormField label="市区町村">
            <input
              name="city"
              type="text"
              defaultValue={company?.city ?? ""}
              placeholder="例：渋谷区"
              className={inputClass}
            />
          </FormField>
        </div>
        <FormField label="番地・建物名">
          <input
            name="address"
            type="text"
            defaultValue={company?.address ?? ""}
            placeholder="例：1-2-3 〇〇ビル 4F"
            className={inputClass}
          />
        </FormField>
      </FormSection>

      {/* 施設詳細 */}
      <FormSection title="施設詳細">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="従業員数">
            <div className="relative">
              <input
                name="employee_count"
                type="number"
                min="1"
                defaultValue={company?.employee_count ?? ""}
                placeholder="例：120"
                className={`${inputClass} pr-8`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">人</span>
            </div>
          </FormField>
          <FormField label="設立年">
            <div className="relative">
              <input
                name="established_year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                defaultValue={company?.established_year ?? ""}
                placeholder="例：2005"
                className={`${inputClass} pr-8`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">年</span>
            </div>
          </FormField>
        </div>
        <FormField label="ロゴ画像URL">
          <input
            name="logo_url"
            type="url"
            defaultValue={company?.logo_url ?? ""}
            placeholder="例：https://example.com/logo.png"
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1">
            ロゴ画像の公開URLを入力してください
          </p>
        </FormField>
      </FormSection>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-60 text-sm"
      >
        {isPending ? "保存中..." : "施設情報を保存する"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-sm font-bold text-gray-900 border-l-4 border-primary-500 pl-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
