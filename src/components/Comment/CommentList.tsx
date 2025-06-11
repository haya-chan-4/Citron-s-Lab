// src/components/comments/CommentList.tsx
'use client'
import React from 'react'
import type { Comment } from '@/types/comment'
import CommentItem from './CommentItem'

interface CommentListProps {
  comments: Comment[]
  blogId: string
  // ★ 変更: onReplyClick の型定義に commentName を追加 ★
  onReplyClick: (commentId: string, commentNumber: number, commentName: string) => void
}

const CommentList = ({ comments, blogId, onReplyClick }: CommentListProps) => {
  const sortedComments = [...comments].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <ul className="space-y-6 w-full">
      {sortedComments.length > 0 ? (
        sortedComments.map((comment, index) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            blogId={blogId}
            index={index}
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
