import Link from "next/link";


interface LocationOfPageProps {
category: string
}

const LocationOfPage: React.FC<LocationOfPageProps> = (props): JSX.Element => {
  const { category } = props
  return (
    <nav className="text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:underline">
        ホーム
      </Link>
      <span className="mx-2">/</span>
      <span className="text-gray-700">{category}</span>
    </nav>
  )
}

export default LocationOfPage
