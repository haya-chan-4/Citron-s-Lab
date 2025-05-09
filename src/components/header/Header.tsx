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
  const [isSearchOpen, setIsSearchOpen] = useState(true);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <Suspense fallback={<Spinner />}>
      <header className="bg-indigo-900 shadow-md w-screen m-0">
        <div className="max-w-5xl mx-auto px-4 min-h-16 flex items-center">
          <div className="flex items-center justify-between w-full">
            <Link href='/' className="text-xl font-bold text-gray-200">
              {title}
            </Link>
          </div>
        </div>
      </header>
    </Suspense>
  );
};

export default Header;

