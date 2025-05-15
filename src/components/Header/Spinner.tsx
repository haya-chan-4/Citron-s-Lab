import { Loader } from 'lucide-react'
const Spinner = () => {
  return (
    <div className="flex items-center justify-center" aria-label="読み込み中">
      <Loader className="animate-spin" />
    </div>
  )
}
export default Spinner
