// src/components/comments/CommentList.tsx
'use client'
import React from 'react'
// import type { Comment } from '@/types/comment'; // ★ 削除: Comment型は直接使用されていないため削除 ★
import CommentItem, { CommentWithReplyInfo } from './CommentItem' // CommentWithReplyInfoは引き続き必要

interface CommentListProps {
  comments: CommentWithReplyInfo[]
  onReplyClick: (
    commentId: string,
    commentNumber: number,
    commentName: string,
  ) => void
}

const CommentList = ({ comments, onReplyClick }: CommentListProps) => {
  return (
    <ul className="space-y-20 w-full relative">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReplyClick={onReplyClick}
            allComments={comments}
          />
        ))
      ) : (
        <p className="text-gray-600">コメントはまだありません。</p>
      )}
    </ul>
  )
}

export default CommentList
