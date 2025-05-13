// app/page/[id]/page.tsx
import MainContent from '@/components/Body/Main/MainContent'
import { client } from '@/libs/client'
import type { Blog } from '@/types/blog'
import { notFound } from 'next/navigation'
import { PER_PAGE } from '@/constants/pagination'

const perPage = PER_PAGE

async function getBlogs(offset: number) {
  const data = await client.get<{
    contents: Blog[]
    totalCount: number
  }>({
    endpoint: 'blog',
    queries: {
      limit: perPage,
      offset,
      fields: 'id,title,publishedAt,thumbnail,category',
    },
  })
  return { blogs: data.contents, totalCount: data.totalCount }
}

export default async function Page({ params }: { params: { id: string } }) {
  const currentPage = parseInt(params.id, 10)
  if (isNaN(currentPage) || currentPage < 1) return notFound()

  const offset = (currentPage - 1) * perPage

  let blogs: Blog[]
  let totalCount: number
  try {
    const res = await getBlogs(offset)
    blogs = res.blogs
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
