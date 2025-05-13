// src/components/Body/Main/LocationOfPage.tsx
import Link from "next/link"
import CategoryDisplay from "@/components/UI/CategoryDisplay"


interface LocationOfPageProps {
  category: string
  page: string
}

const LocationOfPage: React.FC<LocationOfPageProps> = (props): JSX.Element => {
  const { category, page } = props


  return (
    <nav className="text-gray-500 text-md font-bold mb-8">
      <Link href="/" className="hover:underline">
        {page}
      </Link>
      <span className="mx-2">{'>'}</span>
      <CategoryDisplay categoryId={category} styleType="link" />
    </nav>
  )
}

export default LocationOfPage
