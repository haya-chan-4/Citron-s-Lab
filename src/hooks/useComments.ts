// components/comments/useComments.ts
import { useState, useEffect } from 'react' // useState と useEffect をインポート
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/libs/firebase'
export interface Comment {
  id: string
  name: string
  body: string
  date: Date
}

// ★ useComments フックの戻り値の型を定義します ★
interface UseCommentsResult {
  comments: Comment[]
  loading: boolean // データ取得中の状態 (true: 取得中, false: 完了)
  error: Error | null // データ取得エラーの状態 (null: エラーなし, Errorオブジェクト: エラーあり)
}

// ★ useComments フックがコメント配列、ローディング状態、エラー状態を含むオブジェクトを返すように修正 ★
// 戻り値の型アノテーション UseCommentsResult を追加します
export const useComments = (blogId: string): UseCommentsResult => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true) // ★ loading ステートを追加、初期値は true (コンポーネントマウント時は読み込み開始) ★
  const [error, setError] = useState<Error | null>(null) // ★ error ステートを追加、初期値は null (エラーなし) ★

  useEffect(() => {
    // blogId が無効な場合は何もしないでローディングを終了
    if (!blogId) {
      setLoading(false)
      return
    }

    setLoading(true) // ★ データ取得開始時に loading を true に設定 ★
    setError(null) // ★ 新しい取得開始前にエラー状態をリセット ★

    const q = query(
      collection(db, 'comments'),
      where('blogId', '==', blogId),
      orderBy('date', 'asc'),
    )

    // onSnapshot でリアルタイム購読を開始し、コールバック関数とエラーハンドラーを定義します
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // ★ データが取得または更新された時のコールバック ★
        setComments(
          snapshot.docs.map((doc) => {
            const data = doc.data()
            const raw = data.date as Timestamp | null
            return {
              id: doc.id,
              name: data.name || '名無しさん', // 名前がない場合のフォールバック例
              body: data.body || '', // 本文がない場合のフォールバック例
              date: raw?.toDate() ?? new Date(), // 日付がない場合のフォールバック (サーバータイムスタンプがまだない場合など)
            }
          }),
        )
        setLoading(false) // ★ データ取得完了時に loading を false に設定 ★
        setError(null) // 正常終了時はエラーをクリア
      },
      (err) => {
        // ★ データ取得中にエラーが発生した時のハンドラー ★
        console.error('Failed to fetch comments:', err) // エラーをコンソールに出力
        setError(err) // ★ エラーオブジェクトをステートにセット ★
        setLoading(false) // ★ エラー発生時も loading を false に設定 ★
      },
    )

    // コンポーネントがアンマウントされたら購読を解除するクリーンアップ関数
    return () => unsubscribe()
  }, [blogId]) // blogId が変更されたら useEffect を再実行

  // ★ コメント配列、ローディング状態、エラー状態を含むオブジェクトを返します ★
  return { comments, loading, error }
}
