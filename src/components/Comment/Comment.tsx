// components/Comments.tsx
'use client'
import { useState, useEffect } from 'react'

// firebase
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/libs/firebase'

// interface Comment {
//   id: string;
//   name: string;
//   body: string;
//   publishedAt: string;
// }


const Comment = () => {
  const [comments, setComments] = useState<Array<{ id: string, name: string, body: string, date: Date }>>([]);
  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('date', 'desc'));
    const unSub = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          body: doc.data().body,
          date: doc.data().date.toDate()
        }))
      )
    })
    return () => unSub()
  }, []);
  // const [name, setName] = useState('名無しさん');
  // const [body, setBody] = useState('');

  // useEffect(() => {
  //   fetch(`/api/comments?blogId=${blogId}`)
  //     .then(res => res.json())
  //     .then(data => setComments(data));
  // }, [blogId]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   await fetch('/api/comments', {
  //     method: 'POST',
  //     body: JSON.stringify({ name, body, blogId }),
  //   });

  //   setName('');
  //   setBody('');
  return (
    <div className="mt-10 space-y-6 px-5 w-full">
      <h3 className="text-lg font-semibold">コメント</h3>

      <ul className="space-y-6 w-full">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="bg-white py-5"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-800">{comment.name}</p>
              <time className="text-xs text-gray-400">
                {comment.date.toLocaleDateString()}
              </time>
            </div>
            <p className="text-gray-700 leading-relaxed">{comment.body}</p>
          </li>
        ))}
      </ul>

      <form className="space-y-2 mt-6">
        <input
          type="text"
          placeholder='名無しさん'
          value='名無しさん'
          // onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="コメント"
          // onChange={(e) => setBody(e.target.value)}
          className="w-full border px-3 py-2 rounded h-64"
        />
        <button type="submit" className="bg-teal-500 w-full text-white px-4 py-2 rounded">
          送信
        </button>
      </form>
    </div>
  );
};


export default Comment
