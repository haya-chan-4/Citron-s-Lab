// src/components/comments/CommentItem.tsx
'use client'
import React from 'react'
import DOMPurify from 'dompurify'
import { linkifyText } from '@/utils/format'
import { format } from 'date-fns'
import type { Comment} from '@/types/comment'
import { useComments } from '@/hooks/useComments'
import { Reply } from 'lucide-react'

interface CommentItemProps {
  comment: Comment
  blogId: string
  index?: number
  // ★ 変更: onReplyClick の型定義に commentName を追加 ★
  onReplyClick: (commentId: string, commentNumber: number, commentName: string) => void
}

const CommentItem = ({
  comment,
  blogId,
  index,
  onReplyClick,
}: CommentItemProps) => {
  const { addCommentLocally } = useComments(blogId)

  return (
    <li className="bg-white py-10">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-gray-800">
          {typeof index === 'number' && `${index + 1}. `}
          {comment.name}
        </p>
        <time
          dateTime={comment.date.toISOString()}
          className="text-xs text-gray-400"
        >
          {format(comment.date, 'yyyy/MM/dd HH:mm')}
        </time>
      </div>

      <div className="flex justify-between items-end w-full">
        <p
          className="text-gray-700 leading-relaxed whitespace-pre-line flex-grow"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(linkifyText(comment.body), {
              ADD_ATTR: ['target'],
            }),
          }}
        />

        <button
          // ★ 変更: onReplyClick に comment.name を渡す ★
          onClick={() => onReplyClick(comment.id, (index ?? 0) + 1, comment.name)}
          className="text-gray-600 hover:underline flex items-center group flex-row-reverse ml-4"
        >
          <Reply className="w-4 h-4 ml-1 text-gray-600 group-hover:text-gray-800" />
        </button>
      </div>
    </li>
  )
}

export default CommentItem
