// components/comments/useComments.ts
import { useState, useEffect } from 'react'
import {
  collection, query, where, orderBy, onSnapshot, Timestamp
} from 'firebase/firestore'
import { db } from '@/libs/firebase'

export interface Comment { id: string; name: string; body: string; date: Date }

export const useComments = (blogId: string)  => {
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('blogId', '==', blogId),
      orderBy('date', 'asc')
    )
    const unsubscribe = onSnapshot(q, snapshot => {
      setComments(snapshot.docs.map(doc => {
        const data = doc.data()
        const raw = data.date as Timestamp | null
        return {
          id: doc.id,
          name: data.name,
          body: data.body,
          date: raw?.toDate() ?? new Date(),
        }
      }))
    })
    return () => unsubscribe()
  }, [blogId])

  return comments
}

