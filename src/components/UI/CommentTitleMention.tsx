// src/components/UI/CommentTitleMention.tsx
'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import HoverCard from '@/components/UI/HoverCard' // HoverCard をインポート
import type { CommentWithReplyInfo } from '@/types/comment' // 型をインポート

interface CommentTitleMentionProps {
  commentNumber: number
  commentName: string
  allComments: CommentWithReplyInfo[]
  onReplyClick: (
    commentId: string,
    commentNumber: number,
    commentName: string,
  ) => void
}

const CommentTitleMention = ({
  commentNumber,
  commentName,
  allComments,
  onReplyClick,
}: CommentTitleMentionProps) => {
  const mentionRef = useRef<HTMLAnchorElement>(null) // <a> タグへの参照
  const [hoveredCommentData, setHoveredCommentData] =
    useState<CommentWithReplyInfo | null>(null)
  const [hoverCardPosition, setHoverCardPosition] = useState<{
    x: number
    y: number
    side: 'left' | 'right'
  } | null>(null)

  const findCommentByNumber = useCallback(
    (num: number): CommentWithReplyInfo | undefined => {
      return allComments.find((c) => c.displayNumber === num)
    },
    [allComments],
  )

  const showHoverCard = useCallback(
    (e: MouseEvent, num: number, displaySide: 'left' | 'right') => {
      const targetComment = findCommentByNumber(num)
      if (targetComment) {
        setHoveredCommentData(targetComment)
        setHoverCardPosition({ x: e.clientX, y: e.clientY, side: displaySide })
      }
    },
    [findCommentByNumber],
  )

  const hideHoverCard = useCallback(() => {
    setHoveredCommentData(null)
    setHoverCardPosition(null)
  }, [])

  // スクロールイベントリスナー（ホバーカード非表示用）
  const handleScroll = useCallback(() => {
    if (hoveredCommentData) {
      setHoveredCommentData(null)
      setHoverCardPosition(null)
    }
  }, [hoveredCommentData])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // ネイティブイベントリスナーの設定
  useEffect(() => {
    const anchorElement = mentionRef.current
    if (!anchorElement) return

    const handleMouseEnter = (e: MouseEvent) => {
      // フォームタイトルのメンションは常に右側に表示
      showHoverCard(e, commentNumber, 'right')
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null
      // ホバーカード自体に移動した場合は非表示にしない
      if (!relatedTarget || !relatedTarget.closest('.hover-card-container')) {
        hideHoverCard()
      }
    }

    anchorElement.addEventListener('mouseenter', handleMouseEnter)
    anchorElement.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      anchorElement.removeEventListener('mouseenter', handleMouseEnter)
      anchorElement.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [commentNumber, showHoverCard, hideHoverCard])

  return (
    <>
      <a
        ref={mentionRef}
        href={`#comment-${commentNumber}`}
        className="text-blue-500 hover:underline font-bold" // スタイルは CommentItem と合わせる
        data-type="mention" // data-type を明示的に設定
        data-comment-number={commentNumber} // data-comment-number を設定
      >
        &gt;&gt;{commentNumber}
      </a>
      {`. ${commentName}へのコメント`}

      {hoveredCommentData && hoverCardPosition && (
        <HoverCard
          comment={hoveredCommentData}
          x={hoverCardPosition.x}
          y={hoverCardPosition.y}
          side={hoverCardPosition.side}
          onReplyClick={onReplyClick}
        />
      )}
    </>
  )
}

export default CommentTitleMention
