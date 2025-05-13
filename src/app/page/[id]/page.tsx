// app/page/[id]/page.tsx
import MainContent from '@/components/Body/Main/MainContent'
import type { Blog } from '@/types/blog'
import { notFound } from 'next/navigation'
import { PER_PAGE } from '@/constants/pagination'
import { getPaginatedBlogs } from '@/libs/api'

export default async function Page({ params }: { params: { id: string } }) {
  const currentPage = parseInt(params.id, 10);
  if (isNaN(currentPage) || currentPage < 1) return notFound();

  const offset = (currentPage - 1) * PER_PAGE

  let blogs: Blog[];
  let totalCount: number;
  try {
    // 共通関数を使用
    const res = await getPaginatedBlogs({ endpoint: 'blog', offset });
    blogs = res.blogs;
    totalCount = res.totalCount;
  } catch (e) {
    console.error(e);
    return notFound();
  }

  return (
    <MainContent
      blogs={blogs}
      totalCount={totalCount}
      currentPage={currentPage}
    />
  );
}
