// src/components/Body/Main/MetaInfo.tsx
import { Clock4 } from 'lucide-react'
import DateFormatter from '@/components/UI/DateFormatter'
import CategoryDisplay from '@/components/UI/CategoryDisplay'
import Link from 'next/link'

interface MetaInfoProps {
  publishedAt: string // string 型を想定
  category?: string
}

const MetaInfo: React.FC<MetaInfoProps> = (props) => {
  const { publishedAt, category: categoryId } = props
  return (
    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8 space-x-4">
      <span className="flex items-center">
        <Clock4 className="mr-1 size-4 text-gray-500" />
        {publishedAt && <DateFormatter dateString={publishedAt} />}
      </span>
      {categoryId && (
        // Link タグで CategoryDisplay が返す要素 (span) をラップします
        <Link href={`/category/${categoryId}`} className="category-tag">
          {' '}
          {/* category-tag クラスを Link に適用 */}
          {/* CategoryDisplay はテキストだけを含む span を返します */}
          <CategoryDisplay categoryId={categoryId} styleType="plain" />{' '}
          {/* plain スタイルを指定 */}
        </Link>
      )}
    </div>
  )
}

export default MetaInfo
