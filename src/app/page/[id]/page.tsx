// app/page/[id]/page.tsx
import MainContent from '@/components/Body/Main/MainContent'
import type { Blog } from '@/types/blog'
import { notFound } from 'next/navigation'
import { getPaginatedBlogs } from '@/libs/api'
import { getPaginationParams } from '@/utils/pagination'

const Page = async ({ params }: { params: { id: string } }) => {
  const { currentPage, offset } = getPaginationParams({ pageParam: params.id })

  if (isNaN(currentPage) || currentPage < 1) return notFound()

  let blogs: Blog[]
  let totalCount: number
  try {
    const res = await getPaginatedBlogs({ endpoint: 'blog', offset })
    blogs = res.blogs // getPaginatedBlogs の返り値に合わせて修正
    totalCount = res.totalCount
  } catch (e) {
    console.error(e)
    return notFound()
  }

  return (
    <MainContent
      blogs={blogs}
      totalCount={totalCount}
      currentPage={currentPage}
    />
  )
}
export default Page
