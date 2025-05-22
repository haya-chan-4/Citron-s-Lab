// src/app/category/[id]/[page]/page.tsx
import ArticleSidebarLayout from '@/components/Layouts/ArticleSidebarLayout'
import CategoryList from '@/components/Body/Main/CategoryList'
import Pagination from '@/components/Body/Main/Pagination'
import type { Blog } from '@/types/blog'
import { getPaginatedBlogs } from '@/libs/api'
import { getPaginationParams } from '@/utils/pagination'

interface PageProps {
  params: { id: string; page: string }
}

export const revalidate = 60

const CategoryPage: React.FC<PageProps> = async ({ params }) => {
  const categoryId = params.id
  const pageParam = params.page
  const { currentPage, offset } = getPaginationParams({
    pageParam,
  })

  // microCMS から記事を取得
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
    alert(e)
    return <div>記事の取得に失敗しました。</div>
  }

  // 記事が全く取得できなかった場合（総件数が0の場合を含む）の処理
  // currentPage が総ページ数を超える場合などもこの条件に該当
  if (blogs.length === 0) {
    return (
      <div className="h-screen flex-1 flex-col lg:flex-row py-10 sm:px-4 md:px-24">
        このカテゴリーのブログ記事はありません。
      </div>
    )
  }

  // 記事が取得できた場合はレンダリング
  return (
    <div>
      <ArticleSidebarLayout
        articleArea={<CategoryList blogs={blogs} categoryId={categoryId} />}
      />
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        basePath={`/category/${categoryId}/`}
      />
    </div>
  )
}

export default CategoryPage
