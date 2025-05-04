// app/blog/[id]/page.tsx
import { client } from '@/libs/client'
import { BlogPost } from "@/types/blogPost"
import Image from 'next/image'
// import Link from 'next/link'
// import Comment from '@/components/Comment/Comment'
import SideBar from '@/components/Body/SideBar/SideBar'
import MetaInfo from '@/components/Body/Main/MetaInfo'
import LocationOfPage from '@/components/Body/Main/LocationOfPage'


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
    <main className="flex flex-col lg:flex-row max-w-screen-xl gap-8 py-10 sm:px-4 md:px-24 lg:pl-24">
      {/* メインコンテンツ */}
      <article className="flex-1 animate-fadeIn mx-4">
        {/* パンくず */}
        <LocationOfPage category={post.category} />
        {/* アイキャッチ画像 */}
        {post.thumbnail?.url && (
          <div className="relative aspect-video mb-6 rounded-md overflow-hidden shadow-sm">
            <Image
              src={post.thumbnail.url}
              alt={post.title}
              className="object-cover"
              fill
            />
          </div>
        )}

        {/* タイトル */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800  sm:w-full">
          {post.title}
        </h1>

        {/* メタ情報 */}
        <MetaInfo publishedAt={post.publishedAt} category={post.category} />

        {/* 本文 */}
        <div className="prose max-w-full prose-sm md:prose-lg prose-headings:font-semibold prose-img:rounded-sm prose-a:text-blue-600 sm:w-full ">
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>
        {/* <Comment blogId={''} /> */}
      </article>
      {/* サイドバー */}
      <SideBar />
    </main>
  )
}
export default BlogPostPage
