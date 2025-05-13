// src/components/Body/SideBar/SideBar.tsx
import { client } from "@/libs/client";
import { Blog } from "@/types/blog";
import LatestCard from "./LatestCard";
import CategoryItem from "./CategoryItem";
import { formatCategoryName } from '@/utils/format'

type Props = object;


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
  ]);

  // カテゴリ名を正規化（小文字化）して重複を除外 → 表示用に整形
  // normalized: 小文字（URL用）
  // label: 表示用（頭文字大文字）
  const uniqueCategoryMap = new Map<string, { label: string; value: string }>();

  categories.forEach((blog) => {
    if (typeof blog.category === 'string') {
      const normalized = blog.category.toLowerCase();
      if (!uniqueCategoryMap.has(normalized)) {
        uniqueCategoryMap.set(normalized, {
          label: formatCategoryName(blog.category), // 表示用
          value: normalized,                        // URL用
        });
      }
    }
  });

  const formattedCategories = Array.from(uniqueCategoryMap.values());

  return (
    <aside className="hidden xl:block w-80 space-y-6">
      {/* カテゴリー一覧 */}
      <section className="bg-white p-4 ">
        <h2 className="text-lg bg-gray-200 p-2 rounded-md font-semibold mb-3">カテゴリー</h2>
        <ul className="space-y-0 divide-y divide-gray-200 text-gray-700">
          {formattedCategories.map((category) => (
            <CategoryItem key={category.value} category={category} />
          ))}
        </ul>
      </section>

      {/* 最新記事 */}
      <section className="bg-white p-4">
        <h2 className="text-lg bg-gray-200 p-2 rounded-md font-semibold mb-3">最新記事</h2>
        <ul className="space-y-2">
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
              }}
            />
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default SideBar;
