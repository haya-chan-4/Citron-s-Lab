// src/components/Body/Main/MainContent.tsx
import SideBar from '@/components/Body/SideBar/SideBar'
import ArticleList from './ArticleList'
import Pagination from './Pagination'
import type { Blog } from '@/types/blog'

interface MainContentProps {
  blogs: Blog[]
  totalCount: number
  currentPage: number
}

const MainContent = ({ blogs, totalCount, currentPage }: MainContentProps) => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row py-10 sm:px-4 md:px-24">
        <ArticleList blogs={blogs} />
        <SideBar />
      </div>
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        basePath="/page"
      />
    </div>
  )
}

export default MainContent
