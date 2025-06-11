// src/hooks/useComments.ts
import { useState, useEffect, useCallback } from 'react'
import { db } from '@/libs/firebase' // Firebase Firestore インスタンス
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp, // Firebase SDKのTimestamp型をインポート
} from 'firebase/firestore'
import type { Comment, FirebaseCommentData } from '@/types/comment'

// Firebaseから取得したTimestampをDateオブジェクトに変換するヘルパー
// ★ ここを修正 ★
const convertTimestampToDate = (
  timestamp: Timestamp | null | undefined,
): Date => {
  // timestampがnullまたはundefinedの場合は、デフォルトのDateオブジェクト（例: 現在時刻）を返すか、
  // またはエラーハンドリングを検討する
  if (timestamp instanceof Timestamp) {
    // Timestampのインスタンスであることを確認
    return timestamp.toDate()
  }
  // または、エラーを防ぐため、存在しない場合は仮のDateオブジェクトを返す
  console.warn('Invalid timestamp received:', timestamp)
  return new Date() // または適切なデフォルト値
}

export const useComments = (blogId: string) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!blogId) {
      setLoading(false)
      return
    }

    const commentsCollectionRef = collection(db, 'comments')
    const q = query(
      commentsCollectionRef,
      where('blogId', '==', blogId),
      orderBy('date', 'asc'), // 日付順でソート
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedComments: Comment[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          // ★ ここも修正: `data.date` が Timestamp 型であることを確認またはキャスト ★
          // Firestoreから取得したデータは型安全ではない可能性があるので注意
          return {
            id: doc.id,
            name: data.name,
            body: data.body,
            date: convertTimestampToDate(data.date as Timestamp), // Timestampとしてキャストして渡す
            parentId: data.parentId || null,
          }
        })
        setComments(fetchedComments)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching comments:', err)
        setError(err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [blogId])

  const addCommentLocally = useCallback((newComment: Comment) => {
    setComments((prevComments) => [...prevComments, newComment])
  }, [])

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
          date: serverTimestamp() as Timestamp, // ここは serverTimestamp() なので、Firestoreに書き込まれるまではnull
          parentId: parentId,
        }
        const docRef = await addDoc(collection(db, 'comments'), commentData)

        // ここで返される newComment の date は new Date() (現在のクライアント時刻) になります。
        // これは、サーバータイムスタンプがまだ Firestore に反映されていないためです。
        // 最終的には onSnapshot が正しいサーバータイムスタンプで更新されたデータを取得し、
        // ローカルのコメントリストを上書きします。
        const newComment: Comment = {
          id: docRef.id,
          name,
          body,
          date: new Date(), // 仮の日付
          parentId: parentId,
        }
        return newComment
      } catch (err) {
        console.error('Error posting comment:', err)
        setError(err as Error)
        throw err
      }
    },
    [],
  )

  return { comments, loading, error, addCommentLocally, postComment }
}
