'use client'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  title: string
}

const Header = (props: Props) => {
  const { title } = props

  return (
    <header className="bg-yellow-300 shadow-md w-screen m-0">
      <div className="max-w-5xl mx-auto px-4 min-h-16 flex items-center">
        <Link href="/" className="flex items-center justify-start w-full">
          <Image
            src="/images/Citron.png"
            alt="site icon"
            width={32}
            height={32}
          />
          <p className="text-xl font-bold text-indigo-500 italic">{title}</p>
        </Link>
      </div>
    </header>
  )
}

export default Header
