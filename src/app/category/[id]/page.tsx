// src/app/category/[id]/page.tsx
import ArticleSidebarLayout from '@/components/Layouts/ArticleSidebarLayout'
import CategoryList from '@/components/Body/Main/CategoryList'
import Pagination from '@/components/Body/Main/Pagination'
import { notFound } from 'next/navigation' // notFound は引き続き使用（無効なページ番号の場合）
// import { redirect } from 'next/navigation'; // リダイレクトする場合に必要
import type { Blog } from '@/types/blog'
import { getPaginatedBlogs } from '@/libs/api' // microCMS からブログを取得する関数
import { getPaginationParams } from '@/utils/pagination' // ページングパラメータを計算する関数

interface PageProps {
  params: { id: string } // カテゴリーID
  searchParams: { page?: string } // ページ番号
}

export const revalidate = 60 // ISR の設定

const CategoryPage: React.FC<PageProps> = async ({ params, searchParams }) => {
  const categoryId = params.id
  // searchParams.page からページ番号を取得し、オフセットを計算
  const { currentPage, offset } = getPaginationParams({
    pageParam: searchParams.page,
  })

  // 無効なページ番号（数字でない、または1未満）の場合は notFound() を呼び出す (変更なし)
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
      queries: { filters: `category[equals]${categoryId}` }, // カテゴリーでフィルタリング
    })
    blogs = res.blogs // 取得した記事の配列
    totalCount = res.totalCount // カテゴリー全体の総件数
  } catch (e) {
    console.error(e)
    // データ取得失敗時はエラーメッセージを表示 (変更なし)
    return <div>記事の取得に失敗しました。</div>
  }

  // ★ 記事が全く取得できなかった場合（総件数が0の場合を含む）の処理 ★
  // if (blogs.length === 0 && totalCount > 0) { return notFound(); } // ★ この条件を削除します ★
  // この条件を削除することで、有効なページ番号なのに記事が取得できなかった場合も、
  // 次の blogs.length === 0 の条件で処理されるようになります。

  if (blogs.length === 0) {
    // 記事が0件の場合、総件数に関わらず「記事がありません」というメッセージを表示します。
    // 有効なページ番号なのに記事が0件だった（Pagination で最後のページを超えたなど）場合はここに到達します。
    return (
      <div className="h-screen flex-1 flex-col lg:flex-row py-10 sm:px-4 md:px-24">
        このカテゴリーのブログ記事はありません。
      </div>
    )
  }

  // 記事が取得できた場合は、CategoryList と Pagination コンポーネントをレンダリング (変更なし)
  return (
    <div>
      <ArticleSidebarLayout
        articleArea={<CategoryList blogs={blogs} categoryId={categoryId} />}
      />
      <Pagination
        totalCount={totalCount} // Pagination に総件数を渡す
        currentPage={currentPage} // Pagination に現在のページ番号を渡す
        basePath={`/category/${categoryId}`} // Pagination のリンク生成のためのベースパス
      />
    </div>
  )
}

export default CategoryPage
