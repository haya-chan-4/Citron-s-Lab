// components/comments/CommentList.tsx
'use client'
import CommentItem from '@/components/Comment/commentItem'
import type { Comment } from '@/hooks/useComments'

interface Props { comments: Comment[] }

export const CommentList = ({ comments }: Props) => (
  <ul className="space-y-6 w-full">
    {comments.map((c, i) => (
      <CommentItem key={c.id} index={i} {...c} />
    ))}
  </ul>
)
