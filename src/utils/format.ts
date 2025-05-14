// src/utils/format.ts

export const formatCategoryName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
export function linkifyText(text: string): string {
  if (!text) return ''

  // HTML 特殊文字をエスケープして XSS 攻撃を防ぐ基本的な対策
  const escapeHTML = (str: string): string => {
    return str.replace(/[&<>\"']/g, (match) => {
      switch (match) {
        case '&':
          return '&amp;'
        case '<':
          return '&lt;'
        case '>':
          return '&gt;'
        case '"':
          return '&quot;'
        case "'":
          return '&#39;'
        default:
          return match
      }
    })
  }
  const urlRegex = /(\b(?:https?|ftp):\/\/[^\s<]+)|(\bwww\.[^\s<]+)/g

  const escapedText = escapeHTML(text)
  const linkedText = escapedText.replace(
    urlRegex,
    (match, urlWithScheme, urlWithWww) => {
      const url = urlWithScheme || urlWithWww
      let href = url

      if (url.startsWith('www.')) {
        href = `http://${url}`
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="comment-link">${url}</a>`
    },
  )

  return linkedText
}
