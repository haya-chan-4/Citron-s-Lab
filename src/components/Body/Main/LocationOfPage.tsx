import Link from "next/link";


interface LocationOfPageProps {
  category: string
}

const LocationOfPage: React.FC<LocationOfPageProps> = (props): JSX.Element => {
  const { category } = props
  return (
    <nav className="text-gray-500 mb-4 text-base">
      <Link href="/" className="hover:underline">
        ホーム
      </Link>
      <span className="mx-2">{'>'}</span>
      <Link href={`/category/${category}`} className="text-gray-700 hover:underline">
        {category}
      </Link>
    </nav>
  )
}

export default LocationOfPage
