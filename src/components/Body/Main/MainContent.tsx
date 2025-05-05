
import SideBar from '@/components/Body/SideBar/SideBar';
import ArticleList from './ArticleList';

const MainContent = () => {

  return (
    <div className='flex flex-col lg:flex-row py-10 sm:px-4 md:px-24'>
      <ArticleList />
      <SideBar />
    </div>
  );
};
export default MainContent;
