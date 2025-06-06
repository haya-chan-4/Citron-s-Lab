// src/components/Body/SideBar/SideBar.tsx
import { client } from '@/libs/client'
import { Blog } from '@/types/blog' // Blog 型をインポート
import LatestCard from './LatestCard'
import CategoryItem from './CategoryItem'
import { formatCategoryName } from '@/utils/format'

type Props = object

const getBlogs = async (): Promise<Blog[]> => {
  const data = await client.get({
    endpoint: 'blog',
    queries: {
      limit: 3,
      fields: 'id,title,publishedAt,thumbnail,category',
    },
  })
  return data.contents
}

const getCategories = async (): Promise<Blog[]> => {
  const data = await client.get({
    endpoint: 'blog',
    queries: {
      limit: 100,
      // ★ category と url の両方を必ず取得する ★
      fields: 'id,title,publishedAt,thumbnail,category,url',
    },
  })
  return data.contents
}

const SideBar: React.FC<Props> = async () => {
  const [blogs, categories] = await Promise.all([getBlogs(), getCategories()])

  // カテゴリ名を正規化（小文字化）して重複を除外 → 表示用に整形
  // uniqueCategoryMap のキーは URL 用の値 (blog.url を小文字化したもの)
  const uniqueCategoryMap = new Map<string, { label: string; value: string }>()

  categories.forEach((blog) => {
    // ★ blog.category と blog.url の両方が存在することを確認 ★
    if (typeof blog.category === 'string' && typeof blog.url === 'string') {
      // ★ URL 用の値として blog.url を小文字化して使用 ★
      // microCMS の 'url' フィールドが既に URL に適した形式で登録されていることを想定していますが、
      // 念のため小文字に統一します。
      const categoryUrl = blog.url.toLowerCase()

      if (!uniqueCategoryMap.has(categoryUrl)) {
        uniqueCategoryMap.set(categoryUrl, {
          label: formatCategoryName(blog.category), // 表示用には blog.category を整形して使用
          value: categoryUrl, // ★ URL 用の値として blog.url を使用 ★
        })
      }
    }
  })

  const formattedCategories = Array.from(uniqueCategoryMap.values())

  return (
    <aside className="hidden xl:block w-80 space-y-6">
      {/* カテゴリー一覧 */}
      <section className="bg-white p-4 ">
        <h2 className="text-lg bg-gray-200 p-2 rounded-md font-semibold mb-3">
          カテゴリー
        </h2>
        <ul className="space-y-0 divide-y divide-gray-200 text-gray-700">
          {formattedCategories.map((category) => (
            <CategoryItem key={category.value} category={category} />
          ))}
        </ul>
      </section>

      {/* 最新記事 */}
      <section className="bg-white p-4 sticky -top-2">
        <h2 className="text-lg bg-gray-200 p-2 rounded-md font-semibold mb-3">
          最新記事
        </h2>
        <ul className="space-y-2">
          {blogs.map((blog) => (
            <LatestCard
              key={blog.id}
              blog={{
                id: blog.id,
                title: blog.title,
                publishedAt: blog.publishedAt ?? '',
                thumbnail: {
                  url: blog.thumbnail?.url || '', // thumbnail が undefined の可能性を考慮
                },
              }}
            />
          ))}
        </ul>
      </section>
    </aside>
  )
}

export default SideBar
