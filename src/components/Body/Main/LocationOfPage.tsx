// src/components/Body/Main/LocationOfPage.tsx
import Link from 'next/link'
import { formatCategoryName } from '@/utils/format'

interface LocationOfPageProps {
  // 'category' プロパティは表示用のカテゴリー名（例: "プログラミング"）に使います。
  category: string
  // ★ NEW: 'categoryUrlId' プロパティを URL 用の正規化されたID（例: "programming"）として追加します。
  categoryUrlId: string
  // 'page' プロパティは現在のページのタイトル（例: "記事一覧"）です。
  page: string
}

// Next.js の App Router のサーバーコンポーネントでは React.FC の使用は非推奨のため削除します。
const LocationOfPage = (props: LocationOfPageProps) => {
  // props から必要な値を分割代入します。
  const { category, categoryUrlId, page } = props

  return (
    <nav className="text-gray-500 text-md font-bold mb-8">
      {page && (
        <Link href="/">
          <span className="text-gray-500 hover:underline">{page}</span>
          <span className="mx-2">{'>'}</span>
        </Link>
      )}
      <Link
        // ★ href には URL 用の正規化されたID (categoryUrlId) を使用します。★
        href={`/category/${categoryUrlId}`}
        className="text-indigo-500 hover:underline"
      >
        {/* 表示には formatCategoryName で整形したカテゴリー名（category プロパティ）を使用します。 */}
        {formatCategoryName(category)}
      </Link>
    </nav>
  )
}

export default LocationOfPage
