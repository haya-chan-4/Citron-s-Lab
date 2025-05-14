// src/components/UI/DateFormatter.tsx
interface Props {
  dateString: string
}

const DateFormatter: React.FC<Props> = ({ dateString }) => {
  // 必要に応じて日付のフォーマット処理を追加
  const date = new Date(dateString)
  const formattedDate = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) // 例: 2023年1月1日

  return <time>{formattedDate}</time>
}

export default DateFormatter
