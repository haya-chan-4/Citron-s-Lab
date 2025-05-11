"use client";
import Image from 'next/image'
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
      <header className="bg-yellow-300 shadow-md w-screen m-0">
        <div className="max-w-5xl mx-auto px-4 min-h-16 flex items-center">
          {/* ✅ 修正された Image コンポーネント */}
          <div className="flex items-center justify-start w-full">
            <Image src="/images/Citron.png" alt="site icon" width={32} height={32} />
            <Link href='/' className="text-xl font-bold text-indigo-500 italic">
              {title}
            </Link>
          </div>
        </div>
      </header>
    </Suspense>
  );
};

export default Header;
