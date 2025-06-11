import { Loader } from 'lucide-react'
import React from 'react' // Reactのインポートも追加しておくと良いでしょう

interface SpinnerProps {
  className?: string // className プロップを受け取る
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div className="flex items-center justify-center" aria-label="読み込み中">
      {/* className を Loader コンポーネントに渡す */}
      <Loader className={`animate-spin ${className || ''}`} />
    </div>
  )
}
export default Spinner
