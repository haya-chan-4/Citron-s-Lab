import Link from 'next/link';


interface Props {
  category: {
    label: string;
    value: string;
  };
}




const CategoryItem: React.FC<Props> = ({ category }) => {
  return (
    <li className="py-2">
      <Link
        href={`/category/${category.value}`}
        className="hover:text-gray-900 pl-2"
      >
        {category.label}
      </Link>
    </li>
  );
};


export default CategoryItem
