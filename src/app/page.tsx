import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-700">
            医療・介護求人ポータル
          </h1>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          あなたに最適な<span className="text-primary-600">医療・介護</span>の仕事を
        </h2>
        <p className="text-xl text-gray-600 mb-10">
          看護師・介護士・医師・薬剤師など、多数の求人から理想のキャリアを見つけましょう
        </p>

        {/* 検索バー */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="職種・キーワードを入力"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="勤務地"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              検索
            </button>
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
          <p className="font-bold text-white text-lg mb-2">医療・介護求人ポータル</p>
          <p className="text-sm">© 2026 医療・介護求人ポータル. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
