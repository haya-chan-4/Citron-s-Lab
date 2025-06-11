import { Timestamp } from 'firebase/firestore'

// src/types/comment.ts
export interface Comment {
  id: string
  name: string
  body: string
  date: Date // または string (Firebase/microCMSの形式に合わせる)
  parentId?: string | null // ★ 追加: 親コメントのID。最上位コメントは null または undefined ★
  // blogId?: string; // コメントがどのブログに紐づくか、もし必要なら
}

// Firebaseのコメントデータと型を合わせる場合
export interface FirebaseCommentData {
  name: string
  body: string
  date: Timestamp
  blogId: string
  parentId?: string | null // Firebaseに保存するデータにもparentIdを追加
}
