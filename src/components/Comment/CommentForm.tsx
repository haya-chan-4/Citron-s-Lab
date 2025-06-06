// components/comments/CommentForm.tsx
'use client'
import { useState } from 'react'
import { addDoc, serverTimestamp } from 'firebase/firestore'
import { collection } from 'firebase/firestore'
import { db } from '@/libs/firebase'

type Props = { blogId: string }

const CommentForm = ({ blogId }: Props) => {
  const [name, setName] = useState('名無しさん')
  const [body, setBody] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return alert('コメントを入力してください')
    try {
      await addDoc(collection(db, 'comments'), {
        blogId,
        name: name.trim() || '名無しさん',
        body,
        date: serverTimestamp(),
      })
      setBody('') // フォームをクリア
      // ★ ここにページリロードの処理を追加 ★
      window.location.reload() // ページを強制的にリロード
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
