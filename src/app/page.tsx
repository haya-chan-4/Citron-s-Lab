// app/blog/page.tsx
import MainContent from '@/components/Body/Main/MainContent';
import SideBar from '@/components/Body/SideBar/SideBar';

export const revalidate = 60;


const BlogPage = async () => {

  return (
    <div className='flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-4 gap-8 '>
      <MainContent />
      <SideBar />
    </div>
  );
};

export default BlogPage;
