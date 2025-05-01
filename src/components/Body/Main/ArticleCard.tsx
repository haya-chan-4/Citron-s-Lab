import Link from 'next/link'
import Image from 'next/image'


interface Props {
  blog: {
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
      className="w-full border rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden flex p-0 relative mb-6 sm:w-auto animate-fadeIn"
    >
      <div className="flex flex-col sm:flex-row items-center w-full ">
        <div className="m-0 p-0 relative sm:w-64 sm:h-40 flex-shrink-0 w-full h-56">
          <Image
            src={blog.thumbnail.url}
            fill
            className="object-cover"
            alt="サムネ画像"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold sm:mb-2 text-teal-800 p-5 mb-6">{blog.title}</h2>
        </div>
        <p className="text-sm absolute sm:right-5 sm:pr-5 right-2 bottom-3 pr-0  text-gray-500">
          投稿日: {new Date(blog.publishedAt ?? '').toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}

export default ArticleCard
