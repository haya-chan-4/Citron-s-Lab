import { client } from "@/libs/client";
import { Blog } from "@/types/blog";
import LatestCard from "./LatestCard";
import CategoryItem from "./CategoryItem";


type Props = object
const getBlogs = async (): Promise<Blog[]> => {
  const data = await client.get({
    endpoint: 'blog',
    queries: {
      limit: 3,
      fields: 'id,title,publishedAt,thumbnail,category'
    },
  });
  return data.contents;
};
const getCategories = async (): Promise<Blog[]> => {
  const data = await client.get({
    endpoint: 'blog',
    queries: {
      limit: 100,
      fields: 'id,title,publishedAt,thumbnail,category'
    },
  });
  return data.contents;
};

const SideBar: React.FC<Props> = async () => {
  const [blogs, categories] = await Promise.all([
    getBlogs(),
    getCategories()
  ])

  return (
    <aside className="hidden lg:block w-80 space-y-6">
      {/* カテゴリー一覧 */}
      <section className="bg-white p-4 ">
        <h2 className="text-lg bg-gray-200 p-2 rounded-md font-semibold mb-3">カテゴリ</h2>
        <ul className="space-y-0 divide-y divide-gray-200 text-gray-700">
          {categories.map((blog) => (
            <CategoryItem
              key={blog.id}
              category={blog.category}
            />
          ))}
        </ul>
      </section>

      {/* 最新記事 */}
      <section className="bg-white p-4">
        <h2 className="text-lg bg-gray-200 p-2 rounded-md font-semibold mb-3">最新記事</h2>
        <ul className="space-y-2">
          {/* 例: thisMonthPosts.map */}
          {blogs.map((blog) => (
            <LatestCard
              key={blog.id}
              blog={{
                id: blog.id,
                title: blog.title,
                publishedAt: blog.publishedAt ?? '',
                thumbnail: {
                  url: blog.thumbnail.url
                },
              }} />
          ))}
        </ul>
      </section>
    </aside>
  )
}

export default SideBar
