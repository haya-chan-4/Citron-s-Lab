// src/app/category/[id]/[page]/page.tsx (getPaginationParams の変更に合わせて再修正)
import ArticleSidebarLayout from '@/components/Layouts/ArticleSidebarLayout'
import CategoryList from '@/components/Body/Main/CategoryList'
import Pagination from '@/components/Body/Main/Pagination'
// notFound は不要になるか、別の用途で使用
// import { notFound } from 'next/navigation';
// redirect も不要になるか、別の用途で使用
// import { redirect } from 'next/navigation';
import type { Blog } from '@/types/blog'
import { getPaginatedBlogs } from '@/libs/api'
import { getPaginationParams } from '@/utils/pagination' // 修正した getPaginationParams をインポート

interface PageProps {
  // params.page の型は string
  params: { id: string; page: string }
  // searchParams はこのファイルでは使用しないため、削除またはコメントアウト
  // searchParams: { page?: string };
}

export const revalidate = 60

// props から params を分割代入します。searchParams は受け取りません。
const CategoryPage: React.FC<PageProps> = async ({ params }) => {
  const categoryId = params.id
  const pageParam = params.page // params.page から文字列のページ番号を取得

  // 修正した getPaginationParams に pageParam を渡します
  // getPaginationParams 内で数値変換とバリデーションが行われ、常に有効な currentPage が返されます
  const { currentPage, offset } = getPaginationParams({
    pageParam, // ★ params.page (string) をそのまま渡す ★
  })

  // ★ getPaginationParams 内でバリデーションを行うため、ここでのチェックは不要になります ★
  // if (isNaN(currentPage) || currentPage < 1) {
  //   return notFound();
  // }

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
    console.error(e)
    return <div>記事の取得に失敗しました。</div>
  }

  // 記事が全く取得できなかった場合（総件数が0の場合を含む）の処理
  // このロジックは維持（記事なしメッセージを表示）
  // currentPage が総ページ数を超える場合などもこの条件に該当します
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
        currentPage={currentPage} // getPaginationParams から取得した常に有効な currentPage
        // Pagination に渡す basePath を修正します
        // `/category/test/` のように最後にスラッシュを付けることで、
        // Pagination が `/category/test/2` のようなパスパラメータ形式のリンクを生成できるようになる想定です。
        basePath={`/category/${categoryId}/`}
      />
    </div>
  )
}

export default CategoryPage
