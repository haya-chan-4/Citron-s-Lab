// app/blog/[id]/page.tsx
import { client } from '../../../libs/client';
import dayjs from 'dayjs';

// import { Blog } from '../../../types/blog'

// ブログ記事の型定義


// microCMSから特定の記事を取得
export const getBlogPost = async (id: string) => {
  const data = await client.get({
    endpoint: `blog/${id}`,
  })

  return data
}

// 記事詳細ページの生成
export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params; // IDを取得
  const post = await getBlogPost(id);

  // dayjsを使ってpublishedAtをYY.MM.DD形式に変換
  const formattedDate = dayjs(post.publishedAt).format('YY.MM.DD');

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1> {/* タイトルを表示 */}

      <div className="text-sm text-gray-500 mb-2">
        {formattedDate}
      </div> {/* 日付を表示 */}

      <div className="text-sm text-blue-600 mb-6">
        カテゴリー：{post.category && post.category.name}
      </div> {/* カテゴリーを表示 */}

      <div
        className="prose prose-sm md:prose-base prose-headings:font-semibold prose-img:rounded-lg prose-a:text-blue-600"
        dangerouslySetInnerHTML={{ __html: post.body }}
      /> {/* 記事本文を表示 */}
    </main>

  );
}

// 静的パスを生成
export async function generateStaticParams() {
  const contentIds = await client.getAllContentIds({ endpoint: 'blog' });

  return contentIds.map((contentId) => ({
    id: contentId, // 各記事のIDをパラメータとして返す
  }));
}
