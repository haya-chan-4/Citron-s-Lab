// src/app/category/[id]/page.tsx
import SideBar from '@/components/Body/SideBar/SideBar'
import CategoryList from '@/components/Body/Main/CategoryList'
import Pagination from '@/components/Body/Main/Pagination'
import { client } from '@/libs/client'
import { notFound } from 'next/navigation'
import type { Blog } from '@/types/blog'

interface PageProps {
  params: { id: string }
  searchParams: { page?: string }
}

export const revalidate = 60
const PER_PAGE = 5

const CategoryPage: React.FC<PageProps> = async ({ params, searchParams }) => {
  const categoryId = params.id
  const currentPage = parseInt(searchParams.page ?? '1', 10) || 1
  if (currentPage < 1) return notFound()

  const offset = (currentPage - 1) * PER_PAGE

  // microCMSからフィルタ＋ページネーション付きで取得
  let blogs: Blog[] = []
  let totalCount = 0
  try {
    const { contents, totalCount: tc } = await client.get<{
      contents: Blog[]
      totalCount: number
    }>({
      endpoint: 'blog',
      queries: {
        filters: `category[equals]${categoryId}`,
        limit: PER_PAGE,
        offset,
        fields: 'id,title,publishedAt,thumbnail,category',
      },
    })
    blogs = contents
    totalCount = tc
  } catch (e) {
    console.error(e)
    return <div>記事の取得に失敗しました。</div>
  }

  if (blogs.length === 0) {
    return <div>このカテゴリーのブログ記事はありません。</div>
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row py-10 sm:px-4 md:px-24">
        <CategoryList blogs={blogs} categoryId={categoryId} />
        <SideBar />
      </div>
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        basePath={`/category/${categoryId}`}
      />
    </div>
  )
}

export default CategoryPage
