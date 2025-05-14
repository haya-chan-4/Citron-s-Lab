// src/components/Body/Main/Pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { PER_PAGE } from '@/constants/pagination'

interface Props {
  totalCount: number
  currentPage?: number // オプショナルにする
  basePath: string // 例: '/page'
}

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

const Pagination = ({ totalCount, currentPage, basePath }: Props) => {
  // ① currentPage が undefined や NaN のときは 1 にフォールバック
  const cp =
    typeof currentPage === 'number' && !isNaN(currentPage) ? currentPage : 1

  const pageCount = Math.ceil(totalCount / PER_PAGE)
  const pages = range(1, pageCount)

  // ② 1ページ目だけホーム（"/"）に飛ばす
  const getPageHref = (pageNum: number) => {
    if (pageNum === 1) return '/'
    // basePath が "/" や "" のときも余計なスラッシュが出ないように
    const prefix = basePath === '/' || basePath === '' ? '' : basePath
    return `${prefix}/${pageNum}`
  }

  // Next が有効なのは「現在ページ < 総ページ数」のとき
  const isNextEnabled = cp < pageCount

  return (
    <nav
      aria-label="Pagination"
      className="flex isolate items-center justify-center -space-x-px rounded-md shadow-xs pb-10"
    >
      {/* Prev */}
      {cp > 1 ? (
        <Link
          href={getPageHref(cp - 1)}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft size={20} aria-hidden="true" />
        </Link>
      ) : (
        <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset bg-gray-100 cursor-not-allowed">
          <span className="sr-only">Previous</span>
          <ChevronLeft size={20} aria-hidden="true" />
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((num) => {
        const isActive = num === cp
        return (
          <Link
            key={num}
            href={getPageHref(num)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
              isActive
                ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
          >
            {num}
          </Link>
        )
      })}

      {/* Next */}
      {isNextEnabled ? (
        <Link
          href={getPageHref(cp + 1)}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Next</span>
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
      ) : (
        <span className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset bg-gray-100 cursor-not-allowed">
          <span className="sr-only">Next</span>
          <ChevronRight size={20} aria-hidden="true" />
        </span>
      )}
    </nav>
  )
}
export default Pagination
