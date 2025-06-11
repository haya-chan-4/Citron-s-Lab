// src/types/comment.ts
import { Timestamp } from 'firebase/firestore'

export type Comment = {
  id: string
  name: string
  body: string
  date: Date
  parentId: string | null
}

export interface CommentWithReplyInfo extends Comment {
  displayNumber: number
  repliedByNumbers: number[]
}

export type FirebaseCommentData = {
  name: string
  body: string
  blogId: string
  date: Timestamp
  parentId: string | null
}
