// src/app/category/[id]/[page]/page.tsx
import ArticleSidebarLayout from '@/components/Layouts/ArticleSidebarLayout'
import CategoryList from '@/components/Body/Main/CategoryList'
import Pagination from '@/components/Body/Main/Pagination'
import { notFound } from 'next/navigation' // notFound をインポート
import type { Blog } from '@/types/blog'
import { getPaginatedBlogs } from '@/libs/api'
import { getPaginationParams } from '@/utils/pagination'

interface PageProps {
  params: { id: string; page: string }
}

export const revalidate = 60

// ★ React.FC の削除（App Router のサーバーコンポーネントでは非推奨）★
const CategoryPage = async ({ params }: PageProps) => {
  const categoryId = params.id // URL パスパラメータから取得した元のカテゴリID
  const pageParam = params.page

  // ★ URLパスパラメータを小文字に正規化（microCMSのurlフィールドに合わせるため）★
  const normalizedCategoryId = categoryId.toLowerCase()

  const { currentPage, offset } = getPaginationParams({
    pageParam,
  })

  // 無効なページ番号（数字でない、または1未満）の場合は notFound() を呼び出す
  // getPaginationParams が currentPage を常に1以上にするため、ここには通常到達しませんが、念のため残します。
  if (isNaN(currentPage) || currentPage < 1) {
    return notFound()
  }

  // microCMS から記事を取得
  let blogs: Blog[] = []
  let totalCount = 0
  try {
    const res = await getPaginatedBlogs({
      endpoint: 'blog',
      offset,
      // ★ filters を category ではなく url フィールドでフィルタリングする ★
      // URLからのID（categoryId）を小文字に正規化したものを使用します。
      queries: { filters: `url[equals]${normalizedCategoryId}` },
    })
    blogs = res.blogs
    totalCount = res.totalCount
  } catch (e) {
    // ★ サーバーサイドでのエラーハンドリングのため alert(e) を console.error(e) に変更 ★
    console.error(e)
    return <div>記事の取得に失敗しました。</div>
  }

  // 記事が全く取得できなかった場合（総件数が0の場合を含む）の処理
  // currentPage が総ページ数を超える場合などもこの条件に該当します。
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
        articleArea={
          // ★ CategoryList には正規化されたカテゴリーIDを渡す ★
          <CategoryList blogs={blogs} categoryId={normalizedCategoryId} />
        }
      />
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        // ★ Pagination のリンク生成のためのベースパスも正規化されたIDを使用 ★
        basePath={`/category/${normalizedCategoryId}/`}
      />
    </div>
  )
}

export default CategoryPage
