import Link from 'next/link'
import Image from 'next/image'


interface Props {
  blog: {
    category: string,
    id: string
    thumbnail: {
      url: string
    }
    title: string
    publishedAt?: string;
  }
}

const ArticleCard = (props: Props): JSX.Element => {
  const { blog } = props;
  return (
    <Link
      key={blog.id}
      href={`blog/${blog.id}`}
      className="w-full border rounded-md shadow-sm hover:shadow-lg transition-shadow bg-white overflow-hidden flex p-0 relative mb-2 sm:w-auto animate-fadeIn"
    >
      <div className="flex flex-col sm:flex-row  w-full ">
        <div className="m-0 p-0 relative sm:w-64 sm:h-40 flex-shrink-0 w-full h-56">
          <Image
            src={blog.thumbnail.url}
            fill
            className="object-cover"
            alt="サムネ画像"
          />
        </div>
        <div className="flex-1 ">
          <h2 className=" text-lg font-semibold sm:mb-2 text-gray-700 p-5 mb-8">{blog.title}</h2>
          <p className="text-sm text-indigo-600 border border-indigo-600 rounded px-2 pt-[3px] pb-[2px]  absolute sm:left-72  left-6 bottom-3">
            {blog.category}
          </p>
          <p className="text-sm absolute sm:right-5 sm:pr-5 right-2 bottom-3 pr-3 text-gray-500">
            投稿日: {new Date(blog.publishedAt ?? '').toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ArticleCard
