// src/components/comments/CommentForm.tsx
'use client'
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
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
  onCancelReply?: () => void
  replyToCommentNumber?: number
  replyToCommentName?: string
}

export type CommentFormRefHandle = {
  focusTextArea: () => void
  scrollIntoView: (options?: ScrollIntoViewOptions | undefined) => void
}

const CommentForm = forwardRef<CommentFormRefHandle, CommentFormProps>(
  (
    {
      blogId,
      onCommentAdded,
      parentId = null,
      onCancelReply,
      replyToCommentNumber,
      replyToCommentName,
    },
    ref,
  ) => {
    const [name, setName] = useState('名無しさん')
    const [body, setBody] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const { postComment } = useComments(blogId)

    useEffect(() => {
      if (parentId && replyToCommentNumber !== undefined) {
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus()
          }
        }, 0)
      }
      setBody('')
    }, [parentId, replyToCommentNumber])

    useImperativeHandle(ref, () => ({
      focusTextArea: () => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(0, 0)
        }
      },
      scrollIntoView: (options) => {
        if (formRef.current) {
          formRef.current.scrollIntoView(options)
        }
      },
    }))

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitError(null)
      setIsSubmitting(true)

      const trimmedBody = body.trim()

      if (!trimmedBody) {
        setSubmitError('コメントを入力してください')
        setIsSubmitting(false)
        return
      }

      let commentToPost = trimmedBody

      if (parentId && replyToCommentNumber !== undefined) {
        commentToPost = `>>${replyToCommentNumber}\n${trimmedBody}`
      }

      try {
        const newComment = await postComment(
          name.trim(),
          commentToPost,
          blogId,
          parentId,
        )

        onCommentAdded({
          id: newComment.id,
          name: newComment.name,
          body: newComment.body,
          date: newComment.date,
          parentId: newComment.parentId,
        })

        setName('名無しさん')
        setBody('')
      } catch (error) {
        console.error('コメント投稿失敗:', error)
        setSubmitError('コメントを投稿できませんでした')
      } finally {
        setIsSubmitting(false)
      }
    }

    // ★ 変更: フォームタイトルを「〇〇へのコメント」形式に変更 ★
    const formTitle =
      parentId &&
      replyToCommentNumber !== undefined &&
      replyToCommentName !== undefined
        ? `>>${replyToCommentNumber}. ${replyToCommentName}へのコメント` // 変更点
        : 'コメントを投稿'

    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-2 mt-6 pt-10"
        ref={formRef}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">{formTitle}</h4>
          {onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
              aria-label="返信をキャンセル"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

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
        </div>
      </form>
    )
  },
)

CommentForm.displayName = 'CommentForm'

export default CommentForm
