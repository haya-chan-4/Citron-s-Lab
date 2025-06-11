// src/components/comments/Comments.tsx
'use client'
import { useComments } from '@/hooks/useComments'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import Spinner from '@/components/Header/Spinner'
import type { Comment } from '@/types/comment'
import { useState, useCallback, useRef, useMemo } from 'react'
import type { CommentFormRefHandle } from './CommentForm'
import { extractMentionedCommentNumbers } from '@/utils/format'

interface Props {
  blogId: string
}

const Comments = ({ blogId }: Props) => {
  const { comments, loading, error, addCommentLocally } = useComments(blogId)
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null)
  const [replyingToCommentNumber, setReplyingToCommentNumber] = useState<number | undefined>(undefined)
  const [replyingToCommentName, setReplyingToCommentName] = useState<string | undefined>(undefined)

  const commentFormRef = useRef<CommentFormRefHandle>(null)

  const handleTopLevelCommentAdded = (newCommentData: {
    id: string
    name: string
    body: string
    date: Date
    parentId?: string | null
  }) => {
    const newComment: Comment = {
      id: newCommentData.id,
      name: newCommentData.name,
      body: newCommentData.body,
      date: newCommentData.date,
      parentId: newCommentData.parentId || null,
    }
    addCommentLocally(newComment)
    setReplyingToCommentId(null)
    setReplyingToCommentNumber(undefined)
    setReplyingToCommentName(undefined)
  }

  const handleReplyClick = useCallback((commentId: string, commentNumber: number, commentName: string) => {
    setReplyingToCommentId(prevId => {
      const newId = prevId === commentId ? null : commentId
      setReplyingToCommentNumber(newId ? commentNumber : undefined)
      setReplyingToCommentName(newId ? commentName : undefined)
      return newId
    })

    if (commentFormRef.current) {
      commentFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        commentFormRef.current?.focusTextArea()
      }, 100)
    }
  }, [])

  const handleCancelReplyForm = useCallback(() => {
    setReplyingToCommentId(null)
    setReplyingToCommentNumber(undefined)
    setReplyingToCommentName(undefined)
  }, [])

  const isReplyFormOpen = replyingToCommentId !== null

  const commentsWithReplyInfo = useMemo(() => {
    const sortedComments = [...comments].sort((a, b) => a.date.getTime() - b.date.getTime())

    const commentIdToNumberMap = new Map<string, number>()
    sortedComments.forEach((comment, index) => {
      commentIdToNumberMap.set(comment.id, index + 1)
    })

    const repliedByMap = new Map<number, number[]>()

    sortedComments.forEach((comment, index) => {
      const currentCommentNumber = index + 1
      const mentionedNumbers = extractMentionedCommentNumbers(comment.body)

      mentionedNumbers.forEach(mentionedNum => {
        if (mentionedNum >= 1 && mentionedNum <= sortedComments.length) {
          if (!repliedByMap.has(mentionedNum)) {
            repliedByMap.set(mentionedNum, [])
          }
          const existingReplies = repliedByMap.get(mentionedNum)
          if (existingReplies && !existingReplies.includes(currentCommentNumber)) {
            existingReplies.push(currentCommentNumber)
          }
        }
      })
    })

    return sortedComments.map((comment, index) => ({
      ...comment,
      displayNumber: index + 1,
      repliedByNumbers: repliedByMap.get(index + 1) || []
    }))
  }, [comments])

  if (error) {
    return (
      <div className="mt-10 space-y-6 px-5 w-full">
        <h3 className="text-lg font-semibold">コメント</h3>
        <p className="text-red-600">コメントの読み込みに失敗しました</p>
        <CommentForm blogId={blogId} onCommentAdded={handleTopLevelCommentAdded} ref={commentFormRef} />
      </div>
    )
  }

  return (
    <div className="mt-10 space-y-6 px-5 w-full">
      <h3 className="text-lg font-semibold">
        コメント ({loading ? 0 : comments.length})
      </h3>

      {loading ? (
        <div className="flex justify-center items-center min-h-[100px]">
          <Spinner />
          <p className="ml-2 text-gray-600">コメントを読み込み中</p>
        </div>
      ) : (
        <CommentList
          comments={commentsWithReplyInfo}
          blogId={blogId}
          onReplyClick={handleReplyClick}
        />
      )}

      {!isReplyFormOpen && (
        <CommentForm blogId={blogId} onCommentAdded={handleTopLevelCommentAdded} ref={commentFormRef} />
      )}

      {isReplyFormOpen && (
        <CommentForm
          blogId={blogId}
          parentId={replyingToCommentId}
          onCommentAdded={handleTopLevelCommentAdded}
          onCancelReply={handleCancelReplyForm}
          replyToCommentNumber={replyingToCommentNumber}
          // ★ 変更: タイポ修正 ★
          replyToCommentName={replyingToCommentName}
          ref={commentFormRef}
        />
      )}
    </div>
  )
}
export default Comments
