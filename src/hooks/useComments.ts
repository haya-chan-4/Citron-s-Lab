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

const convertTimestampToDate = (
  timestamp: Timestamp | null | undefined,
): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  // ★ 変更: console.warn を削除 ★
  return new Date() // `null` や `undefined` の場合は現在の時刻を返す
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
          const data = doc.data() as FirebaseCommentData
          return {
            id: doc.id,
            name: data.name,
            body: data.body,
            date: convertTimestampToDate(data.date),
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
          date: serverTimestamp() as Timestamp,
          parentId: parentId,
        }
        const docRef = await addDoc(collection(db, 'comments'), commentData)

        const newComment: Comment = {
          id: docRef.id,
          name,
          body,
          date: new Date(),
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
