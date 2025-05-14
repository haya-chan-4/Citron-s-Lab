// components/comments/Comments.tsx
'use client'
import { useState } from 'react'
import { useComments } from '../../hooks/useComments'
import { CommentList } from './CommentList'
import { CommentForm } from './CommentForm'

interface Props { blogId: string }

export default function Comments({ blogId }: Props) {
  const comments = useComments(blogId)
  const [count, setCount] = useState(comments.length)

  // コメント投稿後に一覧を再レンダーさせる
  const handlePosted = () => setCount(c => c + 1)

  return (
    <div className="mt-10 space-y-6 px-5 w-full">
      <h3 className="text-lg font-semibold">コメント ({count})</h3>
      <CommentList comments={comments} />
      <CommentForm blogId={blogId} onPosted={handlePosted} />
    </div>
  )
}
