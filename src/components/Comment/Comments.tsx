// components/comments/Comments.tsx
'use client'
import { useComments } from '../../hooks/useComments'
import { CommentList } from './CommentList'
import { CommentForm } from './CommentForm'

interface Props {
  blogId: string
}

export default function Comments({ blogId }: Props) {
  const comments = useComments(blogId)

  return (
    <div className="mt-10 space-y-6 px-5 w-full">
      <h3 className="text-lg font-semibold">コメント ({comments.length})</h3>
      <CommentList comments={comments} />
      <CommentForm blogId={blogId} />
    </div>
  )
}
