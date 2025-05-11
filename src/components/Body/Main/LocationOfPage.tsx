import Link from "next/link";


interface LocationOfPageProps {
  category: string
  page: string
}

const LocationOfPage: React.FC<LocationOfPageProps> = (props): JSX.Element => {
  const { category, page } = props
  return (
    <nav className="text-gray-500 mb-4 font-bold">
      <Link href="/" className="hover:underline">
        {page}
      </Link>
      <span className="mx-2">{'>'}</span>
      <Link href={`/category/${category}`} className="text-indigo-500 hover:underline">
        {category}
      </Link>
    </nav>
  )
}

export default LocationOfPage
