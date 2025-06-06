// src/components/Body/Main/CategoryList.tsx
import ArticleCard from '@/components/Body/Main/ArticleCard'
import LocationOfPage from './LocationOfPage'
import type { Blog } from '@/types/blog' // Blog 型をインポート

export interface CategoryListProps {
  blogs: Blog[]
  categoryId: string
}

const CategoryList: React.FC<CategoryListProps> = ({ blogs, categoryId }) => {
  const displayCategoryName = blogs.length > 0 ? blogs[0].category : categoryId

  return (
    <main className="max-w-4xl mx-auto px-4 py-9 w-full">
      <div className="flex-1">
        <LocationOfPage
          category={displayCategoryName} // 表示用テキスト
          categoryUrlId={categoryId}
          page={'記事一覧'}
        />
        <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          {blogs.map((post) => (
            <li key={post.id}>
              <ArticleCard
                blog={{
                  id: post.id,
                  category: post.category ?? '',
                  title: post.title,
                  publishedAt: post.publishedAt,
                  thumbnail: { url: post.thumbnail.url },
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default CategoryList
