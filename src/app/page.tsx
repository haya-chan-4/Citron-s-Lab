import { client } from '../libs/client'
import type { Blog } from '../types/blog'
import ArticleCard from '../components/Body/Main/ArticleCard'

export const revalidate = 60;

const getBlogs = async (): Promise<Blog[]> => {
  const data = await client.get({
    endpoint: 'blog',
    queries: {
      limit: 10,
      fields: 'id,title,publishedAt,thumbnail'
    },
  });
  return data.contents;
};

const BlogPage = async () => {
  const blogs = await getBlogs();

  return (
    <main className="max-w-4xl mx-auto px-4 py-9 w-full ">
      <h1 className="text-md font-bold mb-8">記事一覧</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {blogs.map((blog) => (
          <ArticleCard
            key={blog.id}
            blog={{
              id: blog.id,
              thumbnail: {
                url: blog.thumbnail.url
              },
              title: blog.title,
              publishedAt: blog.publishedAt ?? ''
            }} />
        ))}
      </ul>
    </main>
  );
};

export default BlogPage;
