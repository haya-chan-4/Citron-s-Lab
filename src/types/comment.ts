// src/types/comment.ts
import { Timestamp } from 'firebase/firestore' // FirebaseのTimestamp型をインポート

export type Comment = {
  id: string
  name: string // ★ name プロパティがあることを確認 ★
  body: string
  date: Date // FirestoreのTimestampをDateに変換して保持することを想定
  parentId: string | null
}

// CommentItemやCommentsコンポーネントで内部的に使用する拡張型
// Commentを継承していることを明示
export interface CommentWithReplyInfo extends Comment {
  displayNumber: number
  repliedByNumbers: number[]
}

// Firestoreに保存する際のデータ型（serverTimestamp()はFirestore側でTimestampに変換されるため）
export type FirebaseCommentData = {
  name: string
  body: string
  blogId: string
  date: Timestamp // Firestoreに保存する際はTimestamp型
  parentId: string | null
}
