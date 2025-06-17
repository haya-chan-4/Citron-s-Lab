// src/hooks/useComments.ts
import { useState, useEffect, useCallback } from 'react'
import { db } from '@/libs/firebase' // Firebase Firestore インスタンス
import {
  collection,
  query,
  where,
  orderBy,
  getDocs, // ★ getDocs をインポート ★
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import type { Comment, FirebaseCommentData } from '@/types/comment'

const convertTimestampToDate = (
  timestamp: Timestamp | null | undefined,
): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  return new Date() // null や undefined の場合は現在の時刻を返す
}

export const useComments = (blogId: string) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // ★ コメントを取得する関数を定義（リアルタイムではない一度きりの取得） ★
  const fetchComments = useCallback(async () => {
    if (!blogId) {
      setComments([]); // blogId がない場合は空にする
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const commentsCollectionRef = collection(db, 'comments');
      const q = query(
        commentsCollectionRef,
        where('blogId', '==', blogId),
        orderBy('date', 'asc'),
      );

      const querySnapshot = await getDocs(q); // ★ getDocs を使用 ★
      const fetchedComments: Comment[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as FirebaseCommentData;
        return {
          id: doc.id,
          name: data.name,
          body: data.body,
          date: convertTimestampToDate(data.date),
          parentId: data.parentId || null,
        };
      });
      setComments(fetchedComments); // コメントステートを更新
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [blogId]); // blogId が変更されたら関数を再生成

  // ★ コンポーネントマウント時に一度コメントをフェッチ ★
  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // fetchComments が変更されたら再実行（初回のみ実行されるように useCallback と組み合わせる）

  // ★ addCommentLocally はこのユースケースでは不要なので削除します ★
  // なぜなら、投稿後に即時反映させないことが目的なので、ローカルでコメントを追加する必要がないためです。
  // もし将来的に「投稿直後はローカルのみ反映、リロードで全体反映」のようにしたい場合は、
  // ここで addCommentLocally を再導入し、`Comments.tsx` 側で呼び出すようにしてください。

  const postComment = useCallback(
    async (
      name: string,
      body: string,
      targetBlogId: string,
      parentId: string | null = null,
    ) => {
      setError(null)
      try {
        const commentData: FirebaseCommentData = {
          name,
          body,
          blogId: targetBlogId,
          date: serverTimestamp() as Timestamp,
          parentId: parentId,
        }
        const docRef = await addDoc(collection(db, 'comments'), commentData)

        // ★ ここでローカルステートを更新しない ★
        // Firebase に保存されたコメントの ID を含む情報を呼び出し元に返しますが、
        // この情報を使ってコメントリストを即座に更新することはしません。
        const postedComment: Comment = {
          id: docRef.id,
          name,
          body,
          date: new Date(), // これはクライアント側のタイムスタンプなので、サーバーのタイムスタンプとは厳密には一致しませんが、動作に影響はありません。
          parentId: parentId,
        }
        return postedComment
      } catch (err) {
        console.error('Error posting comment:', err)
        setError(err as Error)
        throw err
      }
    },
    [],
  )

  // ★ 戻り値から addCommentLocally を削除 ★
  return { comments, loading, error, postComment, fetchComments }
}
