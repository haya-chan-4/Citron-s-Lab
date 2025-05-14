// src/components/Body/Main/ArticleCard.tsx
'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock4 } from 'lucide-react'
import DateFormatter from '@/components/UI/DateFormatter'
import CategoryDisplay from '@/components/UI/CategoryDisplay';

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
  const articleLinkHref = `/blog/${blog.id}`

  return (
    <Link
      href={articleLinkHref}
      className="w-full flex p-0 relative mb-2 sm:w-auto card-base"
    >
      <div className="flex flex-col sm:flex-row  w-full ">
        <div className="m-0 p-0 relative sm:w-72 lg:h-full lg:min-h-40 flex-shrink-0 w-full h-52">
        <Image
            src={blog.thumbnail.url}
            fill
            className="object-cover"
            alt="サムネ画像"
            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 72px, 33vw"
          />
        </div>
        <div className="grid grid-cols-1 w-full">
          <h2 className="grid-span-2 text-lg font-semibold text-gray-700 p-5 mg-8">
            {blog.title}
          </h2>
          <div className='grid text-lg text-gray-700 px-5 pb-4'>
            {blog.category && <CategoryDisplay categoryId={blog.category} styleType="tag" />}
            <time className="text-base text-gray-600 flex items-center">
              <Clock4 className="mr-2 size-4 text-gray-500" />
              {blog.publishedAt && <DateFormatter dateString={blog.publishedAt} />}
            </time>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default React.memo(ArticleCard);
