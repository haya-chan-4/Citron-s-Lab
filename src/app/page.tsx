// app/blog/page.tsx
import MainContent from '@/components/Body/Main/MainContent';
import { client } from '@/libs/client';
import type { Blog } from '@/types/blog';

export const revalidate = 60;


const PER_PAGE = 3;

// microCMS からページネーション用に記事＋総件数を取得
const getBlogs = async (offset = 0): Promise<{ blogs: Blog[]; totalCount: number }> => {
  const data = await client.get<{
    contents: Blog[];
    totalCount: number;
  }>({
    endpoint: 'blog',
    queries: {
      limit: PER_PAGE,
      offset,
      fields: 'id,title,publishedAt,thumbnail,category',
    },
  });
  return { blogs: data.contents, totalCount: data.totalCount };
};

const BlogPage = async (props: { currentPage: number; offset: number; }) => {
  const {currentPage, offset} = props
  // 1ページ目なので offset=0, currentPage=1
  // const currentPage = 1;
  // const offset = 0;

  const { blogs, totalCount } = await getBlogs(offset);

  return (
    <MainContent
      blogs={blogs}
      totalCount={totalCount}
      currentPage={currentPage}
    />
  );
};

export default BlogPage;
