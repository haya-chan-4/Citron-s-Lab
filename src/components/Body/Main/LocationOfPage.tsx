// src/components/Body/Main/LocationOfPage.tsx
import Link from 'next/link'
import { formatCategoryName } from '@/utils/format'
interface LocationOfPageProps {
  category: string

  page: string
}
const LocationOfPage: React.FC<LocationOfPageProps> = (props): JSX.Element => {
  const { category, page } = props
  return (
    <nav className="text-gray-500 text-md font-bold mb-8">
      <Link href="/" className="hover:underline">
        {page}
      </Link>
      <span className="mx-2">{'>'}</span>
      <Link
        href={`/category/${category}`}
        className="text-indigo-500 hover:underline"
      >
        {formatCategoryName(category)}
      </Link>
    </nav>
  )
}
export default LocationOfPage
