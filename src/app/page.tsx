import Link from 'next/link'
import Image from 'next/image'
import { client } from '../libs/client'
import type { Blog } from '../types/blog'; // 必要なら型も使ってください
// import Header from '@/components/header/Header';

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
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-md font-bold mb-8">ブログ一覧</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-1 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`blog/${blog.id}`}
            className="w-full border rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden flex p-0 relative"
          >
            <div className="flex flex-col sm:flex-row items-center w-full">
              <div className="m-0 p-0 relative sm:w-64 sm:h-40 flex-shrink-0 w-full h-56">
                <Image
                  src={blog.thumbnail.url}
                  fill
                  className="object-cover"
                  alt="サムネ画像"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold sm:mb-2 text-teal-800 p-5 mb-6">{blog.title}</h2>
              </div>
              <p className="text-sm absolute sm:right-5 sm:pr-5 right-2 bottom-3 pr-0  text-gray-500">
                投稿日: {new Date(blog.publishedAt ?? '').toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </ul>
    </main>
  );
};

export default BlogPage;
