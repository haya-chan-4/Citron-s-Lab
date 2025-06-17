// src/components/Comment/Comments.tsx
'use client'
import { useComments } from '@/hooks/useComments'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import Spinner from '@/components/Header/Spinner'
import { useState, useCallback, useRef, useMemo } from 'react'
import type { CommentFormRefHandle } from './CommentForm'
import { extractMentionedCommentNumbers } from '@/utils/format'
import type { CommentWithReplyInfo } from '@/types/comment'

interface Props {
  blogId: string
}

const Comments = ({ blogId }: Props) => {
  const { comments, loading, error } = useComments(blogId)
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(
    null,
  )
  const [replyingToCommentNumber, setReplyingToCommentNumber] = useState<
    number | undefined
  >(undefined)
  const [replyingToCommentName, setReplyingToCommentName] = useState<
    string | undefined
  >(undefined)

  const commentFormRef = useRef<CommentFormRefHandle>(null)

  // コメント投稿が完了した後の処理
  const handleTopLevelCommentAdded = useCallback(() => {
    // フォームをリセット
    setReplyingToCommentId(null)
    setReplyingToCommentNumber(undefined)
    setReplyingToCommentName(undefined)

    // ★ ここでページをリロードします ★
    // コメントがデータベースに保存された後、この関数が呼ばれ、ページ全体が再読み込みされます。
    // これにより、useComments フックが再度 fetchComments を行い、最新のコメントリストが取得・表示されます。
    window.location.reload()
  }, [])

  const handleReplyClick = useCallback(
    (commentId: string, commentNumber: number, commentName: string) => {
      setReplyingToCommentId((prevId) => {
        const newId = prevId === commentId ? null : commentId
        setReplyingToCommentNumber(newId ? commentNumber : undefined)
        setReplyingToCommentName(newId ? commentName : undefined)
        return newId
      })

      if (commentFormRef.current) {
        commentFormRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
        setTimeout(() => {
          commentFormRef.current?.focusTextArea()
        }, 100)
      }
    },
    [],
  )

  const handleCancelReplyForm = useCallback(() => {
    setReplyingToCommentId(null)
    setReplyingToCommentNumber(undefined)
    setReplyingToCommentName(undefined)
  }, [])

  const isReplyFormOpen = replyingToCommentId !== null

  const commentsWithReplyInfo: CommentWithReplyInfo[] = useMemo(() => {
    const sortedComments = [...comments].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    )

    const idsEncountered = new Set<string>()
    for (const comment of sortedComments) {
      if (idsEncountered.has(comment.id)) {
        console.error(
          '⛔ DUPLICATE KEY DETECTED IN commentsWithReplyInfo (after fetch):',
          comment.id,
          'This will cause React warnings and potential UI issues.',
        )
      }
      idsEncountered.add(comment.id)
    }

    const commentIdToNumberMap = new Map<string, number>()
    sortedComments.forEach((comment, index) => {
      commentIdToNumberMap.set(comment.id, index + 1)
    })

    const repliedByMap = new Map<number, number[]>()

    sortedComments.forEach((comment, index) => {
      const currentCommentNumber = index + 1
      const mentionedNumbers = extractMentionedCommentNumbers(comment.body)

      mentionedNumbers.forEach((mentionedNum) => {
        if (mentionedNum >= 1 && mentionedNum <= sortedComments.length) {
          if (!repliedByMap.has(mentionedNum)) {
            repliedByMap.set(mentionedNum, [])
          }
          const existingReplies = repliedByMap.get(mentionedNum)
          if (
            existingReplies &&
            !existingReplies.includes(currentCommentNumber)
          ) {
            existingReplies.push(currentCommentNumber)
          }
        }
      })
    })

    return sortedComments.map((comment, index) => ({
      ...comment,
      displayNumber: index + 1,
      repliedByNumbers: repliedByMap.get(index + 1) || [],
    }))
  }, [comments])

  if (error) {
    return (
      <div className="mt-10 space-y-6 px-5 w-full">
        <h3 className="text-lg font-semibold">コメント</h3>
        <p className="text-red-600">コメントの読み込みに失敗しました</p>
        <CommentForm
          blogId={blogId}
          onCommentAdded={handleTopLevelCommentAdded}
          ref={commentFormRef}
          allComments={commentsWithReplyInfo}
          onReplyClick={handleReplyClick}
        />
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
          onReplyClick={handleReplyClick}
        />
      )}

      {/* トップレベルコメントフォーム */}
      {!isReplyFormOpen && (
        <CommentForm
          blogId={blogId}
          onCommentAdded={handleTopLevelCommentAdded}
          ref={commentFormRef}
          allComments={commentsWithReplyInfo}
          onReplyClick={handleReplyClick}
        />
      )}

      {/* 返信コメントフォーム */}
      {isReplyFormOpen && (
        <CommentForm
          blogId={blogId}
          parentId={replyingToCommentId}
          onCommentAdded={handleTopLevelCommentAdded}
          onCancelReply={handleCancelReplyForm}
          replyToCommentNumber={replyingToCommentNumber}
          replyToCommentName={replyingToCommentName}
          ref={commentFormRef}
          allComments={commentsWithReplyInfo}
          onReplyClick={handleReplyClick}
        />
      )}
    </div>
  )
}
export default Comments
