'use client';
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/libs/firebase';


const Comment = () => {
  const [name, setName] = useState('名無しさん')
  const [body, setBody] = useState('')
  const [comments, setComments] = useState<
    Array<{ id: string; name: string; body: string; date: Date }>
  >([])

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('date', 'asc'))
    const unSub = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => {
          const data = doc.data()
          // date フィールドが null の場合は new Date() を代わりに使う
          const rawDate = data.date as Timestamp | null
          const date = rawDate?.toDate() ?? new Date()
          return {
            id: doc.id,
            name: data.name,
            body: data.body,
            date,
          }
        })
      )
    })
    return () => unSub()
  }, [])

  const commentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return alert('コメントを入力してください')
    try {
      await addDoc(collection(db, 'comments'), {
        name,
        body,
        date: serverTimestamp(), // サーバー側タイムスタンプ
      })
      setBody('')
    } catch {
      alert('コメントを投稿できませんでした')
    }
  }

  return (
    <div className="mt-10 space-y-6 px-5 w-full">
      <h3 className="text-lg font-semibold">コメント</h3>

      <ul className="space-y-6 w-full">
        {comments.map((comment) => (
          <li key={comment.id} className="bg-white py-8 ">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold pb-3 text-gray-800">{comment.name}</p>
              <time className="text-xs text-gray-400">
                {comment.date.toLocaleString()}
              </time>
            </div>
            <p className="text-gray-700 leading-relaxed">{comment.body}</p>
          </li>
        ))}
      </ul>

      {/* onSubmit はフォームに */}
      <form onSubmit={commentSubmit} className="space-y-2 mt-6">
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
    </div>
  );
};

export default Comment;
