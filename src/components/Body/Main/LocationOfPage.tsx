import Link from "next/link";


interface LocationOfPageProps {
title: string
}

const LocationOfPage: React.FC<LocationOfPageProps> = (props): JSX.Element => {
  const { title } = props
  return (
    <nav className="text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:underline">
        ホーム
      </Link>
      <span className="mx-2">/</span>
      <span className="text-gray-700">{title}</span>
    </nav>
  )
}

export default LocationOfPage
