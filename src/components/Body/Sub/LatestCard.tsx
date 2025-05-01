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

const LatestCard = (props: Props): JSX.Element => {
  const { blog } = props;
  return (
    <Link
      key={blog.id}
      href={`blog/${blog.id}`}
      className="w-full  rounded-md overflow-hidden flex p-0 relative mb-6 animate-fadeIn"
    >
      <div className="flex flex-col items-center w-full ">
        <div className="relative w-72 h-36 overflow-hidden rounded">
          <Image
            src={blog.thumbnail.url}
            className="object-cover rounded"
            alt="サムネ画像"
            width={300}
            height={166}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm justify-start flex items-start font-semibold text-gray-600 py-4">{blog.title}</p>
        </div>
      </div>
    </Link>
  )
}

export default LatestCard
