// src/components/Comment/CommentList.tsx
'use client'
import React from 'react'
import CommentItem from './CommentItem'
import type { CommentWithReplyInfo } from '@/types/comment' // Comment型は直接使用されていないため削除

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
