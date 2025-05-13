// src/components/Body/Main/MainContent.tsx
import ArticleSidebarLayout from '@/components/Layouts/ArticleSidebarLayout';
import ArticleList from './ArticleList';
import Pagination from './Pagination';
import type { Blog } from '@/types/blog';

interface MainContentProps {
  blogs: Blog[];
  totalCount: number;
  currentPage: number;
}

const MainContent = ({ blogs, totalCount, currentPage }: MainContentProps) => {
  return (
    <div>
      <ArticleSidebarLayout
        articleArea={<ArticleList blogs={blogs} />}
      />
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        basePath="/page"
      />
    </div>
  );
};

export default MainContent;
