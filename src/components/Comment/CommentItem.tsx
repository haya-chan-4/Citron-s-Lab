// src/components/Comment/CommentItem.tsx
'use client'
import React from 'react'
import DOMPurify from 'dompurify'
import { formatCommentBody } from '@/utils/format'
import { format } from 'date-fns'
import type { Comment } from '@/types/comment'
// import { useComments } from '@/hooks/useComments' // ★ 削除: 'useComments' は使用されていないためインポートを削除 ★
import { Reply } from 'lucide-react'

interface CommentWithReplyInfo extends Comment {
  displayNumber: number
  repliedByNumbers: number[]
}

interface CommentItemProps {
  comment: CommentWithReplyInfo
  // blogId: string // ★ 削除: 'blogId' は使用されていないためプロパティを削除 ★
  onReplyClick: (
    commentId: string,
    commentNumber: number,
    commentName: string,
  ) => void
}

const CommentItem = ({
  comment,
  // blogId, // ★ 削除: 'blogId' は使用されていないため引数から削除 ★
  onReplyClick,
}: CommentItemProps) => {
  // const { addCommentLocally } = useComments(blogId); // 以前の修正で削除済みなのでコメントアウトを外す

  const displayCommentNumber = comment.displayNumber

  return (
    <li className="bg-white py-10" id={`comment-${displayCommentNumber}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-gray-800">
          {`${displayCommentNumber}. `}
          {comment.name}
        </p>
        <time
          dateTime={comment.date.toISOString()}
          className="text-xs text-gray-400"
        >
          {format(comment.date, 'yyyy/MM/dd HH:mm')}
        </time>
      </div>

      <div className="flex justify-between items-start w-full">
        <p
          className="text-gray-700 leading-relaxed whitespace-pre-line flex-grow"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(formatCommentBody(comment.body), {
              ADD_ATTR: ['target'],
            }),
          }}
        />

        <div className="flex flex-col items-end ml-4">
          <button
            onClick={() =>
              onReplyClick(comment.id, displayCommentNumber, comment.name)
            }
            className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors flex items-center group flex-row-reverse"
          >
            <Reply className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>
      </div>

      {comment.repliedByNumbers.length > 0 && (
        <div className="flex justify-end mt-4 space-x-2 w-full">
          {comment.repliedByNumbers.map((replyingNum) => (
            <a
              key={replyingNum}
              href={`#comment-${replyingNum}`}
              className="text-blue-500 hover:underline text-xs"
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById(`comment-${replyingNum}`)
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              ※{replyingNum}
            </a>
          ))}
        </div>
      )}
    </li>
  )
}

export default CommentItem
