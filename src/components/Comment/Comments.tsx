// components/comments/Comments.tsx
'use client'
import { useComments } from '@/hooks/useComments'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import Spinner from '@/components/Header/Spinner'
import type { Comment } from '@/hooks/useComments'

interface Props {
  blogId: string
}

const Comments = ({ blogId }: Props) => {
  const { comments, loading, error, addCommentLocally } = useComments(blogId)

  // コメント投稿成功時に CommentForm から呼び出されるコールバック関数
  const handleCommentAdded = (newCommentData: {
    id: string
    name: string
    body: string
    date: Date
  }) => {
    // Firebaseから返された（またはローカルで生成した）IDを使ってComment型に変換
    // ★ この関数スコープ内で newComment を定義し、addCommentLocally を呼び出す ★
    const newComment: Comment = {
      id: newCommentData.id,
      name: newCommentData.name,
      body: newCommentData.body,
      date: newCommentData.date, // ローカルタイムスタンプまたは仮の日付
      // Comment インターフェースに blogId がない場合、ここでの割り当ては不要か、
      // Comment インターフェース自体に blogId: string を追加してください
      // blogId: blogId,
    }
    addCommentLocally(newComment) // ★ コメントをリストに即時追加 ★
  } // ★ handleCommentAdded 関数の閉じ括弧はここ ★

  if (error) {
    return (
      <div className="mt-10 space-y-6 px-5 w-full">
        <h3 className="text-lg font-semibold">コメント</h3>
        <p className="text-red-600">コメントの読み込みに失敗しました。</p>
        {/* エラー時も CommentForm は表示し、onCommentAdded を渡す */}
        <CommentForm blogId={blogId} onCommentAdded={handleCommentAdded} />
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
          <p className="ml-2 text-gray-600">コメントを読み込み中...</p>
        </div>
      ) : comments.length === 0 ? (
        // コメントがない場合、何も表示しない（または「コメントはまだありません」）
        // ここで空文字列 '' を返していますが、必要であれば <p> などにできます
        ''
      ) : (
        // ★ CommentList は CommentForm と同じ階層でレンダリングする ★
        // CommentList を min-h-[100px] の div で囲む必要はないでしょう
        <CommentList comments={comments} />
      )}

      {/* ★ CommentForm は条件付きレンダーの外側で、一度だけレンダリングする ★ */}
      {/* CommentList と CommentForm が隣接して表示されるようにする */}
      <CommentForm blogId={blogId} onCommentAdded={handleCommentAdded} />
    </div>
  )
} // ★ Comments コンポーネントの閉じ括弧はここ ★
export default Comments
