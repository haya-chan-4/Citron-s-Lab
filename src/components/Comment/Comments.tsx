// src/components/Comment/Comments.tsx
'use client'
import { useComments } from '@/hooks/useComments'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import Spinner from '@/components/Header/Spinner'
// import type { Comment } from '@/types/comment' // ★ 削除: 直接使用されていないため削除 ★
import { useState, useCallback, useRef, useMemo } from 'react' // ★ useEffect を削除 ★
import type { CommentFormRefHandle } from './CommentForm'
import { extractMentionedCommentNumbers } from '@/utils/format'
import type { CommentWithReplyInfo } from '@/types/comment'

interface Props {
  blogId: string
}

const Comments = ({ blogId }: Props) => {
  // `postComment` と `fetchComments` は CommentForm に渡すため、ここで受け取っておくのは正しいです。
  // ESLintが未使用と判断しているのは、このファイル内で直接 `postComment()` や `fetchComments()` と呼んでいないためです。
  // 通常は `CommentForm` に渡すことで使用していると判断されますが、ESLintの設定によってはこのように警告が出ます。
  // 今回は、`CommentForm` がこれらの関数を直接受け取るわけではないので、
  // `Comments.tsx` が `postComment` を直接呼び出さなくなりました。（CommentForm内で呼ばれる）
  // そのため、useComments から返された `postComment` と `fetchComments` は、このコンポーネント内では**未使用**と判断されます。
  // 警告を消すには、受け取らないようにするか、ESLintのルールを無効にするのが一般的ですが、
  // 後者の理由（`fetchComments`が実際には必要ないため）で、今回は受け取り自体を削除します。
  const { comments, loading, error } = useComments(blogId) // ★ postComment, fetchComments を削除 ★
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
  // `newCommentData` は CommentForm から渡されますが、この関数内では使われないため削除します。
  const handleTopLevelCommentAdded = useCallback(() => {
    // ★ newCommentData パラメータを削除 ★
    // フォームをリセット
    setReplyingToCommentId(null)
    setReplyingToCommentNumber(undefined)
    setReplyingToCommentName(undefined)
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
