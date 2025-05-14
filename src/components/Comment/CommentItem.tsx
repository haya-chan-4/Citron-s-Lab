// components/comments/CommentItem.tsx
'use client'
import DOMPurify from 'dompurify'
import { linkifyText } from '@/utils/format'

type Props = { index: number; name: string; body: string; date: Date }

const CommentItem = ({ index, name, body, date }: Props) => (
  <li className="bg-white py-10">
    <div className="flex items-center justify-between mb-2">
      <p className="font-semibold text-gray-800">
        {index + 1}. {name}
      </p>
      <time className="text-xs text-gray-400">{date.toLocaleString()}</time>
    </div>
    <p
      className="text-gray-700 leading-relaxed whitespace-pre-line"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(linkifyText(body), { ADD_ATTR: ['target'] }),
      }}
    />
  </li>
)
export default CommentItem
