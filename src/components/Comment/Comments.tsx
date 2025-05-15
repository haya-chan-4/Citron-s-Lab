// components/comments/Comments.tsx
'use client';
import { useComments } from '@/hooks/useComments';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import Spinner from '@/components/Header/Spinner';

interface Props {
  blogId: string;
}

export default function Comments({ blogId }: Props) {
  const { comments, loading, error } = useComments(blogId);

  if (error) {
    return (
      <div className="mt-10 space-y-6 px-5 w-full">
        <h3 className="text-lg font-semibold">コメント</h3>
        <p className="text-red-600">コメントの読み込みに失敗しました。</p>
        <CommentForm blogId={blogId} />
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6 px-5 w-full">
      <h3 className="text-lg font-semibold">コメント ({loading ? 0 : comments.length})</h3>

      {loading ? (
        <div className="flex justify-center items-center min-h-[100px]">
          <Spinner />
          <p className="ml-2 text-gray-600">コメントを読み込み中...</p>
        </div>
      ) : comments.length === 0 ? '' : (
        <CommentList comments={comments} />
      )}

      <CommentForm blogId={blogId} />
    </div>
  );
}
