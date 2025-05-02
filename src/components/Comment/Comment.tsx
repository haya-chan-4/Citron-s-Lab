// components/Comments.tsx
'use client'
import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  name: string;
  body: string;
  publishedAt: string;
}

const Comment = ({ blogId }: { blogId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('名無しさん');
  const [body, setBody] = useState('');

  useEffect(() => {
    fetch(`/api/comments?blogId=${blogId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ name, body, blogId }),
    });

    setName('');
    setBody('');
  };

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-lg font-semibold">コメント</h3>

      <ul className="space-y-4">
        {comments.map(c => (
          <li key={c.id} className="border p-3 rounded">
            <p className="font-bold">{c.name}</p>
            <p>{c.body}</p>
            <p className="text-sm text-gray-500">{new Date(c.publishedAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-2 mt-6 w-[640px]">
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
        <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded">
          送信
        </button>
      </form>
    </div>
  );
}
export default Comment
