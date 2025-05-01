"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import Spinner from './Spinner';
import { Search } from 'lucide-react';

interface Props {
  title: string;
}

const Header = (props: Props): JSX.Element => {
  const { title } = props;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <Suspense fallback={<Spinner />}>
      <header className="bg-gray-800 shadow-md w-screen m-0">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href='/' className="text-xl font-bold text-gray-400">
            {title}
          </Link>

          {/* 検索アイコン */}
          <button
            onClick={toggleSearch}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none"
            aria-label="検索を開く"
          >
            <Search size={20} />
          </button>
        </div>

        {/* 検索フォーム */}
        {/* {isSearchOpen && (
          <div className="bg-gray-800">
            <div className="max-w-5xl mx-auto px-4 py-2 flex">
              <input
                type="text"
                placeholder="キーワード検索..."
                className="w-full px-3 py-2 rounded-l-md focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded-r-md text-white hover:bg-blue-700 transition-colors"
              >
                検索
              </button>
            </div>
          </div>
        )} */}
      </header>
    </Suspense>
  );
};

export default Header;

