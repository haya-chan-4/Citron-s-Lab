// src/components/UI/CategoryDisplay.tsx
import Link from 'next/link';
import { formatCategoryName } from '@/utils/format'

interface Props {
  categoryId: string;
  styleType: 'tag' | 'link' | 'plain'
}

const CategoryDisplay: React.FC<Props> = ({ categoryId, styleType }) => {
  const categoryName = formatCategoryName(categoryId);

  switch (styleType) {
    case 'tag':
      return (
        <Link href={`/category/${categoryId}`} className="w-max h-min text-sm text-indigo-600 border border-indigo-600 rounded px-2 pt-[3px] pb-[2px]">
          {categoryName}
        </Link>
      );
    case 'link':
      return (
        <Link href={`/category/${categoryId}`} className="text-indigo-500 hover:underline">
          {categoryName}
        </Link>
      );
    case 'plain':
      return <span>{categoryName}</span>
    default:
      return null;
  }
};

export default CategoryDisplay
