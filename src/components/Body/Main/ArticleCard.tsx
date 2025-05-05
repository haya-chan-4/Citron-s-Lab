'use client';
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Clock4 } from 'lucide-react';
import React from 'react';



interface ArticleCardProps {
  blog: {
    id: string;
    category: string;
    title: string;
    publishedAt?: string;
    thumbnail: {
      url: string;
    };
  }
}

const ArticleCard = (props: ArticleCardProps): JSX.Element => {
  const { blog } = props
  const pathname = usePathname()
  const currentPathname = pathname
  return (
    <Link
      key={blog.id}
      href={
        currentPathname.startsWith('/blog/[id]')
          ? `/${blog.id}` // 現在閲覧中のカテゴリページの場合、IDのみ
          : `/blog/${blog.id}` // それ以外の場合、/blog/ID
      }
      className="w-full border rounded-md shadow-sm hover:shadow-lg transition-shadow bg-white overflow-hidden flex p-0 relative mb-2 sm:w-auto"
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
        <div className="grid grid-cols-1 w-full">
          <h2 className="grid-span-2 text-lg font-semibold text-gray-700 p-5 mg-8">
            {blog.title}
          </h2>
          <div className='grid text-lg text-gray-700 px-5 pb-4'>
            <span className="w-max h-min grid-item col-span-1 text-sm text-indigo-600 border border-indigo-600 rounded px-2 pt-[3px] pb-[2px] mb-2">
              {blog.category}
            </span>
            <time className="text-base text-gray-600 flex items-center">
              <Clock4 className="mr-2 size-4 text-gray-500" />
              {new Date(blog.publishedAt ?? '').toLocaleDateString()}
            </time>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default React.memo(ArticleCard);
