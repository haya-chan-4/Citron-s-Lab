// src/components/Comment/CommentItem.tsx
'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'
import { formatCommentBody } from '@/utils/format'
import { format } from 'date-fns'
import type { CommentWithReplyInfo } from '@/types/comment'
import { Reply } from 'lucide-react'
import HoverCard from '@/components/UI/HoverCard'

interface CommentItemProps {
  comment: CommentWithReplyInfo
  onReplyClick: (
    commentId: string,
    commentNumber: number,
    commentName: string,
  ) => void
  allComments: CommentWithReplyInfo[]
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
    side: 'left' | 'right' // ★ side を追加 ★
  } | null>(null)

  const commentBodyRef = useRef<HTMLParagraphElement>(null)

  const findCommentByNumber = useCallback(
    (number: number): CommentWithReplyInfo | undefined => {
      return allComments.find((c) => c.displayNumber === number)
    },
    [allComments],
  )

  const showHoverCard = useCallback(
    (
      e: MouseEvent,
      commentNum: number,
      displaySide: 'left' | 'right' = 'right',
    ) => {
      // ★ displaySide 引数を追加 ★
      const targetComment = findCommentByNumber(commentNum)
      if (targetComment) {
        setHoveredCommentData(targetComment)
        // setHoverCardPosition に side 情報を含める
        setHoverCardPosition({ x: e.clientX, y: e.clientY, side: displaySide }) // ★ side を追加 ★
      } else {
        console.log('DEBUG: Target comment NOT found for:', commentNum)
      }
    },
    [findCommentByNumber],
  )

  const hideHoverCard = useCallback(() => {
    setHoveredCommentData(null)
    setHoverCardPosition(null)
  }, [])

  const handleRepliedByMouseEnter = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      repliedByCommentNumber: number,
    ) => {
      // ReactMouseEvent から MouseEvent に変換して showHoverCard に渡す
      // event.nativeEvent を使用するか、必要なプロパティを手動で渡す
      const syntheticMouseEvent = event.nativeEvent as MouseEvent
      showHoverCard(syntheticMouseEvent, repliedByCommentNumber, 'left') // ★ ※[番号] の場合は 'left' を指定 ★
    },
    [showHoverCard], // showHoverCard が依存配列に含まれるように変更
  )

  const handleRepliedByMouseLeave = useCallback(() => {
    setHoveredCommentData(null)
    setHoverCardPosition(null)
  }, [])

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

  useEffect(() => {
    const paragraphElement = commentBodyRef.current
    if (!paragraphElement) return

    const handleNativeMouseEnter = (e: MouseEvent) => {
      const targetAnchor = (e.target as HTMLElement).closest(
        'a[data-type="mention"][data-comment-number]',
      ) as HTMLAnchorElement | null
      if (targetAnchor) {
        const commentNum = parseInt(
          targetAnchor.dataset.commentNumber || '0',
          10,
        )
        if (!isNaN(commentNum) && commentNum > 0) {
          if (
            hoveredCommentData?.displayNumber === commentNum &&
            hoverCardPosition // hoverCardPosition が null でないことも確認
          ) {
            return
          }
          showHoverCard(e, commentNum, 'right') // ★ >>[番号] の場合は 'right' を指定 ★
        }
      }
    }

    const handleNativeMouseLeave = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null
      // マウスがホバーカード自体、または data-type="mention" を持つ他のメンションリンクに移動した場合のみ非表示をキャンセル
      if (
        !relatedTarget ||
        (!relatedTarget.closest('.hover-card-container') &&
          !relatedTarget.closest('a[data-type="mention"][data-comment-number]'))
      ) {
        hideHoverCard()
      }
    }

    const observer = new MutationObserver(() => {
      // data-type="mention" を持つアンカーのみを対象とする
      paragraphElement
        .querySelectorAll('a[data-type="mention"][data-comment-number]')
        .forEach((element) => {
          const anchor = element as HTMLAnchorElement
          anchor.removeEventListener(
            'mouseenter',
            handleNativeMouseEnter as EventListener,
          )
          anchor.removeEventListener(
            'mouseleave',
            handleNativeMouseLeave as EventListener,
          )
          anchor.addEventListener(
            'mouseenter',
            handleNativeMouseEnter as EventListener,
          )
          anchor.addEventListener(
            'mouseleave',
            handleNativeMouseLeave as EventListener,
          )
        })
    })

    observer.observe(paragraphElement, { childList: true, subtree: true })

    // 初期ロード時にもイベントリスナーをアタッチ
    paragraphElement
      .querySelectorAll('a[data-type="mention"][data-comment-number]')
      .forEach((element) => {
        const anchor = element as HTMLAnchorElement
        anchor.addEventListener(
          'mouseenter',
          handleNativeMouseEnter as EventListener,
        )
        anchor.addEventListener(
          'mouseleave',
          handleNativeMouseLeave as EventListener,
        )
      })

    return () => {
      observer.disconnect()
      paragraphElement
        .querySelectorAll('a[data-type="mention"][data-comment-number]')
        .forEach((element) => {
          const anchor = element as HTMLAnchorElement
          anchor.removeEventListener(
            'mouseenter',
            handleNativeMouseEnter as EventListener,
          )
          anchor.removeEventListener(
            'mouseleave',
            handleNativeMouseLeave as EventListener,
          )
        })
    }
  }, [
    comment.body,
    showHoverCard,
    hideHoverCard,
    hoveredCommentData,
    hoverCardPosition,
  ]) // 依存配列に hoveredCommentData, hoverCardPosition を追加

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
          ref={commentBodyRef}
          className="text-gray-700 leading-relaxed whitespace-pre-line flex-grow"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(formatCommentBody(comment.body), {
              ADD_ATTR: ['target', 'data-comment-number', 'data-type'],
            }),
          }}
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
          side={hoverCardPosition.side} // ★ side を渡す ★
          onReplyClick={onReplyClick}
        />
      )}
    </li>
  )
}

export default CommentItem
