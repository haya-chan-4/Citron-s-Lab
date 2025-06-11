// src/components/comments/CommentList.tsx
'use client'
import React from 'react'
import type { Comment } from '@/types/comment'
import CommentItem from './CommentItem'

// Comment 型を拡張して、Comments.tsx で追加した displayNumber と repliedByNumbers を含む
interface CommentWithReplyInfo extends Comment {
  displayNumber: number
  repliedByNumbers: number[]
}

interface CommentListProps {
  comments: CommentWithReplyInfo[]
  // blogId: string; // ★ 削除: 'blogId' は CommentList 内で使われていないため削除 ★
  onReplyClick: (
    commentId: string,
    commentNumber: number,
    commentName: string,
  ) => void
}

const CommentList = ({
  comments,
  // blogId, // ★ 削除: 'blogId' は使用されていないため引数から削除 ★
  onReplyClick,
}: CommentListProps) => {
  return (
    <ul className="space-y-20 w-full">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReplyClick={onReplyClick}
          />
        ))
      ) : (
        <p className="text-gray-600">コメントはまだありません。</p>
      )}
    </ul>
  )
}

export default CommentList
