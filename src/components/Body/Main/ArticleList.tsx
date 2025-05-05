import { client } from '@/libs/client'
import type { Blog } from '@/types/blog'
import ArticleCard from '@/components/Body/Main/ArticleCard'

export const revalidate = 60;

const getPosts = async (): Promise<Blog[]> => {
  const data = await client.get({
    endpoint: 'blog',
    queries: {
      limit: 10,
      fields: 'id,title,publishedAt,thumbnail,category'
    },
  });
  return data.contents;
};

const ArticleList = async () => {
  const posts = await getPosts();

  return (
    <main className="max-w-4xl mx-auto px-4 py-9 w-full animate-fadeIn">
      <div className='flex-1 mx-4'>
        <h2 className="text-md font-bold mb-8">記事一覧</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          {posts.map((post) => (
            <ArticleCard
              key={post.id}
              blog={{
                category: post.category,
                id: post.id,
                thumbnail: {
                  url: post.thumbnail.url
                },
                title: post.title,
                publishedAt: post.publishedAt ?? '',
              }} />
          ))}
        </ul>
      </div>
    </main>
  );
};

export default ArticleList;
