// app/blog/page.tsx
import MainContent from '@/components/Body/Main/MainContent';

export const revalidate = 60;


const BlogPage = async () => {

  return (
    <MainContent />
  );
};

export default BlogPage;
