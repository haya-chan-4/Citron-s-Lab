// app/blog/[id]/page.tsx
import LatestCard from '@/components/Body/Sub/LatestCard';
import { client } from '@/libs/client';
import { Blog } from '@/types/blog';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  publishedAt: string;
  category?: { name: string };
  thumbnail?: { url: string; width: number; height: number };
  body: string;
};

export const revalidate = 60;
export async function generateStaticParams() {
  const ids = await client.getAllContentIds({ endpoint: 'blog' });
  return ids.map((id) => ({ id }));
}

async function getBlogPost(id: string): Promise<BlogPost> {
  return client.get({ endpoint: `blog/${id}` });
}

const getBlogs = async (): Promise<Blog[]> => {
  const data = await client.get({
    endpoint: 'blog',
    queries: {
      limit: 3,
      fields: 'id,title,publishedAt,thumbnail'
    },
  });
  return data.contents;
};

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getBlogPost(params.id);
  const formattedDate = dayjs(post.publishedAt).format('YYYY.MM.DD');

  const blogs = await getBlogs();


  return (
    <main className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-10 gap-8 animate-fadeIn">
      {/* メインコンテンツ */}
      <article className="flex-1">
        {/* パンくず */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:underline">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:underline">
            ブログ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{post.title}</span>
        </nav>

        {/* アイキャッチ画像 */}
        {post.thumbnail?.url && (
          <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.thumbnail.url}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* タイトル */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {post.title}
        </h1>

        {/* メタ情報 */}
        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8 space-x-4">
          <span>{formattedDate}</span>
          {post.category && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {post.category.name}
            </span>
          )}
          <span className="flex items-center space-x-2">
            {/* <BsTwitter /> <BsFacebook /> <BsHatena /> */}
          </span>
        </div>

        {/* 本文 */}
        <div className="prose prose-sm md:prose-lg prose-headings:font-semibold prose-img:rounded-lg prose-a:text-blue-600">
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>
      </article>

      {/* サイドバー */}
      <aside className="hidden lg:block w-80 space-y-6">
        {/* カテゴリー一覧 */}
        <section className="bg-white p-4 ">
          <h2 className="text-lg bg-gray-200 p-2 rounded-md font-semibold mb-3">カテゴリ</h2>
          <ul className="space-y-0 divide-y divide-gray-200 text-gray-700">
            <li className="py-2">
              <Link href="/blog?category=tech" className="hover:text-gray-900">
                Tech
              </Link>
            </li>
            <li className="py-2">
              <Link href="/blog?category=design" className="hover:text-gray-900">
                Design
              </Link>
            </li>
            <li className="py-2">
              <Link href="/blog?category=life" className="hover:text-gray-900">
                Life
              </Link>
            </li>
            <li className="py-2">
              <Link href="/blog?category=career" className="hover:text-gray-900">
                Career
              </Link>
            </li>
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
                  thumbnail: {
                    url: blog.thumbnail.url
                  },
                  title: blog.title,
                  publishedAt: blog.publishedAt ?? ''
                }} />
            ))}
          </ul>
        </section>
      </aside>
    </main>
  );
}
