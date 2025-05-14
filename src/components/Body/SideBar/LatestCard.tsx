// src/components/Body/SideBar/LatestCard.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface Props {
  blog: {
    id: string
    thumbnail: {
      url: string
    }
    title: string
    publishedAt?: string
  }
}

const LatestCard: React.FC<Props> = (props) => {
  const { blog } = props
  const pathname = usePathname()
  const currentPathname = pathname

  return (
    <Link
      key={blog.id}
      href={
        currentPathname.startsWith('/blog/[id]')
          ? `/${blog.id}` // 現在閲覧中の記事ページの場合、IDのみ
          : `/blog/${blog.id}` // それ以外の場合、/blog/ID
      }
      className="w-full rounded-md overflow-hidden flex p-0 relative mb-6"
    >
      <div className="flex flex-col w-full">
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
          <p className="text-sm justify-start flex items-start font-semibold text-gray-600 py-4">
            {blog.title}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default LatestCard
