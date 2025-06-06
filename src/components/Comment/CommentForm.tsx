// components/comments/CommentForm.tsx
'use client'
import { useState } from 'react'
import { addDoc, serverTimestamp } from 'firebase/firestore'
import { collection } from 'firebase/firestore'
import { db } from '@/libs/firebase'

type Props = {
  blogId: string
  onCommentAdded: (commentData: {
    name: string
    body: string
    date: Date
    id: string
  }) => void
} // コールバックプロパティを追加

const CommentForm = ({ blogId, onCommentAdded }: Props) => {
  const [name, setName] = useState('名無しさん')
  const [body, setBody] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return alert('コメントを入力してください')
    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        blogId,
        name: name.trim() || '名無しさん',
        body,
        date: serverTimestamp(),
      })
      setBody('')

      // コールバックを呼び出し、投稿されたコメントデータを渡す
      onCommentAdded({
        id: docRef.id, // 生成されたID
        name: name.trim() || '名無しさん',
        body: body,
        date: new Date(),
      })
      // window.location.reload() は削除
    } catch (error) {
      console.error('コメント投稿失敗:', error) // デバッグ用にエラーをコンソールに出力
      alert('コメントを投稿できませんでした')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2 mt-6">
      <input
        type="text"
        placeholder="お名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <textarea
        placeholder="コメント"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full border px-3 py-2 rounded h-64"
      />
      <button
        type="submit"
        className="bg-teal-500 w-full text-white px-4 py-2 rounded"
      >
        送信
      </button>
    </form>
  )
}
export default CommentForm
