// src/app/category/[id]/page.tsx
import ArticleSidebarLayout from '@/components/Layouts/ArticleSidebarLayout'
import CategoryList from '@/components/Body/Main/CategoryList'
import Pagination from '@/components/Body/Main/Pagination'
import { notFound } from 'next/navigation'
import type { Blog } from '@/types/blog'
import { getPaginatedBlogs } from '@/libs/api'
import { getPaginationParams } from '@/utils/pagination'

interface PageProps {
  params: { id: string }
  searchParams: { page?: string }
}

export const revalidate = 60

const CategoryPage: React.FC<PageProps> = async ({ params, searchParams }) => {
  const categoryId = params.id
  const { currentPage, offset } = getPaginationParams({
    pageParam: searchParams.page,
  })
  if (isNaN(currentPage) || currentPage < 1) {
    return notFound()
  }

  // microCMSからフィルタ＋ページネーション付きで取得
  let blogs: Blog[] = []
  let totalCount = 0
  try {
    const res = await getPaginatedBlogs({
      endpoint: 'blog',
      offset,
      queries: { filters: `category[equals]${categoryId}` },
    })
    blogs = res.blogs
    totalCount = res.totalCount
  } catch (e) {
    console.error(e)
    return <div>記事の取得に失敗しました。</div>
  }

  if (blogs.length === 0 && totalCount > 0) {
    return notFound()
  }
  if (blogs.length === 0) {
    return <div>このカテゴリーのブログ記事はありません。</div>
  }
  return (
    <div>
      <ArticleSidebarLayout
        articleArea={<CategoryList blogs={blogs} categoryId={categoryId} />}
      />
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        basePath={`/category/${categoryId}`}
      />
    </div>
  )
}

export default CategoryPage
