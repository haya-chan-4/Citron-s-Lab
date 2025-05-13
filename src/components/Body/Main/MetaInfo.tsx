// src/components/Body/Main/MetaInfo.tsx
import dayjs from 'dayjs';
import { Clock4 } from 'lucide-react'
import CategoryDisplay from '@/components/UI/CategoryDisplay';


interface MetaInfoProps {
  publishedAt: string;
  category?: string;
}

const MetaInfo: React.FC<MetaInfoProps> = (props) => {
  const { publishedAt, category } = props
  const formattedDate = dayjs(publishedAt).format('YYYY.MM.DD');
  return (
    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8 space-x-4">
      <span className="flex items-center">
        <Clock4 className="mr-1 size-4 text-gray-500" />
        {formattedDate}
      </span>
      {category && (
        <CategoryDisplay categoryId={category} styleType="tag" />
      )}
    </div>
  );
};

export default MetaInfo;
