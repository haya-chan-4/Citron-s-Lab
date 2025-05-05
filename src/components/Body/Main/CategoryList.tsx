import ArticleCard from '@/components/Body/Main/ArticleCard';

interface Blog {
  id: string;
  category?: string;
  title: string;
  publishedAt: string;
  thumbnail: {
    url: string;
  };
}

interface CategoryListProps {
  blog: Blog[];
}

const CategoryList = ({ blog }: CategoryListProps) => {
  return (
    <main className='max-w-4xl mx-auto px-4 py-9 w-full'>
      <h2 className="text-md font-bold mb-8">記事一覧</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {blog.map((post) => (
          <li key={post.id}>
            <ArticleCard blog={{
              id: post.id,
              category: post.category ?? '',
              title: post.title,
              publishedAt: post.publishedAt ?? '',
              thumbnail: {
                url: post.thumbnail.url
              }
            }} />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default CategoryList;
