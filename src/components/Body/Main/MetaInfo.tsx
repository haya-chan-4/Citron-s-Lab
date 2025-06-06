// src/components/Body/Main/MetaInfo.tsx
import { Clock4 } from 'lucide-react'
import DateFormatter from '@/components/UI/DateFormatter'
import CategoryDisplay from '@/components/UI/CategoryDisplay'
import Link from 'next/link'

interface MetaInfoProps {
  publishedAt: string // string 型を想定
  category?: string // 表示用のカテゴリー名（例: "プログラミング"）
  categoryUrlId?: string // ★ NEW: URL用の正規化されたID（例: "programming"）★
}

// Next.js App Router のサーバーコンポーネントでは React.FC の使用は非推奨のため削除します。
const MetaInfo = (props: MetaInfoProps) => {
  // props から必要な値を分割代入します。
  // category プロパティは categoryDisplay に渡すため、そのまま category とします。
  // categoryId は混乱を避けるため、categoryUrlId に名称変更します。
  const { publishedAt, category, categoryUrlId } = props

  return (
    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8 space-x-4">
      <span className="flex items-center">
        <Clock4 className="mr-1 size-4 text-gray-500" />
        {publishedAt && <DateFormatter dateString={publishedAt} />}
      </span>
      {/* categoryUrlId が存在する場合のみカテゴリーリンクを表示します。 */}
      {categoryUrlId && (
        <Link
          // ★ href には categoryUrlId を使用して、正しい URL に遷移するようにします。★
          href={`/category/${categoryUrlId}`}
          className="category-tag"
        >
          {/* CategoryDisplay には表示用のカテゴリー名 (category) を渡します。 */}
          <CategoryDisplay categoryId={category ?? ''} styleType="plain" />
        </Link>
      )}
    </div>
  )
}

export default MetaInfo
