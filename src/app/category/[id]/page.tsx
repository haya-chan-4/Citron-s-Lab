// src/app/category/[id]/page.tsx
import ArticleSidebarLayout from '@/components/Layouts/ArticleSidebarLayout'
import CategoryList from '@/components/Body/Main/CategoryList'
import Pagination from '@/components/Body/Main/Pagination'
import { notFound } from 'next/navigation' // notFound は引き続き使用（無効なページ番号の場合）
// import { redirect } from 'next/navigation'; // リダイレクトする場合に必要
import type { Blog } from '@/types/blog' // Blog 型をインポート
import { getPaginatedBlogs } from '@/libs/api' // microCMS からブログを取得する関数
import { getPaginationParams } from '@/utils/pagination' // ページングパラメータを計算する関数

// PageProps インターフェースを正確に定義
interface PageProps {
  params: { id: string } // カテゴリーID（URLパスパラメータ）
  // searchParams.page は string | string[] | undefined の可能性を考慮
  searchParams: { page?: string | string[] } // ページ番号（クエリパラメータ）
}

export const revalidate = 60 // ISR の設定

// ★ React.FC の削除（App Router のサーバーコンポーネントでは非推奨）★
const CategoryPage = async ({ params, searchParams }: PageProps) => {
  const categoryId = params.id // URL パスパラメータから取得した元のカテゴリID

  // ★ URLパスパラメータを小文字に正規化（microCMSのurlフィールドに合わせるため）★
  const normalizedCategoryId = categoryId.toLowerCase()

  // searchParams.page からページ番号を取得し、オフセットを計算
  const { currentPage, offset } = getPaginationParams({
    pageParam: searchParams.page,
  })

  // 無効なページ番号（数字でない、または1未満）の場合は notFound() を呼び出す
  if (isNaN(currentPage) || currentPage < 1) {
    return notFound()
  }

  // microCMSから指定されたカテゴリーとページングパラメータでブログ記事を取得
  let blogs: Blog[] = []
  let totalCount = 0
  try {
    const res = await getPaginatedBlogs({
      endpoint: 'blog', // microCMS のエンドポイント名
      offset, // 取得開始位置
      // ★ filters を category ではなく url フィールドでフィルタリングする ★
      // URLからのID（categoryId）を小文字に正規化したものを使用します。
      queries: { filters: `url[equals]${normalizedCategoryId}` },
    })
    blogs = res.blogs // 取得した記事の配列
    totalCount = res.totalCount // カテゴリー全体の総件数
  } catch (e) {
    console.error(e)
    // データ取得失敗時はエラーメッセージを表示
    return <div>記事の取得に失敗しました。</div>
  }

  if (blogs.length === 0) {
    return (
      <div className="h-screen flex-1 flex-col lg:flex-row py-10 sm:px-4 md:px-24">
        このカテゴリーのブログ記事はありません。
      </div>
    )
  }

  // 記事が取得できた場合は、CategoryList と Pagination コンポーネントをレンダリング
  return (
    <div>
      <ArticleSidebarLayout
        articleArea={
          // ★ CategoryList には正規化されたカテゴリーIDを渡す ★
          <CategoryList blogs={blogs} categoryId={normalizedCategoryId} />
        }
      />
      <Pagination
        totalCount={totalCount} // Pagination に総件数を渡す
        currentPage={currentPage} // Pagination に現在のページ番号を渡す
        // ★ Pagination のリンク生成のためのベースパスも正規化されたIDを使用 ★
        basePath={`/category/${normalizedCategoryId}`}
      />
    </div>
  )
}

export default CategoryPage
