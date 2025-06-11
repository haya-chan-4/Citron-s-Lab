// src/components/comments/CommentItem.tsx
'use client'
import React, { useState, useCallback } from 'react'
import DOMPurify from 'dompurify'
import { formatCommentBody } from '@/utils/format'
import { format } from 'date-fns'
import type { Comment } from '@/types/comment'
import { Reply } from 'lucide-react'
// HoverCardコンポーネントとその中の CommentWithReplyInfo 型をインポート
import HoverCard from '@/components/UI/HoverCard'

export interface CommentWithReplyInfo extends Comment {
  displayNumber: number
  repliedByNumbers: number[]
}

interface CommentItemProps {
  comment: CommentWithReplyInfo
  onReplyClick: (
    commentId: string,
    commentNumber: number,
    commentName: string,
  ) => void
  allComments: CommentWithReplyInfo[] // 全てのコメントデータを受け取る
}

const CommentItem = ({
  comment,
  onReplyClick,
  allComments,
}: CommentItemProps) => {
  const displayCommentNumber = comment.displayNumber

  const [hoveredCommentData, setHoveredCommentData] =
    useState<CommentWithReplyInfo | null>(null)
  const [hoverCardPosition, setHoverCardPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const findCommentByNumber = useCallback(
    (number: number): CommentWithReplyInfo | undefined => {
      return allComments.find((c) => c.displayNumber === number)
    },
    [allComments],
  )

  const handleAnchorMouseEnter = useCallback(
    (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      commentNumber: number,
    ) => {
      const targetComment = findCommentByNumber(commentNumber)
      if (targetComment) {
        setHoveredCommentData(targetComment)
        setHoverCardPosition({ x: event.clientX, y: event.clientY }) // ホバーカード側で調整するため、ここでは生のマウス座標を渡す
      }
    },
    [findCommentByNumber],
  )

  const handleAnchorMouseLeave = useCallback(() => {
    setHoveredCommentData(null)
    setHoverCardPosition(null)
  }, [])

  const handleRepliedByMouseEnter = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      repliedByCommentNumber: number,
    ) => {
      const targetComment = findCommentByNumber(repliedByCommentNumber)
      if (targetComment) {
        setHoveredCommentData(targetComment)
        setHoverCardPosition({ x: event.clientX, y: event.clientY }) // ホバーカード側で調整するため、ここでは生のマウス座標を渡す
      }
    },
    [findCommentByNumber],
  )

  const handleRepliedByMouseLeave = useCallback(() => {
    setHoveredCommentData(null)
    setHoverCardPosition(null)
  }, [])

  return (
    <li className="bg-white" id={`comment-${displayCommentNumber}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-gray-800">
          {`${displayCommentNumber}. `}
          {comment.name}
        </p>
        <div className="flex items-center space-x-2">
          <time
            dateTime={comment.date.toISOString()}
            className="text-xs text-gray-400"
          >
            {format(comment.date, 'yyyy/MM/dd HH:mm')}
          </time>
          <button
            onClick={() =>
              onReplyClick(comment.id, displayCommentNumber, comment.name)
            }
            className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors flex items-center group flex-row-reverse"
            aria-label="返信する"
          >
            <Reply className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>
      </div>

      <div className="relative flex justify-between items-start w-full">
        <p
          className="text-gray-700 leading-relaxed whitespace-pre-line flex-grow"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              formatCommentBody(comment.body).replace(
                />>(\d+)/g,
                (match, p1) => {
                  const num = parseInt(p1, 10)
                  return `<a href="#comment-${num}" class="text-blue-500 hover:underline font-bold"
                           data-comment-number="${num}"
                           data-type="mention"
                           >${match}</a>`
                },
              ),
              { ADD_ATTR: ['target', 'data-comment-number', 'data-type'] },
            ),
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement
            const anchor = target.closest(
              'a:not([href="#"])',
            ) as HTMLAnchorElement | null
            if (
              anchor?.dataset.commentNumber &&
              anchor.dataset.type === 'mention'
            ) {
              const commentNum = parseInt(anchor.dataset.commentNumber, 10)
              if (!isNaN(commentNum)) {
                handleAnchorMouseEnter(e, commentNum)
              }
            }
          }}
          onMouseLeave={handleAnchorMouseLeave}
        />
      </div>

      {comment.repliedByNumbers.length > 0 && (
        <div className="flex justify-end mt-4 space-x-2 w-full">
          {comment.repliedByNumbers.map((replyingNum) => (
            <a
              key={replyingNum}
              href={`#comment-${replyingNum}`}
              className="text-blue-500 hover:underline text-xs"
              onMouseEnter={(e) => handleRepliedByMouseEnter(e, replyingNum)}
              onMouseLeave={handleRepliedByMouseLeave}
            >
              ※{replyingNum}
            </a>
          ))}
        </div>
      )}

      {hoveredCommentData && hoverCardPosition && (
        <HoverCard
          comment={hoveredCommentData}
          x={hoverCardPosition.x}
          y={hoverCardPosition.y}
          onReplyClick={onReplyClick} // ★ 追加: 返信ハンドラをHoverCardに渡す ★
        />
      )}
    </li>
  )
}

export default CommentItem
