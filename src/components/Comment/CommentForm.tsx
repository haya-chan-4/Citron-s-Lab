// src/components/comments/CommentForm.tsx
'use client'
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { useComments } from '@/hooks/useComments'
import Spinner from '@/components/Header/Spinner'
import { X } from 'lucide-react'

interface CommentFormProps {
  blogId: string
  onCommentAdded: (newComment: {
    id: string
    name: string
    body: string
    date: Date
    parentId?: string | null
  }) => void
  parentId?: string | null
  onCancelReply?: () => void;
  replyToCommentNumber?: number;
  // ★ 追加: 返信先のコメント名プロップ ★
  replyToCommentName?: string;
}

export type CommentFormRefHandle = {
  focusTextArea: () => void;
  scrollIntoView: (options?: ScrollIntoViewOptions | undefined) => void;
};

const CommentForm = forwardRef<CommentFormRefHandle, CommentFormProps>(({ blogId, onCommentAdded, parentId = null, onCancelReply, replyToCommentNumber, replyToCommentName }, ref) => {
  const [name, setName] = useState('名無しさん')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { postComment } = useComments(blogId)

  useEffect(() => {
    if (parentId && replyToCommentNumber !== undefined) {
      setBody(`>>${replyToCommentNumber}\n`);
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPosition = (`>>${replyToCommentNumber}\n`).length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
    } else {
      setBody('');
    }
  }, [parentId, replyToCommentNumber]);

  useImperativeHandle(ref, () => ({
    focusTextArea: () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const initialTextLength = body.length;
        textareaRef.current.setSelectionRange(initialTextLength, initialTextLength);
      }
    },
    scrollIntoView: (options) => {
      if (formRef.current) {
        formRef.current.scrollIntoView(options);
      }
    },
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    if (!body.trim()) {
      setSubmitError('コメントを入力してください')
      setIsSubmitting(false)
      return
    }

    try {
      const newComment = await postComment(name.trim(), body.trim(), blogId, parentId)

      onCommentAdded({
        id: newComment.id,
        name: newComment.name,
        body: newComment.body,
        date: newComment.date,
        parentId: newComment.parentId,
      })

      setName('名無しさん')
      setBody('');
    } catch (error) {
      console.error('コメント投稿失敗:', error)
      setSubmitError('コメントを投稿できませんでした')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ★ 変更: フォームタイトルを新しい形式に変更 ★
  const formTitle =
    parentId && replyToCommentNumber !== undefined && replyToCommentName !== undefined
      ? `${replyToCommentNumber}.${replyToCommentName} へコメント`
      : 'コメントを投稿';

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-6 pt-10" ref={formRef}>
      <h4 className="text-lg font-semibold mb-2">{formTitle}</h4>
      {submitError && <p className="text-red-500 mb-4">{submitError}</p>}
      <input
        type="text"
        placeholder="お名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        disabled={isSubmitting}
      />
      <textarea
        placeholder="コメント"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full border px-3 py-2 rounded h-64"
        disabled={isSubmitting}
        ref={textareaRef}
      />
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-teal-500 w-full text-white px-4 py-2 rounded flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner className="mr-2" />}
          {parentId ? '返信を投稿' : '送信'}
        </button>
        {onCancelReply && (
          <button
            type="button"
            onClick={onCancelReply}
            className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
})

CommentForm.displayName = 'CommentForm';

export default CommentForm;
