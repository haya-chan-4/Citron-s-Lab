// src/components/UI/CategoryDisplay.tsx
import { formatCategoryName } from '@/utils/format'

interface Props {
  categoryId: string
  styleType: 'tag' | 'plain'
  className?: string
}

const CategoryDisplay: React.FC<Props> = ({
  categoryId,
  styleType,
  className,
}) => {
  if (!categoryId) {
    return null
  }

  const categoryName = formatCategoryName(categoryId)
  switch (styleType) {
    case 'tag':
      return (
        <span className={`category-tag ${className || ''}`}>
          {categoryName}
        </span>
      )
    case 'plain':
      // プレーンなテキストを span で囲んで返します。
      return <span className={className || ''}>{categoryName}</span>
    default:
      return <span className={className || ''}></span>
  }
}

export default CategoryDisplay
