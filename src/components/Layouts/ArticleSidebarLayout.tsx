// src/components/Layouts/ArticleSidebarLayout.tsx
import React from 'react'
import SideBar from '@/components/Body/SideBar/SideBar' // SideBarのパスを調整

interface Props {
  articleArea: React.ReactNode // 記事リストや記事詳細コンテンツ
  // sidebarArea?: React.ReactNode; // 必要ならSideBarもPropsで渡す
}

const ArticleSidebarLayout: React.FC<Props> = ({ articleArea }) => {
  return (
    <div className="flex flex-col lg:flex-row md:py-10 sm:px-4 md:px-24">
      {articleArea}
      <SideBar /> {/* SideBarをここで固定、またはPropsで渡す */}
    </div>
  )
}

export default ArticleSidebarLayout
