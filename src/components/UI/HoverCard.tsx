// src/components/UI/HoverCard.tsx
'use client'

import React from 'react'
// import type { Comment } from '@/types/comment'; // ★ この行を削除します ★
import DOMPurify from 'dompurify'
import { formatCommentBody } from '@/utils/format'
import { format } from 'date-fns'
import { Reply } from 'lucide-react'

import type { CommentWithReplyInfo } from '@/components/Comment/CommentItem' // こちらの型は引き続き必要

interface HoverCardProps {
  comment: CommentWithReplyInfo
  x: number
  y: number
  onReplyClick?: (
    commentId: string,
    commentNumber: number,
    commentName: string,
  ) => void
}

const HoverCard: React.FC<HoverCardProps> = ({
  comment,
  x,
  y,
  onReplyClick,
}) => {
  const displayCommentNumber = comment.displayNumber

  const style: React.CSSProperties = {
    position: 'fixed',
    top: y,
    left: x + 10,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 9999,
    maxWidth: '350px',
    minWidth: '250px',
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
    opacity: 1,
    transform: 'translateY(-100%)',
    transformOrigin: 'bottom left',
  }

  const hoverCardRef = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    if (hoverCardRef.current && y) {
      hoverCardRef.current.style.top = `${y - hoverCardRef.current.offsetHeight - 10}px`
    }
  }, [comment, x, y])

  return (
    <div ref={hoverCardRef} style={style}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-gray-800 break-words">
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
          {onReplyClick && (
            <button
              onClick={() =>
                onReplyClick(comment.id, displayCommentNumber, comment.name)
              }
              className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors flex items-center group flex-row-reverse"
              aria-label={`返信する (コメント ${displayCommentNumber})`}
            >
              <Reply className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
            </button>
          )}
        </div>
      </div>

      <div
        className="text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words mb-2"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(formatCommentBody(comment.body)),
        }}
      />

      {comment.repliedByNumbers.length > 0 && (
        <div className="flex justify-end mt-2 space-x-2 w-full">
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
    </div>
  )
}

export default HoverCard
