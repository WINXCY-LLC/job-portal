import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/layout/Logo";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo size="md" />
          <nav className="flex gap-4">
            <Link href="/jobs" className="text-gray-600 hover:text-primary-600 transition-colors">
              求人を探す
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-primary-600 transition-colors">
              ログイン
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              無料登録
            </Link>
          </nav>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* 左：テキスト＋検索 */}
          <div>
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-5">
              <span>🌺</span> 沖縄の医療・介護求人 No.1
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
              あなたに最適な<br />
              <span className="text-primary-600">医療・介護</span>の仕事を<br />
              沖縄で見つけよう
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              看護師・介護士・医師・薬剤師など、沖縄県内の多数の求人から理想のキャリアを見つけましょう
            </p>

            {/* 検索バー */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="職種・キーワードを入力"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="市区町村"
                  className="flex-1 sm:max-w-[160px] border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Link
                  href="/jobs"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm text-center"
                >
                  求人を探す
                </Link>
              </div>
            </div>

            {/* 統計 */}
            <div className="flex gap-6 mt-6 text-sm text-gray-500">
              <span><strong className="text-gray-800 text-base">4,600+</strong> 件の求人</span>
              <span><strong className="text-gray-800 text-base">320+</strong> 施設</span>
              <span><strong className="text-gray-800 text-base">無料</strong> 登録</span>
            </div>
          </div>

          {/* 右：画像グリッド */}
          <div className="hidden lg:grid grid-cols-2 gap-3 h-[420px]">
            {/* メイン画像（左・縦長） */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg row-span-2">
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80"
                alt="看護師が患者をケアしている様子"
                fill
                className="object-cover"
                sizes="300px"
                priority
              />
            </div>
            {/* サブ画像1 */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80"
                alt="介護士が高齢者をサポートしている様子"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            {/* サブ画像2 */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80"
                alt="医療スタッフが笑顔で働いている様子"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          </div>

          {/* モバイル用：横長1枚 */}
          <div className="relative lg:hidden rounded-2xl overflow-hidden shadow-lg h-52">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80"
              alt="医療・介護スタッフ"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* 職種カテゴリー */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">職種から探す</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "看護師", icon: "🏥", count: "1,234" },
            { name: "介護士", icon: "👴", count: "2,567" },
            { name: "医師", icon: "👨‍⚕️", count: "345" },
            { name: "薬剤師", icon: "💊", count: "678" },
            { name: "理学療法士", icon: "🦽", count: "456" },
            { name: "作業療法士", icon: "🖐️", count: "321" },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/jobs?category=${category.name}`}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <div className="font-medium text-gray-900">{category.name}</div>
              <div className="text-sm text-gray-500 mt-1">{category.count}件</div>
            </Link>
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-gray-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-bold text-white text-lg mb-2">沖縄メディケアワーク</p>
          <p className="text-sm">© 2026 沖縄メディケアワーク. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
