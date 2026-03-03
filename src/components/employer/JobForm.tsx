"use client";

import { useRef, useState, useTransition } from "react";
import {
  OCCUPATIONS,
  PREFECTURES,
  EMPLOYMENT_STATUSES,
  JOB_TYPES,
  SALARY_TYPES,
} from "@/lib/constants";
import type { Job } from "@/types/models";
import type { SalaryType } from "@/lib/constants";

interface JobFormProps {
  /** 編集時は既存データを渡す。新規時は undefined */
  defaultValues?: Partial<Job>;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

export function JobForm({ defaultValues, action }: JobFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [submitAction, setSubmitAction] = useState<"draft" | "publish">("draft");
  const [serverError, setServerError] = useState<string | null>(null);
  const [salaryType, setSalaryType] = useState<SalaryType>(defaultValues?.salary_type ?? "monthly");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const formData = new FormData(formRef.current!);
    formData.set("action", submitAction);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setServerError(result.error);
    });
  }

  const salaryUnit = salaryType === "hourly" ? "円/時" : salaryType === "monthly" ? "円/月" : "円/年";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      {/* ── 基本情報 ── */}
      <Section title="基本情報">
        {/* 求人タイトル */}
        <Field label="求人タイトル" required>
          <input
            name="title"
            type="text"
            required
            defaultValue={defaultValues?.title}
            placeholder="例）看護師募集｜〇〇病院（正社員・東京都）"
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">求職者が最初に目にするタイトルです。職種・施設名・雇用形態などを含めると効果的です。</p>
        </Field>

        {/* 職種 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="職種" required>
            <select name="occupation" required defaultValue={defaultValues?.occupation ?? ""} className={inputCls}>
              <option value="" disabled>選択してください</option>
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>

          {/* 雇用形態 */}
          <Field label="雇用形態" required>
            <select name="employment_status" required defaultValue={defaultValues?.employment_status ?? ""} className={inputCls}>
              <option value="" disabled>選択してください</option>
              {EMPLOYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* 雇用区分 */}
        <Field label="雇用区分" required>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.entries(JOB_TYPES) as [string, string][]).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-lg px-3 py-2 hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                <input
                  type="radio"
                  name="job_type"
                  value={value}
                  required
                  defaultChecked={defaultValues?.job_type === value || (!defaultValues?.job_type && value === "full_time")}
                  className="accent-primary-600"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </Field>
      </Section>

      {/* ── 勤務地 ── */}
      <Section title="勤務地">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="都道府県" required>
            <select name="prefecture" required defaultValue={defaultValues?.prefecture ?? ""} className={inputCls}>
              <option value="" disabled>選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="市区町村">
            <input
              name="city"
              type="text"
              defaultValue={defaultValues?.city ?? ""}
              placeholder="例）新宿区"
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="詳細住所">
          <input
            name="address"
            type="text"
            defaultValue={defaultValues?.address ?? ""}
            placeholder="例）西新宿2-8-1"
            className={inputCls}
          />
        </Field>
      </Section>

      {/* ── 給与 ── */}
      <Section title="給与">
        <Field label="給与形態" required>
          <div className="flex gap-4">
            {(Object.entries(SALARY_TYPES) as [SalaryType, string][]).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="salary_type"
                  value={value}
                  defaultChecked={defaultValues?.salary_type === value || (!defaultValues?.salary_type && value === "monthly")}
                  onChange={() => setSalaryType(value)}
                  className="accent-primary-600"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label={`最低給与（${salaryUnit}）`}>
            <input
              name="salary_min"
              type="number"
              min={0}
              step={salaryType === "hourly" ? 10 : 1000}
              defaultValue={defaultValues?.salary_min ?? ""}
              placeholder={salaryType === "hourly" ? "1100" : salaryType === "monthly" ? "200000" : "3000000"}
              className={inputCls}
            />
          </Field>
          <Field label={`最高給与（${salaryUnit}）`}>
            <input
              name="salary_max"
              type="number"
              min={0}
              step={salaryType === "hourly" ? 10 : 1000}
              defaultValue={defaultValues?.salary_max ?? ""}
              placeholder={salaryType === "hourly" ? "1500" : salaryType === "monthly" ? "350000" : "5000000"}
              className={inputCls}
            />
          </Field>
        </div>
        <p className="text-xs text-gray-400">未入力の場合は「応相談」と表示されます。</p>
      </Section>

      {/* ── 勤務条件 ── */}
      <Section title="勤務条件">
        <Field label="勤務時間">
          <input
            name="working_hours"
            type="text"
            defaultValue={defaultValues?.working_hours ?? ""}
            placeholder="例）8:30〜17:30（休憩60分）、夜勤あり"
            className={inputCls}
          />
        </Field>
        <Field label="休日・休暇">
          <input
            name="holidays"
            type="text"
            defaultValue={defaultValues?.holidays ?? ""}
            placeholder="例）週休2日制、年間休日120日、有給休暇あり"
            className={inputCls}
          />
        </Field>
        <Field label="待遇・福利厚生">
          <textarea
            name="benefits"
            rows={3}
            defaultValue={defaultValues?.benefits ?? ""}
            placeholder="例）社会保険完備、交通費全額支給、退職金制度あり、資格取得支援制度"
            className={inputCls}
          />
        </Field>
        <Field label="掲載終了日">
          <input
            name="expires_at"
            type="date"
            defaultValue={defaultValues?.expires_at?.split("T")[0] ?? ""}
            min={new Date().toISOString().split("T")[0]}
            className={inputCls + " max-w-xs"}
          />
          <p className="text-xs text-gray-400 mt-1">未設定の場合は手動で非公開にするまで掲載されます。</p>
        </Field>
      </Section>

      {/* ── 仕事内容・応募要件 ── */}
      <Section title="仕事内容・応募要件">
        <Field label="仕事内容" required>
          <textarea
            name="description"
            rows={8}
            required
            defaultValue={defaultValues?.description ?? ""}
            placeholder={`例）
・入院患者様の看護業務全般
・バイタルチェック、投薬管理
・医師・他職種との連携
・電子カルテ入力
など`}
            className={inputCls}
          />
        </Field>
        <Field label="応募資格・必要なスキル">
          <textarea
            name="requirements"
            rows={5}
            defaultValue={defaultValues?.requirements ?? ""}
            placeholder={`例）
【必須】
・看護師免許保有者
・普通自動車免許

【歓迎】
・急性期病棟での経験者`}
            className={inputCls}
          />
        </Field>
      </Section>

      {/* ── 送信ボタン ── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-200">
        <button
          type="submit"
          disabled={isPending}
          onClick={() => setSubmitAction("draft")}
          className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
        >
          {isPending && submitAction === "draft" ? "保存中..." : "下書き保存"}
        </button>
        <button
          type="submit"
          disabled={isPending}
          onClick={() => setSubmitAction("publish")}
          className="flex-1 sm:flex-none px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm"
        >
          {isPending && submitAction === "publish" ? "公開中..." : "公開する"}
        </button>
        <a
          href="/employer/jobs"
          className="flex-1 sm:flex-none px-6 py-3 text-center text-gray-500 hover:text-gray-700 text-sm"
        >
          キャンセル
        </a>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({
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
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white";
