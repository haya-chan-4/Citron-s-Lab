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
  // ★ 変更: comments の型を CommentWithReplyInfo[] に変更 ★
  comments: CommentWithReplyInfo[]
  blogId: string
  onReplyClick: (commentId: string, commentNumber: number, commentName: string) => void
}

const CommentList = ({ comments, blogId, onReplyClick }: CommentListProps) => {
  // Comments.tsx で既にソートされているため、ここではソート不要
  // const sortedComments = [...comments].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <ul className="w-full">
      {comments.length > 0 ? (
        // ★ 変更: comments を直接 map する（既にソート済み） ★
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment} // 拡張されたコメントオブジェクトを渡す
            blogId={blogId}
            // index は comment.displayNumber で代用可能
            // index={comment.displayNumber - 1} // 必要であれば元のindexに戻す
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
