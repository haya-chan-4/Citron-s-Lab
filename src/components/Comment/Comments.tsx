// src/components/comments/Comments.tsx
'use client'
import { useComments } from '@/hooks/useComments'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import Spinner from '@/components/Header/Spinner'
import type { Comment } from '@/types/comment'
import { useState, useCallback, useRef } from 'react'
import type { CommentFormRefHandle } from './CommentForm'

interface Props {
  blogId: string
}

const Comments = ({ blogId }: Props) => {
  const { comments, loading, error, addCommentLocally } = useComments(blogId)
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null)
  const [replyingToCommentNumber, setReplyingToCommentNumber] = useState<number | undefined>(undefined)
  // ★ 追加: 返信先のコメント名を保持するstate ★
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
    setReplyingToCommentName(undefined) // コメント投稿後、名前もリセット
  }

  // ★ 変更: handleReplyClick でコメントID、番号、名前を受け取る ★
  const handleReplyClick = useCallback((commentId: string, commentNumber: number, commentName: string) => {
    setReplyingToCommentId(prevId => {
      const newId = prevId === commentId ? null : commentId
      setReplyingToCommentNumber(newId ? commentNumber : undefined)
      setReplyingToCommentName(newId ? commentName : undefined) // 名前も設定
      return newId
    })

    if (commentFormRef.current) {
      commentFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // スクロール後にテキストエリアにフォーカスを当てる
      // setTimeout を使用してDOM更新とスクロールが完了してからフォーカスを当てる
      setTimeout(() => {
        commentFormRef.current?.focusTextArea()
      }, 100); // わずかな遅延
    }
  }, [])

  const handleCancelReplyForm = useCallback(() => {
    setReplyingToCommentId(null)
    setReplyingToCommentNumber(undefined)
    setReplyingToCommentName(undefined) // キャンセル時、名前もリセット
  }, [])

  const isReplyFormOpen = replyingToCommentId !== null

  if (error) {
    return (
      <div className="mt-10 space-y-6 px-5 w-full">
        <h3 className="text-lg font-semibold">コメント</h3>
        <p className="text-red-600">コメントの読み込みに失敗しました。</p>
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
          <p className="ml-2 text-gray-600">コメントを読み込み中...</p>
        </div>
      ) : (
        <CommentList
          comments={comments}
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
          // ★ 追加: 返信先のコメント名を渡す ★
          replyToCommentName={replyingToCommentName}
          ref={commentFormRef}
        />
      )}
    </div>
  )
}
export default Comments
