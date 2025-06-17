// src/hooks/useComments.ts
import { useState, useEffect, useCallback } from 'react'
import { db } from '@/libs/firebase'
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
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
  return new Date()
}

export const useComments = (blogId: string) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchComments = useCallback(async () => {
    if (!blogId) {
      setComments([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const commentsCollectionRef = collection(db, 'comments')
      const q = query(
        commentsCollectionRef,
        where('blogId', '==', blogId),
        orderBy('date', 'asc'),
      )

      const querySnapshot = await getDocs(q)
      const fetchedComments: Comment[] = querySnapshot.docs.map((doc) => {
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
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [blogId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

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

        const postedComment: Comment = {
          id: docRef.id, // ★ docRef.id を使用 ★
          name,
          body,
          date: new Date(), // クライアント側のタイムスタンプ
          parentId: parentId,
        }
        return postedComment // ★ 投稿されたコメントオブジェクトを返す ★
      } catch (err) {
        console.error('Error posting comment:', err)
        setError(err as Error)
        throw err
      }
    },
    [],
  )

  return { comments, loading, error, postComment, fetchComments }
}
