// components/comments/useComments.ts
import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  // ★ onSnapshot を削除し、getDocs をインポート ★
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/libs/firebase'

export interface Comment {
  id: string
  name: string
  body: string
  date: Date
}

interface UseCommentsResult {
  comments: Comment[]
  loading: boolean
  error: Error | null
}

export const useComments = (blogId: string): UseCommentsResult => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // blogId が無効な場合は何もしないでローディングを終了
    if (!blogId) {
      setLoading(false)
      return
    }

    const fetchComments = async () => {
      setLoading(true)
      setError(null)

      try {
        const q = query(
          collection(db, 'comments'),
          where('blogId', '==', blogId),
          orderBy('date', 'asc'),
        )

        // ★ onSnapshot の代わりに getDocs を使って一度だけデータを取得 ★
        const querySnapshot = await getDocs(q)

        setComments(
          querySnapshot.docs.map((doc) => {
            const data = doc.data()
            const raw = data.date as Timestamp | null
            return {
              id: doc.id,
              name: data.name || '名無しさん',
              body: data.body || '',
              date: raw?.toDate() ?? new Date(),
            }
          }),
        )
        setLoading(false)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch comments:', err)
        setError(err instanceof Error ? err : new Error(String(err))) // エラーが Error インスタンスであることを確認
        setLoading(false)
      }
    }

    fetchComments() // ★ useEffect の中で fetchComments 関数を実行 ★

    // getDocs を使う場合、リスナーの解除は不要なので、クリーンアップ関数は削除します。
    // return () => unsubscribe() は不要になります。
  }, [blogId]) // blogId が変更されたら useEffect を再実行

  return { comments, loading, error }
}
