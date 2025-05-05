import Image from 'next/image';
import LocationOfPage from '@/components/Body/Main/LocationOfPage';
import MetaInfo from '@/components/Body/Main/MetaInfo';

interface ArticleContentProps {
  post: {
    category: string;
    thumbnail?: { url: string };
    title: string;
    publishedAt: string;
    body: string;
  };
}

const ArticleContent = ({ post }: ArticleContentProps): JSX.Element => {
  return (
    <article className="flex-1 animate-fadeIn w-full max-w-4xl px-4 xl:px-0 ">
      {/* パンくず */}
      <LocationOfPage category={post.category} />
      {/* アイキャッチ画像 */}
      {post.thumbnail?.url && (
        <div className="relative aspect-video mb-6 rounded-md overflow-hidden shadow-sm">
          <Image
            src={post.thumbnail.url}
            alt={post.title}
            className="object-cover"
            fill
          />
        </div>
      )}

      {/* タイトル */}
      <h1 className="text-3xl font-bold mb-4 text-gray-800  sm:w-full">
        {post.title}
      </h1>

      {/* メタ情報 */}
      <MetaInfo publishedAt={post.publishedAt} category={post.category} />

      {/* 本文 */}
      <div className="prose max-w-full prose-sm md:prose-lg prose-headings:font-semibold prose-img:rounded-sm prose-a:text-blue-600 sm:w-full ">
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </article>
  );
};

export default ArticleContent;
