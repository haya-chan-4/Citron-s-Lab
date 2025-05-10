// components/Pagination.tsx
// import page from '@/app/page/[id]/page'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  totalCount: number
  currentPage: number
  basePath: string // 例: "/blog"
}

const PER_PAGE = 3

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

export default function Pagination({ totalCount, currentPage, basePath }: Props) {
  const pageCount = Math.ceil(totalCount / PER_PAGE)
  const pages = range(1, pageCount)

  return (
    <nav className="flex items-center justify-center space-x-2 py-6">
      {/* Prev */}
      {currentPage >  1? (
        <Link
          href={`${basePath}/${currentPage - 1}`}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <span className="p-2 rounded bg-gray-200 text-gray-400 cursor-not-allowed">
          <ChevronLeft size={20} />
        </span>
      )}

      {/* ページ番号 */}
      {pages.map((num) => (
        <Link
          key={num}
          href={`${basePath}/${num}`}
          className={`px-3 py-1 rounded ${num === currentPage
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
            }`}
        >
          {num}
        </Link>
      ))}

      {/* Next */}
      {currentPage < pageCount ? (
        <Link
          href={`${basePath}/${currentPage + 1}`}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <span className="p-2 rounded bg-gray-200 text-gray-400 cursor-not-allowed">
          <ChevronRight size={20} />
        </span>
      )}
    </nav>
  )
}
