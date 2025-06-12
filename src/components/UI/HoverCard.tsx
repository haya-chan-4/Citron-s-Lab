// src/components/UI/HoverCard.tsx
import React, { useRef, useLayoutEffect } from 'react'
import { format } from 'date-fns'
import type { CommentWithReplyInfo } from '@/types/comment'
import { Reply } from 'lucide-react'

interface HoverCardProps {
  comment: CommentWithReplyInfo
  x: number
  y: number
  onReplyClick: (
    commentId: string,
    commentNumber: number,
    commentName: string,
  ) => void
  side?: 'left' | 'right'
}

const HoverCard = ({
  comment,
  x,
  y,
  onReplyClick,
  side = 'right',
}: HoverCardProps) => {
  const hoverCardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (hoverCardRef.current) {
      const cardWidth = hoverCardRef.current.offsetWidth
      const cardHeight = hoverCardRef.current.offsetHeight
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // --- Y座標の調整 (極力アンカーの上部に表示、画面上下にはみ出す場合は調整) ---
      let newTop = y - cardHeight - 10
      if (newTop < 0) {
        newTop = y + 20
      }
      if (y + cardHeight + 20 > screenHeight && newTop > y) {
        newTop = screenHeight - cardHeight - 10
        if (newTop < 0) newTop = 10
      }
      hoverCardRef.current.style.top = `${newTop}px`

      // --- X座標の調整 (side プロパティに基づいて左右を決定) ---
      let newLeft: number

      if (side === 'right') {
        newLeft = x + 10
        if (newLeft + cardWidth > screenWidth) {
          newLeft = x - cardWidth - 10
          if (newLeft < 0) newLeft = 10
        }
      } else {
        // side === 'left'
        newLeft = x - cardWidth - 10
        if (newLeft < 0) {
          newLeft = x + 10
          if (newLeft + cardWidth > screenWidth) {
            newLeft = screenWidth - cardWidth - 10
          }
        }
      }
      hoverCardRef.current.style.left = `${newLeft}px`
    }
  }, [x, y, side])

  return (
    <div
      ref={hoverCardRef}
      className="fixed bg-white text-popover-foreground border rounded-md shadow-lg p-5 z-[10000] max-w-xs min-w-[280px] pointer-events-none hover-card-container data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      style={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-gray-800 text-sm">
          {' '}
          {/* ★ text-sm を追加 ★ */}
          {`${comment.displayNumber}. `}
          {comment.name}
        </p>
        <time
          dateTime={comment.date.toISOString()}
          className="text-xs text-gray-400"
        >
          {format(comment.date, 'yyyy/MM/dd HH:mm')}
        </time>
      </div>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4 text-sm">
        {' '}
        {/* ★ text-sm を追加 ★ */}
        {comment.body}
      </p>
      <button
        onClick={() =>
          onReplyClick(comment.id, comment.displayNumber, comment.name)
        }
        className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors flex items-center group flex-row-reverse float-right"
        aria-label="返信する"
      >
        <Reply className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
      </button>
    </div>
  )
}

export default HoverCard
