import Link from 'next/link';


interface Props {
category: string
}



const CategoryItem: React.FC<Props> = (props) => {
  const { category } = props;
  return (
    <li className="py-2">
      <Link href="/" className="hover:text-gray-900 pl-2">
        {category}
      </Link>
    </li>
  )
}

export default CategoryItem
