// src/utils/format.ts
export const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${url}</a>`
  })
}

export const anchorCommentMentions = (text: string) => {
  const commentMentionRegex = />>(\d+)/g

  return text.replace(commentMentionRegex, (match, p1) => {
    const commentNumber = p1
    // ★ 変更: data-comment-number と data-type="mention" 属性を追加しました ★
    // onclick 属性は CommentItem.tsx のイベントハンドラーで処理されるため、ここから削除しました
    return `<a href="#comment-${commentNumber}" class="text-blue-500 hover:underline font-bold" data-comment-number="${commentNumber}" data-type="mention">${match}</a>`
  })
}

export const formatCommentBody = (text: string) => {
  let formattedText = text
  formattedText = linkifyText(formattedText)
  formattedText = anchorCommentMentions(formattedText)
  return formattedText
}

export const formatCategoryName = (category: string): string => {
  if (!category) return ''
  return category.charAt(0).toUpperCase() + category.slice(1)
}

export const extractMentionedCommentNumbers = (text: string): number[] => {
  const commentMentionRegex = />>(\d+)/g
  const matches: number[] = []
  let match

  while ((match = commentMentionRegex.exec(text)) !== null) {
    matches.push(parseInt(match[1], 10))
  }
  return matches
}
