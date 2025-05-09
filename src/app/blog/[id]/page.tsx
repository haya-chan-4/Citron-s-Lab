// app/blog/[id]/page.tsx
import { client } from '@/libs/client'
import { BlogPost } from "@/types/blogPost"
import SideBar from '@/components/Body/SideBar/SideBar'
import Comment from '@/components/Comment/Comment'
import ArticleContent from '@/components/Body/Main/ArticleContent'
export const revalidate = 60
export const generateStaticParams = async () => {
  const ids = await client.getAllContentIds({ endpoint: 'blog' })
  return ids.map((id) => ({ id }))
}

const getBlogPost = async (id: string): Promise<BlogPost> => {
  const data = await client.get({
    endpoint: 'blog',
    contentId: id,
  });
  return data;
}

const BlogPostPage = async ({ params }: { params: { id: string } }) => {
  const post = await getBlogPost(params.id)

  return (
    <div>
      <div className="flex flex-col lg:flex-row py-10 sm:px-4 md:px-24">
        {/* メインコンテンツ */}
        <ArticleContent post={post} />
        {/* サイドバー */}
        <SideBar />
      </div>
      <div className="mt-12 flex justify-center pt-20">
        <div className="w-full max-w-6xl border">  {/* ここの max-w-? はお好みで調整 */}

        </div>
      </div>
      <div className="mt-12 flex justify-center pb-20">
        <div className="w-full max-w-3xl">  {/* ここの max-w-? はお好みで調整 */}
          <Comment blogId={post.id} />
        </div>
      </div>
    </div>
  )
}
export default BlogPostPage
