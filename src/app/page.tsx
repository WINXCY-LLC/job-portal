import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/layout/Logo";

/* ─── 職種カテゴリデータ ─── */
const CATEGORIES = [
  { name: "看護師",       icon: "🏥", count: "1,234", query: "看護師" },
  { name: "准看護師",     icon: "💉", count: "892",   query: "准看護師" },
  { name: "介護職員",     icon: "🤝", count: "2,567", query: "介護職員・ヘルパー" },
  { name: "介護福祉士",   icon: "🌿", count: "1,102", query: "介護福祉士" },
  { name: "医師",         icon: "👨‍⚕️", count: "345",   query: "医師" },
  { name: "薬剤師",       icon: "💊", count: "678",   query: "薬剤師" },
  { name: "理学療法士",   icon: "🦽", count: "456",   query: "理学療法士" },
  { name: "作業療法士",   icon: "🖐️", count: "321",   query: "作業療法士" },
  { name: "ケアマネ",     icon: "📋", count: "543",   query: "ケアマネージャー" },
  { name: "社会福祉士",   icon: "🤲", count: "267",   query: "社会福祉士" },
  { name: "管理栄養士",   icon: "🥗", count: "198",   query: "管理栄養士・栄養士" },
  { name: "その他",       icon: "✨", count: "431",   query: "" },
];

/* ─── 特徴データ ─── */
const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="24" cy="24" r="24" fill="#ccfbf1" />
        <path d="M14 24l7 7 13-13" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "完全無料で使える",
    desc: "登録から応募まで、求職者の方は一切費用がかかりません。安心してご利用ください。",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="24" cy="24" r="24" fill="#ccfbf1" />
        <rect x="12" y="20" width="6" height="16" rx="2" fill="#0d9488" />
        <rect x="21" y="14" width="6" height="22" rx="2" fill="#0d9488" />
        <rect x="30" y="10" width="6" height="26" rx="2" fill="#0d9488" />
      </svg>
    ),
    title: "沖縄最大級の求人数",
    desc: "県内4,600件以上の求人を掲載。病院・介護施設・クリニックなど幅広い職場から選べます。",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="24" cy="24" r="24" fill="#ccfbf1" />
        <path d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z" stroke="#0d9488" strokeWidth="2.5" />
        <path d="M24 19v5l3 3" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "すぐに転職できる",
    desc: "最短1日で応募から面接まで進めます。急いで転職先を探している方にも対応しています。",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ═══════════ HEADER ═══════════ */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="md" />
          <nav className="flex items-center gap-2">
            <Link
              href="/jobs"
              className="hidden sm:block text-sm text-gray-600 hover:text-primary-700 px-3 py-2 transition-colors font-medium"
            >
              求人を探す
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-primary-700 border border-gray-300 px-4 py-2 rounded-full transition-colors font-medium"
            >
              ログイン
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-bold bg-primary-600 text-white px-5 py-2 rounded-full hover:bg-primary-700 transition-colors"
            >
              無料登録
            </Link>
          </nav>
        </div>
      </header>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-primary-900 min-h-[540px] sm:min-h-[580px] flex items-center">
        {/* 背景画像 */}
        <Image
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&auto=format&fit=crop&q=80"
          alt="医療・介護スタッフ"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/80 to-primary-900/50" />

        {/* コンテンツ */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 w-full">
          <div className="max-w-xl">
            {/* バッジ */}
            <span className="inline-flex items-center gap-1.5 bg-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6 tracking-wide">
              🌺 沖縄No.1 医療・介護求人サイト
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              沖縄で理想の<br />
              <span className="text-primary-300">医療・介護</span>の<br />
              お仕事を見つけよう
            </h1>
            <p className="text-primary-100 text-base sm:text-lg mb-8 leading-relaxed">
              看護師・介護士・医師など<strong className="text-white">4,600件以上</strong>の求人を掲載中。<br className="hidden sm:block" />
              完全無料で今すぐ応募できます。
            </p>

            {/* CTA ボタン */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white font-bold px-8 py-4 rounded-full text-base transition-all shadow-lg hover:shadow-xl"
              >
                無料で会員登録する
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/40 font-medium px-8 py-4 rounded-full text-base transition-all backdrop-blur-sm"
              >
                求人を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="bg-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 divide-x divide-primary-600">
            {[
              { value: "4,600+", label: "掲載求人数" },
              { value: "320+",   label: "掲載施設数" },
              { value: "0円",    label: "登録・利用料" },
            ].map((stat) => (
              <div key={stat.label} className="py-5 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-primary-200 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-primary-600 text-sm font-bold uppercase tracking-widest mb-2">FEATURES</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              沖縄メディケアワークが<br className="sm:hidden" />選ばれる理由
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 職種カテゴリ ═══════════ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-primary-600 text-sm font-bold uppercase tracking-widest mb-2">JOBS</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">職種から求人を探す</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/jobs?occupation=${cat.query}`}
                className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-4 hover:border-primary-400 hover:bg-primary-50 transition-all"
              >
                <span className="text-2xl shrink-0">{cat.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 group-hover:text-primary-700 text-sm truncate">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.count}件</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 text-sm border border-primary-300 px-6 py-2.5 rounded-full hover:bg-primary-50 transition-colors"
            >
              すべての求人を見る
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ STEP（登録フロー） ═══════════ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-primary-600 text-sm font-bold uppercase tracking-widest mb-2">HOW TO USE</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">かんたん3ステップで応募完了</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {/* 接続線（PC） */}
            <div className="hidden sm:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-primary-200 -z-0" />
            {[
              { step: "01", title: "無料会員登録", desc: "メールアドレスだけで30秒登録完了" },
              { step: "02", title: "求人を検索", desc: "職種・地域・条件で絞り込んで理想の求人を探す" },
              { step: "03", title: "応募・面接", desc: "気になる求人に応募。最短翌日に面接へ" },
            ].map((s) => (
              <div key={s.step} className="relative text-center bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section className="bg-primary-700 py-14 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            まずは無料登録してみる
          </h2>
          <p className="text-primary-200 text-sm sm:text-base mb-8">
            登録は無料・1分で完了。沖縄の医療・介護求人を今すぐ探せます。
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white font-bold px-10 py-4 rounded-full text-base transition-all shadow-lg hover:shadow-xl"
          >
            無料で会員登録する
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="text-primary-300 text-xs mt-4">クレジットカード不要・いつでも退会可能</p>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            {/* ブランド */}
            <div>
              <div className="mb-3">
                <Logo size="sm" />
              </div>
              <p className="text-xs leading-relaxed text-gray-500">
                沖縄県の医療・介護業界に特化した<br />
                求人情報サービスです。
              </p>
            </div>
            {/* 求職者向け */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">求職者の方へ</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/jobs" className="hover:text-white transition-colors">求人を探す</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">無料会員登録</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">ログイン</Link></li>
              </ul>
            </div>
            {/* 事業者向け */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">事業者の方へ</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/auth/register" className="hover:text-white transition-colors">施設登録</Link></li>
                <li><Link href="/employer/jobs" className="hover:text-white transition-colors">求人を掲載する</Link></li>
                <li><Link href="/employer/applications" className="hover:text-white transition-colors">応募を管理する</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
            <p>© 2026 沖縄メディケアワーク（ウィンクシーLLC）. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
