// import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-gray-300 py-8 px-4">
      <div className="max-w-screen-xl mx-auto grid-cols-1 flex justify-center">
        {/* サイト名称 */}
        <div>
          {/* <h3 className="text-xl font-semibold text-white mb-3">INFJ&apos;s Lab</h3> */}
          <p className="text-sm">&copy; {new Date().getFullYear()} INFJ&apos;s Lab All rights reserved.</p>
        </div>

        {/* ナビゲーション */}
        {/* <div>
          <h4 className="text-lg font-semibold mb-3">ナビゲーション</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">ホーム</Link></li>
            <li><Link href="/blog" className="hover:text-white">ブログ一覧</Link></li>
            <li><Link href="/about" className="hover:text-white">このサイトについて</Link></li>
            <li><Link href="/contact" className="hover:text-white">お問い合わせ</Link></li>
          </ul>
        </div> */}

        {/* カテゴリー */}
        {/* <div>
          <h4 className="text-lg font-semibold mb-3">カテゴリー</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog?category=tech" className="hover:text-white">Tech</Link></li>
            <li><Link href="/blog?category=design" className="hover:text-white">Design</Link></li>
            <li><Link href="/blog?category=life" className="hover:text-white">Life</Link></li>
            <li><Link href="/blog?category=career" className="hover:text-white">Career</Link></li>
          </ul>
        </div> */}

        {/* SNS */}
        {/* <div>
          <h4 className="text-lg font-semibold mb-3">フォローする</h4>
          <ul className="flex space-x-4">
            <li>
              <Link href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Twitter
              </Link>
            </li>
            <li>
              <Link href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                GitHub
              </Link>
            </li>
            <li>
              <Link href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Facebook
              </Link>
            </li>
          </ul>
        </div> */}
      </div>
    </footer>
  );
}

export default Footer
