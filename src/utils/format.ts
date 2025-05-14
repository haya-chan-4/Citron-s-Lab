// src/utils/format.ts
export const formatCategoryName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

// テキスト中の URL をリンクに変換する関数
// ★ セキュリティに関する注意点:
//    この関数は基本的な HTML エスケープを行いますが、完全な XSS 対策には十分でない場合があります。
//    より高いセキュリティが必要な場合は、DOMPurify のような HTML サニタイズ ライブラリの使用を強く推奨します。
export function linkifyText(text: string): string {
  // null または undefined の場合は空文字列を返す
  if (!text) return '';

  // HTML 特殊文字をエスケープして XSS 攻撃を防ぐ基本的な対策
  const escapeHTML = (str: string): string => {
    return str.replace(/[&<>\"']/g, (match) => {
      switch (match) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return match;
      }
    });
  };

  // URL を検出するための正規表現
  // http:// または https:// で始まるもの、あるいは www. で始まるものを対象
  const urlRegex = /(\bhttps?:\/\/[^\s<]+)|(www\.[^\s<]+)/g;

  const escapedText = escapeHTML(text);
  const linkedText = escapedText.replace(urlRegex, (url) => {
    let href = url;
    // www. で始まる場合はスキーム (http://) を付加
    if (url.startsWith('www.')) {
      href = `http://${url}`;
    }
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600">${url}</a>`;
  });

  return linkedText;
}
