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
          onClick={() => onReplyClick(comment.id, (index ?? 0) + 1, comment.name)}
          // ★ 変更: ml-1 を削除し、px-2 を追加して楕円を解消 ★
          // 垂直方向のパディング p-1 はそのままに、水平方向のパディングを px-2 にすることで、
          // アイコンとボタンの左右の余白を調整し、より真円に近づけます。
          // flex-row-reverse でアイコンを右に、テキストを左に配置しつつ、全体が真円になるように調整
          className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors flex items-center group flex-row-reverse"
        >
          {/* Replyアイコンからml-1を削除。アイコンとテキスト間のスペースはボタンのパディングで調整 */}
          <Reply className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
        </button>
      </div>
    </li>
  )
}

export default CommentItem
