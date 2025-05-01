import { client } from "@/libs/client";
import { Blog } from "@/types/blog";
import Link from "next/link";
import LatestCard from "./LatestCard";


type Props = object
const getBlogs = async (): Promise<Blog[]> => {
  const data = await client.get({
    endpoint: 'blog',
    queries: {
      limit: 3,
      fields: 'id,title,publishedAt,thumbnail'
    },
  });
  return data.contents;
};

const SideBar = async (props: Props): Promise<JSX.Element> => {
  const blogs = await getBlogs();
  const {} = props;
  return (
    <aside className="hidden lg:block w-80 space-y-6">
        {/* カテゴリー一覧 */}
        <section className="bg-white p-4 ">
          <h2 className="text-lg bg-gray-200 p-2 rounded-md font-semibold mb-3">カテゴリ</h2>
          <ul className="space-y-0 divide-y divide-gray-200 text-gray-700">
            <li className="py-2">
              <Link href="/blog?category=tech" className="hover:text-gray-900 pl-2">
                Tech
              </Link>
            </li>
            <li className="py-2">
              <Link href="/blog?category=design" className="hover:text-gray-900 pl-2">
                Design
              </Link>
            </li>
            <li className="py-2">
              <Link href="/blog?category=life" className="hover:text-gray-900 pl-2">
                Life
              </Link>
            </li>
            <li className="py-2">
              <Link href="/blog?category=career" className="hover:text-gray-900 pl-2">
                Career
              </Link>
            </li>
          </ul>
        </section>

        {/* 最新記事 */}
        <section className="bg-white p-4">
          <h2 className="text-lg bg-gray-200 p-2 rounded-md font-semibold mb-3">最新記事</h2>
          <ul className="space-y-2">
            {/* 例: thisMonthPosts.map */}
            {blogs.map((blog) => (
              <LatestCard
                key={blog.id}
                blog={{
                  id: blog.id,
                  thumbnail: {
                    url: blog.thumbnail.url
                  },
                  title: blog.title,
                  publishedAt: blog.publishedAt ?? ''
                }} />
            ))}
          </ul>
        </section>
      </aside>
  )
}

export default SideBar
