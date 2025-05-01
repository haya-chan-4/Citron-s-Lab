import Link from "next/link";
import { Suspense } from "react";
import Spinner from './Spinner';

interface Props {
  title: string;
}


const Header = (props: Props): JSX.Element => {
  const { title } = props;

  return (
    <Suspense fallback={<Spinner />}>
      <header className="bg-gray-800 shadow-md w-screen m-0">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href='/' className="text-xl font-bold text-gray-400">
            {title}
          </Link>
          <nav className="space-x-4">
            <Link href="/" className="text-gray-400 hover:text-blue-600 transition-colors">
              ホーム
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-blue-600 transition-colors">
              このサイトについて
            </Link>
          </nav>
        </div>
      </header>
    </Suspense>
  )
}

export default Header
