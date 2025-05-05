// app/blog/[id]/page.tsx
import { client } from '@/libs/client'
import { BlogPost } from "@/types/blogPost"
import SideBar from '@/components/Body/SideBar/SideBar'
import ArticleContent from '@/components/Body/Main/ArticleContent'


export const revalidate = 60
export const generateStaticParams = async () => {
  const ids = await client.getAllContentIds({ endpoint: 'blog' })
  return ids.map((id) => ({ id }))
}

const getBlogPost = async (id: string): Promise<BlogPost> => {
  return client.get({ endpoint: `blog/${id}` })
}

const BlogPostPage = async ({ params }: { params: { id: string } }) => {
  const post = await getBlogPost(params.id)

  return (
    <div className="flex flex-col lg:flex-row py-10 sm:px-4 md:px-24">
      {/* メインコンテンツ */}
      <ArticleContent post={post} />
      {/* サイドバー */}
      <SideBar />
    </div>
  )
}
export default BlogPostPage
