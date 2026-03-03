export const OCCUPATIONS = [
  "看護師",
  "准看護師",
  "介護福祉士",
  "介護職員・ヘルパー",
  "医師",
  "薬剤師",
  "理学療法士",
  "作業療法士",
  "言語聴覚士",
  "社会福祉士",
  "ケアマネージャー",
  "歯科衛生士",
  "管理栄養士・栄養士",
  "保育士",
  "事務・受付",
  "その他",
] as const;

export type Occupation = (typeof OCCUPATIONS)[number];

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
] as const;

export type Prefecture = (typeof PREFECTURES)[number];

export const EMPLOYMENT_STATUSES = [
  "正社員",
  "パート・アルバイト",
  "契約社員",
  "派遣社員",
] as const;

export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export const JOB_TYPES = {
  full_time: "正規雇用",
  part_time: "非常勤・パート",
  contract: "契約社員",
  temporary: "派遣",
} as const;

export type JobType = keyof typeof JOB_TYPES;

export const SALARY_TYPES = {
  hourly: "時給",
  monthly: "月給",
  annual: "年収",
} as const;

export type SalaryType = keyof typeof SALARY_TYPES;

export const APPLICATION_STATUSES = {
  pending: { label: "未確認", color: "bg-gray-100 text-gray-700" },
  reviewing: { label: "選考中", color: "bg-blue-100 text-blue-700" },
  interview: { label: "面接調整中", color: "bg-yellow-100 text-yellow-700" },
  offered: { label: "内定", color: "bg-green-100 text-green-700" },
  rejected: { label: "不採用", color: "bg-red-100 text-red-700" },
  withdrawn: { label: "辞退", color: "bg-gray-100 text-gray-500" },
} as const;
